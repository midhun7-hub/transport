const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const jwt = require("jsonwebtoken");

// Auth Middleware
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

// GET all vehicles (Public or authenticated)
router.get("/vehicles", async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: "Error fetching vehicles" });
    }
});

// ADD vehicle (Admin only)
router.post("/vehicles", adminAuth, async (req, res) => {
    const { name, type, capacity, pricePerKm, image, availability } = req.body;
    try {
        const newVehicle = new Vehicle({
            name, type, capacity, pricePerKm, image, availability
        });
        await newVehicle.save();
        res.status(201).json({ message: "Vehicle added successfully", vehicle: newVehicle });
    } catch (err) {
        res.status(500).json({ message: "Error adding vehicle" });
    }
});

// UPDATE vehicle (Admin only)
router.put("/vehicles/:id", adminAuth, async (req, res) => {
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.json({ message: "Vehicle updated", vehicle: updatedVehicle });
    } catch (err) {
        res.status(500).json({ message: "Error updating vehicle" });
    }
});

// DELETE vehicle (Admin only)
router.delete("/vehicles/:id", adminAuth, async (req, res) => {
    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!deletedVehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.json({ message: "Vehicle deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting vehicle" });
    }
});

module.exports = router;
