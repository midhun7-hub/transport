import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, CalendarDays, LogOut } from 'lucide-react';

const AdminLayout = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/vehicles', icon: <Truck size={20} />, label: 'Vehicles' },
        { path: '/admin/drivers', icon: <Users size={20} />, label: 'Drivers' },
        { path: '/admin/bookings', icon: <CalendarDays size={20} />, label: 'Bookings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-2xl font-bold text-blue-600">Admin Panel</h2>
                    <p className="text-sm text-gray-500 mt-1">Cargo Transport</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={handleLogoutClick}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-blue-600">Admin Panel</h2>
                    <button onClick={handleLogoutClick} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                        <LogOut size={20} />
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
