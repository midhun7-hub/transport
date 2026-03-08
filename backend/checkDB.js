const mongoose = require("mongoose");
require("dotenv").config();
const Vehicle = require("./models/Vehicle");

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const vehicles = await Vehicle.find({});
        console.log("Vehicles in DB:", JSON.stringify(vehicles, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
