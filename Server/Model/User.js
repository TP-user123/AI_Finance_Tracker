const mongoose = require("mongoose");

const recurringItemSchema = new mongoose.Schema({
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  date: { type: Date, required: true },
  frequency: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly", "yearly"],
    default: "none"
  },
  status: {
    type: String,
    enum: ["pending", "done"],
    default: "pending"
  },
  completedOn: { type: Date, default: null },

  // ✅ Add this field to track when the next one is due
  nextDueDate: { type: Date, default: null }

}, { _id: true });


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  picture: { type: String },
  spendingLimit: {
    monthly: { type: Number, default: 0 },
    expectedRecurringList: [recurringItemSchema],
  },
  otp: String,
  otpExpiry: Date,
}, { timestamps: true });




module.exports = mongoose.model("User", userSchema);
