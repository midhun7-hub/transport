const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate token
function generateToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// Helper function to format user response (exclude password)
function formatUserResponse(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        contact: user.contact,
        address: user.address,
        role: user.role,
        profileImage: user.profileImage,
    };
}

// SIGNUP
router.post("/signup", async (req, res) => {
    const { name, businessName, address, contact, email, password, role, profileImage } = req.body;

    try {
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = new User({
            name,
            businessName: businessName || "",
            address: address || "",
            contact: contact || "",
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role === "admin" ? "admin" : "user",
            profileImage: profileImage || "",
        });

        await newUser.save();

        // Generate token so user is automatically logged in after signup
        const token = generateToken(newUser);

        console.log(`✅ New user registered: ${email}`);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: formatUserResponse(newUser),
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = generateToken(user);

        console.log(`✅ User logged in: ${email}`);

        res.json({
            message: "Login successful",
            token,
            user: formatUserResponse(user),
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

// GET CURRENT USER (verify token and return user data)
router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user: formatUserResponse(user) });
    } catch (err) {
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        console.error("Get user error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE USER PROFILE
router.put("/profile", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { name, businessName, contact, address, profileImage } = req.body;

        const user = await User.findByIdAndUpdate(
            decoded.id,
            { name, businessName, contact, address, profileImage },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(`✅ User profile updated: ${user.email}`);

        res.json({
            message: "Profile updated successfully",
            user: formatUserResponse(user),
        });
    } catch (err) {
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        console.error("Update profile error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// GOOGLE LOGIN / SIGNUP
router.post("/google", async (req, res) => {
    const { credential } = req.body;

    try {
        if (!credential) {
            return res.status(400).json({ message: "No credential provided" });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Check if user already exists
        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Generate a secure random password for Google users
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 12);

            // Create user
            user = new User({
                name,
                businessName: "",
                address: "",
                contact: "",
                email: email.toLowerCase(),
                password: hashedPassword,
                role: "user",
                profileImage: picture || "",
            });

            await user.save();
            console.log(`✅ New user registered via Google: ${email}`);
        } else {
            console.log(`✅ User logged in via Google: ${email}`);
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            message: "Google login successful",
            token,
            user: formatUserResponse(user),
        });
    } catch (err) {
        console.error("Google auth error:", err);
        res.status(500).json({ message: "Server error during Google authentication" });
    }
});

module.exports = router;
