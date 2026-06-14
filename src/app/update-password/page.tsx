"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabase';
import { FaLock, FaSpinner } from 'react-icons/fa';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Ensure the Supabase client extracts the session from the URL hash fragment
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) {
                setErrorMsg("Invalid or expired recovery link. Please request a new password reset link.");
            }
        };
        checkSession();
    }, []);

    // Password validation logic (Minimum 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Special)
    const validatePassword = (pwd: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(pwd);
    };

    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        // 1. Check if passwords match
        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match. Please try again.");
            setLoading(false);
            return;
        }

        // 2. Check password standard pattern
        if (!validatePassword(password)) {
            setErrorMsg("Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&).");
            setLoading(false);
            return;
        }

        try {
            // 3. Update the user's password in Supabase
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccessMsg("Password updated successfully! Redirecting to login...");
            
            // 4. Redirect to login page after 2 seconds
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">
                    TGPSC<span className="text-gray-800">Prep</span>
                </h2>
                <h2 className="mt-6 text-2xl font-bold text-gray-900">Set New Password</h2>
                <p className="mt-2 text-sm text-gray-600">Please enter your new secure password below.</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleUpdatePassword}>
                        
                        {/* Display error or success messages */}
                        {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{errorMsg}</div>}
                        {successMsg && <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">{successMsg}</div>}

                        {/* New Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input 
                                    type="password" 
                                    required 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                    placeholder="••••••••" 
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special (@$!%*?&)
                            </p>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input 
                                    type="password" 
                                    required 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                    placeholder="••••••••" 
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loading || !!successMsg} 
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition"
                        >
                            {loading ? <FaSpinner className="animate-spin text-xl" /> : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}