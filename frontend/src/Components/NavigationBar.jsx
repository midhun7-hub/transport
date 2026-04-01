import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NavigationBar({ user, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Vehicles", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const userLinks = [
    { label: "Book Now", path: "/preference" },
    { label: "My Bookings", path: "/history" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <img src="/logo.png" alt="CargoLink" className="h-8 object-contain" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CargoLink
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* User Section - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {userLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all"
                  >
                    {link.label}
                  </button>
                ))}
                {user.role === 'admin' && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="px-3 py-2 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg font-bold transition-all border border-orange-200"
                  >
                    Admin Dashboard
                  </button>
                )}
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {user.name || user.email || "User"}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all"
              >
                {link.label}
              </button>
            ))}

            {user && (
              <>
                <div className="h-px bg-gray-200 my-2"></div>
                {userLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => {
                      navigate(link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all"
                  >
                    {link.label}
                  </button>
                ))}
              </>
            )}

            <div className="h-px bg-gray-200 my-2"></div>

            {user ? (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name || "User"}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-center"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavigationBar;
