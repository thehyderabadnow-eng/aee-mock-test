"use client";

import { useState } from 'react';
import { supabase } from '../utils/supabase'; // మీ సుపబేస్ పాత్ చెక్ చేసుకోండి
import { FaPlusCircle, FaSpinner, FaCheckCircle, FaDatabase } from 'react-icons/fa';

// ఈ డేటాని మీ imports కింద, AdminPage ఫంక్షన్ కి పైన పెట్టండి
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

    // Options State (Array of 4 strings)
    const [options, setOptions] = useState(['', '', '', '']);

    // Correct Answer State (0, 1, 2, or 3 corresponding to A, B, C, D)
    const [correctOptionIndex, setCorrectOptionIndex] = useState(0);

    const [explanation, setExplanation] = useState('');

    // --- UI States ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // పేపర్ మారినప్పుడు సబ్జెక్ట్ మరియు చాప్టర్ ని రీసెట్ చేసే ఫంక్షన్
    const handlePaperChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPaper = e.target.value;
        setPaperType(newPaper);

        const firstSubject = Object.keys(syllabusData[newPaper])[0];
        setSubjectName(firstSubject);
        setChapterName(syllabusData[newPaper][firstSubject][0]);
    };

    // సబ్జెక్ట్ మారినప్పుడు చాప్టర్ ని రీసెట్ చేసే ఫంక్షన్
    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSubject = e.target.value;
        setSubjectName(newSubject);
        setChapterName(syllabusData[paperType][newSubject][0]);
    };

    // --- Handlers ---
    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        // Basic Validation
        if (!subjectName || !chapterName || !questionText || options.some(opt => !opt.trim())) {
            setMessage({ type: 'error', text: 'Please fill all required fields, including all 4 options.' });
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. సుపబేస్ డేటాబేస్ లోకి ఇన్సర్ట్ చేయడం
            const { error } = await supabase
                .from('questions')
                .insert([
                    {
                        paper_type: paperType,
                        subject_name: subjectName.trim(),
                        chapter_name: chapterName.trim(),
                        question_text: questionText.trim(),
                        options: options.map(opt => opt.trim()), // JSONB array
                        correct_answer: options[correctOptionIndex].trim(), // కరెక్ట్ ఆన్సర్ టెక్స్ట్ సేవ్ చేస్తున్నాం
                        explanation: explanation.trim() // <-- మీరు అడిగిన ఫీల్డ్
                    }
                ]);

            if (error) throw error;

            // 2. సక్సెస్ అయితే మెసేజ్ చూపించి, ఫామ్ క్లియర్ చేయడం (సబ్జెక్ట్, చాప్టర్ ఉంచుతాం ఈజీగా ఉండటానికి)
            setMessage({ type: 'success', text: 'Question added successfully to the database!' });
            setQuestionText('');
            setOptions(['', '', '', '']);
            setExplanation('');
            setCorrectOptionIndex(0);

            // 3 సెకన్ల తర్వాత సక్సెస్ మెసేజ్ దాచేయడం
            setTimeout(() => setMessage(null), 3000);

        } catch (error: any) {
            console.error("Error inserting question:", error);
            setMessage({ type: 'error', text: error.message || 'Failed to add question.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans py-12">
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

                {/* Message Alert */}
                {message && (
                    <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 font-bold shadow-sm ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                        {message.type === 'success' ? <FaCheckCircle /> : null}
                        {message.text}
                    </div>
                )}

                {/* Question Entry Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-blue-50/50 border-b border-gray-200 px-8 py-5">
                        <h2 className="text-xl font-bold text-gray-800">Question Entry Form</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* 1. Categorization Row (Dynamic Dropdowns) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">

                            {/* Paper Type */}
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

                            {/* Subject Dropdown */}
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

                            {/* Chapter Dropdown */}
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

                        {/* 3. Options & Correct Answer Selection (Combined UX) */}
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
                                        {/* Radio Button Label (Acts as the prefix) */}
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

                                        {/* Text Input for the Option */}
                                        <input
                                            type="text"
                                            required
                                            placeholder={`Enter option ${label} text...`}
                                            value={options[index]}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            className="flex-1 px-4 py-3 outline-none bg-transparent text-gray-800"
                                        />

                                        {/* Correct Answer Indicator Badge */}
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

                        {/* 4. Explanation (వివరణ) */}
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

                        {/* 6. Submit Button */}
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