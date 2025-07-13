const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  name: String,
  picture: String,
  googleId: String,
});

module.exports = mongoose.model("User", userSchema);
