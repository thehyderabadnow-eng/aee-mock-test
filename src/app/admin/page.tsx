"use client";

import { useState, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { FaPlusCircle, FaSpinner, FaCheckCircle, FaDatabase, FaTimesCircle } from 'react-icons/fa';

// --- Syllabus Data (Cascading Dropdowns కోసం) ---
const syllabusData: Record<string, Record<string, string[]>> = {
    paper_1: {
        "General Science": ["Biology", "Physics", "Chemistry", "Science & Technology"],
        "Telangana History": ["Statehood Movement", "Culture & Heritage", "Kakatiyas", "Qutb Shahis"],
        "Indian Polity": ["Constitution", "Parliament", "Judiciary", "Local Self Government"],
        "Current Affairs": ["Regional", "National", "International"],
    },
    paper_2: {
        "Fluid Mechanics": ["Kinematics of Flow", "Fluid Properties", "Open Channel Flow", "Fluid Dynamics"],
        "Structural Analysis": ["Trusses", "Arches", "Matrices Method", "Indeterminate Structures"],
        "Environmental Engineering": ["Water Supply", "Wastewater Treatment", "Solid Waste Management"],
        "Building Materials": ["Bricks & Timber", "Cement & Concrete", "Masonry"],
    }
};

export default function AdminPage() {
    // --- Form States ---
    const [paperType, setPaperType] = useState('paper_1');
    const [subjectName, setSubjectName] = useState(Object.keys(syllabusData['paper_1'])[0]);
    const [chapterName, setChapterName] = useState(syllabusData['paper_1'][Object.keys(syllabusData['paper_1'])[0]][0]);
    const [questionText, setQuestionText] = useState('');

    // Options & Correct Answer
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
    const [explanation, setExplanation] = useState('');

    // --- UI States ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const topRef = useRef<HTMLDivElement>(null);

    // --- Handlers ---
    const handlePaperChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPaper = e.target.value;
        setPaperType(newPaper);
        const firstSubject = Object.keys(syllabusData[newPaper])[0];
        setSubjectName(firstSubject);
        setChapterName(syllabusData[newPaper][firstSubject][0]);
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSubject = e.target.value;
        setSubjectName(newSubject);
        setChapterName(syllabusData[paperType][newSubject][0]);
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        // Validation
        if (!questionText || options.some(opt => !opt.trim())) {
            setMessage({ type: 'error', text: 'Please fill out the question and all 4 options.' });
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. Insert into Supabase
            const { error } = await supabase
                .from('questions')
                .insert([
                    {
                        paper_type: paperType,
                        subject_name: subjectName,
                        chapter_name: chapterName,
                        question_text: questionText.trim(),
                        options: options.map(opt => opt.trim()),
                        correct_answer: options[correctOptionIndex].trim(),
                        explanation: explanation.trim()
                    }
                ]);

            if (error) throw error;

            // 2. Show Success Toast Message
            setMessage({ type: 'success', text: 'Question added successfully to the database!' });

            // 🚀 పేజీని స్మూత్‌గా పైకి (Top) పంపించే లాజిక్ 🚀
            setTimeout(() => {
                topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

            // 3. Clear the form (but keep category selected)
            setQuestionText('');
            setOptions(['', '', '', '']);
            setExplanation('');
            setCorrectOptionIndex(0);

            // 4. Hide message after 4 seconds
            setTimeout(() => setMessage(null), 4000);

        } catch (error: any) {
            console.error("Error inserting question:", error);
            setMessage({ type: 'error', text: error.message || 'Failed to add question.' });
            window.scrollTo({ top: 0, behavior: 'smooth' }); // ఎర్రర్ వచ్చినా పైకి వెళ్లేలా..
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans py-12 relative">

            <div ref={topRef}></div>
            
            {/* 🚀 FLOATING TOAST NOTIFICATION 🚀 */}
            {message && (
                <div className={`fixed top-8 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-bold transition-all transform duration-500 ease-in-out translate-y-0 opacity-100 ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {message.type === 'success' ? <FaCheckCircle className="text-2xl" /> : <FaTimesCircle className="text-2xl" />}
                    <span className="text-lg">{message.text}</span>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                            <FaDatabase className="text-blue-600" /> Admin Panel
                        </h1>
                        <p className="mt-2 text-gray-600">Add new questions to the database dynamically.</p>
                    </div>
                </div>

                {/* Question Entry Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-blue-50/50 border-b border-gray-200 px-8 py-5">
                        <h2 className="text-xl font-bold text-gray-800">Question Entry Form</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* 1. Categorization Row (Dynamic Dropdowns) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Paper Type *</label>
                                <select
                                    value={paperType}
                                    onChange={handlePaperChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-blue-900 font-semibold shadow-sm cursor-pointer"
                                >
                                    <option value="paper_1">Paper I (General Studies)</option>
                                    <option value="paper_2">Paper II (Civil Engineering)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subject Name *</label>
                                <select
                                    value={subjectName}
                                    onChange={handleSubjectChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800 shadow-sm cursor-pointer"
                                >
                                    {Object.keys(syllabusData[paperType]).map(subject => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Chapter Name *</label>
                                <select
                                    value={chapterName}
                                    onChange={(e) => setChapterName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800 shadow-sm cursor-pointer"
                                >
                                    {syllabusData[paperType][subjectName]?.map(chapter => (
                                        <option key={chapter} value={chapter}>{chapter}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 2. Question Text */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Question Text *</label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Type the question here..."
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                            ></textarea>
                        </div>

                        {/* 3. Combined UX for Options & Correct Answer */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Answer Options (Select the radio button for the correct answer) *
                            </label>
                            <div className="space-y-4">
                                {['A', 'B', 'C', 'D'].map((label, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-stretch border rounded-lg overflow-hidden transition-colors duration-200 focus-within:ring-2 focus-within:ring-blue-500
                      ${correctOptionIndex === index ? 'border-green-500 bg-green-50/30' : 'border-gray-300 bg-white'}`}
                                    >
                                        <label
                                            className={`flex items-center justify-center px-4 py-3 cursor-pointer border-r transition-colors
                        ${correctOptionIndex === index ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}
                                            title={`Mark Option ${label} as Correct`}
                                        >
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                required
                                                checked={correctOptionIndex === index}
                                                onChange={() => setCorrectOptionIndex(index)}
                                                className="w-5 h-5 text-green-600 focus:ring-green-500 cursor-pointer"
                                            />
                                            <span className="ml-2 font-bold text-gray-700 w-4 text-center">{label}</span>
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            placeholder={`Enter option ${label} text...`}
                                            value={options[index]}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            className="flex-1 px-4 py-3 outline-none bg-transparent text-gray-800"
                                        />

                                        {correctOptionIndex === index && (
                                            <div className="hidden sm:flex items-center px-4 bg-green-50 border-l border-green-200">
                                                <span className="text-xs font-bold text-green-700 uppercase tracking-wider flex items-center gap-1">
                                                    <FaCheckCircle /> Correct
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Explanation */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Explanation (Optional but Recommended)</label>
                            <textarea
                                rows={3}
                                placeholder="Explain why the answer is correct... (This will be shown in the results page)"
                                value={explanation}
                                onChange={(e) => setExplanation(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-y bg-purple-50/30"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'}`}
                            >
                                {isSubmitting ? (
                                    <><FaSpinner className="animate-spin" /> Saving...</>
                                ) : (
                                    <><FaPlusCircle /> Add Question to Database</>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}