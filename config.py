import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///fts.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Simulated market data
    MARKET_DATA = {
        'EUR/USD': 1.0850,
        'GBP/USD': 1.2750,
        'USD/JPY': 147.50,
        'USD/CHF': 0.9150,
        'AUD/USD': 0.6650,
        'USD/CAD': 1.3450,
    }

    # Initial cash balance for new users
    INITIAL_CASH = 10000.0
