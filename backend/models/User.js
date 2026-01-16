const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    businessName: {
        type: String,
        default: "",
        trim: true,
    },
    address: {
        type: String,
        default: "",
        trim: true,
    },
    contact: {
        type: String,
        default: "",
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

// unique: true on email field already creates the necessary index

module.exports = mongoose.model("User", userSchema);
