import React from "react";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";

function Summary({ preference, vehicle, user, onNavigate, onConfirmBooking, onLogout }) {
  const distance = parseInt(preference.distance) || 0;
  const total = vehicle.pricePerKm * distance;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <NavigationBar onNavigate={onNavigate} user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-2xl mx-auto py-12 px-6 w-full">
        <div className="mb-8">
          <button
            onClick={() => onNavigate("booking")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Vehicles
          </button>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Booking Summary
          </h1>
        </div>

        <div className="space-y-6">
          {/* Vehicle Info */}
          <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-lg">🚚</span>
              Vehicle Details
            </h2>
            <div className="flex items-center gap-4">
              <img
                src={vehicle.image || "https://images.pexels.com/photos/2424925/pexels-photo-2424925.jpeg"}
                alt={vehicle.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div>
                <p className="font-bold text-xl text-gray-900">{vehicle.name}</p>
                <p className="text-gray-500">Capacity: {vehicle.capacity / 1000} Ton</p>
                <p className="text-green-600 font-medium">₹{vehicle.pricePerKm}/km</p>
              </div>
            </div>
          </div>

          {/* Route Info */}
          <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-lg">📍</span>
              Route Details
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Pickup</p>
                  <p className="font-medium text-gray-800">{preference.from}</p>
                </div>
              </div>
              <div className="ml-1.5 w-0.5 h-6 bg-gray-200"></div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Destination</p>
                  <p className="font-medium text-gray-800">{preference.to}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Distance</p>
                <p className="font-bold text-gray-800">{preference.distance} km</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Duration</p>
                <p className="font-bold text-gray-800">~{Math.ceil(distance / 50)} hours</p>
              </div>
            </div>
          </div>

          {/* Cargo Info */}
          <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-lg">📦</span>
              Cargo Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Cargo Type</p>
                <p className="font-medium text-gray-800">{preference.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Weight</p>
                <p className="font-medium text-gray-800">{preference.weight} kg</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Date</p>
                <p className="font-medium text-gray-800">{preference.day}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Time</p>
                <p className="font-medium text-gray-800">{preference.time}</p>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-bold mb-4">Price Breakdown</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-100">Base Rate</span>
                <span>₹{vehicle.pricePerKm}/km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Distance</span>
                <span>{distance} km</span>
              </div>
              <div className="border-t border-blue-400/30 my-3"></div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => onNavigate("home")}
              className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmBooking}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

export default Summary;
