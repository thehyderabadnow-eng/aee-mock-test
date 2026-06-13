// src/app/dashboard/page.tsx
import Link from 'next/link';
import { FaLock, FaPlay, FaFileAlt, FaClock, FaTrophy, FaStar, FaBolt } from 'react-icons/fa';

// --- Types ---
interface MockTest {
  id: number;
  title: string;
  category: 'Previous Year' | 'Chapter Test' | 'Grand Test';
  type: 'Free' | 'Premium';
  questions: number;
  time: number;
  isLocked: boolean;
}

// --- Data based on the Business Plan ---
const mockTests: MockTest[] = [
  // The Hook: Free High-Value Content
  { id: 1, title: "TGPSC AEE 2023 - Paper 1 (General Studies)", category: "Previous Year", type: "Free", questions: 150, time: 150, isLocked: false },
  { id: 2, title: "TGPSC AEE 2023 - Paper 2 (Civil Engineering)", category: "Previous Year", type: "Free", questions: 150, time: 150, isLocked: false },
  { id: 3, title: "Civil Engg: Fluid Mechanics Basics", category: "Chapter Test", type: "Free", questions: 50, time: 50, isLocked: false },
  { id: 4, title: "Civil Engg: Strength of Materials", category: "Chapter Test", type: "Free", questions: 50, time: 50, isLocked: false },
  { id: 5, title: "General Studies: History of Telangana", category: "Chapter Test", type: "Free", questions: 50, time: 50, isLocked: false },
  { id: 6, title: "Current Affairs: Last 6 Months Mega Test", category: "Chapter Test", type: "Free", questions: 100, time: 100, isLocked: false },

  // The Monetization: Premium Content
  { id: 7, title: "Grand Test 1: Full Length (Paper I & II)", category: "Grand Test", type: "Premium", questions: 300, time: 300, isLocked: true },
  { id: 8, title: "Grand Test 2: Full Length (Paper I & II)", category: "Grand Test", type: "Premium", questions: 300, time: 300, isLocked: true },
  { id: 9, title: "Grand Test 3: Full Length (Paper I & II)", category: "Grand Test", type: "Premium", questions: 300, time: 300, isLocked: true },
];

// Helper to filter tests
const freeTests = mockTests.filter(test => !test.isLocked);
const premiumTests = mockTests.filter(test => test.isLocked);

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      
      {/* 1. Welcome Banner (Upsell Focus) */}
      <div className="bg-blue-800 text-white py-10 px-4 md:px-8 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Welcome, Aspirant! <span className="text-yellow-400"><FaTrophy /></span>
            </h1>
            <p className="text-blue-200 mt-2 text-lg">
              You are on the <span className="font-bold text-white">Free Plan</span>. Upgrade to unlock 50+ Grand Tests and Chapter-wise mocks.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 transition transform hover:scale-105">
              <FaStar /> Upgrade to Premium
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">

        {/* 2. Free Resources Section (The Hook) */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b pb-2 border-gray-200">
            <FaBolt className="text-yellow-500 text-xl" />
            <h2 className="text-2xl font-bold text-gray-900">Your Free Resources</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </section>

        {/* 3. Premium Test Series Section (The Upsell) */}
        <section>
          <div className="flex items-center justify-between mb-6 border-b pb-2 border-gray-200">
            <div className="flex items-center gap-2">
              <FaLock className="text-red-500 text-xl" />
              <h2 className="text-2xl font-bold text-gray-900">Premium Grand Tests</h2>
            </div>
            <span className="text-sm font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full">Pro Only</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-90">
            {premiumTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
          
          {/* CTA Banner inside Premium Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Want to clear TGPSC AEE in the first attempt?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Get access to 10+ Full-Length Mock Tests, 50+ Chapter Tests, and detailed performance analytics designed by TGPSC toppers.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg shadow-md transition">
              View Premium Plans
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

// --- Reusable Component for Test Cards ---
function TestCard({ test }: { test: MockTest }) {
  return (
    <div className={`relative bg-white rounded-xl shadow-sm border p-5 transition duration-200 flex flex-col justify-between h-full
      ${test.isLocked ? 'border-gray-200' : 'border-blue-100 hover:shadow-md hover:-translate-y-1'}`}>
      
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {test.category}
          </span>
          {test.isLocked ? (
            <div className="bg-gray-100 text-gray-500 p-2 rounded-full">
              <FaLock className="text-xs" />
            </div>
          ) : (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
              FREE
            </span>
          )}
        </div>

        <h3 className={`text-lg font-bold leading-tight mb-4 ${test.isLocked ? 'text-gray-600' : 'text-gray-900'}`}>
          {test.title}
        </h3>
      </div>
      
      <div>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6 bg-gray-50 p-2 rounded">
          <div className="flex items-center space-x-1">
            <FaFileAlt className="text-blue-400" />
            <span className="font-medium">{test.questions} Qs</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaClock className="text-red-400" />
            <span className="font-medium">{test.time} Mins</span>
          </div>
        </div>

        {test.isLocked ? (
          <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-500 py-3 rounded-lg font-bold cursor-not-allowed border border-gray-200">
            <FaLock className="text-xs" />
            <span>Unlock to Attempt</span>
          </button>
        ) : (
          <Link 
            href={`/exam/${test.id}`}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition shadow-sm"
          >
            <FaPlay className="text-xs" />
            <span>Start Now</span>
          </Link>
        )}
      </div>
    </div>
  );
}