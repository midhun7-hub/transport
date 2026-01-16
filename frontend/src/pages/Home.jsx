import React from "react";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";

function Home({ onNavigate, user, onLogout }) {
  const features = [
    { icon: "🚚", title: "Wide Vehicle Range", desc: "From mini trucks to container trucks" },
    { icon: "⚡", title: "Instant Booking", desc: "Book your cargo vehicle in seconds" },
    { icon: "🛡️", title: "Fully Insured", desc: "All shipments are covered" },
    { icon: "📍", title: "Real-time Tracking", desc: "Track your cargo live" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <NavigationBar onNavigate={onNavigate} user={user} onLogout={onLogout} />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transport your cargo
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block mt-2">
                  safely & reliably
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                India's most trusted cargo transport service. Book vehicles instantly,
                track shipments in real-time, and enjoy hassle-free logistics.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onNavigate("preference")}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    Rent Vehicle
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
                <button
                  onClick={() => onNavigate("about")}
                  className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  View Vehicles
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 max-w-xl mx-auto">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-blue-600">10K+</p>
                  <p className="text-sm text-gray-500 mt-1">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-blue-600">50+</p>
                  <p className="text-sm text-gray-500 mt-1">Vehicles Available</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-blue-600">50K+</p>
                  <p className="text-sm text-gray-500 mt-1">Trips Completed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EasyCart?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide the best logistics solutions tailored to your needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-default"
                >
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to ship your cargo?</h2>
                <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                  Get started today and experience hassle-free transportation
                </p>
                <button
                  onClick={() => onNavigate("preference")}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  Get Started Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

export default Home;
