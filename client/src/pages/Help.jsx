import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobe, FaShareAlt, FaEnvelope } from 'react-icons/fa';

// FAQ Data for easy rendering
const faqs = [
  {
    id: 1,
    question: "How can I cancel or refund my ticket?",
    answer: (
      <>
        Go to your <span className="font-semibold text-gray-700">Ticket Wallet</span> by clicking "My Tickets" in the navbar, select the booking card you want to cancel, and click the red trash/cancel icon. The simulated refund will process immediately, releasing the tickets back into inventory.
      </>
    ),
  },
  {
    id: 2,
    question: "Is payment secure on Flexibook?",
    answer: "All transactions on Bookit are completed in sandbox evaluation mode. No real credit card, financial accounts, or physical currencies are accessed or debited. It is fully secure and perfect for validation testing.",
  },
  {
    id: 3,
    question: "How do I access flight boarding passes?",
    answer: "When you select any flight listing (e.g. LHR to JFK) and book Business or Economy class experience, the confirmation ticket is generated as an authentic airline boarding pass containing dynamic seat indices (such as 12A) and precise check-in boarding times.",
  },
];

const Help = () => {
  return (
    <div className="min-h-screen bg-[#b8b8b8] py-10 px-4 flex flex-col items-center font-sans">
      
      {/* Top Header */}
      <div className="w-full max-w-[1000px] mb-4">
        <h1 className="text-2xl font-bold text-gray-600">Help</h1>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[1000px] bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col">
        
       

        {/* Main Content */}
        <main className="px-10 py-6 flex-grow">
          {/* Header Section */}
          <div className="mb-10">
            <h2 className="text-3xl font-serif text-[#1e4b6d] mb-2 font-bold tracking-wide">
              Help & Guidelines Center
            </h2>
            <p className="text-gray-500 text-sm">
              Got questions? Find high-key answers regarding your bookings and flight stubs instantly.
            </p>
          </div>

          {/* FAQ Cards */}
          <div className="space-y-4 max-w-4xl">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className="border border-blue-50 shadow-[0_4px_12px_rgba(0,0,0,0.03)] bg-white p-6 rounded-lg"
              >
                <h3 className="text-[#1e4b6d] text-sm font-bold mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-10 py-10 mt-12 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            
            {/* Brand Info */}
            <div className="md:col-span-4 pr-4">
              <div className="text-lg font-bold text-gray-700 mb-4">Flexibook</div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Flexibook Global Inc. Provides Elite Ticketing Solutions For Movie Premieres, Global Flights, Express Trains, And Local Events Worldwide. Bridging Absolute Reliability With Excitement.
              </p>
              <div className="flex space-x-4 text-gray-500">
                <FaGlobe className="w-4 h-4 cursor-pointer hover:text-gray-800" />
                <FaShareAlt className="w-4 h-4 cursor-pointer hover:text-gray-800" />
                <FaEnvelope className="w-4 h-4 cursor-pointer hover:text-gray-800" />
              </div>
            </div>

            {/* Empty space for grid alignment */}
            <div className="md:col-span-2"></div>

            {/* Footer Links */}
            <div className="md:col-span-2">
              <h4 className="font-bold text-gray-700 text-sm mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><Link to="#" className="hover:text-blue-900">About Us</Link></li>
                <li><Link to="#" className="hover:text-blue-900">Partner With Us</Link></li>
                <li><Link to="#" className="hover:text-blue-900">Our Services</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-bold text-gray-700 text-sm mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><Link to="#" className="hover:text-blue-900">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-blue-900">Terms Of Service</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-bold text-gray-700 text-sm mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><Link to="#" className="hover:text-blue-900">Help Center</Link></li>
                <li><Link to="#" className="hover:text-blue-900">FAQs & Guidelines</Link></li>
                <li><Link to="#" className="hover:text-blue-900">Refund Rules</Link></li>
              </ul>
            </div>

          </div>
          
          <div className="text-xs text-gray-400">
            © 2026 Flexibook Global Inc. Efficient Ticketing For Every Ticketed Adventure.
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Help;