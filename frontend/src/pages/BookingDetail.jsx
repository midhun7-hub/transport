import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";
import { API_URL } from "../config";

function BookingDetail({ user, onLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBooking();
    }, [id]);

    async function fetchBooking() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/bookings/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch booking details");
            const data = await res.json();
            setBooking(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed": return { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500", icon: "✅" };
            case "in transit": return { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500", icon: "🚛" };
            case "completed": return { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", icon: "🎉" };
            case "cancelled": return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", icon: "❌" };
            default: return { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500", icon: "⏳" };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
                <NavigationBar user={user} onLogout={onLogout} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600">Loading booking details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
                <NavigationBar user={user} onLogout={onLogout} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-5xl mb-4">😕</div>
                        <p className="text-red-600 font-medium mb-4">{error || "Booking not found"}</p>
                        <button onClick={() => navigate("/history")} className="px-6 py-3 bg-blue-600 text-white rounded-xl">
                            Back to My Bookings
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const statusStyle = getStatusColor(booking.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
            <NavigationBar user={user} onLogout={onLogout} />

            <main className="flex-1 max-w-2xl mx-auto py-12 px-6 w-full">
                {/* Back button */}
                <button
                    onClick={() => navigate("/history")}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to My Bookings
                </button>

                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                    Booking Details
                </h1>

                <div className="space-y-5">
                    {/* Status Card */}
                    <div className={`rounded-2xl p-6 ${statusStyle.bg} flex items-center gap-4`}>
                        <span className="text-4xl">{statusStyle.icon}</span>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Current Status</p>
                            <p className={`text-2xl font-bold ${statusStyle.text}`}>{booking.status}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Booked on {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric", month: "long", year: "numeric"
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Route & Vehicle */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span>🚚</span> Vehicle & Route
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Vehicle</span>
                                <span className="font-semibold text-gray-800">{booking.vehicleType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">From</span>
                                <span className="font-semibold text-gray-800 text-right max-w-[200px]">{booking.from}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">To</span>
                                <span className="font-semibold text-gray-800 text-right max-w-[200px]">{booking.to}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Distance</span>
                                <span className="font-semibold text-gray-800">{booking.distance} km</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Weight</span>
                                <span className="font-semibold text-gray-800">{booking.weight} kg</span>
                            </div>
                            {booking.cargoType && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Cargo Type</span>
                                    <span className="font-semibold text-gray-800">{booking.cargoType}</span>
                                </div>
                            )}
                            {booking.scheduledDate && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Scheduled Date</span>
                                    <span className="font-semibold text-gray-800">{booking.scheduledDate}</span>
                                </div>
                            )}
                            {booking.scheduledTime && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Scheduled Time</span>
                                    <span className="font-semibold text-gray-800">{booking.scheduledTime}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-100 pt-3 flex justify-between">
                                <span className="text-gray-700 font-semibold">Total Amount</span>
                                <span className="text-xl font-bold text-blue-600">₹{booking.amount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span>💳</span> Payment
                        </h2>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Payment Status</span>
                            <span className={`font-semibold ${booking.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"}`}>
                                {booking.paymentStatus || "Pending"}
                            </span>
                        </div>
                    </div>

                    {/* Driver Info */}
                    {booking.driver ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span>👨‍✈️</span> Assigned Driver
                            </h2>
                            <div className="flex items-center gap-4">
                                {booking.driver.image ? (
                                    <img
                                        src={booking.driver.image}
                                        alt={booking.driver.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {booking.driver.name?.[0] || "D"}
                                    </div>
                                )}
                                <div className="flex-1 space-y-1">
                                    <p className="text-lg font-bold text-gray-900">{booking.driver.name}</p>
                                    {booking.driver.contact && (
                                        <a href={`tel:${booking.driver.contact}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                                            📞 {booking.driver.contact}
                                        </a>
                                    )}
                                    {booking.driver.vehicle && (
                                        <p className="text-sm text-gray-500">
                                            🚛 Vehicle: {booking.driver.vehicle?.name || booking.driver.vehicle}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-6 text-center">
                            <div className="text-3xl mb-2">⏳</div>
                            <p className="font-semibold text-yellow-700">Driver Not Yet Assigned</p>
                            <p className="text-sm text-yellow-600 mt-1">Our team will assign a driver shortly. Check back soon.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default BookingDetail;
