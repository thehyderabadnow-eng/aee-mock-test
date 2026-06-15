"use client";

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { FaCalendarAlt, FaUserGraduate, FaClipboardList, FaMapMarkerAlt, FaArrowRight, FaSpinner } from 'react-icons/fa';

export default function Home() {
  // 🚀 కస్టమ్ హుక్ ద్వారా డేటా తెచ్చుకోవడం
  const { isLoggedIn, user, isLoading } = useAuth();

  // లోడింగ్ స్టేట్ కోసం చిన్న స్పిన్నర్
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-200 flex flex-col">

      {/* 🚀 0. Navigation Bar (Sticky Top) 🚀 */}
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
          <Link 
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition shadow-md" 
          >
            {isLoggedIn ? "Dashboard" : "Login / Sign Up"}
          </Link>
        </div>
      </nav>

      {/* 1. Premium Hero Section */}
      <section className="relative bg-[#0B1120] overflow-hidden border-b border-gray-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[100px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center lg:pt-32 lg:pb-40">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Notification No.01/G/RB/2026 Released
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">TGPSC AEE</span> Prep
          </h1>

          <p className="mt-4 text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            Experience a real-time, global standard examination environment. Chapter-wise, subject-wise, and full-length mock tests for Civil Engineering.
          </p>

          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
              {/* 🚀 Dynamic Button based on Auth State 🚀 */}
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="inline-flex justify-center items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] hover:-translate-y-1"
              >
                {isLoggedIn ? "Go to Dashboard" : "Take Free Test"} <FaArrowRight className="text-sm" />
              </Link>

              <Link
                href="/syllabus"
                className="inline-flex justify-center items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                View Syllabus
              </Link>
            </div>

            {/* 🚀 Welcome Message for Logged-in Users 🚀 */}
            {isLoggedIn && (
              <p className="text-blue-300 font-medium text-lg animate-fade-in mt-4">
                Welcome back, <span className="text-white font-bold">{user?.user_metadata?.full_name || "Aspirant"}</span>!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Notification Highlights (Modern Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FaCalendarAlt className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Important Dates</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex justify-between border-b border-gray-50 pb-2"><span>Starts:</span> <strong className="text-gray-900">06/06/2026</strong></li>
              <li className="flex justify-between border-b border-gray-50 pb-2"><span>Ends:</span> <strong className="text-gray-900">13/07/2026</strong></li>
              <li className="flex justify-between pb-2"><span>Exam:</span> <strong className="text-blue-600">October 2026</strong></li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <FaUserGraduate className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Eligibility (Civil)</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex justify-between border-b border-gray-50 pb-2"><span>Degree:</span> <strong className="text-gray-900">B.E / B.Tech Civil</strong></li>
              <li className="flex justify-between pb-2"><span>Age Limit:</span> <strong className="text-gray-900">18 to 44 Years</strong></li>
              <li className="text-xs text-gray-400 italic mt-2">*Age calculation as on 01/07/2026</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FaClipboardList className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Exam Pattern</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex justify-between border-b border-gray-50 pb-2"><span>Paper I:</span> <strong className="text-gray-900">150 Marks</strong></li>
              <li className="flex justify-between pb-2"><span>Paper II (Civil):</span> <strong className="text-gray-900">300 Marks</strong></li>
              <li className="text-sm font-bold text-purple-600 mt-2 bg-purple-50 px-3 py-2 rounded-lg text-center">Total 450 Marks / 300 Mins</li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3. Vacancies Section */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Vacancies Breakdown</h2>
            <p className="text-lg text-gray-600">Transport, Roads & Buildings Department Distribution</p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-2 md:p-4 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Multi Zone - 1</h4>
                    <p className="text-sm text-gray-500">Pay Scale: ₹54,220 - ₹1,33,630</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-black text-blue-600">112</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Posts</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Multi Zone - 2</h4>
                    <p className="text-sm text-gray-500">Pay Scale: ₹54,220 - ₹1,33,630</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-black text-blue-600">110</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Posts</span>
                </div>
              </div>

            </div>

            <div className="mt-4 bg-blue-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between text-white shadow-lg">
              <div>
                <h4 className="text-xl font-bold">Grand Total Vacancies</h4>
                <p className="text-blue-200 text-sm mt-1">Combined for MZ-1 and MZ-2</p>
              </div>
              <div className="text-5xl font-black tracking-tighter mt-4 sm:mt-0">
                222
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}