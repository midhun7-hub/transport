const express = require("express");
const connectDB = require("./db");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const driverRoutes = require("./routes/driverRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const contactRoutes = require("./routes/contactRoutes");


const app = express();

// 1. CORS Configuration (MUST be first)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://cargolink-one.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
].filter(Boolean).map(origin => origin.toLowerCase().replace(/\/$/, ""));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.toLowerCase().replace(/\/$/, "");
    if (allowedOrigins.includes(normalizedOrigin) || normalizedOrigin.endsWith(".vercel.app")) {
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

// 2. Body Parser
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "CargoLink Backend is running",
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
app.use("/api", vehicleRoutes);
app.use("/api", driverRoutes);
app.use("/api", uploadRoutes);
app.use("/api/contact", contactRoutes);

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
  console.log(`\n🚚 CargoLink Backend Server`);
  console.log(`   ➜ Local:   http://localhost:${PORT}`);
  console.log(`   ➜ Status:  Running ✅\n`);
});
