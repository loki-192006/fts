const CurrencyRate = require("../models/CurrencyRate");

exports.getRates = async (req, res) => {
  try {
    const rates = await CurrencyRate.find().sort({ currencyCode: 1 });
    res.render("user/rates", { title: "Market Rates - ForexPro", rates });
  } catch (err) {
    req.flash("error", "Could not load rates");
    res.redirect("/dashboard");
  }
};

exports.getApiRates = async (req, res) => {
  try {
    const rates = await CurrencyRate.find();
    res.json({ success: true, rates });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
