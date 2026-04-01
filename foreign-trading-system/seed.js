require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const CurrencyRate = require('./models/CurrencyRate');
const Transaction = require('./models/Transaction');
const Portfolio = require('./models/Portfolio');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foreign_trading_db';

const currencies = [
  { currencyCode: 'USD', currencyName: 'US Dollar', symbol: '$', rateToUSD: 1.0, change24h: 0, flag: 'us' },
  { currencyCode: 'EUR', currencyName: 'Euro', symbol: '€', rateToUSD: 0.92, change24h: -0.15, flag: 'eu' },
  { currencyCode: 'GBP', currencyName: 'British Pound', symbol: '£', rateToUSD: 0.79, change24h: 0.22, flag: 'gb' },
  { currencyCode: 'JPY', currencyName: 'Japanese Yen', symbol: '¥', rateToUSD: 149.50, change24h: -0.43, flag: 'jp' },
  { currencyCode: 'INR', currencyName: 'Indian Rupee', symbol: '₹', rateToUSD: 83.12, change24h: 0.08, flag: 'in' },
  { currencyCode: 'AED', currencyName: 'UAE Dirham', symbol: 'د.إ', rateToUSD: 3.67, change24h: 0.01, flag: 'ae' },
  { currencyCode: 'CAD', currencyName: 'Canadian Dollar', symbol: 'C$', rateToUSD: 1.36, change24h: -0.12, flag: 'ca' },
  { currencyCode: 'AUD', currencyName: 'Australian Dollar', symbol: 'A$', rateToUSD: 1.53, change24h: 0.35, flag: 'au' },
  { currencyCode: 'CHF', currencyName: 'Swiss Franc', symbol: 'Fr', rateToUSD: 0.88, change24h: -0.05, flag: 'ch' },
  { currencyCode: 'CNY', currencyName: 'Chinese Yuan', symbol: '¥', rateToUSD: 7.24, change24h: 0.18, flag: 'cn' },
  { currencyCode: 'SGD', currencyName: 'Singapore Dollar', symbol: 'S$', rateToUSD: 1.34, change24h: 0.06, flag: 'sg' },
  { currencyCode: 'SAR', currencyName: 'Saudi Riyal', symbol: '﷼', rateToUSD: 3.75, change24h: 0.0, flag: 'sa' }
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await CurrencyRate.deleteMany({});
  await Transaction.deleteMany({});
  await Portfolio.deleteMany({});

  // Pass plain text passwords — the User model's pre('save') hook hashes them automatically
  const admin = await User.create({
    name: 'Admin User', email: 'admin@forexpro.com',
    password: 'admin123', role: 'admin', walletBalance: 999999
  });

  const user1 = await User.create({
    name: 'Arjun Sharma', email: 'arjun@example.com',
    password: 'user123', role: 'user', walletBalance: 8420.50
  });

  const user2 = await User.create({
    name: 'Priya Nair', email: 'priya@example.com',
    password: 'user123', role: 'user', walletBalance: 12350.00
  });

  await CurrencyRate.insertMany(currencies);
  console.log('Currencies seeded');

  await Transaction.insertMany([
    { userId: user1._id, type: 'buy', baseCurrency: 'USD', targetCurrency: 'EUR', amount: 500, exchangeRate: 0.92, totalValue: 460, status: 'completed' },
    { userId: user1._id, type: 'buy', baseCurrency: 'USD', targetCurrency: 'GBP', amount: 300, exchangeRate: 0.79, totalValue: 237, status: 'completed' },
    { userId: user1._id, type: 'sell', baseCurrency: 'EUR', targetCurrency: 'USD', amount: 200, exchangeRate: 1.087, totalValue: 217.4, status: 'completed' },
    { userId: user2._id, type: 'buy', baseCurrency: 'USD', targetCurrency: 'JPY', amount: 1000, exchangeRate: 149.5, totalValue: 149500, status: 'completed' },
    { userId: user2._id, type: 'buy', baseCurrency: 'USD', targetCurrency: 'INR', amount: 500, exchangeRate: 83.12, totalValue: 41560, status: 'completed' }
  ]);

  await Portfolio.insertMany([
    { userId: user1._id, currencyCode: 'EUR', quantity: 260, averageBuyRate: 0.92 },
    { userId: user1._id, currencyCode: 'GBP', quantity: 237, averageBuyRate: 0.79 },
    { userId: user2._id, currencyCode: 'JPY', quantity: 149500, averageBuyRate: 149.5 },
    { userId: user2._id, currencyCode: 'INR', quantity: 41560, averageBuyRate: 83.12 }
  ]);

  console.log('Seed complete!');
  console.log('Admin: admin@forexpro.com / admin123');
  console.log('User: arjun@example.com / user123');
  mongoose.disconnect();
}

seed().catch(console.error);
