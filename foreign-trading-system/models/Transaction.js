const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["buy", "sell"], required: true },
  baseCurrency: { type: String, required: true },
  targetCurrency: { type: String, required: true },
  amount: { type: Number, required: true },
  exchangeRate: { type: Number, required: true },
  totalValue: { type: Number, required: true },
  status: { type: String, enum: ["completed", "pending", "failed"], default: "completed" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
