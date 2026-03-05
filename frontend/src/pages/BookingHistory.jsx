import React, { useState, useEffect } from "react";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";
import { API_URL } from "../config";

function BookingHistory({ onNavigate, user, onLogout }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/bookings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch bookings");
            }

            const data = await res.json();
            setBookings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return "bg-green-100 text-green-700 border-green-200";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "cancelled":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <NavigationBar onNavigate={onNavigate} user={user} onLogout={onLogout} />

            <main className="max-w-4xl mx-auto py-12 px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        My Bookings
                    </h1>
                    <p className="text-gray-600 mt-2">View your booking history and status</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600">Loading bookings...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600 font-medium">{error}</p>
                        <button
                            onClick={fetchBookings}
                            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">No Bookings Yet</h2>
                        <p className="text-gray-600 mb-6">You haven't made any bookings. Start by renting a vehicle!</p>
                        <button
                            onClick={() => onNavigate("preference")}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                        >
                            Rent Vehicle
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking, index) => (
                            <div
                                key={booking._id || index}
                                className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-2xl">🚚</span>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {booking.vehicleType}
                                            </h3>
                                            <span
                                                className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                                                    booking.status
                                                )}`}
                                            >
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">From:</span>
                                                <span className="font-medium text-gray-800">{booking.from}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">To:</span>
                                                <span className="font-medium text-gray-800">{booking.to}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">Weight:</span>
                                                <span className="font-medium text-gray-800">{booking.weight} kg</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">Date:</span>
                                                <span className="font-medium text-gray-800">
                                                    {new Date(booking.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {booking.driver && (
                                            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-lg">
                                                    👨‍✈️
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">Assigned Driver</p>
                                                    <p className="text-sm text-gray-600">{booking.driver.name} • {booking.driver.contact}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                        <p className="text-2xl font-bold text-blue-600">₹{booking.amount}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer onNavigate={onNavigate} />
        </div>
    );
}

export default BookingHistory;
