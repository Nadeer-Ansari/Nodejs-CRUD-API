const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 9000;

// Import model (after mongoose is defined)
let MyModel;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// MongoDB Connection String
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cdac";

console.log("Starting server...");

// Connect to MongoDB and define model after connection
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully!");

    // Define schema and model only after successful connection
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      age: { type: Number, required: true },
      place: { type: String, required: true }
    });

    MyModel = mongoose.model("User", userSchema);
    console.log("✅ User model created");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    // Create a fallback in-memory model if database fails
    MyModel = null;
  });

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  res.json({
    status: "ok",
    mongodb: states[dbState],
    database: mongoose.connection.name || "Not connected",
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    mongodb_connected: mongoose.connection.readyState === 1
  });
});

// API Routes
app.get("/api/users", async (req, res) => {
  try {
    if (!MyModel || mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        error: "Database not connected. Please check MongoDB Atlas.",
        users: []
      });
    }
    const users = await MyModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    if (!MyModel) {
      return res.status(500).json({ error: "Database not connected" });
    }
    const user = new MyModel(req.body);
    const result = await user.save();
    res.status(201).json({ message: "User created successfully!", user: result });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/users/:userid", async (req, res) => {
  try {
    if (!MyModel) {
      return res.status(500).json({ error: "Database not connected" });
    }
    const user = await MyModel.findByIdAndUpdate(req.params.userid, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully!", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/users/:userid", async (req, res) => {
  try {
    if (!MyModel) {
      return res.status(500).json({ error: "Database not connected" });
    }
    const user = await MyModel.findByIdAndDelete(req.params.userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(400).json({ error: error.message });
  }
});

// View Routes
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  try {
    res.render("home.ejs", {
      currentPage: 'home',
      dbConnected: mongoose.connection.readyState === 1
    });
  } catch (error) {
    console.error("Error rendering home:", error);
    res.send(`<h1>Error</h1><p>${error.message}</p><p>Check logs for details</p>`);
  }
});

app.get("/showuser", async (req, res) => {
  try {
    if (!MyModel || mongoose.connection.readyState !== 1) {
      return res.render("showuser.ejs", {
        data: [],
        currentPage: 'showuser',
        error: "Database not connected. Please check MongoDB Atlas configuration."
      });
    }
    const users = await MyModel.find();
    res.render("showuser.ejs", { data: users, currentPage: 'showuser', error: null });
  } catch (error) {
    console.error("Error in showuser:", error);
    res.render("showuser.ejs", { data: [], currentPage: 'showuser', error: error.message });
  }
});

app.get("/adduser", (req, res) => {
  try {
    res.render("adduser.ejs", { currentPage: 'adduser' });
  } catch (error) {
    console.error("Error in adduser:", error);
    res.send(`<h1>Error</h1><p>${error.message}</p>`);
  }
});

app.get("/edituser/:userid", async (req, res) => {
  try {
    if (!MyModel) {
      return res.status(500).send("Database not connected");
    }
    const user = await MyModel.findById(req.params.userid);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("updateuser.ejs", { user, currentPage: 'edit' });
  } catch (error) {
    console.error("Error in edituser:", error);
    res.status(500).send(error.message);
  }
});

app.post("/useraction", async (req, res) => {
  try {
    if (!MyModel) {
      return res.status(500).send("Database not connected");
    }
    const user = new MyModel(req.body);
    await user.save();
    res.redirect("/showuser");
  } catch (error) {
    console.error("Error in useraction:", error);
    res.status(400).send(error.message);
  }
});

app.post("/updateaction/:userid", async (req, res) => {
  try {
    if (!MyModel) {
      return res.status(500).send("Database not connected");
    }
    await MyModel.findByIdAndUpdate(req.params.userid, req.body);
    res.redirect("/showuser");
  } catch (error) {
    console.error("Error in updateaction:", error);
    res.status(400).send(error.message);
  }
});

app.delete("/deleteaction/:userid", async (req, res) => {
  try {
    if (!MyModel) {
      return res.status(500).json({ error: "Database not connected" });
    }
    await MyModel.findByIdAndDelete(req.params.userid);
    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteaction:", error);
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📍 Homepage: http://localhost:${port}/home`);
  console.log(`📊 API: http://localhost:${port}/api/users`);
  console.log(`🔍 Health Check: http://localhost:${port}/api/health`);
});