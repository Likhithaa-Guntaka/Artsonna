import { useEffect,useMemo,useState } from 'react';
import { useParams,useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import PageShell from '@/components/PageShell';
import CreativeCard from '@/components/CreativeCard';
import DiscoveryFilters from '@/components/marketplace/DiscoveryFilters';
import { creatives as sampleCreatives } from '@/data/marketplace';
import usePublishedCreatives from '@/hooks/usePublishedCreatives';

const fieldRoles={Photography:['Photographer'], 'Film / Video':['Videographer','Filmmaker','Cinematographer','Animator / Motion Designer'], 'Makeup & Beauty':['Makeup Artist','Beauty Artist'], Styling:['Stylist','Fashion Designer'], 'Creative Direction':['Creative Director','Set Designer'], Design:['Designer','Graphic Designer','Animator / Motion Designer'], Illustration:['Illustrator'], Art:['Artist','Multidisciplinary Artist','Set Designer'], Music:['Musician','Performer','Music Photographer','DJ / Music Producer']};
const fieldSlugs={Photography:'photography','Film / Video':'film-video','Makeup & Beauty':'makeup-beauty',Styling:'styling','Creative Direction':'creative-direction',Design:'design',Illustration:'illustration',Art:'art',Music:'music'};
const slugFields=Object.fromEntries(Object.entries(fieldSlugs).map(([field,slug])=>[slug,field]));
const stopWords=new Set(['a','an','the','with','for','in','on','at','and','or','of','to','nyc','new','york','artist','creative','available','style','shoot']);
const normalizeToken=token=>({photography:'photographer',videography:'videographer',film:'videographer',saturday:'weekend',sunday:'weekend'}[token]||token);
function matchesSearch(creative,query){if(!query.trim())return true;const text=`${creative.name} ${creative.role} ${creative.borough} ${creative.neighborhood} ${creative.tags?.join(' ')} ${creative.bio||''}`.toLowerCase();const cap=query.toLowerCase().match(/under\s*\$?(\d+)/);if(cap&&creative.price>Number(cap[1]))return false;const tokens=query.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).map(normalizeToken).filter(token=>token&&!stopWords.has(token)&&!/^\d+$/.test(token)&&token!=='under');return tokens.every(token=>text.includes(token));}
function matchesGroup(creative,group,values){if(!values.length)return true;return values.some(value=>{if(group==='Field')return (fieldRoles[value]||[]).includes(creative.role);if(group==='Style')return creative.tags?.includes(value);if(group==='Logistics'){if(['Manhattan','Brooklyn','Queens','Bronx','Staten Island'].includes(value))return creative.borough===value||creative.neighborhood?.includes(value);if(['Today','This weekend','Next week'].includes(value))return creative.availability?.toLowerCase().includes(value.toLowerCase());if(value==='Remote'||value==='In person')return creative.workMode?.includes(value);if(value==='Under $300')return creative.price<300;if(value==='$300–$500')return creative.price>=300&&creative.price<=500;if(value==='$500–$1,000')return creative.price>500&&creative.price<=1000;if(value==='$1,000+')return creative.price>1000;return creative.projectTypes?.includes(value);}if(group==='People'){if(value==='Open to collaboration')return creative.openToCollaboration;if(value==='Available for hire')return creative.availableForHire;return creative.people?.includes(value);}return true;});}

export default function Discover(){
 const published=usePublishedCreatives();
 const creatives=[...published,...sampleCreatives];
 const [params]=useSearchParams();
 const {field:fieldSlug}=useParams();
 const requestedField=params.get('field');
 const initialField=slugFields[fieldSlug]||slugFields[requestedField]||requestedField;
 const [q,setQ]=useState('');
 const [filters,setFilters]=useState({Field:initialField?[initialField]:[],Style:[],Logistics:[],People:[]});
 useEffect(()=>{const routedField=slugFields[fieldSlug];if(routedField)setFilters(current=>({...current,Field:[routedField]}))},[fieldSlug]);
 const [saved,setSaved]=useState(()=>JSON.parse(localStorage.getItem('savedCreatives')||'[]'));
 const toggleSaved=id=>{const next=saved.includes(id)?saved.filter(item=>item!==id):[...saved,id];setSaved(next);localStorage.setItem('savedCreatives',JSON.stringify(next))};
 const toggleFilter=(group,value)=>setFilters(current=>({...current,[group]:current[group].includes(value)?current[group].filter(item=>item!==value):[...current[group],value]}));
 const results=useMemo(()=>creatives.filter(creative=>matchesSearch(creative,q)&&Object.entries(filters).every(([group,values])=>matchesGroup(creative,group,values))),[creatives,q,filters]);
 const field=filters.Field.length===1?filters.Field[0]:null;
 return <PageShell>
  <section id="marketplace-results" className="mx-auto max-w-[1500px] scroll-mt-20 px-5 pb-24 pt-14 lg:px-10">
   <p className="section-kicker">{field?`${field} portfolios`:'Search with intent'}</p>
   <div className="grid items-end gap-6 lg:grid-cols-[1fr_.8fr]"><div><h2 className="text-4xl font-semibold tracking-[-.045em] sm:text-5xl">{field?`A curated world of ${field}`:'Describe who you need'}</h2><p className="mt-3 max-w-2xl text-black/55">{field?'Work-led portfolios from New York creatives, connected to the people and collaborators behind each project.':'Search by field, aesthetic, place, timing, or budget — in one natural request.'}</p></div><label className="flex items-center gap-3 border-b border-black py-3"><Search className="h-5 w-5 shrink-0"/><input value={q} onChange={event=>setQ(event.target.value)} className="w-full bg-transparent text-base outline-none" placeholder="NYC photographer with cinematic nightlife style" aria-label="Search creative portfolios"/></label></div>
   <div className="mt-8"><DiscoveryFilters filters={filters} onToggle={toggleFilter}/></div>
   <p className="mb-7 mt-12 text-sm text-black/50">{results.length} portfolios in New York</p>
   <div className="grid items-start gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{results.map(creative=><CreativeCard key={creative.id} creative={creative} saved={saved.includes(creative.id)} onSave={toggleSaved}/>)}</div>
   {!results.length&&<p className="py-24 text-center text-black/45">No portfolios match that request yet.</p>}
  </section>
 </PageShell>
}