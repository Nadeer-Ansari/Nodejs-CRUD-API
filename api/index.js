const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cdac";

// Connect without deprecated options
mongoose.connect(MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Import model
const MyModel = require("../models/usermodel");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// API Routes
app.get("/api/users", async (req, res) => {
    try {
        let result = await MyModel.find();
        res.json(result);
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

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

// For Vercel serverless
module.exports = app;

// Export for Vercel
if (process.env.VERCEL) {
    module.exports = app;
} else {
    const port = process.env.PORT || 9000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}