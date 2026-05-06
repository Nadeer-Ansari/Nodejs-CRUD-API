const mongoose = require("mongoose");

// Use environment variable for production, local for development
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cdac";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log("MongoDB connection error:", err));