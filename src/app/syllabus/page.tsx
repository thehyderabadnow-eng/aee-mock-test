"use client";

import Link from 'next/link';
import { FaBookOpen, FaHardHat, FaCheckCircle } from 'react-icons/fa';

export default function SyllabusPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans">
      
      {/* Premium Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          TGPSC AEE <span className="text-blue-600">Syllabus 2026</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Comprehensive and detailed syllabus for Assistant Executive Engineers (Civil) in Transport, Roads and Buildings Department.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
        
        {/* Paper 1: General Studies */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-blue-600 p-6 flex items-center gap-4 text-white">
            <FaBookOpen className="text-3xl opacity-80" />
            <div>
              <h2 className="text-2xl font-bold">Paper I</h2>
              <p className="text-blue-100 text-sm mt-1">General Studies & General Abilities</p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg text-sm font-bold text-blue-800 mb-6 border border-blue-100">
              <span>Questions: 150</span>
              <span>Marks: 150</span>
              <span>Duration: 150 Mins</span>
            </div>

            <ul className="space-y-4">
              {[
                "Current Affairs – Regional, National and International.",
                "International Relations and Events.",
                "General Science; India’s Achievements in Science and Technology.",
                "Environmental issues; Disaster Management- Prevention and Mitigation Strategies.",
                "Economic and Social Development of India and Telangana.",
                "Physical, Social and Economic Geography of India.",
                "Physical, Social and Economic Geography and Demography of Telangana.",
                "Socio-economic, Political and Cultural History of Modern India with special emphasis on Indian National Movement.",
                "Socio-economic, Political and Cultural History of Telangana with special emphasis on Telangana Statehood Movement and formation of Telangana state.",
                "Indian Constitution; Indian Political System; Governance and Public Policy.",
                "Social Exclusion; Rights issues such as Gender, Caste, Tribe, Disability etc. and inclusive policies.",
                "Society, Culture, Heritage, Arts and Literature of Telangana.",
                "Policies of Telangana State.",
                "Logical Reasoning; Analytical Ability and Data Interpretation.",
                "Basic English (10th class Standard)."
              ].map((topic, idx) => (
                <li key={idx} className="flex items-start text-gray-700">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="leading-relaxed text-sm md:text-base">{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Paper 2: Civil Engineering */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-gray-800 p-6 flex items-center gap-4 text-white">
            <FaHardHat className="text-3xl opacity-80 text-yellow-400" />
            <div>
              <h2 className="text-2xl font-bold">Paper II</h2>
              <p className="text-gray-300 text-sm mt-1">Civil Engineering (Degree Level)</p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg text-sm font-bold text-gray-800 mb-6 border border-gray-200">
              <span>Questions: 150</span>
              <span>Marks: 300 (2 per Q)</span>
              <span>Duration: 150 Mins</span>
            </div>

            <ul className="space-y-4">
              {[
                "Building Materials And Construction: Bricks, Timber, Cement, Concrete, Masonry.",
                "Fluid Mechanics And Hydraulics: Fluid properties, kinematics, dynamics, Open channel flow.",
                "Structural Analysis: Determinacy, Trusses, Arches, Matrices method.",
                "Design Of Steel Structures: Connections, Tension & Compression members, Beams.",
                "Design Of Concrete And Masonry Structures: Limit state design, Slabs, Columns, Footings.",
                "Construction Planning And Management: PERT, CPM, Cost analysis, Resource allocation.",
                "Hydrology And Water Resources Engineering: Precipitation, Runoff, Dams, Canals.",
                "Environmental Engineering: Water supply, Wastewater treatment, Solid waste management.",
                "Soil Mechanics And Foundation Engineering: Soil properties, Shear strength, Shallow & Deep foundations.",
                "Surveying And Transport Engineering: Levelling, Theodolite, Highway alignment, Traffic engineering."
              ].map((topic, idx) => (
                <li key={idx} className="flex items-start text-gray-700">
                  <FaCheckCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="leading-relaxed text-sm md:text-base">
                    <strong>{topic.split(':')[0]}:</strong> {topic.split(':')[1]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Call to Action for Free Test */}
      <div className="max-w-4xl mx-auto mt-16 text-center px-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-blue-900 mb-3">Ready to test your knowledge?</h3>
          <p className="text-blue-700 mb-6">Attempt our chapter-wise mock tests and experience the real exam interface.</p>
          <Link href="/login" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition shadow-md">
            Start Free Mock Test
          </Link>
        </div>
      </div>

    </div>
  );
}