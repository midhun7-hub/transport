import React, { useState } from "react";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";

function Preference({ onNavigate, onSetPreferences, user, onLogout }) {
  const [form, setForm] = useState({
    from: "",
    to: "",
    type: "",
    weight: "",
    day: "",
    time: "",
    distance: ""
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  }

  function validate() {
    const newErrors = {};
    if (!form.from.trim()) newErrors.from = "Pickup location is required";
    if (!form.to.trim()) newErrors.to = "Destination is required";
    if (!form.type.trim()) newErrors.type = "Cargo type is required";
    if (!form.weight || parseInt(form.weight) <= 0) newErrors.weight = "Valid weight is required";
    if (!form.day) newErrors.day = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    if (!form.distance || parseInt(form.distance) <= 0) newErrors.distance = "Valid distance is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      onSetPreferences(form);
      onNavigate("booking");
    }
  }

  const cargoTypes = [
    "Electronics",
    "Furniture",
    "Food & Perishables",
    "Industrial Equipment",
    "Construction Materials",
    "Textiles",
    "Chemicals",
    "General Cargo",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <NavigationBar onNavigate={onNavigate} user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-2xl mx-auto py-12 px-6 w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Transport Preferences
          </h1>
          <p className="text-gray-600">Tell us about your cargo and we'll find the perfect vehicle</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-8">
          {/* Route Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">1</span>
              Route Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                <input
                  name="from"
                  value={form.from}
                  onChange={handleChange}
                  placeholder="Enter city/address"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.from ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                />
                {errors.from && <p className="text-red-500 text-xs mt-1">{errors.from}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input
                  name="to"
                  value={form.to}
                  onChange={handleChange}
                  placeholder="Enter city/address"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.to ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                />
                {errors.to && <p className="text-red-500 text-xs mt-1">{errors.to}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Distance (km)</label>
              <input
                type="number"
                name="distance"
                value={form.distance}
                onChange={handleChange}
                placeholder="e.g., 150"
                min="1"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.distance ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
              />
              {errors.distance && <p className="text-red-500 text-xs mt-1">{errors.distance}</p>}
            </div>
          </div>

          {/* Cargo Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">2</span>
              Cargo Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.type ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                >
                  <option value="">Select cargo type</option>
                  {cargoTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  min="1"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.weight ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                />
                {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">3</span>
              Schedule
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="day"
                  value={form.day}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.day ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                />
                {errors.day && <p className="text-red-500 text-xs mt-1">{errors.day}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.time ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                />
                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            Find Vehicles
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </form>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

export default Preference;
