import { useState } from 'react';import { useSearchParams } from 'react-router-dom';import PageShell from '@/components/PageShell';import EventCard from '@/components/EventCard';import CommunityTabs from '@/components/CommunityTabs';import BoardGallery from '@/components/community/BoardGallery';import { events } from '@/data/marketplace';
export default function Community(){
 const [params,setParams]=useSearchParams();
 const requested=params.get('tab');
 const active=['events','boards'].includes(requested)?requested:'events';
 const [joined,setJoined]=useState(()=>JSON.parse(localStorage.getItem('joinedEvents')||'[]'));
 const [saved,setSaved]=useState(()=>JSON.parse(localStorage.getItem('savedEvents')||'[]'));
 const toggle=(key,id,list,setList)=>{const next=list.includes(id)?list.filter(x=>x!==id):[...list,id];setList(next);localStorage.setItem(key,JSON.stringify(next))};
 return <PageShell><section className="mx-auto max-w-[1500px] px-5 py-14 lg:px-10"><p className="section-kicker">Community</p><h1 className="max-w-4xl text-5xl font-semibold tracking-[-.055em] sm:text-7xl">Made in New York, together.</h1><p className="mt-5 max-w-2xl text-lg text-black/60">Discover events across the city and gather shared inspiration on collaborative boards.</p><div className="mt-10"><CommunityTabs active={active} onChange={tab=>setParams({tab})}/></div></section>
 {active==='events'&&<section className="bg-[#dedbd2] px-5 py-16 lg:px-10"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between"><h2 className="section-title">Upcoming events</h2><span className="text-sm">{joined.length} in My Events</span></div><div className="mt-9 grid gap-7 md:grid-cols-3">{events.map(e=><EventCard key={e.id} event={e} joined={joined.includes(e.id)} saved={saved.includes(e.id)} onJoin={()=>toggle('joinedEvents',e.id,joined,setJoined)} onSave={()=>toggle('savedEvents',e.id,saved,setSaved)}/>)}</div></div></section>}
 {active==='boards'&&<section className="mx-auto max-w-[1500px] px-5 pb-20 lg:px-10"><p className="section-kicker">Shared inspiration</p><h2 className="section-title mb-8">Boards</h2><BoardGallery/></section>}
 </PageShell>
}