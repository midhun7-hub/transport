import React, { useState, useEffect } from "react";

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

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [preference, setPreference] = useState({});
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setPage("home");
      } catch (e) {
        // Invalid saved data, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  function navigate(to) {
    setPage(to);
    if (to === "home") {
      setPreference({});
      setVehicle(null);
    }
  }

  function handleLogin(data) {
    if (data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    setPage("home");
  }

  function handleLogout() {
    setUser(null);
    setPreference({});
    setVehicle(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setPage("login");
  }

  // Show loading while checking auth
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
    <>
      {page === "login" && (
        <LoginSignUp onLogin={handleLogin} />
      )}

      {page === "home" && (
        <Home onNavigate={navigate} user={user} onLogout={handleLogout} />
      )}
      {page === "about" && (
        <About onNavigate={navigate} user={user} onLogout={handleLogout} />
      )}
      {page === "contact" && (
        <Contact onNavigate={navigate} user={user} onLogout={handleLogout} />
      )}
      {page === "history" && (
        <BookingHistory onNavigate={navigate} user={user} onLogout={handleLogout} />
      )}
      {page === "profile" && (
        <Profile onNavigate={navigate} user={user} onLogout={handleLogout} />
      )}

      {page === "preference" && (
        <Preference
          onNavigate={navigate}
          onSetPreferences={setPreference}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {page === "booking" && (
        <Booking
          preference={preference}
          onNavigate={navigate}
          onSelectVehicle={(v) => {
            setVehicle(v);
            setPage("summary");
          }}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {page === "summary" && vehicle && (
        <Summary
          preference={preference}
          vehicle={vehicle}
          user={user}
          onNavigate={navigate}
          onConfirmBooking={() => setPage("payment")}
          onLogout={handleLogout}
        />
      )}

      {page === "payment" && vehicle && (
        <Payment
          preference={preference}
          vehicle={vehicle}
          onNavigate={navigate}
          onPaymentSuccess={() => setPage("confirmation")}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {page === "confirmation" && (
        <Confirmation onNavigate={navigate} user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
