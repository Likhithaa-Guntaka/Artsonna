import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const groups={
 Field:['Photography','Film / Video','Makeup & Beauty','Styling','Creative Direction','Design','Illustration','Art','Music'],
 Style:['Editorial','Cinematic','Minimal','Street','Vintage','Y2K','Luxury','Experimental','Documentary','Colorful','Dark / Moody','Natural','Commercial','Fine Art'],
 Logistics:['Manhattan','Brooklyn','Queens','Bronx','Staten Island','Today','This weekend','Next week','Remote','In person','Under $300','$300–$500','$500–$1,000','$1,000+','Editorial shoot','Campaign','Event','Music video'],
 People:['Emerging talent','Established creative','Individual creator','Creative team / crew','Open to collaboration','Available for hire']
};

export default function DiscoveryFilters({filters,onToggle}){
 const [open,setOpen]=useState(null);
 return <div className="border-y border-black/10 py-3">
  <div className="flex flex-wrap gap-2">{Object.keys(groups).map(group=><button key={group} onClick={()=>setOpen(open===group?null:group)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${open===group?'bg-primary text-primary-foreground':'bg-black/[.05]'}`}>{group}{filters[group]?.length>0&&<span className="text-xs opacity-60">{filters[group].length}</span>}<ChevronDown className={`h-3.5 w-3.5 transition-transform ${open===group?'rotate-180':''}`}/></button>)}</div>
  {open&&<div className="mt-3 flex flex-wrap gap-2 pb-1">{groups[open].map(option=>{const active=filters[open]?.includes(option);return <button key={option} onClick={()=>onToggle(open,option)} className={`rounded-full px-3 py-1.5 text-xs transition ${active?'bg-primary text-primary-foreground':'bg-black/[.04] text-black/65 hover:bg-black/[.09]'}`}>{option}</button>})}</div>}
 </div>
}