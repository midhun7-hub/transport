const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    from: {
        type: String,
        required: true,
        trim: true,
    },
    to: {
        type: String,
        required: true,
        trim: true,
    },
    pickupLocation: {
        type: String,
        default: "",
    },
    pickupCoords: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
    },
    destinationLocation: {
        type: String,
        default: "",
    },
    destinationCoords: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        default: null,
    },
    weight: {
        type: Number,
        required: true,
        min: 1,
    },
    vehicleType: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    distance: {
        type: Number,
        default: null,
    },
    cargoType: {
        type: String,
        default: "General",
        trim: true,
    },
    scheduledDate: {
        type: String,
        default: null,
    },
    scheduledTime: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "In Transit", "Completed", "Cancelled"],
        default: "Pending",
        index: true,
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Refunded", "Failed"],
        default: "Pending",
    },
    paymentMethod: {
        type: String,
        enum: ["UPI", "Card", "NetBanking", "Wallet", "COD"],
        default: "UPI",
    },
    paymentId: {
        type: String,
        default: null,
    },
    orderId: {
        type: String,
        default: null,
    },
    notes: {
        type: String,
        default: "",
        maxlength: 500,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Virtual for formatted date
bookingSchema.virtual("formattedDate").get(function () {
    return this.createdAt?.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
});

// Index for faster queries
bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
