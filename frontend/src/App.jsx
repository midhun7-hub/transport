import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import LoginSignUp from "./pages/LoginSignUp";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Preference from "./pages/Preference";
import Booking from "./pages/Booking";
import Summary from "./pages/Summary";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import BookingHistory from "./pages/BookingHistory";
import Profile from "./pages/Profile";
import AdminLayout from "./Components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ManageVehicles from "./pages/ManageVehicles";
import ManageDrivers from "./pages/ManageDrivers";
import PendingBookings from "./pages/PendingBookings";
import NavigationBar from "./Components/NavigationBar";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      // Redirect to home if user is not authorized for this role
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout component to include NavigationBar for non-admin pages
const MainLayout = ({ children, user, handleLogout }) => {
  return (
    <>
      <NavigationBar onNavigate={() => { }} user={user} onLogout={handleLogout} />
      <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
        {children}
      </div>
    </>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Flow State
  const [preference, setPreference] = useState({});
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (data) => {
    if (data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPreference({});
    setVehicle(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Routing redirect is managed in components
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginSignUp onLogin={handleLogin} />} />

        {/* User Routes (Protected layout logic handles navbar inside) */}
        <Route path="/" element={<ProtectedRoute allowedRoles={["user", "admin"]}><Home user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute allowedRoles={["user", "admin"]}><About user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute allowedRoles={["user", "admin"]}><Contact user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={["user", "admin"]}><Profile user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute allowedRoles={["user", "admin"]}><BookingHistory user={user} onLogout={handleLogout} /></ProtectedRoute>} />

        {/* Booking Flow */}
        <Route path="/preference" element={<ProtectedRoute allowedRoles={["user"]}><Preference onSetPreferences={setPreference} user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute allowedRoles={["user"]}><Booking preference={preference} onSelectVehicle={setVehicle} user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/summary" element={<ProtectedRoute allowedRoles={["user"]}><Summary preference={preference} vehicle={vehicle} user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute allowedRoles={["user"]}><Payment preference={preference} vehicle={vehicle} user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/confirmation" element={<ProtectedRoute allowedRoles={["user"]}><Confirmation user={user} onLogout={handleLogout} /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout user={user} onLogout={handleLogout} /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="vehicles" element={<ManageVehicles />} />
          <Route path="drivers" element={<ManageDrivers />} />
          <Route path="bookings" element={<PendingBookings />} />
        </Route>

        {/* Wildcard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
