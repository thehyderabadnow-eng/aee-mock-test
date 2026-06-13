// src/app/exam/[testId]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaClock, FaCheckCircle, FaBookmark, FaBars, FaTimes, FaSpinner } from 'react-icons/fa';

// --- TypeScript Interfaces ---
interface Question {
  id: number;
  text: string;
  options: string[];
}

// --- Dummy Data (Will be replaced dynamically) ---
const examQuestions: Question[] = [
  { id: 1, text: "The property of a fluid which determines its resistance to shearing stresses is called:", options: ["Viscosity", "Surface Tension", "Compressibility", "Capillarity"] },
  { id: 2, text: "The angle of dip at the magnetic equator is:", options: ["0 degrees", "90 degrees", "45 degrees", "180 degrees"] },
  { id: 3, text: "Who was the first Chief Minister of Telangana State?", options: ["K. Chandrashekar Rao", "N. Chandrababu Naidu", "Y. S. Rajasekhara Reddy", "K. Taraka Rama Rao"] },
  { id: 4, text: "In PERT analysis, the time estimates of activities and probability of their occurrence follow:", options: ["Normal distribution curve", "Beta distribution curve", "Poisson's distribution curve", "Binomial distribution curve"] },
  { id: 5, text: "The maximum bending moment for a simply supported beam with a uniformly distributed load 'w' over entire length 'l' is:", options: ["wl/2", "wl^2/8", "wl^2/4", "wl/8"] },
];

