// app/page.jsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">

      {/* 1. Navbar (Simple Header for Landing Page) */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">
            TGPSC<span className="text-gray-800">Prep</span>
          </h1>
          <nav className="space-x-4">
            {/* Link components for Next.js client-side routing */}
            <Link href="/syllabus" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Syllabus
            </Link>
            <Link href="/login" className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition shadow-md">
              Login / Register
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4 border border-blue-200">
            Notification No.01/G/RB/2026 Released
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Master Your TGPSC AEE (Civil) Preparation
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the real-time exam environment with our chapter-wise and full-length mock tests designed specifically for the Transport, Roads and Buildings Department notification.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
              Take a Free Mock Test
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Notification Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-10">Notification Highlights</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Important Dates */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Important Dates</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong>Apply Starts:</strong> 06/06/2026</li>
              <li><strong>Last Date:</strong> 13/07/2026 (5:00 PM)</li>
              <li><strong>Exam Tentative:</strong> October 2026</li>
            </ul>
          </div>

          {/* Card 2: Eligibility */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Eligibility (Civil)</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong>Degree:</strong> B.E / B.Tech in Civil Engineering</li>
              <li><strong>Age Limit:</strong> 18 to 44 Years (as on 01/07/2026)</li>
            </ul>
          </div>

          {/* Card 3: Exam Pattern */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Exam Pattern</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong>Paper I:</strong> Gen. Studies (150 Marks / 150 Mins)</li>
              <li><strong>Paper II:</strong> Civil Engg. (300 Marks / 150 Mins)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Vacancies Breakdown Table */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Vacancies Breakdown</h3>
          <p className="text-center text-gray-600 mb-6 text-sm">
            Total 222 Vacancies in Transport, Roads & Buildings Department. Below is the multi-zone distribution.
          </p>

          <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-700 tracking-wider">Multi Zone</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-700 tracking-wider">Total Vacancies</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-700 tracking-wider">Pay Scale</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Multi Zone-1 (MZ-1)</td>
                  <td className="px-6 py-4 text-center text-gray-700">112</td>
                  <td className="px-6 py-4 text-center text-gray-500" rowSpan={3}>
                    ₹54,220 - ₹1,33,630/-
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Multi Zone-2 (MZ-2)</td>
                  <td className="px-6 py-4 text-center text-gray-700">110</td>
                </tr>
                <tr className="bg-blue-50 font-bold">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 text-right">Grand Total:</td>
                  <td className="px-6 py-4 text-center text-blue-700">222</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}