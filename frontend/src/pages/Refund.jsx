import React from 'react';
import NavigationBar from '../Components/NavigationBar';
import Footer from '../Components/Footer';

function Refund({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationBar user={user} onLogout={onLogout} />
      <main className="flex-1 max-w-4xl mx-auto py-12 px-6 w-full mt-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">Refund Policy</h1>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Cargo Loss & Damages</h2>
              <p>
                We handle your goods with the utmost care. In the rare event that cargo is lost, missing, or suffers significant damage during transit due to negligence on our part, we will initiate a prompt refund and compensation claim procedure subject to our standard damage inspection process.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Time Delays</h2>
              <p>
                We value your time. If the cargo is not delivered within a reasonable timeframe past the agreed-upon deadline (excluding unavoidable circumstances like severe weather), you may be eligible to proceed with a partial refund or dispute discount on the trip fare.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Claim Processing</h2>
              <p>
                To officially request a refund regarding damages or delays, please contact our support desk immediately upon identifying the issue. Always provide photographic evidence where applicable. Refunds are typically analyzed and processed within standard business days after validation.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Refund;
