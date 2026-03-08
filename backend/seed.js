const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "./backend/.env" });
const User = require("./models/User");
const Vehicle = require("./models/Vehicle");
const Driver = require("./models/Driver");

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Update Admin
        const adminEmail = "admin123@gmail.com";
        const adminPass = "mnbvcxz";
        const hashedPass = await bcrypt.hash(adminPass, 10);

        await User.findOneAndUpdate(
            { role: "admin" },
            { email: adminEmail, password: hashedPass },
            { upsert: true, new: true }
        );
        console.log("Admin updated successfully");

        // Seed Vehicles if empty
        const count = await Vehicle.countDocuments();
        if (count === 0) {
            const vehicles = [
                { name: "Tata Ace", type: "Mini Truck", capacity: 850, pricePerKm: 20, image: "https://via.placeholder.com/300x200?text=Tata+Ace", availability: true },
                { name: "Ashok Leyland Dost", type: "Pickup", capacity: 1500, pricePerKm: 30, image: "https://via.placeholder.com/300x200?text=Pickup", availability: true },
                { name: "Eicher 10.59", type: "Intermediate Truck", capacity: 3000, pricePerKm: 50, image: "https://via.placeholder.com/300x200?text=Eicher", availability: true },
            ];
            await Vehicle.insertMany(vehicles);
            console.log("Vehicles seeded successfully");
        }

        // Seed Drivers
        await Driver.deleteMany({});

        // Get the first vehicle to assign to a driver
        const firstVehicle = await Vehicle.findOne({ name: 'Tata Ace' });

        await Driver.create([
            {
                name: 'Rajesh Kumar',
                contact: '9876543210',
                licenseNumber: 'DL1234567890',
                vehicle: firstVehicle ? firstVehicle._id : null,
                status: 'Available',
                image: 'https://images.unsplash.com/photo-1595273670150-db0a3d39074f?auto=format&fit=crop&q=80&w=200'
            },
            {
                name: 'Suresh Raina',
                contact: '9123456789',
                licenseNumber: 'UP8521479630',
                status: 'Available'
            }
        ]);
        console.log("Drivers seeded successfully");

        console.log('✅ Seed data updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seed();
