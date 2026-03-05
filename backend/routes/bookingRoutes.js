const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
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

// CREATE BOOKING (Simple version without Stripe - for demo/development)
router.post("/book", auth, async (req, res) => {
    const { from, to, pickupLocation, pickupCoords, destinationLocation, destinationCoords, weight, vehicleType, amount, distance, cargoType, scheduledDate, scheduledTime, paymentId, orderId } = req.body;

    try {
        // Validation
        if (!from || !to || !weight || !vehicleType || !amount) {
            return res.status(400).json({
                message: "Missing required fields: from, to, weight, vehicleType, and amount are required"
            });
        }

        // Create booking
        const booking = new Booking({
            user: req.userId,
            from,
            to,
            pickupLocation: pickupLocation || "",
            pickupCoords: pickupCoords || { lat: null, lng: null },
            destinationLocation: destinationLocation || "",
            destinationCoords: destinationCoords || { lat: null, lng: null },
            weight: Number(weight),
            vehicleType,
            amount: Number(amount),
            distance: distance ? Number(distance) : null,
            cargoType: cargoType || "General",
            scheduledDate: scheduledDate || null,
            scheduledTime: scheduledTime || null,
            paymentId: paymentId || null,
            orderId: orderId || null,
            paymentStatus: paymentId ? "Paid" : "Pending",
            status: "Confirmed",
            paymentStatus: "Paid",
            paymentMethod: "UPI",
        });

        await booking.save();

        // Get user info for logging
        const user = await User.findById(req.userId);
        console.log(`✅ New booking created: ${from} → ${to} by ${user?.email || req.userId}`);

        res.status(201).json({
            message: "Booking created successfully",
            booking: {
                id: booking._id,
                from: booking.from,
                to: booking.to,
                weight: booking.weight,
                vehicleType: booking.vehicleType,
                amount: booking.amount,
                status: booking.status,
                createdAt: booking.createdAt,
            },
        });
    } catch (err) {
        console.error("Booking error:", err);
        res.status(500).json({ message: "Failed to create booking" });
    }
});

// GET ALL BOOKINGS (Admin only)
router.get("/admin/bookings", adminAuth, async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate("user", "name email contact")
            .populate("driver", "name contact vehicle")
            .sort({ createdAt: -1 })
            .lean();

        res.json(bookings);
    } catch (err) {
        console.error("Get all bookings error:", err);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
});

// ASSIGN DRIVER TO BOOKING (Admin only)
router.put("/admin/bookings/:id/assign-driver", adminAuth, async (req, res) => {
    try {
        const { driverId } = req.body;

        if (!driverId) {
            return res.status(400).json({ message: "Driver ID is required" });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.driver = driverId;
        booking.status = "In Transit"; // Optional, maybe Admin confirms it first
        await booking.save();

        res.json({ message: "Driver assigned successfully", booking });
    } catch (err) {
        console.error("Assign driver error:", err);
        res.status(500).json({ message: "Failed to assign driver" });
    }
});

// GET ALL USER BOOKINGS
router.get("/bookings", auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.userId })
            .populate("driver", "name contact vehicle")
            .sort({ createdAt: -1 })
            .lean();

        res.json(bookings);
    } catch (err) {
        console.error("Get bookings error:", err);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
});

// GET SINGLE BOOKING
router.get("/bookings/:id", auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.userId,
        }).populate("driver", "name contact vehicle").lean();

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(booking);
    } catch (err) {
        console.error("Get booking error:", err);
        res.status(500).json({ message: "Failed to fetch booking" });
    }
});

// CANCEL BOOKING
router.put("/bookings/:id/cancel", auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.userId,
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status === "Cancelled") {
            return res.status(400).json({ message: "Booking is already cancelled" });
        }

        if (booking.status === "Completed") {
            return res.status(400).json({ message: "Cannot cancel a completed booking" });
        }

        booking.status = "Cancelled";
        await booking.save();

        console.log(`✅ Booking cancelled: ${booking._id}`);

        res.json({
            message: "Booking cancelled successfully",
            booking,
        });
    } catch (err) {
        console.error("Cancel booking error:", err);
        res.status(500).json({ message: "Failed to cancel booking" });
    }
});

// GET BOOKING STATS
router.get("/stats", auth, async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            { $match: { user: req.userId } },
            {
                $group: {
                    _id: null,
                    totalBookings: { $sum: 1 },
                    totalAmount: { $sum: "$amount" },
                    confirmedBookings: {
                        $sum: { $cond: [{ $eq: ["$status", "Confirmed"] }, 1, 0] },
                    },
                    completedBookings: {
                        $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
                    },
                    cancelledBookings: {
                        $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
                    },
                },
            },
        ]);

        res.json(stats[0] || {
            totalBookings: 0,
            totalAmount: 0,
            confirmedBookings: 0,
            completedBookings: 0,
            cancelledBookings: 0,
        });
    } catch (err) {
        console.error("Get stats error:", err);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
});

module.exports = router;
