const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  currencyCode: { type: String, required: true, uppercase: true },
  quantity: { type: Number, required: true, default: 0 },
  averageBuyRate: { type: Number, required: true, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

portfolioSchema.index({ userId: 1, currencyCode: 1 }, { unique: true });

module.exports = mongoose.model("Portfolio", portfolioSchema);
