const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Connect to MongoDB (use environment variable)
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cdac");

// Import model
let MyModel = require("../../models/usermodel");

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

// View Routes
app.get("/", (req, res) => res.redirect("/home"));
app.get("/home", async (req, res) => {
    try {
        res.render("home.ejs", { currentPage: 'home' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/showuser", async (req, res) => {
    try {
        let result = await MyModel.find();
        res.render("showuser.ejs", { data: result, currentPage: 'showuser' });
    } catch (error) {
        res.status(500).send(error.message);
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
        res.status(500).send(error.message);
    }
});

app.post("/useraction", async (req, res) => {
    try {
        let instance = new MyModel(req.body);
        await instance.save();
        res.redirect("/showuser");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post("/updateaction/:userid", async (req, res) => {
    try {
        await MyModel.findByIdAndUpdate(
            req.params.userid,
            req.body,
            { new: true, runValidators: true }
        );
        res.redirect("/showuser");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.delete("/deleteaction/:userid", async (req, res) => {
    try {
        await MyModel.findByIdAndDelete(req.params.userid);
        res.json({ message: "User Deleted Successfully!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Export for serverless
module.exports.handler = serverless(app);