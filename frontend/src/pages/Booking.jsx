import React, { useState, useEffect } from "react";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";
import axios from "axios";
import { toast } from "react-hot-toast";

function Booking({ preference, onNavigate, onSelectVehicle, user, onLogout }) {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vehicles");
      setVehicles(res.data.filter(v => v.availability));
    } catch (error) {
      toast.error("Failed to load vehicles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const weight = parseInt(preference.weight) || 0;
  const distance = parseInt(preference.distance) || 0;
  const filtered = vehicles.filter(v => parseInt(v.capacity) >= weight);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <NavigationBar onNavigate={onNavigate} user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-5xl mx-auto py-12 px-6 w-full">
        <div className="mb-8">
          <button
            onClick={() => onNavigate("preference")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Preferences
          </button>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Available Vehicles
          </h1>
          <p className="text-gray-600">
            Showing vehicles suitable for {weight} kg cargo • {preference.from} → {preference.to}
          </p>
        </div>

        {/* Route Summary */}
        <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-6 mb-8">
          <div className="grid sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">From</p>
              <p className="font-bold text-gray-800">{preference.from}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">To</p>
              <p className="font-bold text-gray-800">{preference.to}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Distance</p>
              <p className="font-bold text-gray-800">{distance} km</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Weight</p>
              <p className="font-bold text-gray-800">{weight} kg</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center p-12"><p className="text-gray-500">Loading available vehicles...</p></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-12 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Vehicles Available</h2>
            <p className="text-gray-600 mb-6">
              Sorry, we don't have vehicles suitable for {weight} kg cargo.
              Please try with a smaller weight or contact us for custom solutions.
            </p>
            <button
              onClick={() => onNavigate("preference")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold"
            >
              Modify Preferences
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map(v => {
              const estimatedCost = v.pricePerKm * distance;

              return (
                <div key={v._id} className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Image */}
                  <div className="relative h-44 bg-gray-100 flex items-center justify-center">
                    <img
                      src={v.image || 'https://via.placeholder.com/300x200'}
                      alt={v.name}
                      className="h-full object-contain"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-blue-600">
                      {v.capacity / 1000} Ton
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{v.name}</h2>
                        <p className="text-gray-500 text-sm">Capacity: {v.capacity / 1000} Ton</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Rate</p>
                        <p className="font-bold text-green-600">₹{v.pricePerKm}/km</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Estimated Total</span>
                        <span className="text-2xl font-bold text-blue-600">₹{estimatedCost}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{distance} km × ₹{v.pricePerKm}/km</p>
                    </div>

                    <button
                      onClick={() => onSelectVehicle(v)}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                    >
                      Select Vehicle
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

export default Booking;
