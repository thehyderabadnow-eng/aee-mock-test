"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase'; // పాత్ సరిచూసుకోండి
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaMinusCircle, FaTrophy, FaLock, FaSpinner } from 'react-icons/fa';

// --- TypeScript Interfaces ---
interface QuestionResult {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer: string | null; 
}

// --- Dummy Data ---
const resultData: QuestionResult[] = [
  { id: 1, text: "The property of a fluid which determines its resistance to shearing stresses is called:", options: ["Viscosity", "Surface Tension", "Compressibility", "Capillarity"], correctAnswer: "Viscosity", explanation: "Viscosity is the physical property that characterizes the fluid's resistance to flow or shearing.", userAnswer: "Viscosity" },
  { id: 2, text: "The angle of dip at the magnetic equator is:", options: ["0 degrees", "90 degrees", "45 degrees", "180 degrees"], correctAnswer: "0 degrees", explanation: "At the magnetic equator, the magnetic field lines are parallel to the Earth's surface, so the angle of dip is zero.", userAnswer: "90 degrees" },
  { id: 3, text: "Who was the first Chief Minister of Telangana State?", options: ["K. Chandrashekar Rao", "N. Chandrababu Naidu", "Y. S. Rajasekhara Reddy", "K. Taraka Rama Rao"], correctAnswer: "K. Chandrashekar Rao", explanation: "K. Chandrashekar Rao (KCR) assumed office as the first Chief Minister of Telangana on June 2, 2014.", userAnswer: null },
  { id: 4, text: "In PERT analysis, the time estimates of activities and probability of their occurrence follow:", options: ["Normal distribution curve", "Beta distribution curve", "Poisson's distribution curve", "Binomial distribution curve"], correctAnswer: "Beta distribution curve", explanation: "PERT assumes that the expected time of an activity follows a Beta distribution curve.", userAnswer: "Beta distribution curve" },
  { id: 5, text: "The maximum bending moment for a simply supported beam with a uniformly distributed load 'w' over entire length 'l' is:", options: ["wl/2", "wl^2/8", "wl^2/4", "wl/8"], correctAnswer: "wl^2/8", explanation: "For a simply supported beam with UDL, the max bending moment occurs at the center and is calculated as (w * l^2) / 8.", userAnswer: "wl^2/4" },
];

export default function ResultsPage() {
  const router = useRouter();
  
  // 🔒 Security State
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  // --- Authentication Check ---
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login'); // సెషన్ లేకపోతే లాగిన్ కి పంపించేస్తాం
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [router]);

  // --- Calculate Analytics ---
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;

  resultData.forEach((item) => {
    if (item.userAnswer === null) {
      skippedCount++;
    } else if (item.userAnswer === item.correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const totalQuestions = resultData.length;
  const marksPerQuestion = 1; 
  const totalScore = correctCount * marksPerQuestion;
  const maxScore = totalQuestions * marksPerQuestion;
  const percentage = Math.round((totalScore / maxScore) * 100);

  // 🔒 సెక్యూరిటీ చెక్ అయ్యేదాకా లోడింగ్ చూపిస్తాం
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700">Verifying Access...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      
      {/* 1. Header Navigation */}
      <header className="bg-white shadow-sm border-b px-4 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Performance Report</h1>
          <Link href="/dashboard" className="flex items-center text-blue-600 font-bold hover:text-blue-800 transition">
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-8">
        
        {/* 2. Score Card (Hero Section) */}
        <section className="bg-gradient-to-br from-blue-800 to-indigo-900 rounded-2xl shadow-lg p-6 md:p-10 text-white flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-extrabold flex items-center justify-center md:justify-start gap-3">
              <FaTrophy className="text-yellow-400" /> 
              {percentage >= 50 ? "Good Attempt!" : "Needs Improvement"}
            </h2>
            <p className="mt-2 text-blue-200 text-lg">Grand Test: Paper I (General Studies)</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-sm text-center min-w-[200px]">
            <p className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-1">Your Score</p>
            <p className="text-5xl font-black text-white">
              {totalScore} <span className="text-2xl text-blue-300 font-medium">/ {maxScore}</span>
            </p>
            <p className="text-xs text-green-300 font-bold mt-2 bg-green-900/30 py-1 px-2 rounded-full inline-block">
              No Negative Marks Applied
            </p>
          </div>
        </section>

        {/* 3. Analytics Overview Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl shadow-sm">
              <FaCheckCircle />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">Correct</p>
              <p className="text-3xl font-black text-green-600">{correctCount}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-2xl shadow-sm">
              <FaTimesCircle />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">Incorrect</p>
              <p className="text-3xl font-black text-red-500">{incorrectCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-2xl shadow-sm">
              <FaMinusCircle />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">Unattempted</p>
              <p className="text-3xl font-black text-gray-600">{skippedCount}</p>
            </div>
          </div>
        </section>

        {/* 4. Premium Upsell Banner */}
        <section className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FaLock className="text-yellow-600" /> Unlock Subject-Wise Weakness Analysis
            </h3>
            <p className="text-sm text-gray-600 mt-1">Want to know exactly which civil engineering topics you are weak at? Upgrade to premium for detailed AI-driven analytics.</p>
          </div>
          <button className="mt-4 md:mt-0 w-full md:w-auto px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg shadow transition whitespace-nowrap">
            View Premium Plans
          </button>
        </section>

        {/* 5. Detailed Solutions Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Detailed Solutions</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {resultData.map((q, index) => {
              const isCorrect = q.userAnswer === q.correctAnswer;
              const isSkipped = q.userAnswer === null;
              
              return (
                <div key={q.id} className="p-6 hover:bg-gray-50 transition">
                  {/* Question Header */}
                  <div className="flex gap-4 items-start">
                    <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 leading-relaxed mb-4">
                        {q.text}
                      </h4>
                      
                      {/* Status Tag */}
                      <div className="mb-4 inline-block">
                        {isSkipped ? (
                          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200 flex items-center gap-1">
                            <FaMinusCircle /> Not Answered
                          </span>
                        ) : isCorrect ? (
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200 flex items-center gap-1">
                            <FaCheckCircle /> Correct (+{marksPerQuestion} Mark)
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-200 flex items-center gap-1">
                            <FaTimesCircle /> Incorrect (0 Marks)
                          </span>
                        )}
                      </div>

                      {/* User vs Correct Answer */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {!isSkipped && (
                          <div className={`p-3 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Your Answer</p>
                            <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                              {q.userAnswer}
                            </p>
                          </div>
                        )}
                        <div className="p-3 rounded-lg border bg-green-50 border-green-200">
                          <p className="text-xs font-bold text-green-600 uppercase mb-1">Correct Answer</p>
                          <p className="font-medium text-green-800">{q.correctAnswer}</p>
                        </div>
                      </div>

                      {/* Explanation Box */}
                      <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg">
                        <p className="text-xs font-bold text-blue-800 uppercase mb-1">Explanation</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}