const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    capacity: {
        type: Number, // In kg/tons
        required: true,
    },
    pricePerKm: {
        type: Number,
        required: true,
    },
    image: {
        type: String, // Cloudinary URL
        default: "",
    },
    availability: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
