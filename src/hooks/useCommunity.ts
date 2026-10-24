import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/api';
import type { SiteSettings,Announcement,Poll,Member,Vote } from '@/types/community';
import { useAuth } from '@/hooks/useAuth';
export function useSettings(){return useQuery({queryKey:['settings'],queryFn:async()=>{const {data,error}=await supabase.from('sf_settings').select('*').single();if(error)throw error;return data as SiteSettings;},refetchInterval:30000});}
export function useAnnouncements(){return useQuery({queryKey:['announcements'],queryFn:async()=>{const {data,error}=await supabase.from('sf_announcements').select('*').eq('published',true).order('created_at',{ascending:false});if(error)throw error;return data as Announcement[];},refetchInterval:30000});}
export function useNewsArticle(id?:string){return useQuery({queryKey:['news-article',id],enabled:!!id,queryFn:async()=>{const {data,error}=await supabase.from('sf_announcements').select('*').eq('id',id!).eq('kind','news').eq('published',true).maybeSingle();if(error)throw error;return data as Announcement|null;},refetchInterval:30000});}
export function usePolls(){return useQuery({queryKey:['polls'],queryFn:async()=>{const {data,error}=await supabase.from('sf_polls').select('*').neq('status','archived').order('created_at',{ascending:false});if(error)throw error;return data as Poll[];},refetchInterval:30000});}
export function useRegistration(){const {user}=useAuth();return useQuery({queryKey:['registration',user?.id],enabled:!!user,queryFn:async()=>{const {data,error}=await supabase.from('sf_my_registration').select('*').maybeSingle();if(error)throw error;return data as Member|null;}});}
export function useVotes(){const {user}=useAuth();return useQuery({queryKey:['votes',user?.id],enabled:!!user,queryFn:async()=>{const {data,error}=await supabase.from('sf_votes').select('*').eq('user_id',user!.id);if(error)throw error;return data as Vote[];}});}
