"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabase'; // మీ సుపబేస్ పాత్ సరిచూసుకోండి
import { FaCheckCircle, FaCrown, FaSpinner, FaLock } from 'react-icons/fa';

export default function PricingPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      name: "Grand Master Pack",
      price: "999",
      originalPrice: "2999",
      features: [
        "10 Full-Length Mock Tests", 
        "Paper 1 & Paper 2 Coverage", 
        "Detailed Performance Analytics", 
        "Subject & Chapter Wise Tests",
        "No Negative Marking Pattern"
      ],
      cta: "Upgrade to Premium"
    }
  ];

  // 🚀 Payment Simulation & Database Update Logic 🚀
  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // 1. కరెంట్ యూజర్ ని తెచ్చుకోవడం
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        // లాగిన్ అవ్వకుండా ప్రైసింగ్ పేజీకి వస్తే లాగిన్ కి పంపుతాం
        router.push('/login');
        return;
      }

      // 2. పేమెంట్ గేట్‌వే కోసం ఒక 2 సెకన్ల డమ్మీ డిలే (Simulating Razorpay/Stripe)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. పేమెంట్ సక్సెస్ అయ్యాక, ప్రొఫైల్స్ టేబుల్ లో is_premium ని true చేయడం
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 4. సక్సెస్ మెసేజ్ చూపించి డ్యాష్‌బోర్డ్ కి పంపడం
      alert("Payment Successful! Premium Access Unlocked.");
      window.location.href = '/dashboard'; // Hard reload to clear client cache

    } catch (error) {
      console.error("Payment failed:", error);
      alert("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center">
      <div className="max-w-3xl mx-auto text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-bold mb-6 border border-yellow-200 shadow-sm">
          <FaLock /> Limited Time Launch Offer
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Unlock Your Potential</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">Upgrade to premium today and access our complete suite of full-length mock tests, chapter-wise analysis, and personalized insights.</p>
        
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:-translate-y-2 transition duration-500 max-w-md mx-auto relative">
          
          {/* Top Banner highlight */}
          <div className="h-2 w-full bg-linear-to-r from-blue-500 to-indigo-600"></div>

          <div className="p-8">
            <div className="text-blue-600 text-5xl mb-4 flex justify-center drop-shadow-md">
              <FaCrown />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{plans[0].name}</h3>
            
            <div className="my-6 flex items-center justify-center gap-3">
              <span className="text-5xl font-black text-gray-900">₹{plans[0].price}</span>
              <div className="flex flex-col text-left">
                <span className="text-lg text-gray-400 line-through font-semibold">₹{plans[0].originalPrice}</span>
                <span className="text-xs font-bold text-green-500 uppercase bg-green-50 px-2 py-0.5 rounded">Save 66%</span>
              </div>
            </div>
            
            <ul className="text-left space-y-4 mb-8">
              {plans[0].features.map((feature, i) => (
                <li key={i} className="flex items-start text-gray-700 font-medium">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 shrink-0 text-lg" /> 
                  {feature}
                </li>
              ))}
            </ul>
            
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full py-4 font-bold rounded-xl text-lg shadow-lg flex items-center justify-center gap-2 transition-all
                ${isProcessing 
                  ? 'bg-blue-400 cursor-not-allowed text-white' 
                  : 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl hover:-translate-y-0.5'
                }`}
            >
              {isProcessing ? (
                <><FaSpinner className="animate-spin" /> Processing Securely...</>
              ) : (
                plans[0].cta
              )}
            </button>
            <p className="text-xs text-gray-400 mt-4 font-medium flex items-center justify-center gap-1">
              <FaLock className="text-gray-300" /> Secure encrypted payment
            </p>
          </div>
        </div>
      </div>
      
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900">Verifying Payment...</h3>
            <p className="text-sm text-gray-500 mt-2">Please do not close this window or click back.</p>
          </div>
        </div>
      )}
    </div>
  );
}