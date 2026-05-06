// For Vercel serverless deployment
const express = require("express");
require("./database/db");
const cors = require("cors");
const MyModel = require("./models/usermodel");
const app = express();
const port = process.env.PORT || 9000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Serve static files
app.use(express.static('public'));

// Test database connection endpoint
app.get("/api/test-db", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };
    
    res.json({
      mongodb_status: states[dbState],
      ready_state: dbState,
      database_name: mongoose.connection.name || "Not connected",
      message: dbState === 1 ? "Database is connected!" : "Database is not connected"
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running!", timestamp: new Date().toISOString() });
});

// ============ VIEW ROUTES ============

// Home page route
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", async (req, res) => {
  try {
    res.render("home.ejs", { currentPage: 'home' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Show all users
app.get("/showuser", async (req, res) => {
  try {
    let result = await MyModel.find();
    res.render("showuser.ejs", { data: result, currentPage: 'showuser' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Show add user form
app.get("/adduser", async (req, res) => {
  res.render("adduser.ejs", { currentPage: 'adduser' });
});

// Show edit user form
app.get("/edituser/:userid", async (req, res) => {
  try {
    console.log("Edit user ID:", req.params.userid);
    let user = await MyModel.findById(req.params.userid);
    console.log("Found user:", user);
    
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("updateuser.ejs", { user: user, currentPage: 'edit' });
  } catch (error) {
    console.error("Error in edituser:", error);
    res.status(500).send("Error: " + error.message);
  }
});

// Handle create user from browser
app.post("/useraction", async (req, res) => {
  try {
    let instance = new MyModel(req.body);
    let result = await instance.save();
    res.redirect("/showuser");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Handle update user from browser
app.post("/updateaction/:userid", async (req, res) => {
  try {
    console.log("Updating user ID:", req.params.userid);
    console.log("Update data:", req.body);
    
    let result = await MyModel.findByIdAndUpdate(
      req.params.userid, 
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!result) {
      return res.status(404).send("User not found");
    }
    res.redirect("/showuser");
  } catch (error) {
    console.error("Error in updateaction:", error);
    res.status(400).send(error.message);
  }
});

// Handle delete user from browser
app.delete("/deleteaction/:userid", async (req, res) => {
  try {
    let result = await MyModel.findByIdAndDelete(req.params.userid);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User Deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ API ROUTES ============

// Get all users (API)
app.get("/api/users", async (req, res) => {
  try {
    let result = await MyModel.find();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user (API)
app.post("/api/users", async (req, res) => {
  try {
    let instance = new MyModel(req.body);
    let result = await instance.save();
    res.status(201).json({ message: "User Created Successfully!", user: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user (API)
app.put("/api/users/:userid", async (req, res) => {
  try {
    let result = await MyModel.findByIdAndUpdate(
      req.params.userid, 
      req.body,
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User Updated Successfully!", user: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user (API)
app.delete("/api/users/:userid", async (req, res) => {
  try {
    let result = await MyModel.findByIdAndDelete(req.params.userid);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User Deleted Successfully!", user: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Debug route - check all users
app.get("/debug/users", async (req, res) => {
  try {
    let users = await MyModel.find();
    res.json(users);
  } catch (error) {
    res.json({ error: error.message });
  }
});

// For Vercel serverless
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Visit: http://localhost:${port}`);
  });
}
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Visit: http://localhost:${port}`);
});
// Export for Vercel
module.exports = app;