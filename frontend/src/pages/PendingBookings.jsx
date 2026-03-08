import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PendingBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    const fetchData = async () => {
        try {
            const [bookingsRes, driversRes] = await Promise.all([
                axios.get('http://localhost:5001/api/admin/bookings', checkAuth()),
                axios.get('http://localhost:5001/api/drivers', checkAuth())
            ]);
            setBookings(bookingsRes.data);
            setDrivers(driversRes.data.filter(d => d.status === 'Available'));
        } catch (error) {
            toast.error("Failed to fetch bookings or drivers");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await axios.put(`http://localhost:5001/api/admin/bookings/${bookingId}/status`, { status: newStatus }, checkAuth());
            toast.success(`Status updated to ${newStatus}`);
            fetchData();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleAssignDriver = async (bookingId, driverId) => {
        if (!driverId) return;
        try {
            await axios.put(`http://localhost:5001/api/admin/bookings/${bookingId}/assign-driver`, { driverId }, checkAuth());
            toast.success("Driver assigned successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to assign driver");
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Bookings</h1>
                <button onClick={fetchData} className="text-sm text-blue-600 hover:underline">Refresh List</button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Driver</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((b) => (
                            <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-semibold text-gray-900">{b.user?.name || 'Guest User'}</div>
                                    <div className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
                                    <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mt-1">{b.vehicleType}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 flex items-center space-x-1">
                                        <span className="font-medium">From:</span>
                                        <span className="truncate max-w-[150px]" title={b.from}>{b.from}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center space-x-1">
                                        <span className="font-medium">To:</span>
                                        <span className="truncate max-w-[150px]" title={b.to}>{b.to}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">{b.distance} km • {b.weight} kg</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    ₹{b.amount}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col space-y-2">
                                        <span className={`px-2 py-1 text-center inline-flex text-xs leading-5 font-semibold rounded-full w-24
                                            ${b.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                b.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                                    b.status === 'In Transit' ? 'bg-indigo-100 text-indigo-800' :
                                                        b.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {b.status}
                                        </span>
                                        {b.driver ? (
                                            <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100 font-medium">
                                                Driver: {b.driver.name}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-red-500 italic">No driver assigned</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <div className="flex flex-col items-end space-y-2">
                                        {!b.driver && (
                                            <select
                                                onChange={(e) => handleAssignDriver(b._id, e.target.value)}
                                                className="block w-40 border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-xs focus:ring-blue-500 focus:border-blue-500"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Assign Driver</option>
                                                {drivers.map(d => (
                                                    <option key={d._id} value={d._id}>{d.name} ({d.vehicle?.name || 'NA'})</option>
                                                ))}
                                            </select>
                                        )}
                                        <select
                                            value={b.status}
                                            onChange={(e) => handleStatusUpdate(b._id, e.target.value)}
                                            className="block w-40 border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-xs focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="In Transit">In Transit</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingBookings;
