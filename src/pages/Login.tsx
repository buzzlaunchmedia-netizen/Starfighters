import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowUpRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/lib/validations';
interface Values{email:string;password:string;}
export default function Login(){const {user,loading,login}=useAuth();const navigate=useNavigate();const [busy,setBusy]=useState(false);const {register,handleSubmit,formState:{errors}}=useForm<Values>({resolver:zodResolver(loginSchema)});
 useEffect(()=>{if(!loading&&user)navigate('/dashboard',{replace:true});},[user,loading,navigate]);
 const submit=handleSubmit(v=>{setBusy(true);login(v.email,v.password).catch(e=>{toast.error(e.message);setBusy(false);});});
 return <><Header/><main className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16"><div><span className="eyebrow text-primary">BACK IN YOUR CORNER</span><h1 className="text-5xl md:text-7xl tracking-tight mt-5">Show up.<br/>Keep growing.</h1><p className="text-muted-foreground mt-8 max-w-sm">Your community updates, registration status, and the next conversation in the ring.</p></div><form onSubmit={submit} className="panel self-start"><h2 className="text-2xl font-semibold mb-8">Welcome back</h2><label htmlFor="login-email">Email address</label><input id="login-email" type="email" autoComplete="email" {...register('email')}/>{errors.email&&<p className="field-error" role="alert">! {errors.email.message}</p>}<label className="mt-6" htmlFor="login-password">Password</label><input id="login-password" type="password" autoComplete="current-password" {...register('password')}/>{errors.password&&<p className="field-error" role="alert">! {errors.password.message}</p>}<button className="btn-primary w-full mt-8" disabled={busy||loading}>{busy?'Signing in…':'Sign in'}<ArrowUpRight size={18}/></button><p className="text-muted-foreground text-sm mt-6">New here? <Link to="/register" className="text-foreground underline">Join the community</Link></p></form></main></>;
}
