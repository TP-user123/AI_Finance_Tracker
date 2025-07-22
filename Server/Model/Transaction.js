const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value <= new Date(); // Prevent future dates
      },
      message: "Date cannot be in the future",
    },
  },
  description: {
    type: String,
    trim: true,
    default: "", // Optional
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["credit", "debit"], // Your confirmed types
    required: true,
  },
  category: {
    type: String,
    required: true, // Allow any custom or predefined value
    trim: true,
  },
  isCustomCategory: {
    type: Boolean,
    default: false, // Will be true only if user added a custom one
  },
  paymentMode: {
    type: String,
    enum: ["cash", "bank", "upi", "wallet", "other"],
    default: "cash",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
