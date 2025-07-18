const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  picture: String,
  spendingLimit: {
    monthly: { type: Number, default: 0 },
    expectedRecurringList: [
      {
        source: String,
        amount: Number,
        type: { type: String, enum: ["income", "expense"] },
        date: String,
      },
    ],
  },
});



module.exports = mongoose.model("User", userSchema);
