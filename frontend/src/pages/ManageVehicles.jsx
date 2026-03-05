import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import useCloudinaryWidget from '../hooks/useCloudinaryWidget';

const ManageVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isModalsOpen, setIsModalsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '', type: '', capacity: '', pricePerKm: '', image: '', availability: true
    });
    const [editId, setEditId] = useState(null);

    const checkAuth = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    const fetchVehicles = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/vehicles', checkAuth());
            setVehicles(res.data);
        } catch (error) {
            toast.error("Failed to load vehicles");
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleOpenModal = (vehicle = null) => {
        if (vehicle) {
            setFormData(vehicle);
            setEditId(vehicle._id);
        } else {
            setFormData({ name: '', type: '', capacity: '', pricePerKm: '', image: '', availability: true });
            setEditId(null);
        }
        setIsModalsOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`http://localhost:5000/api/vehicles/${editId}`, formData, checkAuth());
                toast.success("Vehicle updated successfully");
            } else {
                await axios.post('http://localhost:5000/api/vehicles', formData, checkAuth());
                toast.success("Vehicle added successfully");
            }
            fetchVehicles();
            setIsModalsOpen(false);
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            try {
                await axios.delete(`http://localhost:5000/api/vehicles/${id}`, checkAuth());
                toast.success("Vehicle deleted");
                fetchVehicles();
            } catch (error) {
                toast.error("Failed to delete vehicle");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Vehicles</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20} />
                    <span>Add Vehicle</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type / Capacity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Km</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vehicles.map((v) => (
                            <tr key={v._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full object-cover" src={v.image || 'https://via.placeholder.com/40'} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{v.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{v.type}</div>
                                    <div className="text-sm text-gray-500">{v.capacity} kg</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₹{v.pricePerKm}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${v.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {v.availability ? 'Available' : 'Unavailable'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(v)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(v._id)} className="text-red-600 hover:text-red-900">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalsOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <input required type="text" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Capacity (kg)</label>
                                    <input required type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price Per Km (₹)</label>
                                <input required type="number" value={formData.pricePerKm} onChange={e => setFormData({ ...formData, pricePerKm: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="https://..." />
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" checked={formData.availability} onChange={e => setFormData({ ...formData, availability: e.target.checked })} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                <label className="ml-2 block text-sm text-gray-900">Available for booking</label>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setIsModalsOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageVehicles;
