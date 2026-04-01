require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foreign_trading_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'forex_super_secret_key_2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.info = req.flash('info');
  next();
});

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const tradeRoutes = require('./routes/trade');
const rateRoutes = require('./routes/rates');

app.use('/auth', authRoutes);
app.use('/dashboard', userRoutes);
app.use('/admin', adminRoutes);
app.use('/trade', tradeRoutes);
app.use('/rates', rateRoutes);

app.get('/', (req, res) => {
  if (req.session.user) {
    return req.session.user.role === 'admin'
      ? res.redirect('/admin/dashboard')
      : res.redirect('/dashboard');
  }
  res.render('home', { title: 'ForexPro - Foreign Trading System' });
});

app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Page Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('404', { title: '500 - Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Foreign Trading System running at http://localhost:' + PORT);
});

module.exports = app;
