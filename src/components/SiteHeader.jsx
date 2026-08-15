import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function SiteHeader(){
  const [open,setOpen]=useState(false);
  const accountType=localStorage.getItem('accountType')||'hiring';
  const links=accountType==='creative'
    ? [['Home','/'],['My Portfolio','/portfolio'],['Bookings','/bookings'],['Messages','/messages'],['Community','/community']]
    : [['Discover','/discover'],['Saved','/saved'],['Bookings','/bookings'],['Messages','/messages'],['Community','/community']];
  return <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f5f0]/95 backdrop-blur">
    <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 lg:px-10">
      <Link to="/" className="font-display text-xl font-semibold tracking-[-.04em]">NYC Creative Hub</Link>
      <nav className="hidden items-center gap-8 md:flex">{links.map(([label,path])=><NavLink key={path} to={path} className={({isActive})=>`text-sm transition-opacity hover:opacity-50 ${isActive?'font-semibold':'text-black/65'}`}>{label}</NavLink>)}<Link to="/profile" className="rounded-full bg-black px-5 py-2.5 text-sm text-white">Your profile</Link></nav>
      <button className="md:hidden" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
    </div>
    {open&&<nav className="flex flex-col gap-5 border-t border-black/10 px-5 py-6 md:hidden">{links.map(([label,path])=><Link key={path} to={path} onClick={()=>setOpen(false)}>{label}</Link>)}<Link to="/profile">Your profile</Link></nav>}
  </header>
}