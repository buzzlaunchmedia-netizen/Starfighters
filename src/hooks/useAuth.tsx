import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/api';
import { toast } from 'sonner';
import { authService } from '@/lib/auth';
interface AuthContextValue { user:User|null; loading:boolean; signOut:()=>Promise<void>; login:typeof authService.login; sendOtp:typeof authService.sendOtp; verify:typeof authService.verify; }
const AuthContext=createContext<AuthContextValue>({user:null,loading:true,signOut:async()=>{},...authService});
export function AuthProvider({children}:{children:ReactNode}) {
 const [user,setUser]=useState<User|null>(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{ let mounted=true;
  supabase.auth.getSession().then(({data,error})=>{if(mounted){setUser(data.session?.user || null);setLoading(false);if(error)toast.error(error.message);}});
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{if(mounted){setUser(session?.user || null);setLoading(false);if(!session)sessionStorage.removeItem('sf-admin-token');}});
  return()=>{mounted=false;subscription.unsubscribe();};
 },[]);
 const signOut=async()=>{const {error}=await supabase.auth.signOut();if(error){toast.error(error.message);return;} sessionStorage.removeItem('sf-admin-token');toast.success('Signed out.');};
 return <AuthContext.Provider value={{user,loading,signOut,login:authService.login,sendOtp:authService.sendOtp,verify:authService.verify}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
