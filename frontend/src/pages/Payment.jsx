import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";

const BACKEND_URL = "http://localhost:5001";

function Payment({ preference, vehicle, user, onLogout }) {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const distance = parseInt(preference?.distance) || 0;
  const totalAmount = (vehicle?.pricePerKm || 0) * distance;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  async function handlePay() {
    setError("");
    setProcessing(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to continue");

      // Step 1: Load Razorpay SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) throw new Error("Razorpay SDK failed to load. Check your internet connection.");

      // Step 2: Create Razorpay Order
      const orderRes = await fetch(`${BACKEND_URL}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: totalAmount }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Failed to create payment order");

      // Step 3: Save Booking to DB immediately (test mode)
      const bookingRes = await fetch(`${BACKEND_URL}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          from: preference.from,
          to: preference.to,
          weight: preference.weight,
          vehicleType: vehicle.name,
          amount: totalAmount,
          distance: distance,
          cargoType: preference.type,
          scheduledDate: preference.day,
          scheduledTime: preference.time,
          paymentStatus: "Paid",
          orderId: orderData.id,
        }),
      });

      if (!bookingRes.ok) {
        const bd = await bookingRes.json();
        throw new Error(bd.message || "Failed to save booking");
      }

      // Step 4: Open Razorpay Modal
      const options = {
        key: "rzp_test_SOmN1JYplRyzpx",
        amount: orderData.amount,
        currency: "INR",
        name: "EasyCart Transport",
        description: `${preference?.from} → ${preference?.to}`,
        order_id: orderData.id,
        handler: function () {
          // Payment successful — go to confirmation
          navigate("/confirmation");
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#2563eb" },
        modal: {
          ondismiss: function () {
            // Modal closed — booking is saved, go to confirmation anyway
            navigate("/confirmation");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        // Even on failure, booking is saved — navigate to confirmation
        navigate("/confirmation");
      });
      rzp.open();

    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setProcessing(false);
    }
  }

  if (!vehicle || !preference) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No booking details found.</p>
          <button onClick={() => navigate("/preference")} className="px-6 py-3 bg-blue-600 text-white rounded-xl">
            Start Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <NavigationBar user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-2xl mx-auto py-12 px-6 w-full">
        <div className="mb-8">
          <button
            onClick={() => navigate("/summary")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Summary
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Payment
          </h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Payment Card */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl">
                  💳
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Secure Payment</h2>
              <p className="text-gray-500 text-center text-sm mb-6">
                Powered by Razorpay — Pay with UPI, Cards, Netbanking or Wallets
              </p>

              {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <div>
                    <p className="font-medium text-red-800 text-sm">Error</p>
                    <p className="text-sm text-red-600 mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-700">₹{totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{vehicle.name}</p>
                  <p>{distance} km × ₹{vehicle.pricePerKm}/km</p>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving &amp; Opening Payment...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Pay ₹{totalAmount.toLocaleString()} Securely
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span>🔒 256-bit SSL</span>
                <span>•</span>
                <span>🛡️ PCI DSS Compliant</span>
                <span>•</span>
                <span>✅ Razorpay Secured</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle</span>
                  <span className="font-medium">{vehicle.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route</span>
                  <span className="font-medium text-right max-w-[120px] truncate">
                    {preference.from} → {preference.to}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance</span>
                  <span className="font-medium">{distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate</span>
                  <span className="font-medium">₹{vehicle.pricePerKm}/km</span>
                </div>
                <div className="border-t border-gray-100 my-3"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-xl text-xs text-green-700">
                ✅ Booking confirmed instantly on payment
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Payment;
