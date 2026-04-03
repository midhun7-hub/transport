const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

// Auth Middleware (from bookingRoutes)
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
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        return res.status(500).json({ message: "Authentication error" });
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

// POST /api/contact - Save message to DB
router.post("/", async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "Name, email, and message are required." });
    }

    try {
        const newMessage = new Message({
            name,
            email,
            phone,
            message,
        });

        await newMessage.save();

        console.log(`✅ Contact message saved from ${email}`);
        res.status(200).json({ message: "Message sent successfully!" });

    } catch (error) {
        console.error("Message saving error:", error);
        res.status(500).json({ message: "Failed to send message." });
    }
});

// GET /api/contact - Admin only, get all messages
router.get("/", adminAuth, async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 }).lean();
        res.json(messages);
    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({ message: "Failed to fetch messages." });
    }
});

// PATCH /api/contact/:id/status - Admin only, toggle read status
router.patch("/:id/status", adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        message.status = status;
        await message.save();

        res.json({ message: `Message status updated to ${status}`, updatedMessage: message });
    } catch (error) {
        console.error("Update message status error:", error);
        res.status(500).json({ message: "Failed to update message status." });
    }
});

// DELETE /api/contact/:id - Admin only, delete a message
router.delete("/:id", adminAuth, async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Delete message error:", error);
        res.status(500).json({ message: "Failed to delete message." });
    }
});

module.exports = router;
