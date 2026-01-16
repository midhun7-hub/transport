import React, { useState } from "react";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";
import { API_URL } from "../config";

function Payment({ preference, vehicle, onNavigate, onPaymentSuccess, user, onLogout }) {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upi, setUpi] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const distance = parseInt(preference.distance) || 0;
  const totalAmount = vehicle.rent * distance;

  function validateForm() {
    if (paymentMethod === "upi") {
      if (!upi.includes("@")) {
        setError("Please enter a valid UPI ID (e.g., name@upi)");
        return false;
      }
    } else if (paymentMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        setError("Please enter a valid 16-digit card number");
        return false;
      }
      if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        setError("Please enter expiry in MM/YY format");
        return false;
      }
      if (cardCvv.length !== 3) {
        setError("Please enter a valid 3-digit CVV");
        return false;
      }
    }
    return true;
  }

  async function handlePay(e) {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setProcessing(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to continue with payment");
      }

      // First, create Razorpay order
      const orderResponse = await fetch(`${API_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: totalAmount, // Send amount in rupees
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Failed to create payment order");
      }

      // Razorpay checkout options
      const options = {
        key: "rzp_test_S4REy5TRSEnxmI", // Your Razorpay key ID
        currency: "INR",
        name: "Fleet Transport",
        description: `Booking for ${vehicle.name}`,
        order_id: orderData.id,
        handler: async function (response) {
          // Payment successful, now create booking
          try {
            const bookingResponse = await fetch(`${API_URL}/api/book`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
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
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              }),
            });

            const bookingData = await bookingResponse.json();

            if (!bookingResponse.ok) {
              throw new Error(bookingData.message || "Booking failed after payment");
            }

            // Success!
            onPaymentSuccess();
          } catch (bookingErr) {
            setError("Payment successful but booking failed. Please contact support.");
            console.error("Booking error:", bookingErr);
          }
        },
        prefill: {
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  function formatCardNumber(value) {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <NavigationBar onNavigate={onNavigate} user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-2xl mx-auto py-12 px-6 w-full">
        <div className="mb-8">
          <button
            onClick={() => onNavigate("summary")}
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
          {/* Payment Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Select Payment Method</h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === "upi"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="text-2xl mb-2">📱</div>
                  <p className="font-medium text-gray-800">UPI</p>
                  <p className="text-xs text-gray-500">GPay, PhonePe, etc.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === "card"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="text-2xl mb-2">💳</div>
                  <p className="font-medium text-gray-800">Card</p>
                  <p className="text-xs text-gray-500">Credit/Debit Card</p>
                </button>
              </div>
            </div>

            {/* Payment Details */}
            <form onSubmit={handlePay} className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {paymentMethod === "upi" ? "UPI Details" : "Card Details"}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              {paymentMethod === "upi" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    placeholder="yourname@upi"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your UPI ID linked to GPay, PhonePe, Paytm, etc.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        placeholder="•••"
                        maxLength={3}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹{totalAmount}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                🔒 Your payment is secured with 256-bit SSL encryption
              </p>
            </form>
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
                  <span className="font-medium text-right">{preference.from} → {preference.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance</span>
                  <span className="font-medium">{distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate</span>
                  <span className="font-medium">₹{vehicle.rent}/km</span>
                </div>

                <div className="border-t border-gray-100 my-3"></div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

export default Payment;
