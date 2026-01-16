from flask import Flask, render_template, redirect, url_for, flash, request
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, FloatField, SelectField
from wtforms.validators import DataRequired, Email, EqualTo, ValidationError
from werkzeug.security import generate_password_hash
from models import db, User, Transaction
from config import Config
from sqlalchemy import func

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Username already exists.')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Email already exists.')

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class OrderForm(FlaskForm):
    currency_pair = SelectField('Currency Pair', choices=[(k, k) for k in Config.MARKET_DATA.keys()], validators=[DataRequired()])
    action = SelectField('Action', choices=[('buy', 'Buy'), ('sell', 'Sell')], validators=[DataRequired()])
    amount = FloatField('Amount', validators=[DataRequired()])
    submit = SubmitField('Place Order')

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data, cash_balance=Config.INITIAL_CASH)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Registration successful! Please log in.')
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            return redirect(url_for('dashboard'))
        flash('Invalid username or password.')
    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/market')
@login_required
def market():
    return render_template('market.html', market_data=Config.MARKET_DATA)

@app.route('/place_order', methods=['GET', 'POST'])
@login_required
def place_order():
    form = OrderForm()
    if form.validate_on_submit():
        currency_pair = form.currency_pair.data
        action = form.action.data
        amount = form.amount.data
        price = Config.MARKET_DATA[currency_pair]

        # Calculate holdings for sell orders
        if action == 'sell':
            buy_transactions = Transaction.query.filter_by(user_id=current_user.id, currency_pair=currency_pair, action='buy').all()
            total_bought = sum(t.amount for t in buy_transactions)
            sell_transactions = Transaction.query.filter_by(user_id=current_user.id, currency_pair=currency_pair, action='sell').all()
            total_sold = sum(t.amount for t in sell_transactions)
            current_holding = total_bought - total_sold
            if amount > current_holding:
                flash('Insufficient holdings for this sell order.')
                return redirect(url_for('place_order'))

        # Check cash for buy orders
        if action == 'buy':
            cost = amount * price
            if cost > current_user.cash_balance:
                flash('Insufficient cash balance.')
                return redirect(url_for('place_order'))
            current_user.cash_balance -= cost

        # Record transaction
        transaction = Transaction(user_id=current_user.id, currency_pair=currency_pair, action=action, amount=amount, price=price)
        db.session.add(transaction)
        db.session.commit()
        flash('Order placed successfully!')
        return redirect(url_for('portfolio'))
    return render_template('place_order.html', form=form)

@app.route('/portfolio')
@login_required
def portfolio():
    # Calculate holdings
    holdings = {}
    for pair in Config.MARKET_DATA.keys():
        buy_transactions = Transaction.query.filter_by(user_id=current_user.id, currency_pair=pair, action='buy').all()
        sell_transactions = Transaction.query.filter_by(user_id=current_user.id, currency_pair=pair, action='sell').all()
        total_bought = sum(t.amount for t in buy_transactions)
        total_sold = sum(t.amount for t in sell_transactions)
        holdings[pair] = total_bought - total_sold

    return render_template('portfolio.html', holdings=holdings, cash_balance=current_user.cash_balance, market_data=Config.MARKET_DATA)

@app.route('/history')
@login_required
def history():
    transactions = Transaction.query.filter_by(user_id=current_user.id).order_by(Transaction.timestamp.desc()).all()
    return render_template('history.html', transactions=transactions)

@app.route('/pnl')
@login_required
def pnl():
    # Calculate P&L
    pnl_data = {}
    for pair in Config.MARKET_DATA.keys():
        buy_transactions = Transaction.query.filter_by(user_id=current_user.id, currency_pair=pair, action='buy').all()
        sell_transactions = Transaction.query.filter_by(user_id=current_user.id, currency_pair=pair, action='sell').all()
        total_bought = sum(t.amount for t in buy_transactions)
        total_sold = sum(t.amount for t in sell_transactions)
        current_holding = total_bought - total_sold

        if current_holding > 0:
            avg_buy_price = sum(t.amount * t.price for t in buy_transactions) / total_bought
            current_price = Config.MARKET_DATA[pair]
            pnl = (current_price - avg_buy_price) * current_holding
            pnl_data[pair] = {'holding': current_holding, 'avg_buy_price': avg_buy_price, 'current_price': current_price, 'pnl': pnl}

    total_pnl = sum(data['pnl'] for data in pnl_data.values())
    return render_template('pnl.html', pnl_data=pnl_data, total_pnl=total_pnl)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
