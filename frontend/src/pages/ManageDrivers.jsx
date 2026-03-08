import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const ManageDrivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [isModalsOpen, setIsModalsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '', contact: '', licenseNumber: '', vehicle: '', status: 'Available', image: ''
    });
    const [editId, setEditId] = useState(null);

    const checkAuth = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    const fetchData = async () => {
        try {
            const [driversRes, vehiclesRes] = await Promise.all([
                axios.get('http://localhost:5001/api/drivers', checkAuth()),
                axios.get('http://localhost:5001/api/vehicles', checkAuth())
            ]);
            setDrivers(driversRes.data);
            setVehicles(vehiclesRes.data);
        } catch (error) {
            toast.error("Failed to load data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (driver = null) => {
        if (driver) {
            setFormData({
                name: driver.name,
                contact: driver.contact,
                licenseNumber: driver.licenseNumber,
                vehicle: driver.vehicle ? driver.vehicle._id : '',
                status: driver.status,
                image: driver.image || ''
            });
            setEditId(driver._id);
        } else {
            setFormData({ name: '', contact: '', licenseNumber: '', vehicle: '', status: 'Available', image: '' });
            setEditId(null);
        }
        setIsModalsOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, vehicle: formData.vehicle || null };

            if (editId) {
                await axios.put(`http://localhost:5001/api/drivers/${editId}`, payload, checkAuth());
                toast.success("Driver updated successfully");
            } else {
                await axios.post('http://localhost:5001/api/drivers', payload, checkAuth());
                toast.success("Driver added successfully");
            }
            fetchData();
            setIsModalsOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this driver?")) {
            try {
                await axios.delete(`http://localhost:5001/api/drivers/${id}`, checkAuth());
                toast.success("Driver deleted");
                fetchData();
            } catch (error) {
                toast.error("Failed to delete driver");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Drivers</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Driver</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact / License</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Vehicle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {drivers.map((d) => (
                            <tr key={d._id} className={d.status === 'On Trip' ? 'bg-gray-50 italic text-gray-400' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`flex items-center ${d.status === 'On Trip' ? 'opacity-50' : ''}`}>
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={d.image || 'https://via.placeholder.com/40?text=Driver'} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{d.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-sm text-gray-900 ${d.status === 'On Trip' ? 'opacity-50' : ''}`}>{d.contact}</div>
                                    <div className={`text-sm text-gray-500 ${d.status === 'On Trip' ? 'opacity-50' : ''}`}>{d.licenseNumber}</div>
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${d.status === 'On Trip' ? 'opacity-50' : ''}`}>
                                    {d.vehicle ? d.vehicle.name : 'Unassigned'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${d.status === 'Available' ? 'bg-green-100 text-green-800' :
                                            d.status === 'On Trip' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {d.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(d)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(d._id)} className="text-red-600 hover:text-red-900">
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <h2 className="text-xl font-bold mb-6 text-gray-800">{editId ? 'Edit Driver' : 'Add Driver'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Driver Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                <input required type="text" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. +91 9876543210" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">License Number</label>
                                <input required type="text" value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. DL-123456789" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Driver Photo</label>
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
                                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-500'); }}
                                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-blue-500'); }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove('border-blue-500');
                                        const file = e.dataTransfer.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (re) => setFormData({ ...formData, image: re.target.result });
                                            reader.readAsDataURL(file);
                                            toast.success("Photo selected");
                                        }
                                    }}
                                    onClick={() => document.getElementById('driver-image-input').click()}
                                >
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="h-32 w-32 object-cover rounded-full mx-auto border-2 border-blue-100" />
                                    ) : (
                                        <div className="py-2">
                                            <p className="text-gray-500 text-sm">Drag & drop photo here or click to upload</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="driver-image-input"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (re) => setFormData({ ...formData, image: re.target.result });
                                                reader.readAsDataURL(file);
                                                toast.success("Photo selected");
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Assign Vehicle (Optional)</label>
                                <select value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">-- No Vehicle Assigned --</option>
                                    {vehicles.map(v => (
                                        <option key={v._id} value={v._id}>{v.name} ({v.type})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="Available">Available</option>
                                    <option value="On Trip">On Trip</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 mt-8">
                                <button type="button" onClick={() => setIsModalsOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors">Save Driver</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDrivers;
