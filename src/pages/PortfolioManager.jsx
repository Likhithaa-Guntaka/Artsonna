import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import PageShell from '@/components/PageShell';
import CreatorIdentity from '@/components/CreatorIdentity';
import CreatorProfileForm from '@/components/CreatorProfileForm';
import PortfolioNav from '@/components/PortfolioNav';
import { loadCreatorProfile, saveCreatorProfile } from '@/lib/creatorProfile';
import { portfolio as initial } from '@/data/marketplace';

export default function PortfolioManager() {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('portfolioWork') || 'null') || initial);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    loadCreatorProfile().then(({ user, profile }) => {
      setUser(user);
      setProfile(profile);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateProfile = async (values) => {
    const saved = await saveCreatorProfile(user, values);
    setProfile(saved);
    setEditing(false);
  };
  const save = (next) => { setItems(next); localStorage.setItem('portfolioWork', JSON.stringify(next)); };
  const move = (index, direction) => { const next = [...items]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; save(next); };
  const add = (event) => { event.preventDefault(); save([{ id: Date.now().toString(), title, image, category: 'New work' }, ...items]); setTitle(''); setImage(''); setShow(false); };

  if (loading) return <PageShell><div className="flex min-h-[60vh] items-center justify-center">Loading profile…</div></PageShell>;
  if (!profile) return <PageShell><section className="mx-auto min-h-[60vh] max-w-3xl px-5 py-20 text-center"><h1 className="text-4xl font-semibold">Start your creative storefront.</h1><p className="mt-3 text-black/55">Add your identity once, then build your portfolio around it.</p><Link to="/profile" className="mt-7 inline-block rounded-full bg-black px-6 py-3 text-white">Create Profile</Link></section></PageShell>;

  return <PageShell><section className="mx-auto max-w-[1300px] px-5 py-14 lg:px-10">
    <PortfolioNav />
    <div id="profile"><CreatorIdentity profile={profile} onEdit={() => setEditing(!editing)} /></div>
    {editing && <div className="mt-10 bg-white p-6"><CreatorProfileForm profile={profile} onSave={updateProfile} submitLabel="Save Changes" /></div>}
    <div id="portfolio" className="mt-14 flex flex-wrap items-end justify-between gap-5"><div><p className="section-kicker">Portfolio</p><h2 className="text-4xl font-semibold tracking-[-.05em]">Show us what you make.</h2><p className="mt-4 text-black/55">Add, reorder, and choose the work people see first.</p></div><button onClick={() => setShow(!show)} className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-white"><Plus className="h-4 w-4" />Add work</button></div>
    {show && <form onSubmit={add} className="mt-10 grid gap-4 bg-white p-6 sm:grid-cols-2"><label className="field-label">Project title<input required className="form-field" value={title} onChange={e => setTitle(e.target.value)} /></label><label className="field-label">Cover image URL<input required type="url" className="form-field" value={image} onChange={e => setImage(e.target.value)} placeholder="https://…" /></label><button className="rounded-full bg-black px-5 py-3 text-white sm:col-span-2">Add to portfolio</button></form>}
    <div className="mt-12 grid gap-6 sm:grid-cols-2">{items.map((project, index) => <article key={project.id}><div className="relative aspect-[4/3] overflow-hidden bg-stone-200"><Image src={project.image} alt={project.title} className="h-full w-full" /><span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-xs">{index === 0 ? 'Profile cover' : `Position ${index + 1}`}</span><div className="absolute bottom-3 right-3 flex gap-2"><button onClick={() => move(index, -1)} className="rounded-full bg-white p-2" aria-label="Move up"><ArrowUp className="h-4 w-4" /></button><button onClick={() => move(index, 1)} className="rounded-full bg-white p-2" aria-label="Move down"><ArrowDown className="h-4 w-4" /></button><button onClick={() => save(items.filter(item => item.id !== project.id))} className="rounded-full bg-white p-2" aria-label="Delete"><Trash2 className="h-4 w-4" /></button></div></div><div className="flex items-center justify-between pt-3"><div><p className="font-semibold">{project.title}</p><p className="text-sm text-black/50">{project.category}</p></div><button onClick={() => { const nextTitle = prompt('Project title', project.title); if (nextTitle) save(items.map(item => item.id === project.id ? { ...item, title: nextTitle } : item)); }} aria-label="Edit"><Pencil className="h-4 w-4" /></button></div></article>)}</div>
    <div className="mt-16 divide-y divide-black/15 border-y border-black/15"><section id="services" className="py-7"><h2 className="text-2xl font-semibold">Services</h2><p className="mt-2 text-black/55">Manage the services connected to your creative storefront.</p></section><section id="availability" className="py-7"><h2 className="text-2xl font-semibold">Availability</h2><p className="mt-2 text-black/55">{profile.availability||'Add your availability through Edit Profile.'}</p></section><section id="collaborators" className="py-7"><h2 className="text-2xl font-semibold">Collaborators</h2><p className="mt-2 text-black/55">Collaborators credited on your projects will appear here.</p></section><section id="preview" className="py-7"><h2 className="text-2xl font-semibold">Public Profile Preview</h2><p className="mt-2 text-black/55">Your public storefront uses this profile and portfolio information.</p></section></div>
  </section></PageShell>;
}