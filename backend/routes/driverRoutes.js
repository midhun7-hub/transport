const express = require("express");
const router = express.Router();
const Driver = require("../models/Driver");
const jwt = require("jsonwebtoken");

// Auth Middleware (can be extracted to a separate file later if needed)
const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Authentication error" });
    }
};

const adminAuth = (req, res, next) => {
    auth(req, res, () => {
        if (req.userRole !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }
        next();
    });
};

// GET all drivers (Admin only)
router.get("/drivers", adminAuth, async (req, res) => {
    try {
        const drivers = await Driver.find({}).populate("vehicle");
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ message: "Error fetching drivers" });
    }
});

// ADD driver (Admin only)
router.post("/drivers", adminAuth, async (req, res) => {
    const { name, contact, licenseNumber, vehicle, status } = req.body;
    try {
        // Validation
        if (!name || !contact || !licenseNumber) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const existingDriver = await Driver.findOne({ licenseNumber });
        if (existingDriver) {
            return res.status(400).json({ message: "License number already exists" });
        }
        const newDriver = new Driver({
            name, contact, licenseNumber, vehicle: vehicle || null, status
        });
        await newDriver.save();
        res.status(201).json({ message: "Driver added successfully", driver: newDriver });
    } catch (err) {
        res.status(500).json({ message: "Error adding driver" });
    }
});

// UPDATE driver (Admin only)
router.put("/drivers/:id", adminAuth, async (req, res) => {
    try {
        const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDriver) return res.status(404).json({ message: "Driver not found" });
        res.json({ message: "Driver updated", driver: updatedDriver });
    } catch (err) {
        res.status(500).json({ message: "Error updating driver" });
    }
});

// DELETE driver (Admin only)
router.delete("/drivers/:id", adminAuth, async (req, res) => {
    try {
        const deletedDriver = await Driver.findByIdAndDelete(req.params.id);
        if (!deletedDriver) return res.status(404).json({ message: "Driver not found" });
        res.json({ message: "Driver deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting driver" });
    }
});

module.exports = router;
