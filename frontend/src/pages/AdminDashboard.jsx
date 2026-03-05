import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Users, CalendarDays, CheckCircle, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center mb-4">
        <div className={`p-4 rounded-full ${color} mr-4`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalVehicles: 0,
        totalDrivers: 0,
        totalBookings: 0,
        revenue: 0,
        pendingBookings: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all required data to compute stats
                const [vehiclesRes, driversRes, bookingsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/vehicles', checkAuth()), // Adjust mapping
                    axios.get('http://localhost:5000/api/drivers', checkAuth()),
                    axios.get('http://localhost:5000/api/admin/bookings', checkAuth()),
                ]);

                const bookings = bookingsRes.data;
                const revenue = bookings.reduce((acc, curr) => acc + (curr.amount || 0), 0);
                const pendingCount = bookings.filter(b => b.status === 'Pending').length;

                setStats({
                    totalVehicles: vehiclesRes.data.length,
                    totalDrivers: driversRes.data.length,
                    totalBookings: bookings.length,
                    revenue: revenue,
                    pendingBookings: pendingCount
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return <div className="text-center py-10">Loading Dashboard...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

            {/* Grid layout as requested */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.revenue.toLocaleString()}`}
                    icon={<TrendingUp size={24} className="text-green-600" />}
                    color="bg-green-100"
                />
                <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    icon={<CalendarDays size={24} className="text-blue-600" />}
                    color="bg-blue-100"
                />
                <StatCard
                    title="Pending Actions"
                    value={stats.pendingBookings}
                    icon={<CheckCircle size={24} className="text-yellow-600" />}
                    color="bg-yellow-100"
                />
                <StatCard
                    title="Fleet Size"
                    value={stats.totalVehicles}
                    icon={<Truck size={24} className="text-purple-600" />}
                    color="bg-purple-100"
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
