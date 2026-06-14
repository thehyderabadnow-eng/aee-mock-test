"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../utils/supabase';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaSpinner } from 'react-icons/fa';

export default function RegisterPage() {
    const router = useRouter();
    
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // కొత్త స్టేట్
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // పాస్‌వర్డ్ వాలిడేషన్ లాజిక్ (Minimum 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Special)
    const validatePassword = (pwd: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(pwd);
    };

const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        setLoading(false);
        return;
    }

    try {
        // 1. Sign up the user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name, mobile: mobile }
            }
        });

        if (authError) throw authError;

        // 2. Insert extra profile details into the public profiles table
        if (authData?.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    { 
                        id: authData.user.id, 
                        full_name: name, 
                        mobile_number: mobile,
                        is_premium: false 
                    }
                ]);

            if (profileError) throw profileError;
        }

        setSuccessMsg("Registration successful! Redirecting to login...");
        setTimeout(() => { router.push('/login'); }, 2000);

    } catch (error: any) {
        setErrorMsg(error.message);
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link href="/" className="text-3xl font-extrabold text-blue-700">TGPSC<span className="text-gray-800">Prep</span></Link>
                <h2 className="mt-6 text-2xl font-bold text-gray-900">Create a new account</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
                    <form className="space-y-4" onSubmit={handleRegister}>
                        {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{errorMsg}</div>}
                        {successMsg && <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">{successMsg}</div>}

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUser className="text-gray-400" /></div>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-10 px-3 py-2 border rounded-md" placeholder="Vamshi Krishna" />
                            </div>
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaPhone className="text-gray-400" /></div>
                                <input type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)} className="block w-full pl-10 px-3 py-2 border rounded-md" placeholder="9876543210" pattern="[0-9]{10}" title="Must be a 10 digit number" />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaEnvelope className="text-gray-400" /></div>
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 px-3 py-2 border rounded-md" placeholder="aspirant@example.com" />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Create Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLock className="text-gray-400" /></div>
                                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-10 px-3 py-2 border rounded-md" placeholder="••••••••" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special (@$!%*?&)</p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Re-enter Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLock className="text-gray-400" /></div>
                                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full pl-10 px-3 py-2 border rounded-md" placeholder="••••••••" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700">
                            {loading ? <FaSpinner className="animate-spin text-xl" /> : "Register Account"}
                        </button>
                    </form>

                    <div className="mt-6 text-center border-t pt-4">
                        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                            Already have an account? <span className="font-bold underline">Sign in</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}