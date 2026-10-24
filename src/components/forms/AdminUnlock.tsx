import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api';
import { adminPinSchema, type AdminPinValues } from '@/lib/validations';
interface Props { onUnlock: () => void; }
interface PinSession { token: string; expires_at: string; }
export default function AdminUnlock({ onUnlock }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminPinValues>({ resolver: zodResolver(adminPinSchema) });
  const login = useMutation({
    mutationFn: (values: AdminPinValues) => adminApi<PinSession>('login', values),
    onSuccess: (session) => {
      sessionStorage.setItem('sf-pin-admin-token', session.token);
      sessionStorage.setItem('sf-pin-admin-expires', session.expires_at);
      reset();
      onUnlock();
      toast.success('Administrator access unlocked for one hour.');
    },
    onError: (error: Error) => toast.error(error.message),
  });
  return <form onSubmit={handleSubmit(values => login.mutate(values))} className="panel max-w-lg w-full">
    <ShieldCheck size={36} className="text-accent mb-6" />
    <span className="eyebrow text-primary">RESTRICTED ACCESS</span>
    <h1 className="text-3xl mt-4 font-semibold">Administrator's corner</h1>
    <p className="text-muted-foreground mt-4 mb-6">Enter your administrator PIN to continue. No email or account sign-in is required.</p>
    <label htmlFor="admin-pin">Administrator PIN</label>
    <input id="admin-pin" type="password" inputMode="numeric" autoComplete="off" maxLength={6} disabled={login.isPending} aria-invalid={Boolean(errors.passkey)} aria-describedby={errors.passkey ? 'admin-pin-error' : 'admin-pin-security'} {...register('passkey')} />
    {errors.passkey && <p id="admin-pin-error" role="alert" className="field-error">! {errors.passkey.message}</p>}
    <button className="btn-primary w-full mt-6" disabled={login.isPending}>{login.isPending ? 'Verifying PIN…' : 'Unlock administrator access'}<ArrowUpRight size={18} /></button>
    <p id="admin-pin-security" className="text-sm text-muted-foreground mt-4">Verified securely on the server. Five attempts trigger a temporary lockout.</p>
  </form>;
}