export default function ExamInterface() {
  const router = useRouter();
  
  // --- State Management ---
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true }); 
  const [timeLeft, setTimeLeft] = useState<number>(9000); // 150 mins
  const [showPaletteMobile, setShowPaletteMobile] = useState<boolean>(false);
  
  // Modals state
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const currentQuestion = examQuestions[currentIndex];
  const totalQuestions = examQuestions.length; 

  // --- Timer Effect ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowSubmitModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Helper Functions ---
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')} Hrs : ${m.toString().padStart(2, '0')} Mins : ${s.toString().padStart(2, '0')} Sec`;
  };

  const handleOptionSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  };

  const handleNext = () => {
    if (currentIndex < examQuestions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setVisited((prev) => ({ ...prev, [nextIndex]: true }));
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setVisited((prev) => ({ ...prev, [prevIndex]: true }));
    }
  };

  const handleMarkReview = () => {
    setMarkedForReview((prev) => ({ ...prev, [currentIndex]: true }));
    handleNext(); 
  };

  const handleSaveAndNext = () => {
    const newMarked = { ...markedForReview };
    if (newMarked[currentIndex]) {
      delete newMarked[currentIndex]; // Clear marked status if saved
      setMarkedForReview(newMarked);
    }
    handleNext();
  };

  const clearResponse = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentIndex];
    setAnswers(newAnswers);
    
    const newMarked = { ...markedForReview };
    delete newMarked[currentIndex];
    setMarkedForReview(newMarked);
  };

  const jumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setVisited((prev) => ({ ...prev, [index]: true }));
    setShowPaletteMobile(false);
  };

  // --- EXPLICIT 5-CATEGORY LOGIC (Mutually Exclusive) ---
  const stats = {
    answered: 0,
    notAnswered: 0,
    notVisited: 0,
    marked: 0,
    answeredMarked: 0
  };

  examQuestions.forEach((_, index) => {
    const isAns = !!answers[index];
    const isVis = !!visited[index];
    const isMarked = !!markedForReview[index];

    if (isAns && isMarked) {
      stats.answeredMarked++;      // 1. Answered & Marked
    } else if (!isAns && isMarked) {
      stats.marked++;              // 2. Only Marked (Unanswered)
    } else if (isAns && !isMarked) {
      stats.answered++;            // 3. Only Answered
    } else if (isVis && !isAns && !isMarked) {
      stats.notAnswered++;         // 4. Visited but Not Answered
    } else {
      stats.notVisited++;          // 5. Not Visited
    }
  });

  // --- Real Exam Status for Palette Colors ---
  const getQuestionStatus = (index: number) => {
    const isAnswered = !!answers[index];
    const isMarked = !!markedForReview[index];
    const isVisited = !!visited[index];

    if (isAnswered && isMarked) return 'answered_marked';
    if (isMarked && !isAnswered) return 'marked'; 
    if (isAnswered) return 'answered';
    if (isVisited) return 'not_answered';
    return 'not_visited';
  };

  const getPaletteStyle = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-600 text-white border-green-700';
      case 'not_answered': return 'bg-red-500 text-white border-red-600';
      case 'marked': return 'bg-purple-600 text-white border-purple-700 relative overflow-hidden';
      case 'answered_marked': return 'bg-purple-600 text-white border-purple-700 relative overflow-hidden'; 
      default: return 'bg-gray-200 text-gray-700 border-gray-300'; // not visited
    }
  };

  const confirmFinalSubmit = () => {
    setShowSubmitModal(false); 
    setIsSubmitting(true); 
    setTimeout(() => {
      router.push('/dashboard'); 
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      
      {/* 1. Top Header Bar */}
      <header className="bg-blue-800 text-white p-4 shadow-md flex justify-between items-center z-10">
        <div>
          <h1 className="font-bold text-lg hidden md:block">TGPSC AEE - Grand Test</h1>
          <h1 className="font-bold text-lg md:hidden">TGPSC Exam</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-blue-900 px-4 py-2 rounded-lg border border-blue-700 shadow-inner">
            <FaClock className="mr-2 text-yellow-400 animate-pulse" />
            <span className="font-mono text-lg md:text-xl font-bold tracking-widest text-yellow-100">
              {formatTime(timeLeft)}
            </span>
          </div>
          <button 
            className="lg:hidden bg-blue-700 p-2 rounded hover:bg-blue-600"
            onClick={() => setShowPaletteMobile(!showPaletteMobile)}
          >
            <FaBars />
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 2. Left Pane: Question Area */}
        <div className="w-full lg:w-3/4 flex flex-col p-4 md:p-6 overflow-y-auto">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col">
            <div className="border-b border-gray-200 p-4 bg-gray-50 rounded-t-xl flex justify-between items-center">
              <span className="font-bold text-lg text-blue-800 tracking-wide">
                Question <span className="text-xl">{currentIndex + 1}</span> of {totalQuestions}
              </span>
              <span className="text-xs md:text-sm text-green-700 font-bold bg-green-100 px-2 py-1.5 rounded border border-green-200 shadow-sm">
                Marks: +1 / +2 | <span className="text-gray-600">No Negative</span>
              </span>
            </div>

            <div className="p-6 md:p-8 flex-1">
              <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-8 leading-relaxed">
                {currentQuestion.text}
              </h2>

              <div className="space-y-4">
                {currentQuestion.options.map((option, idx) => (
                  <label 
                    key={idx} 
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200
                      ${answers[currentIndex] === option ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm' : 'hover:bg-gray-50 border-gray-300'}`}
                  >
                    <input 
                      type="radio" 
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentIndex] === option}
                      onChange={() => handleOptionSelect(option)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-4 text-base md:text-lg text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-3">
                <button 
                  onClick={handleMarkReview}
                  className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 font-semibold rounded hover:bg-purple-100 transition text-sm md:text-base flex items-center gap-2"
                >
                  <FaBookmark /> Mark for Review & Next
                </button>
                <button 
                  onClick={clearResponse}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-100 transition text-sm md:text-base"
                >
                  Clear Response
                </button>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className={`px-6 py-2 font-semibold rounded transition text-sm md:text-base border
                    ${currentIndex === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'}`}
                >
                  Previous
                </button>
                <button 
                  onClick={handleSaveAndNext}
                  className="px-8 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition text-sm md:text-base shadow-md"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Right Pane: Question Palette */}
        <div className={`
          absolute lg:relative right-0 top-0 h-full w-4/5 md:w-1/2 lg:w-1/4 bg-white border-l border-gray-200 shadow-2xl lg:shadow-none transition-transform duration-300 z-20 flex flex-col
          ${showPaletteMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Question Palette</h3>
            <button className="lg:hidden text-gray-500 hover:text-red-500 font-bold text-xl" onClick={() => setShowPaletteMobile(false)}><FaTimes /></button>
          </div>

          {/* EXACT 5-CATEGORY LEGEND */}
          <div className="p-4 border-b border-gray-200 grid grid-cols-2 gap-y-3 gap-x-2 text-[11px] md:text-xs font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center text-[10px] text-white bg-green-600 rounded-full">{stats.answered}</div> 
              Answered
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center text-[10px] text-white bg-red-500 rounded-full">{stats.notAnswered}</div> 
              Not Answered
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center text-[10px] text-gray-700 bg-gray-200 border border-gray-300 rounded-full">{stats.notVisited}</div> 
              Not Visited
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center text-[10px] text-white bg-purple-600 rounded-full">{stats.marked}</div> 
              Marked
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-1 p-1.5 bg-purple-50 rounded border border-purple-100">
              <div className="w-5 h-5 flex items-center justify-center text-[10px] text-white bg-purple-600 rounded-full relative">
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-white"></span>
              </div>
              <span className="text-purple-800 font-bold">Answered & Marked <span className="bg-white px-1.5 py-0.5 rounded text-[10px] ml-1">{stats.answeredMarked}</span></span>
            </div>
          </div>

          {/* Grid of Numbers */}
          <div className="p-4 flex-1 overflow-y-auto bg-blue-50/30">
            <h4 className="text-sm font-bold text-gray-600 mb-3 border-b pb-1">Question Numbers</h4>
            <div className="grid grid-cols-5 gap-2 md:gap-3">
              {examQuestions.map((q, index) => {
                const status = getQuestionStatus(index);
                return (
                  <button 
                    key={q.id}
                    onClick={() => jumpToQuestion(index)}
                    className={`
                      relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-md font-bold text-sm md:text-base border transition-transform hover:scale-105 shadow-sm
                      ${getPaletteStyle(status)}
                      ${currentIndex === index ? 'ring-2 ring-offset-2 ring-blue-600 scale-110 z-10' : ''}
                    `}
                  >
                    {index + 1}
                    {/* The Green Dot: Answered & Marked */}
                    {status === 'answered_marked' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-tl-md rounded-br-md border-t border-l border-white shadow-sm"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button 
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-md transition flex items-center justify-center gap-2 text-lg"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Mobile overlay background */}
        {showPaletteMobile && (
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10 lg:hidden" onClick={() => setShowPaletteMobile(false)}></div>
        )}

      </div>

      {/* 4. Pre-Submit Summary Modal (Popup) - EXPLICIT 5 BOXES */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden my-8">
            <div className="bg-blue-800 p-4 text-center">
              <h2 className="text-2xl font-bold text-white">Submit Examination?</h2>
              <p className="text-blue-200 text-sm mt-1">Please review your exam summary before final submission.</p>
            </div>
            
            <div className="p-6">
              
              {/* TOTAL QUESTIONS HEADER */}
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4 flex justify-between items-center shadow-sm">
                 <span className="font-bold text-blue-800">Total Questions</span>
                 <span className="text-2xl font-black text-blue-900">{totalQuestions}</span>
              </div>

              {/* EXACT 5 BOXES LAYOUT */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-green-50 p-3 rounded-xl border border-green-200 text-center shadow-sm">
                  <p className="text-2xl font-black text-green-600">{stats.answered}</p>
                  <p className="text-sm text-gray-700 font-bold mt-1">Answered</p>
                </div>
                <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-center shadow-sm">
                  <p className="text-2xl font-black text-red-500">{stats.notAnswered}</p>
                  <p className="text-sm text-gray-700 font-bold mt-1">Not Answered</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-300 text-center shadow-sm">
                  <p className="text-2xl font-black text-gray-600">{stats.notVisited}</p>
                  <p className="text-sm text-gray-700 font-bold mt-1">Not Visited</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-center shadow-sm">
                  <p className="text-2xl font-black text-purple-600">{stats.marked}</p>
                  <p className="text-sm text-gray-700 font-bold mt-1">Marked</p>
                </div>
                
                {/* 5th Box - Spans Full Width */}
                <div className="col-span-2 bg-purple-100 p-3 rounded-xl border-2 border-purple-300 text-center shadow-sm flex items-center justify-between px-6">
                  <div className="text-left">
                    <p className="text-sm text-purple-900 font-extrabold flex items-center gap-2">
                      Answered & Marked for Review
                    </p>
                    <p className="text-xs text-purple-700 mt-0.5">Will be considered for evaluation</p>
                  </div>
                  <div className="relative">
                    <p className="text-3xl font-black text-purple-700">{stats.answeredMarked}</p>
                    <span className="absolute -top-1 -right-3 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <button 
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
                >
                  Resume Test
                </button>
                <button 
                  onClick={confirmFinalSubmit}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg flex justify-center items-center gap-2"
                >
                  <FaCheckCircle /> Confirm Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Analytics Generation Loading Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <FaSpinner className="animate-spin text-6xl text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-pulse">Test Submitted Successfully!</h2>
            <p className="text-lg text-gray-600">Generating your detailed performance analytics...</p>
            <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 mx-auto overflow-hidden">
               <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}