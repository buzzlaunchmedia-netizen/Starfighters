import { lazy,Suspense } from 'react';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import AppErrorBoundary from '@/components/features/AppErrorBoundary';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
const Register=lazy(()=>import('@/pages/Register'));
const Login=lazy(()=>import('@/pages/Login'));
const Dashboard=lazy(()=>import('@/pages/Dashboard'));
const Polls=lazy(()=>import('@/pages/Polls'));
const Admin=lazy(()=>import('@/pages/Admin'));
const Privacy=lazy(()=>import('@/pages/Privacy'));
const queryClient=new QueryClient({defaultOptions:{queries:{staleTime:15000,retry:1}}});
export default function App(){return <QueryClientProvider client={queryClient}><TooltipProvider><Sonner/><AppErrorBoundary><AuthProvider><BrowserRouter><Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading your corner…</div>}><Routes><Route path="/" element={<Index/>}/><Route path="/register" element={<Register/>}/><Route path="/login" element={<Login/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="/polls" element={<Polls/>}/><Route path="/admin" element={<Admin/>}/><Route path="/privacy" element={<Privacy/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense></BrowserRouter></AuthProvider></AppErrorBoundary></TooltipProvider></QueryClientProvider>;}
