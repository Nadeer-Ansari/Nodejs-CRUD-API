const express = require("express");
require("./database/db");
const cors = require("cors");
const MyModel = require("./models/usermodel");
const app = express();
const port = process.env.PORT || 9000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));

// ============ DEBUG ROUTES ============
app.get("/api/debug/check", async (req, res) => {
  try {
    const allUsers = await MyModel.find();
    const corrupted = allUsers.filter(u => !u._id || !u.name);
    res.json({
      total: allUsers.length,
      corrupted: corrupted.length,
      validUsers: allUsers.filter(u => u._id && u.name)
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/api/debug/clean", async (req, res) => {
  try {
    const allUsers = await MyModel.find();
    const corrupted = allUsers.filter(u => !u._id || !u.name);
    let deleted = [];
    for (let user of corrupted) {
      if (user._id) {
        await MyModel.findByIdAndDelete(user._id);
        deleted.push(user._id);
      }
    }
    res.json({ message: "Cleaned corrupted data", deletedCount: deleted.length });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/api/ping", (req, res) => {
    res.json({ message: "pong", timestamp: new Date().toISOString() });
});

// ============ VIEW ROUTES ============
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", async (req, res) => {
  try {
    res.render("home.ejs", { currentPage: 'home' });
  } catch (error) {
    console.error("Error in home:", error);
    res.status(500).send(error.message);
  }
});

app.get("/showuser", async (req, res) => {
  try {
    let result = await MyModel.find();

    // Ensure result is an array and filter valid users
    let validUsers = [];
    if (result && Array.isArray(result)) {
      validUsers = result.filter(user => {
        return user && typeof user === 'object' && user.name;
      });
    }

    console.log(`Total users: ${result.length}, Valid users: ${validUsers.length}`);

    res.render("showuser.ejs", { data: validUsers, currentPage: 'showuser' });
  } catch (error) {
    console.error("Error in showuser:", error);
    res.render("showuser.ejs", { data: [], currentPage: 'showuser' });
  }
});

app.get("/adduser", async (req, res) => {
  res.render("adduser.ejs", { currentPage: 'adduser' });
});

app.get("/edituser/:userid", async (req, res) => {
  try {
    let user = await MyModel.findById(req.params.userid);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("updateuser.ejs", { user: user, currentPage: 'edit' });
  } catch (error) {
    console.error("Error in edituser:", error);
    res.status(500).send("Error: " + error.message);
  }
});

app.post("/useraction", async (req, res) => {
  try {
    let instance = new MyModel(req.body);
    await instance.save();
    res.redirect("/showuser");
  } catch (error) {
    console.error("Error in useraction:", error);
    res.status(400).send(error.message);
  }
});

app.post("/updateaction/:userid", async (req, res) => {
  try {
    await MyModel.findByIdAndUpdate(req.params.userid, req.body, { new: true, runValidators: true });
    res.redirect("/showuser");
  } catch (error) {
    console.error("Error in updateaction:", error);
    res.status(400).send(error.message);
  }
});

app.delete("/deleteaction/:userid", async (req, res) => {
  try {
    let result = await MyModel.findByIdAndDelete(req.params.userid);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User Deleted Successfully!" });
  } catch (error) {
    console.error("Error in deleteaction:", error);
    res.status(400).json({ error: error.message });
  }
});

// ============ API ROUTES ============
app.get("/api/users", async (req, res) => {
  try {
    let result = await MyModel.find();
    const validUsers = result.filter(user => user && user._id && user.name);
    res.json(validUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    let instance = new MyModel(req.body);
    let result = await instance.save();
    res.status(201).json({ message: "User Created Successfully!", user: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/users/:userid", async (req, res) => {
  try {
    let result = await MyModel.findByIdAndUpdate(req.params.userid, req.body, { new: true, runValidators: true });
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User Updated Successfully!", user: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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

// TEMPORARY: Clean all corrupted data
app.get("/api/clean-all", async (req, res) => {
  try {
    // Delete all users without _id or without name
    const allUsers = await MyModel.find();
    let deleted = 0;

    for (let user of allUsers) {
      if (!user._id || !user.name) {
        if (user._id) {
          await MyModel.findByIdAndDelete(user._id);
          deleted++;
        }
      }
    }

    res.json({
      message: "Cleaned corrupted data",
      deletedCount: deleted,
      remainingUsers: await MyModel.find()
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📍 Visit: http://localhost:${port}`);
  console.log(`Homepage: http://localhost:${port}/home`);
});