import React from 'react';
import NavigationBar from '../Components/NavigationBar';
import Footer from '../Components/Footer';

function Terms({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationBar user={user} onLogout={onLogout} />
      <main className="flex-1 max-w-4xl mx-auto py-12 px-6 w-full mt-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">Terms & Policy</h1>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Additional Charges</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-gray-800">Waiting Time:</strong> Extra charges will be applicable if the vehicle is kept waiting beyond the standard agreed-upon loading/unloading times at the pickup or destination points.</li>
                <li><strong className="text-gray-800">Tolls & Taxes:</strong> Inter-state taxes, toll charges, and local municipal entry taxes are generally excluded from base fares unless explicitly stated during booking. The customer is responsible for clearing these.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Excusable Delays</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-gray-800">Weather Conditions:</strong> There will be absolutely no extra charges or penalties applied for delays resulting directly from heavy rain, storms, or other severe weather conditions.</li>
                <li><strong className="text-gray-800">Unforeseen Circumstances:</strong> We prioritize safety. Delays due to natural calamities, road blockages, or acts of nature will not incur extra fees.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Terms;
