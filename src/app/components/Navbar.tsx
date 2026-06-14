"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // ప్రస్తుత URL పాత్ ని తెలుసుకోవడానికి

  useEffect(() => {
    setIsMounted(true);

    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // 1. ఎగ్జామ్ పేజీలో మెయిన్ న్యావ్‌బార్ ని దాచేయడం (చాలా ముఖ్యం)
  if (pathname?.startsWith('/exam')) {
    return null; 
  }

  // 2. Hydration ఎర్రర్ రాకుండా ఆపడం
  if (!isMounted) {
    return <nav className="flex justify-between items-center p-4 bg-white shadow-sm border-b h-[68px]"></nav>;
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-sm border-b sticky top-0 z-50">
      
      {/* Logo */}
      <Link href="/" className="font-extrabold text-xl text-blue-700">
        TGPSC<span className="text-gray-800">Prep</span>
      </Link>

      {/* మధ్యలో ఉండే లింక్స్ (Syllabus, Premium, Dashboard) */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link href="/syllabus" className="text-gray-600 hover:text-blue-600 font-medium transition">
          Syllabus
        </Link>
        <Link href="/pricing" className="text-gray-600 hover:text-blue-600 font-medium transition">
          Premium Tests
        </Link>
        
        {/* యూజర్ లాగిన్ అయి ఉంటేనే Dashboard లింక్ చూపించాలి */}
        {user && (
          <Link href="/dashboard" className="text-blue-600 font-bold hover:text-blue-800 transition">
            Dashboard
          </Link>
        )}
      </div>

      {/* Login / Logout బటన్స్ */}
      <div className="flex space-x-4 items-center">
        {user ? (
          <button onClick={handleLogout} className="text-red-600 font-bold hover:text-red-700 transition">
            Logout
          </button>
        ) : (
          <Link href="/login" className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition shadow-md">
            Login / Sign Up
          </Link>
        )}
      </div>

    </nav>
  );
}