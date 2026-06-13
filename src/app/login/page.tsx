// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabase'; // Import our Supabase client
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';

export default function LoginPage() {
    const router = useRouter();

    // --- State Management ---
    const [isLoginMode, setIsLoginMode] = useState<boolean>(true); // Toggle Login/Register
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // --- Handle Authentication ---
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            if (isLoginMode) {
                // --- SIGN IN LOGIC ---
                // const { data, error } = await supabase.auth.signInWithPassword({
                //     email,
                //     password,
                // });

                // OTP Login Logic
                const { data, error } = await supabase.auth.signInWithOtp({
                    email: email,
                    options: {
                        emailRedirectTo: 'http://localhost:3000/dashboard',
                    },
                });

                if (error) throw error;

                // Successful login
                router.push('/dashboard');

            } else {
                // --- SIGN UP LOGIC ---
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) throw error;

                // Successful registration
                setSuccessMsg("Registration successful! Please check your email to confirm your account before logging in."); setIsLoginMode(true); // Switch to login screen
                setPassword(''); // Clear password for security
            }
        } catch (error: any) {
            setErrorMsg(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">

            {/* Header / Logo */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link href="/" className="text-3xl font-extrabold text-blue-700 tracking-tight">
                    TGPSC<span className="text-gray-800">Prep</span>
                </Link>
                <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
                    {isLoginMode ? "Sign in to your account" : "Create a new account"}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                        go back to home page
                    </Link>
                </p>
            </div>

            {/* Auth Card */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10 border border-gray-100">

                    <form className="space-y-6" onSubmit={handleAuth}>

                        {/* Error & Success Messages */}
                        {errorMsg && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                                {errorMsg}
                            </div>
                        )}
                        {successMsg && (
                            <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm border border-green-200">
                                {successMsg}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="aspirant@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition"
                            >
                                {loading ? (
                                    <FaSpinner className="animate-spin text-xl" />
                                ) : (
                                    isLoginMode ? "Sign In" : "Register Account"
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Toggle Login/Register Mode */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setErrorMsg(null);
                                setSuccessMsg(null);
                            }}
                            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
                        >
                            {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}