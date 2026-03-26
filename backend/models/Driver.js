const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    contact: {
        type: String,
        required: true,
        trim: true,
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        default: null, // Assigned later or specific to this driver
    },
    status: {
        type: String,
        enum: ["Available", "On Trip", "Inactive"],
        default: "Available",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Driver", driverSchema);
