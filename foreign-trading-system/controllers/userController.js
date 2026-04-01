const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Portfolio = require("../models/Portfolio");
const CurrencyRate = require("../models/CurrencyRate");

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const transactions = await Transaction.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5);
    const portfolio = await Portfolio.find({ userId: user._id });
    const rates = await CurrencyRate.find().limit(8);
    const totalTrades = await Transaction.countDocuments({ userId: user._id });
    const buys = await Transaction.aggregate([
      { $match: { userId: user._id, type: "buy" } },
      { $group: { _id: null, total: { $sum: "$totalValue" } } }
    ]);
    const sells = await Transaction.aggregate([
      { $match: { userId: user._id, type: "sell" } },
      { $group: { _id: null, total: { $sum: "$totalValue" } } }
    ]);
    const totalBought = buys[0] ? buys[0].total : 0;
    const totalSold = sells[0] ? sells[0].total : 0;
    const pnl = totalSold - totalBought;
    res.render("user/dashboard", {
      title: "Dashboard - ForexPro",
      user, transactions, portfolio, rates,
      totalTrades, totalBought, totalSold, pnl
    });
  } catch (err) {
    req.flash("error", "Could not load dashboard");
    res.redirect("/");
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ userId: req.session.user._id });
    const rates = await CurrencyRate.find();
    const rateMap = {};
    rates.forEach(r => rateMap[r.currencyCode] = r.rateToUSD);
    let portfolioData = portfolio.map(p => {
      const currentRate = rateMap[p.currencyCode] || p.averageBuyRate;
      const currentValue = p.quantity * currentRate;
      const costBasis = p.quantity * p.averageBuyRate;
      const pnl = currentValue - costBasis;
      return { ...p._doc, currentRate, currentValue, costBasis, pnl };
    });
    res.render("user/portfolio", { title: "Portfolio - ForexPro", portfolio: portfolioData });
  } catch (err) {
    req.flash("error", "Could not load portfolio");
    res.redirect("/dashboard");
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { type, currency, page = 1 } = req.query;
    const filter = { userId: req.session.user._id };
    if (type) filter.type = type;
    if (currency) filter.baseCurrency = currency.toUpperCase();
    const limit = 10;
    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Transaction.countDocuments(filter);
    res.render("user/transactions", {
      title: "Transactions - ForexPro",
      transactions, total, page: parseInt(page), limit,
      filters: { type, currency }
    });
  } catch (err) {
    req.flash("error", "Could not load transactions");
    res.redirect("/dashboard");
  }
};
