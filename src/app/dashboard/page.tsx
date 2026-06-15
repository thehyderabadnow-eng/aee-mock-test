"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../utils/supabase';
import { 
  FaPlay, 
  FaLock, 
  FaCheckCircle, 
  FaSpinner, 
  FaLayerGroup, 
  FaBookOpen, 
  FaClipboardList, 
  FaCrown, 
  FaSignOutAlt,
  FaThLarge 
} from 'react-icons/fa';

// --- Dummy Data ---
const mockTests = [
  // Grand Tests
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

  // --- 1. All Hooks Must Be at the Very Top (Strict Order) ---
  const { isLoggedIn, user, isLoading } = useAuth();
  
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 🚀 Defaulted to 'all' tests
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  // --- 2. Effect Hook for Profile Validation ---
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isLoading) {
        if (isLoggedIn && user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_premium')
            .eq('id', user.id)
            .single();

          if (profile) {
            setIsUserPremium(profile.is_premium);
          }
        } else {
          router.push('/login');
        }
        setIsCheckingProfile(false);
      }
    };

    fetchProfileData();
  }, [isLoading, isLoggedIn, user, router]);

  // --- 3. Handlers ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('device_session_token');
    window.location.href = '/'; 
  };

  const handleStartTest = (testId: number, isTestPremium: boolean) => {
    if (isTestPremium && !isUserPremium) {
      router.push('/pricing');
    } else {
      router.push(`/exam/${testId}`);
    }
  };

  // 🚀 Helper function to get distinct UI styles based on category 🚀
  const getCategoryMeta = (category: string) => {
    switch (category) {
      case 'grand':
        return {
          label: "Overall Grand Test",
          badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <FaClipboardList className="text-blue-500 text-xs" />,
          borderLeft: "border-l-4 border-l-blue-600"
        };
      case 'subject':
        return {
          label: "Subject Wise Test",
          badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <FaBookOpen className="text-emerald-500 text-xs" />,
          borderLeft: "border-l-4 border-l-emerald-600"
        };
      case 'chapter':
        return {
          label: "Chapter Wise Test",
          badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <FaLayerGroup className="text-purple-500 text-xs" />,
          borderLeft: "border-l-4 border-l-purple-600"
        };
      default:
        return {
          label: "Mock Test",
          badgeClass: "bg-gray-50 text-gray-700 border-gray-200",
          icon: null,
          borderLeft: ""
        };
    }
  };

  // --- 4. Early Returns (Only after ALL Hooks are declared) ---
  if (isLoading || isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const userName = user?.user_metadata?.full_name || "Aspirant";
  
  // 🚀 Filter Logic supporting "all" tab
  const filteredTests = activeTab === "all" 
    ? mockTests 
    : mockTests.filter(test => test.category === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12 flex flex-col">

      {/* Sticky Navigation Bar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-sm border-b sticky top-0 z-50">
        <Link className="font-extrabold text-xl text-blue-700" href="/">
          TGPSC<span className="text-gray-800">Prep</span>
        </Link>
        <div className="hidden md:flex space-x-6 items-center">
          <Link className="text-gray-600 hover:text-blue-600 font-medium transition" href="/syllabus">
            Syllabus
          </Link>
          <Link className="text-gray-600 hover:text-blue-600 font-medium transition" href="/pricing">
            Premium Tests
          </Link>
        </div>
        <div className="flex space-x-4 items-center">
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-md font-medium hover:bg-red-700 transition shadow-md flex items-center gap-2 text-sm md:text-base"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      {/* Welcome Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              Welcome back, <span className="text-blue-600">{userName}</span>! 👋
            </h1>
            <p className="mt-2 text-gray-600 text-lg">Select a category below to start your practice.</p>
          </div>

          {/* User Status Badge */}
          {isUserPremium ? (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-lg font-bold shadow-md">
              <FaCrown /> Premium Member
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold border border-gray-200">
              Free Plan (Upgrade for more)
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        {/* Modern Tab Navigation with Hover & All Tests Option */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm outline-none
              ${activeTab === "all" 
                ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700" 
                : "bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"}`}
          >
            <FaThLarge className="text-sm" /> All Tests
          </button>

          <button
            onClick={() => setActiveTab("grand")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm outline-none
              ${activeTab === "grand" 
                ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700" 
                : "bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"}`}
          >
            <FaClipboardList /> Overall Grand Tests
          </button>

          <button
            onClick={() => setActiveTab("subject")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm outline-none
              ${activeTab === "subject" 
                ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700" 
                : "bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"}`}
          >
            <FaBookOpen /> Subject Wise
          </button>

          <button
            onClick={() => setActiveTab("chapter")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm outline-none
              ${activeTab === "chapter" 
                ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700" 
                : "bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"}`}
          >
            <FaLayerGroup /> Chapter Wise
          </button>
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const isLocked = test.isPremium && !isUserPremium;
            // 🚀 Fetch specific metadata styles per card based on its category
            const catMeta = getCategoryMeta(test.category);

            return (
              <div 
                key={test.id} 
                className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group ${catMeta.borderLeft}`}
              >

                {/* Premium / Free Badge */}
                <div className="absolute top-4 right-4">
                  {test.isPremium ? (
                    <span className="bg-yellow-100 text-yellow-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 border border-yellow-200">
                      <FaLock className="text-[9px]" /> PREMIUM
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 border border-green-200">
                      <FaCheckCircle className="text-[9px]" /> FREE
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="mt-4 mb-6">
                  {/* 🚀 Dynamic Category Badge Added Here 🚀 */}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-xs font-bold mb-3 ${catMeta.badgeClass}`}>
                    {catMeta.icon} {catMeta.label}
                  </span>

                  <h3 className="text-xl font-bold text-gray-900浏览 leading-tight mb-4 pr-12 group-hover:text-blue-700 transition-colors">
                    {test.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600 font-medium">
                    <span className="bg-gray-50 px-2 py-1 rounded border border-gray-200">{test.questions} MCQs</span>
                    <span className="bg-gray-50 px-2 py-1 rounded border border-gray-200">{test.time} Mins</span>
                    <span className="bg-gray-50 px-2 py-1 rounded border border-gray-200">{test.marks} Marks</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleStartTest(test.id, test.isPremium)}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                    ${isLocked
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white shadow-sm"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-blue-600"
                    }`}
                >
                  {isLocked ? (
                    <>Unlock Now <FaLock className="text-sm opacity-80" /></>
                  ) : (
                    <>Start Exam <FaPlay className="text-sm opacity-80" /></>
                  )}
                </button>
              </div>
            );
          })}

          {/* Empty State Fallback */}
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