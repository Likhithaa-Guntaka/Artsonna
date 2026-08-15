import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/PageShell';
import CreatorProfileForm from '@/components/CreatorProfileForm';
import { loadCreatorProfile, saveCreatorProfile, saveHiringAccount } from '@/lib/creatorProfile';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCreatorProfile()
      .then(({ user, profile }) => {
        if (user.account_type === 'creative' && profile) {
          navigate('/portfolio', { replace: true });
          return;
        }
        setUser(user);
        setType(user.account_type || '');
        setLoading(false);
      })
      .catch(() => base44.auth.redirectToLogin(window.location.href));
  }, [navigate]);

  const saveCreative = async (values) => {
    await saveCreatorProfile(user, values);
    localStorage.setItem('accountType', 'creative');
    navigate('/portfolio', { replace: true });
  };

  const continueHiring = async () => {
    setError('');
    try {
      await saveHiringAccount();
      localStorage.setItem('accountType', 'hiring');
      navigate('/discover', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to save your account type.');
    }
  };

  if (loading) return <PageShell><div className="flex min-h-[60vh] items-center justify-center">Loading…</div></PageShell>;

  return <PageShell><section className="mx-auto max-w-4xl px-5 py-10">
    <p className="section-kicker">Your account</p>
    <h1 className="text-5xl font-semibold tracking-[-.05em]">What brings you here?</h1>
    <div className="mt-7 grid gap-4 sm:grid-cols-2">
      <button onClick={() => setType('creative')} className={`p-6 text-left transition ${type === 'creative' ? 'bg-black text-white' : 'border border-black/20 bg-white'}`}><p className="text-2xl font-semibold">I’m a Creative</p><p className="mt-3 opacity-60">Showcase my work, find opportunities, and connect with other creatives.</p></button>
      <button onClick={() => setType('hiring')} className={`p-6 text-left transition ${type === 'hiring' ? 'bg-black text-white' : 'border border-black/20 bg-white'}`}><p className="text-2xl font-semibold">I’m Hiring</p><p className="mt-3 opacity-60">Discover and hire creative talent for a project.</p></button>
    </div>
    {type === 'creative' && <div className="mt-8"><CreatorProfileForm onSave={saveCreative} /></div>}
    {type === 'hiring' && <div className="mt-8"><button onClick={continueHiring} className="w-full rounded-full bg-black px-6 py-3 text-white">Continue as Hiring</button>{error && <p className="mt-3 text-sm text-red-700">{error}</p>}</div>}
  </section></PageShell>;
}