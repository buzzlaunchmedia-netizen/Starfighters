import { supabase } from '@/lib/api';
export const authService={
 async sendOtp(email:string){const {error}=await supabase.auth.signInWithOtp({email,options:{shouldCreateUser:true}});if(error)throw error;},
 async verify(email:string,token:string,password:string,name:string){const {error}=await supabase.auth.verifyOtp({email,token,type:'email'});if(error)throw error;const {data,error:saveError}=await supabase.auth.updateUser({password,data:{username:name}});if(saveError)throw saveError;return data.user;},
 async login(email:string,password:string){const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;},
};
