import router from 'next/router';
import { supabase } from '../utils/supabase';

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push('/login');
};
