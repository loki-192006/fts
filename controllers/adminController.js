const User = require("../models/User");
const Transaction = require("../models/Transaction");
const CurrencyRate = require("../models/CurrencyRate");
const Portfolio = require("../models/Portfolio");

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalTrades = await Transaction.countDocuments();
    const rates = await CurrencyRate.find();
    const recentTrades = await Transaction.find().sort({ createdAt: -1 }).limit(10).populate("userId", "name email");
    const recentUsers = await User.find({ role: "user" }).sort({ createdAt: -1 }).limit(5);
    const volume = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: "$totalValue" } } }
    ]);
    const totalVolume = volume[0] ? volume[0].total.toFixed(2) : 0;
    res.render("admin/dashboard", {
      title: "Admin Dashboard - ForexPro",
      totalUsers, totalTrades, rates, recentTrades, recentUsers, totalVolume
    });
  } catch (err) {
    req.flash("error", "Dashboard error");
    res.redirect("/");
  }
};

exports.getUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).sort({ createdAt: -1 });
  res.render("admin/users", { title: "Users - Admin", users });
};

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find().sort({ createdAt: -1 }).populate("userId", "name email").limit(100);
  res.render("admin/transactions", { title: "All Transactions - Admin", transactions });
};

exports.getRates = async (req, res) => {
  const rates = await CurrencyRate.find();
  res.render("admin/rates", { title: "Manage Rates - Admin", rates });
};

exports.updateRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { rateToUSD, change24h } = req.body;
    await CurrencyRate.findByIdAndUpdate(id, { rateToUSD: parseFloat(rateToUSD), change24h: parseFloat(change24h), updatedAt: new Date() });
    req.flash("success", "Rate updated!");
  } catch (err) {
    req.flash("error", "Update failed");
  }
  res.redirect("/admin/rates");
};

exports.toggleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    req.flash("success", "User status updated");
  } catch (err) {
    req.flash("error", "Action failed");
  }
  res.redirect("/admin/users");
};
