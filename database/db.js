const mongoose = require("mongoose");

// Use environment variable or local connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cdac";

// Log connection string (hide password for security)
console.log("Connecting to MongoDB...");
console.log("Using database:", MONGODB_URI.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas');

// Connect WITHOUT deprecated options
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    console.log("📊 Database Name:", mongoose.connection.name);
    console.log("🌐 Host:", mongoose.connection.host);
    console.log("🔢 Port:", mongoose.connection.port);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed!");
    console.error("Error:", err.message);
  });

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Handle application termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = mongoose;