import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { loadCreatorProfile } from '@/lib/creatorProfile';
import { cleanPortfolioRecord, questionnaireKeys, questionnaireValues, restoreQuestionnaire } from '@/lib/portfolioQuestionnaire';

const sections = ['hero','work','projects','videos','about','experience','services','collaborators','contact'];
const designKeys = ['portfolio_theme','background_color','surface_color','text_color','accent_color','heading_font','body_font','typography_scale','layout_style','gallery_style','hero_style','spacing_style','border_style','animation_style','mood'];
const slugify = value => value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

export default function usePortfolioBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [profile,setProfile] = useState(null);
  const [portfolio,setPortfolio] = useState(null);
  const [assets,setAssets] = useState([]);
  const [services,setServices] = useState([]);
  const [projects,setProjects] = useState([]);
  const [collaborators,setCollaborators] = useState([]);
  const [step,setStep] = useState(0);
  const [mode,setMode] = useState('flow');
  const [retaking,setRetaking] = useState(false);
  const [loading,setLoading] = useState(true);
  const [uploading,setUploading] = useState(false);
  const [generating,setGenerating] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const [history,setHistory] = useState([]);
  const [hasUnsavedChanges,setHasUnsavedChanges] = useState(false);
  const portfolioRef = useRef(null);
  const dirtyFieldsRef = useRef(new Set());
  const revisionRef = useRef(0);
  const queueRef = useRef(Promise.resolve());
  const questionnaireActiveRef = useRef(false);
  const hasUnsavedRef = useRef(false);
  const allowNavigationRef = useRef(false);

  useEffect(() => { portfolioRef.current = portfolio; }, [portfolio]);
  useEffect(() => { questionnaireActiveRef.current = mode === 'flow' && step >= 1 && step <= 4; }, [mode,step]);
  useEffect(() => { hasUnsavedRef.current = hasUnsavedChanges; }, [hasUnsavedChanges]);

  const queued = useCallback(task => {
    const run = queueRef.current.then(task, task);
    queueRef.current = run.catch(() => {});
    return run;
  }, []);

  useEffect(() => {
    loadCreatorProfile().then(async ({profile: creator}) => {
      setProfile(creator);
      if (creator) {
        const [portfolios,files,serviceRows,projectRows,collaboratorRows] = await Promise.all([
          base44.entities.Portfolio.filter({creative_profile_id:creator.id},'-updated_date',1),
          base44.entities.PortfolioAsset.filter({profile_id:creator.id},'sort_order'),
          base44.entities.Service.filter({creator_id:creator.id}),
          base44.entities.Project.filter({creator_id:creator.id}),
          base44.entities.ProjectCollaborator.list()
        ]);
        const current = portfolios[0] || null;
        const requestedId = searchParams.get('retake');
        if (requestedId && current?.id === requestedId) {
          const restored = restoreQuestionnaire(current);
          const hydrated = { ...current, ...restored.values };
          setPortfolio(hydrated);
          portfolioRef.current = hydrated;
          dirtyFieldsRef.current = new Set(restored.dirtyFields);
          setRetaking(true);
          setMode('flow');
          setStep(1);
          if (restored.usedDraft) setNotice('Your most recent questionnaire draft was restored.');
        } else {
          setPortfolio(current);
          portfolioRef.current = current;
          if (requestedId && current?.id !== requestedId) setError('This questionnaire is not connected to your portfolio.');
          if (current?.headline) setMode('studio'); else if (current) setStep(1);
        }
        setAssets(files);
        setServices(serviceRows);
        setProjects(projectRows);
        setCollaborators(collaboratorRows.filter(item => projectRows.some(project => project.id === item.project_id)));
      }
      setLoading(false);
    }).catch(e => { setError(e.message || 'Could not load your portfolio.'); setLoading(false); });
  }, []);

  const start = async importMode => {
    if (portfolioRef.current) { await retake(); return; }
    const created = await base44.entities.Portfolio.create({creative_profile_id:profile.id,discipline:profile.creative_role,style_tags:profile.style_tags||[],status:'draft',public_slug:slugify(profile.display_name),portfolio_theme:'editorial',background_color:'#F7F5F0',surface_color:'#FFFFFF',text_color:'#111111',accent_color:'#111111',heading_font:'editorial',body_font:'modern',typography_scale:'balanced',layout_style:'asymmetric',gallery_style:'editorial',hero_style:'split',spacing_style:'generous',border_style:'fine',animation_style:'subtle',portfolio_section_order:sections,hidden_sections:[]});
    if (assets.length) {
      await base44.entities.PortfolioAsset.bulkUpdate(assets.map(item => ({id:item.id,portfolio_id:created.id})));
      setAssets(current => current.map(item => ({...item,portfolio_id:created.id})));
    }
    setPortfolio(created); portfolioRef.current = created; setStep(1); setMode('flow');
    if (importMode) setTimeout(() => document.getElementById('existing-presence')?.scrollIntoView({behavior:'smooth'}),100);
  };

  const changePortfolio = change => {
    setPortfolio(current => { const next = {...current,...change}; portfolioRef.current = next; return next; });
    if (questionnaireActiveRef.current) {
      const changed = Object.keys(change).filter(key => questionnaireKeys.includes(key));
      if (changed.length) {
        changed.forEach(key => dirtyFieldsRef.current.add(key));
        revisionRef.current += 1;
        setHasUnsavedChanges(true);
        setNotice('Saving questionnaire draft…');
      }
    }
  };

  const flushDraft = useCallback(async () => {
    const current = portfolioRef.current;
    if (!current?.id || !dirtyFieldsRef.current.size || !hasUnsavedRef.current) return true;
    const revision = revisionRef.current;
    const dirtyFields = [...dirtyFieldsRef.current];
    const allValues = questionnaireValues(current);
    const values = Object.fromEntries(dirtyFields.filter(key => allValues[key] !== undefined).map(key => [key,allValues[key]]));
    const lastUpdated = new Date().toISOString();
    const draft = { values, dirty_fields:dirtyFields, lastUpdated };
    try {
      await queued(() => base44.entities.Portfolio.update(current.id,{questionnaire_draft:draft,questionnaire_draft_updated_at:lastUpdated}));
      setPortfolio(latest => { const next = {...latest,questionnaire_draft:draft,questionnaire_draft_updated_at:lastUpdated}; portfolioRef.current = next; return next; });
      if (revisionRef.current === revision) setHasUnsavedChanges(false);
      setNotice('Questionnaire draft saved automatically.');
      setError('');
      return true;
    } catch (e) {
      setError('Your recent questionnaire changes could not be auto-saved. Please retry before leaving.');
      setHasUnsavedChanges(true);
      return false;
    }
  }, [queued]);

  useEffect(() => {
    if (!questionnaireActiveRef.current || !hasUnsavedChanges) return;
    const timer = setTimeout(flushDraft,900);
    return () => clearTimeout(timer);
  }, [portfolio,hasUnsavedChanges,flushDraft]);

  useEffect(() => {
    const beforeUnload = event => {
      if (!hasUnsavedRef.current) return;
      flushDraft();
      event.preventDefault();
      event.returnValue = '';
    };
    const interceptLink = event => {
      if (allowNavigationRef.current || !hasUnsavedRef.current) return;
      const anchor = event.target.closest?.('a[href]');
      if (!anchor) return;
      const url = new URL(anchor.href,window.location.href);
      if (url.origin !== window.location.origin || (url.pathname === window.location.pathname && url.hash)) return;
      event.preventDefault(); event.stopImmediatePropagation();
      flushDraft().then(saved => {
        if (saved || window.confirm('Your latest questionnaire changes could not be saved. Leave without them?')) {
          allowNavigationRef.current = true;
          navigate(`${url.pathname}${url.search}${url.hash}`);
          setTimeout(() => { allowNavigationRef.current = false; },0);
        }
      });
    };
    window.addEventListener('beforeunload',beforeUnload);
    document.addEventListener('click',interceptLink,true);
    return () => { window.removeEventListener('beforeunload',beforeUnload); document.removeEventListener('click',interceptLink,true); if (hasUnsavedRef.current) flushDraft(); };
  }, [flushDraft,navigate]);

  const persist = async (change = {}) => {
    const current = {...portfolioRef.current,...change};
    const now = new Date().toISOString();
    const data = cleanPortfolioRecord({...current,portfolio_content_updated_at:now});
    await queued(() => base44.entities.Portfolio.update(current.id,data));
    const next = {...current,portfolio_content_updated_at:now};
    setPortfolio(next); portfolioRef.current = next;
    return next;
  };

  const go = async next => { await flushDraft(); setStep(next); };
  const saveIdentity = async next => { await base44.entities.CreativeProfile.update(profile.id,{creative_role:portfolioRef.current.discipline}); setProfile(current=>({...current,creative_role:portfolioRef.current.discipline})); await go(next); };

  const retake = async () => {
    setError(''); setNotice('');
    const fresh = await base44.entities.Portfolio.get(portfolioRef.current.id);
    if (fresh.creative_profile_id !== profile.id) { setError('This questionnaire is not connected to your portfolio.'); return; }
    const restored = restoreQuestionnaire(fresh);
    const next = {...fresh,...restored.values};
    setPortfolio(next); portfolioRef.current = next;
    dirtyFieldsRef.current = new Set(restored.dirtyFields);
    setRetaking(true); setMode('flow'); setStep(1);
    if (restored.usedDraft) setNotice('Your most recent questionnaire draft was restored.');
  };

  const submitQuestionnaire = async () => {
    const current = portfolioRef.current;
    const values = questionnaireValues(current);
    const submittedAt = new Date().toISOString();
    const update = {...values,questionnaire_responses:{values,lastUpdated:submittedAt},questionnaire_submitted_at:submittedAt,questionnaire_draft:null,questionnaire_draft_updated_at:null,portfolio_content_updated_at:submittedAt};
    await queued(() => base44.entities.Portfolio.update(current.id,update));
    const next = {...current,...update};
    setPortfolio(next); portfolioRef.current = next;
    dirtyFieldsRef.current = new Set(); revisionRef.current += 1; setHasUnsavedChanges(false);
    return next;
  };

  const uploadFiles = async (files,kind='work') => {
    const accepted = [...files].filter(file=>file.type.startsWith('image/')||file.type.startsWith('video/')||file.type.startsWith('audio/')||/\.(mp3|wav|m4a|aac|ogg|flac|pdf|ai|psd|indd)$/i.test(file.name));
    if (!accepted.length) return;
    setUploading(true); setError('');
    try {
      const uploaded = await Promise.all(accepted.slice(0,20).map(file=>base44.integrations.Core.UploadFile({file}).then(({file_url})=>({profile_id:profile.id,portfolio_id:portfolioRef.current.id,file_url,file_name:file.name,media_type:file.type.startsWith('image/')?'image':file.type.startsWith('video/')?'video':file.type.startsWith('audio/')||/\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(file.name)?'audio':'file',asset_kind:kind,selected:kind==='work',featured:false,sort_order:assets.length,visibility:'draft'}))));
      const created = await base44.entities.PortfolioAsset.bulkCreate(uploaded.map((item,index)=>({...item,sort_order:assets.length+index})));
      setAssets(current=>[...current,...created]);
    } catch(e) { setError(e.message||'Upload failed.'); } finally { setUploading(false); }
  };

  const changeAsset = async (id,change) => { setAssets(current=>current.map(item=>item.id===id?{...item,...change}:item)); await base44.entities.PortfolioAsset.update(id,change); };
  const removeAsset = async id => { await base44.entities.PortfolioAsset.delete(id); setAssets(current=>current.filter(item=>item.id!==id)); };
  const moveAsset = async (index,direction,kind='work') => { const group=assets.filter(item=>item.asset_kind===kind);const target=index+direction;if(target<0||target>=group.length)return;const next=[...group];[next[index],next[target]]=[next[target],next[index]];const updates=next.map((item,i)=>({id:item.id,sort_order:i}));await base44.entities.PortfolioAsset.bulkUpdate(updates);setAssets(current=>current.map(item=>({...item,sort_order:updates.find(row=>row.id===item.id)?.sort_order??item.sort_order})).sort((a,b)=>a.sort_order-b.sort_order)); };

  const generate = async () => {
    setStep(5); setGenerating(true); setSaving(true); setError(''); setNotice('');
    try {
      const current = await submitQuestionnaire();
      const work=assets.filter(item=>item.asset_kind==='work'&&item.selected);
      const sourceUrls=[current.youtube_url,current.linkedin_url,current.portfolio_url,current.personal_website_url,current.behance_url,...(Array.isArray(current.other_links)?current.other_links:[])].filter(Boolean);
      const existingPortfolio={headline:current.headline,tagline:current.tagline,about:current.about,capabilities:current.capabilities,enriched_projects:current.enriched_projects,featured_videos:current.featured_videos,experience:current.experience,education:current.education,certifications:current.certifications};
      const existingProjects=projects.map(project=>({title:project.title||project.project_title,description:project.description,category:project.category}));
      const response=await base44.functions.invoke('generatePortfolio',{profile,identityDescription:current.identity_description,aestheticDirection:current.aesthetic_direction,styleTags:current.style_tags,inspirations:current.inspirations,services,fileUrls:work.filter(item=>item.media_type==='image').map(item=>item.file_url),sourceUrls,existingPortfolio,existingProjects});
      const generated=response.data.portfolio;
      const hero=current.hero_image||work.find(item=>item.media_type==='image')?.file_url||'';
      const preservedDesign=Object.fromEntries(designKeys.map(key=>[key,current[key]]));
      const next={...generated,...preservedDesign,hero_image:hero,portfolio_section_order:current.portfolio_section_order||sections,hidden_sections:current.hidden_sections||[],design_tokens:current.design_tokens||preservedDesign,status:current.status,public_slug:current.public_slug,published_at:current.published_at};
      await persist(next);
      setRetaking(false); setMode('studio'); setNotice('Changes saved successfully.');
      const returnTo=searchParams.get('returnTo');
      if (returnTo?.startsWith('/portfolio/')) { allowNavigationRef.current=true; navigate(`${returnTo}${returnTo.includes('?')?'&':'?'}saved=1`); }
    } catch(e) { setError(e.response?.data?.error||e.message||'Saving failed. Your answers are still here—please try again.'); setStep(4); } finally { setGenerating(false); setSaving(false); }
  };

  const applyDesign=async instruction=>{setSaving(true);setError('');try{setHistory(current=>[...current.slice(-4),Object.fromEntries(designKeys.map(key=>[key,portfolioRef.current[key]]))]);const current=Object.fromEntries(designKeys.map(key=>[key,portfolioRef.current[key]]));const response=await base44.functions.invoke('updatePortfolioStyle',{instruction,current});await persist({...response.data.design,design_tokens:response.data.design})}catch(e){setError(e.response?.data?.error||e.message)}finally{setSaving(false)}};
  const undo=async()=>{if(!history.length)return;const previous=history[history.length-1];setHistory(current=>current.slice(0,-1));await persist({...previous,design_tokens:previous})};
  const save=async publish=>{setSaving(true);setError('');setNotice('');try{const current=portfolioRef.current;const status=publish?'published':'draft';const published_at=publish?new Date().toISOString():current.published_at;const design_tokens=Object.fromEntries(designKeys.map(key=>[key,current[key]]));await persist({status,published_at,design_tokens});if(assets.length)await base44.entities.PortfolioAsset.bulkUpdate(assets.map(item=>({id:item.id,visibility:publish&&item.asset_kind!=='reference'?'published':'draft'})));const portfolio_images=assets.filter(item=>item.asset_kind!=='reference'&&item.selected&&item.media_type==='image').sort((a,b)=>a.sort_order-b.sort_order).slice(0,8).map(item=>item.file_url);const cover_image=current.hero_image||portfolio_images[0]||profile.cover_image||profile.profile_photo;await base44.entities.CreativeProfile.update(profile.id,{portfolio_status:status,marketplace_eligible:publish,cover_image,portfolio_images,hero_image:current.hero_image,portfolio_theme:current.portfolio_theme,background_color:current.background_color,text_color:current.text_color,accent_color:current.accent_color,typography_style:current.heading_font,typography_mood:current.mood,layout_style:current.layout_style,public_portfolio_slug:current.public_slug});setProfile(value=>({...value,portfolio_status:status,marketplace_eligible:publish}));setNotice(publish?'Published':'Changes saved successfully.')}catch(e){setError(e.message||'Could not save your portfolio.');throw e}finally{setSaving(false)}};

  return {profile,portfolio,assets,services,projects,collaborators,step,mode,retaking,loading,uploading,generating,saving,error,notice,history,hasUnsavedChanges,start,setMode,changePortfolio,persist,go,saveIdentity,retake,flushDraft,uploadFiles,changeAsset,removeAsset,moveAsset,generate,applyDesign,undo,save};
}