// src/app/pricing/page.tsx
"use client";

import { FaCheckCircle, FaCrown } from 'react-icons/fa';

export default function PricingPage() {
  const plans = [
    {
      name: "Grand Master Pack",
      price: "999",
      originalPrice: "2999",
      features: ["10 Full-Length Mock Tests", "Paper 1 & Paper 2 Coverage", "Detailed Performance Analytics", "No Negative Marking Pattern"],
      cta: "Buy Now"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Unlock Your Potential</h2>
        <p className="text-lg text-gray-600 mb-12">Upgrade to premium and access the full-length mock tests to boost your preparation.</p>
        
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-600 p-8 transform hover:scale-105 transition duration-300">
          <div className="text-blue-600 text-5xl mb-4 flex justify-center"><FaCrown /></div>
          <h3 className="text-2xl font-bold text-gray-900">{plans[0].name}</h3>
          <div className="my-6">
            <span className="text-5xl font-black text-gray-900">₹{plans[0].price}</span>
            <span className="text-xl text-gray-400 line-through ml-2">₹{plans[0].originalPrice}</span>
          </div>
          <ul className="text-left space-y-4 mb-8">
            {plans[0].features.map((feature, i) => (
              <li key={i} className="flex items-center text-gray-700">
                <FaCheckCircle className="text-green-500 mr-3" /> {feature}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition text-lg shadow-lg">
            {plans[0].cta}
          </button>
        </div>
      </div>
    </div>
  );
}