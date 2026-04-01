const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Portfolio = require("../models/Portfolio");
const CurrencyRate = require("../models/CurrencyRate");

exports.getTrade = async (req, res) => {
  const rates = await CurrencyRate.find();
  const user = await User.findById(req.session.user._id);
  res.render("user/trade", { title: "Trade - ForexPro", rates, user });
};

exports.executeTrade = async (req, res) => {
  try {
    const { type, baseCurrency, targetCurrency, amount } = req.body;
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      req.flash("error", "Invalid amount");
      return res.redirect("/trade");
    }
    const user = await User.findById(req.session.user._id);
    const baseRate = await CurrencyRate.findOne({ currencyCode: baseCurrency });
    const targetRate = await CurrencyRate.findOne({ currencyCode: targetCurrency });
    if (!baseRate || !targetRate) {
      req.flash("error", "Currency not found");
      return res.redirect("/trade");
    }
    const exchangeRate = targetRate.rateToUSD / baseRate.rateToUSD;
    const totalValue = amt * exchangeRate;

    if (type === "buy") {
      const costInUSD = amt / baseRate.rateToUSD;
      if (user.walletBalance < costInUSD) {
        req.flash("error", "Insufficient wallet balance");
        return res.redirect("/trade");
      }
      user.walletBalance -= costInUSD;
      await user.save();
      let portfolio = await Portfolio.findOne({ userId: user._id, currencyCode: targetCurrency });
      if (portfolio) {
        const newQty = portfolio.quantity + totalValue;
        portfolio.averageBuyRate = ((portfolio.quantity * portfolio.averageBuyRate) + (totalValue * targetRate.rateToUSD)) / newQty;
        portfolio.quantity = newQty;
        portfolio.updatedAt = new Date();
        await portfolio.save();
      } else {
        await Portfolio.create({ userId: user._id, currencyCode: targetCurrency, quantity: totalValue, averageBuyRate: targetRate.rateToUSD });
      }
    } else {
      const portfolio = await Portfolio.findOne({ userId: user._id, currencyCode: baseCurrency });
      if (!portfolio || portfolio.quantity < amt) {
        req.flash("error", "Insufficient currency holdings");
        return res.redirect("/trade");
      }
      portfolio.quantity -= amt;
      if (portfolio.quantity <= 0) {
        await Portfolio.deleteOne({ _id: portfolio._id });
      } else {
        await portfolio.save();
      }
      const usdReceived = amt * baseRate.rateToUSD;
      user.walletBalance += usdReceived;
      await user.save();
    }

    await Transaction.create({
      userId: user._id, type, baseCurrency, targetCurrency,
      amount: amt, exchangeRate, totalValue, status: "completed"
    });

    req.session.user.walletBalance = user.walletBalance;
    req.flash("success", "Trade executed successfully!");
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error", "Trade failed: " + err.message);
    res.redirect("/trade");
  }
};
