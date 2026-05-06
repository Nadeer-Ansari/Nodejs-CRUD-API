const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  },
  place: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true  // Optional: adds createdAt and updatedAt
});

// Prevent model overwrite error in development
module.exports = mongoose.models.User || mongoose.model("User", userSchema);