import React from "react";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";

function Profile({ onNavigate, user, onLogout }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <NavigationBar onNavigate={onNavigate} user={user} onLogout={onLogout} />

            <main className="max-w-2xl mx-auto py-12 px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        My Profile
                    </h1>
                    <p className="text-gray-600 mt-2">Manage your account details</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
                        <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 shadow-lg">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-white">
                            {user?.name || "User"}
                        </h2>
                        <p className="text-blue-100">{user?.email}</p>
                    </div>

                    {/* Profile Details */}
                    <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Account Information</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Full Name</span>
                                <span className="font-medium text-gray-800">{user?.name || "Not set"}</span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Email Address</span>
                                <span className="font-medium text-gray-800">{user?.email || "Not set"}</span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Business Name</span>
                                <span className="font-medium text-gray-800">{user?.businessName || "Not set"}</span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Contact</span>
                                <span className="font-medium text-gray-800">{user?.contact || "Not set"}</span>
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <span className="text-gray-500">Address</span>
                                <span className="font-medium text-gray-800 text-right max-w-[200px]">
                                    {user?.address || "Not set"}
                                </span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => onNavigate("preference")}
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                                >
                                    <span>🚚</span>
                                    Book a Vehicle
                                </button>
                                <button
                                    onClick={() => onNavigate("history")}
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    <span>📋</span>
                                    View Bookings
                                </button>
                            </div>
                        </div>

                        {/* Logout */}
                        <div className="mt-6">
                            <button
                                onClick={onLogout}
                                className="w-full py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all border border-red-200"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer onNavigate={onNavigate} />
        </div>
    );
}

export default Profile;
