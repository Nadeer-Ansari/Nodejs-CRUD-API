const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cdac";

console.log("Connecting to MongoDB...");

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    console.log("📊 Database Name:", mongoose.connection.name);
    console.log("🌐 Host:", mongoose.connection.host);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// Connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

module.exports = mongoose;