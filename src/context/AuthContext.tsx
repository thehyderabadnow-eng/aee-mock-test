"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../app/utils/supabase';

// 1. Context కి ఒక ఆకారం (Interface) ఇస్తున్నాం
interface AuthContextType {
  isLoggedIn: boolean;
  user: any | null;
  isLoading: boolean;
}

// 2. Context ని క్రియేట్ చేస్తున్నాం
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  isLoading: true,
});

// 3. Provider Component (దీన్ని మనం Layout లో వాడతాం)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // కరెంట్ యూజర్ ని చెక్ చేసే ఫంక్షన్
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoggedIn(!!user);
      setIsLoading(false);
    };

    checkUser();

    // 🚀 సుపబేస్ ఆటోమేటిక్ లిజనర్: ఎవరైనా లాగౌట్/లాగిన్ అయితే యాప్ మొత్తానికి వెంటనే తెలిసేలా
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. ఏ పేజీలోనైనా సులభంగా వాడుకోవడానికి Custom Hook
export const useAuth = () => useContext(AuthContext);