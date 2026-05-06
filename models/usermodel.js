const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  place: String
});

module.exports = mongoose.model("User", userSchema);