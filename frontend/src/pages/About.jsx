import React from "react";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";
import { vehicleData } from "../data/vehicles";
import VehicleCard from "../Components/VehicleCard";

function About({ onNavigate, user, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <NavigationBar onNavigate={onNavigate} user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-7xl mx-auto py-12 px-6 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Our Vehicles
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our wide range of cargo vehicles. From small deliveries to heavy industrial transport, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicleData.map((vehicle, i) => (
            <VehicleCard key={i} vehicle={vehicle} onBook={() => onNavigate("preference")} />
          ))}
        </div>

        {/* Why Choose Section */}
        <section className="mt-20">
          <div className="bg-white rounded-3xl shadow-lg shadow-blue-500/5 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Vehicle Selection Guide</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Small Cargo</h3>
                <p className="text-gray-600 text-sm">Up to 2 Tons - Mini Truck or Cargo Van</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Medium Cargo</h3>
                <p className="text-gray-600 text-sm">2-5 Tons - Pickup Truck</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
                <div className="text-4xl mb-4">🏭</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Heavy Cargo</h3>
                <p className="text-gray-600 text-sm">5+ Tons - 3 Axle or Container Truck</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

export default About;
