const mongoose = require("mongoose");

const currencyRateSchema = new mongoose.Schema({
  currencyCode: { type: String, required: true, unique: true, uppercase: true },
  currencyName: { type: String, required: true },
  symbol: { type: String, default: "" },
  rateToUSD: { type: Number, required: true },
  change24h: { type: Number, default: 0 },
  flag: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CurrencyRate", currencyRateSchema);
