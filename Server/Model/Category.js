const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isDefault: { type: Boolean, default: false }
});

module.exports = mongoose.model("Category", categorySchema);
