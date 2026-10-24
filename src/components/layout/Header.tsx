import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Brand from '@/components/layout/Brand';
import { useAuth } from '@/hooks/useAuth';
interface Props{hero?:boolean;}
export default function Header({hero=false}:Props){const [open,setOpen]=useState(false);const {user}=useAuth();return <header className={hero?'hero-nav':'flex items-center justify-between py-5 px-6 md:px-12 border-b border-border bg-background'}>
 <Brand/><nav className="hidden md:flex items-center gap-8 text-sm"><a className="hover:text-primary" href="/#community">Community</a><a className="hover:text-primary" href="/#about">About us</a><a className="hover:text-primary" href="/#updates">Updates</a><Link className="hover:text-primary" to="/polls">The ring</Link></nav>
 <div className="flex items-center gap-3"><Link to={user?'/dashboard':'/login'} className="hidden sm:block text-sm px-3 py-3 hover:text-primary">{user?'My dashboard':'Sign in'}</Link><a href="/#contact" className="btn-secondary !border-0 !text-primary hidden md:flex !px-6">Contact <span className="w-2 h-2 rounded-full bg-primary ml-4"/></a><button onClick={()=>setOpen(!open)} className="md:hidden p-3" aria-label="Toggle navigation">{open?<X size={22}/>:<Menu size={22}/>}</button></div>
 {open&&<nav className="absolute top-full left-0 right-0 mt-2 z-50 bg-background border border-border rounded-2xl p-4 flex flex-col">{[['Community','/#community'],['About us','/#about'],['Updates','/#updates'],['The ring','/polls'],[user?'My dashboard':'Sign in',user?'/dashboard':'/login']].map(([label,url])=><a key={label} className="p-3" href={url} onClick={()=>setOpen(false)}>{label}<ArrowUpRight className="float-right" size={18}/></a>)}</nav>}
 </header>;}
