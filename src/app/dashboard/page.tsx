"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabase';
import { FaPlay, FaLock, FaCheckCircle, FaSpinner, FaLayerGroup, FaBookOpen, FaClipboardList } from 'react-icons/fa';

// --- Dummy Data (దీన్ని తర్వాత డేటాబేస్ నుండి తెస్తాం) ---
const mockTests = [
  // Grand Tests (Overall Paper 1 & 2)
  { id: 1, title: "Grand Test 1: Paper I (General Studies)", category: "grand", isPremium: false, questions: 150, time: 150, marks: 150 },
  { id: 2, title: "Grand Test 2: Paper II (Civil Engineering)", category: "grand", isPremium: true, questions: 150, time: 150, marks: 300 },
  { id: 3, title: "Grand Test 3: Full Mock (Paper I & II)", category: "grand", isPremium: true, questions: 300, time: 300, marks: 450 },

  // Subject Wise
  { id: 4, title: "Fluid Mechanics & Hydraulics", category: "subject", isPremium: false, questions: 50, time: 45, marks: 100 },
  { id: 5, title: "Structural Analysis", category: "subject", isPremium: true, questions: 50, time: 45, marks: 100 },
  { id: 6, title: "Environmental Engineering", category: "subject", isPremium: true, questions: 50, time: 45, marks: 100 },

  // Chapter Wise
  { id: 7, title: "Kinematics of Fluid Flow", category: "chapter", isPremium: false, questions: 20, time: 15, marks: 40 },
  { id: 8, title: "Design of Steel Tension Members", category: "chapter", isPremium: true, questions: 25, time: 20, marks: 50 },
  { id: 9, title: "Telangana History: Statehood Movement", category: "chapter", isPremium: false, questions: 30, time: 25, marks: 30 },
];

export default function DashboardPage() {
  const router = useRouter();

  // States
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userName, setUserName] = useState("Aspirant");
  const [activeTab, setActiveTab] = useState("grand"); // Default tab

  // Authentication Check
  // Authentication Check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        window.location.href = '/login';
      } else {
        const name = user.user_metadata?.full_name || "Aspirant";
        setUserName(name);
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [router]);

  const handleStartTest = (testId: number, isPremium: boolean) => {
    if (isPremium) {
      // ప్రీమియం అయితే ప్రైసింగ్ పేజీకి పంపుతాం
      router.push('/pricing');
    } else {
      // ఫ్రీ అయితే నేరుగా ఎగ్జామ్ కి పంపుతాం
      router.push(`/exam/${testId}`);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  // ఫిల్టర్ చేసిన టెస్ట్‌లు
  const filteredTests = mockTests.filter(test => test.category === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">

      {/* Welcome Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, <span className="text-blue-600">{userName}</span>! 👋
          </h1>
          <p className="mt-2 text-gray-600 text-lg">Select a category below to start your practice.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        {/* Modern Tab Navigation */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
          <button
            onClick={() => setActiveTab("grand")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm
              ${activeTab === "grand" ? "bg-blue-600 text-white shadow-blue-200" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            <FaClipboardList /> Overall Grand Tests
          </button>

          <button
            onClick={() => setActiveTab("subject")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm
              ${activeTab === "subject" ? "bg-blue-600 text-white shadow-blue-200" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            <FaBookOpen /> Subject Wise
          </button>

          <button
            onClick={() => setActiveTab("chapter")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm
              ${activeTab === "chapter" ? "bg-blue-600 text-white shadow-blue-200" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            <FaLayerGroup /> Chapter Wise
          </button>
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div key={test.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">

              {/* Premium / Free Badge */}
              <div className="absolute top-4 right-4">
                {test.isPremium ? (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 border border-yellow-200">
                    <FaLock className="text-[10px]" /> PREMIUM
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-700 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 border border-green-200">
                    <FaCheckCircle className="text-[10px]" /> FREE
                  </span>
                )}
              </div>

              {/* Card Content */}
              <div className="mt-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3 pr-8 group-hover:text-blue-700 transition-colors">
                  {test.title}
                </h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 font-medium">
                  <span className="bg-gray-50 px-2 py-1 rounded border border-gray-200">{test.questions} MCQs</span>
                  <span className="bg-gray-50 px-2 py-1 rounded border border-gray-200">{test.time} Mins</span>
                  <span className="bg-gray-50 px-2 py-1 rounded border border-gray-200">{test.marks} Marks</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleStartTest(test.id, test.isPremium)}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                  ${test.isPremium
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white shadow-sm"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-blue-600"
                  }`}
              >
                {test.isPremium ? (
                  <>Unlock Now <FaLock className="text-sm opacity-80" /></>
                ) : (
                  <>Start Exam <FaPlay className="text-sm opacity-80" /></>
                )}
              </button>
            </div>
          ))}

          {/* Empty State Fallback (Just in case) */}
          {filteredTests.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No tests available in this category currently. Check back soon!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}