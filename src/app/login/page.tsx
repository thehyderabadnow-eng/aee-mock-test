"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabase';
import { FaEnvelope, FaLock, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setIsLoading] = useState(false);
    const [errorMsg, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // 🚀 1. Router ని రిఫ్రెష్ చేసి ఆథెంటికేషన్ స్టేట్ ని సింక్ చేయడం
            router.refresh();

            // 🚀 2. బ్రౌజర్ లో సెషన్ సేవ్ అవ్వడానికి ఒక 150ms టైమ్ ఇచ్చి ఆ తర్వాత పుష్ చేయడం
            setTimeout(() => {
                router.push('/dashboard');
            }, 150);

        } catch (err: any) {
            setError(err.message || 'Invalid login credentials');
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address to reset the password.");
            return;
        }
        setIsLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/update-password',
        });
        setIsLoading(false);
        if (error) setError(error.message);
        else setSuccessMsg("Password reset link sent to your email!");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link href="/" className="text-3xl font-extrabold text-blue-700 tracking-tight">
                    TGPSC<span className="text-gray-800">Prep</span>
                </Link>
                <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign in to your account</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{errorMsg}</div>}
                        {successMsg && <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">{successMsg}</div>}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaEnvelope className="text-gray-400" /></div>
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 px-3 py-2 border rounded-md" placeholder="aspirant@example.com" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                {/* 🚀 Eye Icon Button 🚀 */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                                >
                                    {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <button type="button" onClick={handleForgotPassword} className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700">
                            {loading ? <FaSpinner className="animate-spin text-xl" /> : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/register" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                            Don't have an account? <span className="font-bold underline">Register here</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}