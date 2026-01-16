const express = require("express");
const connectDB = require("./db");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


const app = express();

// Middleware
app.use(express.json());

// CORS Configuration - Allow frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "EasyCart Backend is running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Connect to Database
connectDB();

// Routes
app.use("/", authRoutes);
app.use("/api", bookingRoutes);
app.use("/api/payments", paymentRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal server error" });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚚 EasyCart Backend Server`);
  console.log(`   ➜ Local:   http://localhost:${PORT}`);
  console.log(`   ➜ Status:  Running ✅\n`);
});
