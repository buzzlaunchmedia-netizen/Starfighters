import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api';
import type { AdminData } from '@/types/community';
export function useAdminData(enabled:boolean){return useQuery({queryKey:['admin-data'],queryFn:()=>adminApi<AdminData>('overview'),enabled,refetchInterval:60000,retry:false});}
export function useAdminAction(action:string){const query=useQueryClient();return useMutation({mutationFn:(payload:Record<string,unknown>)=>adminApi(action,payload),onSuccess:()=>{toast.success('Changes saved.');query.invalidateQueries({queryKey:['admin-data']});query.invalidateQueries({queryKey:['settings']});query.invalidateQueries({queryKey:['announcements']});query.invalidateQueries({queryKey:['news-article']});query.invalidateQueries({queryKey:['polls']});},onError:(e:Error)=>toast.error(e.message)});}
