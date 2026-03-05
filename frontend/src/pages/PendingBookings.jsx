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
                axios.get('http://localhost:5000/api/admin/bookings', checkAuth()),
                axios.get('http://localhost:5000/api/drivers', checkAuth())
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

    const handleAssignDriver = async (bookingId, driverId) => {
        if (!driverId) return;

        try {
            await axios.put(`http://localhost:5000/api/admin/bookings/${bookingId}/assign-driver`, { driverId }, checkAuth());

            // Also update driver status to 'On Trip'
            const driver = drivers.find(d => d._id === driverId);
            if (driver) {
                await axios.put(`http://localhost:5000/api/drivers/${driverId}`, { ...driver, status: 'On Trip' }, checkAuth());
            }

            toast.success("Driver assigned successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to assign driver");
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading bookings...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Bookings</h1>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Driver</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((b) => (
                            <tr key={b._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{b.user?.name || 'Unknown User'}</div>
                                    <div className="text-sm text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</div>
                                    <div className="text-xs text-blue-600 mt-1">{b.vehicleType}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 truncate max-w-xs" title={b.from}>From: {b.from}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs" title={b.to}>To: {b.to}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ₹{b.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${b.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            b.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                                b.status === 'In Transit' ? 'bg-indigo-100 text-indigo-800' :
                                                    b.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {b.driver ? (
                                        <div className="text-green-600 font-medium">
                                            Assigned: {b.driver.name}
                                        </div>
                                    ) : (
                                        <select
                                            onChange={(e) => handleAssignDriver(b._id, e.target.value)}
                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select Driver</option>
                                            {drivers.map(d => (
                                                <option key={d._id} value={d._id}>{d.name} ({d.vehicle?.name || 'No Vehicle'})</option>
                                            ))}
                                        </select>
                                    )}
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
