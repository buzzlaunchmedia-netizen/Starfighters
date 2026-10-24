import { createClient, FunctionsHttpError } from '@supabase/supabase-js';
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession:true, autoRefreshToken:true, flowType:'pkce' } });
export async function adminApi<T>(action:string, payload:Record<string,unknown> = {}):Promise<T> {
 const { data, error } = await supabase.functions.invoke('starfighters-admin', { body:{ action, adminToken:sessionStorage.getItem('sf-admin-token'), ...payload } });
 if (error) { let message = error.message; if (error instanceof FunctionsHttpError) { const text = await error.context.text(); const parsed = JSON.parse(text) as {error?:string}; message=parsed.error || text; } throw new Error(message); }
 if (data?.error) throw new Error(data.error);
 return data as T;
}
export async function uploadBrand(file:File) {
 if (file.size>5*1024*1024 || !['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG, or WebP image smaller than 5 MB.');
 const bytes = new Uint8Array(await file.arrayBuffer()); let binary=''; for(let i=0;i<bytes.length;i++) binary+=String.fromCharCode(bytes[i]);
 return adminApi<{url:string}>('upload',{file:btoa(binary),mime:file.type});
}
