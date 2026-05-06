const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = process.env.PORT || 9000;

// Simple in-memory storage for testing (if MongoDB fails)
let inMemoryUsers = [];
let useInMemory = false;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cdac";

console.log("Attempting to connect to MongoDB...");

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
        useInMemory = false;
    })
    .catch((err) => {
        console.error("❌ MongoDB Error:", err.message);
        console.log("⚠️  Using in-memory storage instead");
        useInMemory = true;
    });

// Define User Schema (only if MongoDB is used)
let MyModel = null;
if (!useInMemory) {
    const userSchema = new mongoose.Schema({
        name: String,
        age: Number,
        place: String
    });
    MyModel = mongoose.model("User", userSchema);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Simple test route (always works)
app.get("/api/test", (req, res) => {
    res.json({
        message: "Server is running!",
        timestamp: new Date().toISOString(),
        mongodb: useInMemory ? "using in-memory" : "connected"
    });
});

// API Routes with fallback to in-memory
app.get("/api/users", async (req, res) => {
    try {
        if (useInMemory) {
            return res.json(inMemoryUsers);
        }
        let result = await MyModel.find();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/users", async (req, res) => {
    try {
        if (useInMemory) {
            const newUser = { ...req.body, _id: Date.now().toString() };
            inMemoryUsers.push(newUser);
            return res.status(201).json({ message: "User Created!", user: newUser });
        }
        let instance = new MyModel(req.body);
        let result = await instance.save();
        res.status(201).json({ message: "User Created!", user: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put("/api/users/:userid", async (req, res) => {
    try {
        if (useInMemory) {
            const index = inMemoryUsers.findIndex(u => u._id === req.params.userid);
            if (index === -1) return res.status(404).json({ message: "User not found" });
            inMemoryUsers[index] = { ...inMemoryUsers[index], ...req.body };
            return res.json({ message: "User Updated!", user: inMemoryUsers[index] });
        }
        let result = await MyModel.findByIdAndUpdate(req.params.userid, req.body, { new: true });
        if (!result) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User Updated!", user: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete("/api/users/:userid", async (req, res) => {
    try {
        if (useInMemory) {
            const index = inMemoryUsers.findIndex(u => u._id === req.params.userid);
            if (index === -1) return res.status(404).json({ message: "User not found" });
            inMemoryUsers.splice(index, 1);
            return res.json({ message: "User Deleted!" });
        }
        let result = await MyModel.findByIdAndDelete(req.params.userid);
        if (!result) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User Deleted!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// View Routes
app.get("/", (req, res) => res.redirect("/home"));

app.get("/home", (req, res) => {
    res.render("home.ejs", { currentPage: 'home', useInMemory });
});

app.get("/showuser", async (req, res) => {
    try {
        let users = useInMemory ? inMemoryUsers : await MyModel.find();
        res.render("showuser.ejs", { data: users, currentPage: 'showuser' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/adduser", (req, res) => {
    res.render("adduser.ejs", { currentPage: 'adduser' });
});

app.get("/edituser/:userid", async (req, res) => {
    try {
        let user;
        if (useInMemory) {
            user = inMemoryUsers.find(u => u._id === req.params.userid);
        } else {
            user = await MyModel.findById(req.params.userid);
        }
        if (!user) return res.status(404).send("User not found");
        res.render("updateuser.ejs", { user, currentPage: 'edit' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post("/useraction", async (req, res) => {
    try {
        if (useInMemory) {
            const newUser = { ...req.body, _id: Date.now().toString() };
            inMemoryUsers.push(newUser);
        } else {
            let instance = new MyModel(req.body);
            await instance.save();
        }
        res.redirect("/showuser");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post("/updateaction/:userid", async (req, res) => {
    try {
        if (useInMemory) {
            const index = inMemoryUsers.findIndex(u => u._id === req.params.userid);
            if (index !== -1) {
                inMemoryUsers[index] = { ...inMemoryUsers[index], ...req.body };
            }
        } else {
            await MyModel.findByIdAndUpdate(req.params.userid, req.body);
        }
        res.redirect("/showuser");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.delete("/deleteaction/:userid", async (req, res) => {
    try {
        if (useInMemory) {
            const index = inMemoryUsers.findIndex(u => u._id === req.params.userid);
            if (index !== -1) inMemoryUsers.splice(index, 1);
        } else {
            await MyModel.findByIdAndDelete(req.params.userid);
        }
        res.json({ message: "User Deleted Successfully!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start server (only if not on Vercel)
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

module.exports = app;