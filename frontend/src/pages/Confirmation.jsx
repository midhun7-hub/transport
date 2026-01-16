import React from "react";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";

function Confirmation({ onNavigate, user, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <NavigationBar onNavigate={onNavigate} user={user} onLogout={onLogout} />

      <main className="flex-1 flex justify-center items-center py-20 px-6">
        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 p-8 md:p-12 text-center max-w-lg w-full">
          {/* Success Animation */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Booking Confirmed! 🎉
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Your vehicle has been booked successfully. We've sent you a confirmation email with all the details.
          </p>

          {/* Booking Info Card */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-800 mb-4">What's Next?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm flex-shrink-0 mt-0.5">1</div>
                <span className="text-gray-600">You'll receive a confirmation SMS shortly</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm flex-shrink-0 mt-0.5">2</div>
                <span className="text-gray-600">Our team will contact you to confirm pickup details</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm flex-shrink-0 mt-0.5">3</div>
                <span className="text-gray-600">Driver will arrive at the scheduled time</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => onNavigate("history")}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              View My Bookings
            </button>
            <button
              onClick={() => onNavigate("home")}
              className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </button>
          </div>

          {/* Support Info */}
          <p className="mt-8 text-sm text-gray-500">
            Need help? Contact us at{" "}
            <a href="tel:+911234567890" className="text-blue-600 font-medium">+91 12345 67890</a>
          </p>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

export default Confirmation;
