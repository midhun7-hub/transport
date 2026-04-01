import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";

function Contact({ user, onLogout }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status) setStatus(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: "error", message: "Name, email, and message are required." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");

      setStatus({ type: "success", message: "Message sent! We'll get back to you soon." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <NavigationBar user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-6xl mx-auto py-12 px-6 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  📞
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Phone</h3>
                  <p className="text-gray-600">+91 9894335735</p>
                  <p className="text-sm text-gray-500">Mon-Sat, 9am to 6pm</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  ✉️
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Email</h3>
                  <p className="text-gray-600">midhun77msdcr@gmail.com</p>
                  <p className="text-sm text-gray-500">We reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  📍
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Office Address</h3>
                  <p className="text-gray-600">
                    1/252-B, Sembianallur,<br />
                    Avinashi-641 654,<br />
                    Tamil Nadu, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  🕐
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Working Hours</h3>
                  <p className="text-gray-600">Monday - Saturday</p>
                  <p className="text-sm text-gray-500">9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>

            {status && (
              <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
                status.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="text-xl">{status.type === 'success' ? '✅' : '⚠️'}</div>
                <div>
                  <p className="font-medium">{status.type === 'success' ? 'Success' : 'Error'}</p>
                  <p className="text-sm opacity-90">{status.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-4 overflow-hidden">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <span className="text-4xl block mb-2">🗺️</span>
              <p>Map integration coming soon</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
