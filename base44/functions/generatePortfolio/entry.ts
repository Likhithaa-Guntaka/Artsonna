import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

function classifyUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'youtu.be' || host.endsWith('youtube.com')) return 'youtube';
    if (host.endsWith('linkedin.com')) return 'linkedin';
    if (host.endsWith('github.com')) return 'github';
    return 'website';
  } catch { return null; }
}

function decodeXml(value = '') {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

function videoIdFromUrl(value = '') {
  try {
    const url = new URL(value);
    if (url.hostname.replace(/^www\./, '') === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || '';
    return url.searchParams.get('v') || url.pathname.match(/\/(?:shorts|embed)\/([\w-]{6,})/)?.[1] || '';
  } catch { return ''; }
}

async function fetchYouTubeChannelVideos(channelUrl) {
  const source = new URL(channelUrl);
  let channelId = source.pathname.match(/\/channel\/(UC[\w-]{20,})/)?.[1] || '';
  if (!channelId) {
    const page = await fetch(channelUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Artsonna/1.0)' } });
    if (!page.ok) return [];
    const html = await page.text();
    channelId = html.match(/"channelId":"(UC[\w-]{20,})"/)?.[1] || html.match(/itemprop="channelId"\s+content="(UC[\w-]{20,})"/)?.[1] || html.match(/\/channel\/(UC[\w-]{20,})/)?.[1] || '';
  }
  if (!channelId) return [];
  const feed = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`);
  if (!feed.ok) return [];
  const xml = await feed.text();
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 8).map(match => {
    const entry = match[1];
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || '';
    const title = decodeXml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] || 'YouTube video');
    const description = decodeXml(entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] || '').slice(0, 700);
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] || '';
    const thumbnail = decodeXml(entry.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1] || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
    return { title, video_url: `https://www.youtube.com/watch?v=${videoId}`, thumbnail_url: thumbnail, description, published_at: published, project_name: '', matched_project_title: '', technologies: [], skills: [] };
  }).filter(video => videoIdFromUrl(video.video_url));
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const profile = body.profile || {};
    const identity = String(body.identityDescription || '').slice(0, 2000);
    const inspirations = String(body.inspirations || '').slice(0, 2000);
    const aesthetic = String(body.aestheticDirection || '').slice(0, 120);
    const styleTags = Array.isArray(body.styleTags) ? body.styleTags.slice(0, 8) : [];
    const services = Array.isArray(body.services) ? body.services.slice(0, 10) : [];
    const fileUrls = Array.isArray(body.fileUrls) ? body.fileUrls.filter(url => typeof url === 'string').slice(0, 12) : [];
    const existingProjects = Array.isArray(body.existingProjects) ? body.existingProjects.slice(0, 20).map(project => ({ title: String(project.title || project.project_title || '').slice(0, 160), description: String(project.description || '').slice(0, 1200), category: String(project.category || '').slice(0, 100) })) : [];
    const existingPortfolio = body.existingPortfolio && typeof body.existingPortfolio === 'object' ? body.existingPortfolio : {};
    const submittedUrls = Array.isArray(body.sourceUrls) ? body.sourceUrls : [];
    const questionnaireUrls = `${identity} ${inspirations}`.match(/https?:\/\/[^\s<>"']+/g) || [];
    const rawUrls = [...submittedUrls, ...questionnaireUrls];
    const sources = [...new Set(rawUrls.filter(url => typeof url === 'string').map(url => url.trim()).filter(Boolean))].slice(0, 10).map(url => ({ url: url.slice(0, 500), platform: classifyUrl(url) })).filter(source => source.platform);
    const youtubeSources = sources.filter(source => source.platform === 'youtube').slice(0, 2);
    const youtubeResults = await Promise.all(youtubeSources.map(source => fetchYouTubeChannelVideos(source.url).catch(() => [])));
    const verifiedYouTubeVideos = [...new Map(youtubeResults.flat().map(video => [videoIdFromUrl(video.video_url), video])).values()].slice(0, 8);
    if (!identity || !profile.display_name || !profile.creative_role) return Response.json({ error: 'Missing creator identity' }, { status: 400 });

    const prompt = `You are the portfolio enrichment and creative-direction system for Artsonna. Build a distinctive portfolio for ${profile.display_name}, a ${profile.creative_role} based in ${profile.neighborhood || 'New York City'}.

SOURCE PRIORITY — mandatory when facts conflict:
1. Explicit questionnaire responses: ${identity}
2. Existing user-edited portfolio: ${JSON.stringify(existingPortfolio).slice(0, 5000)}
3. Verified structured projects: ${JSON.stringify(existingProjects).slice(0, 5000)}
4. Public LinkedIn information
5. Public YouTube and other external sources

Questionnaire context: primary aesthetic ${aesthetic}; supporting tags ${styleTags.join(', ')}; influences ${inspirations || 'not provided'}; existing bio ${String(profile.short_bio || '').slice(0, 800)}; services ${services.map(service => `${service.name}: ${service.description || ''}`).join('; ') || 'not listed'}.
External sources to research only when publicly accessible and permitted: ${JSON.stringify(sources)}.
Verified public YouTube channel videos fetched directly from the submitted channel: ${JSON.stringify(verifiedYouTubeVideos).slice(0, 12000)}. Rank these against the questionnaire and portfolio context, keep only the strongest relevant videos, and preserve their exact verified video and thumbnail URLs.

Follow Detect → Fetch → Extract → Normalize → Match → Rank → Merge → Render. For YouTube channel, profile, playlist, or creator URLs, inspect publicly available videos and return only professional, technical, creative, educational, performance, research, project, or accomplishment-focused videos that materially strengthen this portfolio. Exclude personal, unrelated, repetitive, or weak content. Capture reliable titles, URLs, thumbnails, concise descriptions, dates when useful, technologies, skills, and project associations. Before making a separate video entry, compare names, descriptions, tools, questionnaire details, existing projects, LinkedIn, GitHub, and websites. Set matched_project_title when a video belongs to an existing project, and do not duplicate that project.
For LinkedIn, use only public permitted facts. Contextually summarize useful headline, about, experience, education, skills, certifications, projects, awards, or accomplishments. Do not copy entire descriptions. Include only skills supported by questionnaire, projects, experience, GitHub, videos, or another credible source.
Normalize sources referring to the same project into one enriched_projects entry. Never invent a title, role, project, technology, skill, achievement, video, or URL. Do not add incidental web-search links or markdown links to generated copy. Every returned project, video, profile, repository, or demo URL must be the submitted URL itself or a directly verified public item belonging to that supplied source. Return exactly one source_status entry per supplied source. If a source cannot be accessed, preserve its URL in source_status with status unavailable and generate from the remaining sources without failing. External data supplements and must never overwrite explicit questionnaire facts or stronger existing user edits.
Study attached work when present. Return concise creator-approved copy and a cohesive design system. Choose one theme from editorial, minimal, bold, raw, playful, cinematic; use readable hex colors; never imitate a named living artist; make this an individual website, not a marketplace profile.`;

    const invokeOptions = {
      prompt,
      model: 'gemini_3_flash',
      add_context_from_internet: sources.length > 0,
      file_urls: fileUrls,
      response_json_schema: {
        type: 'object',
        properties: {
          headline: { type: 'string' }, tagline: { type: 'string' }, about: { type: 'string' },
          capabilities: { type: 'array', items: { type: 'string' } }, generated_sections: { type: 'array', items: { type: 'string' } },
          suggested_categories: { type: 'array', items: { type: 'string' } }, suggested_project_titles: { type: 'array', items: { type: 'string' } },
          service_descriptions: { type: 'array', items: { type: 'string' } }, mood: { type: 'string' },
          enriched_projects: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, summary: { type: 'string' }, description: { type: 'string' }, technologies: { type: 'array', items: { type: 'string' } }, skills: { type: 'array', items: { type: 'string' } }, github_url: { type: 'string' }, live_url: { type: 'string' }, youtube_url: { type: 'string' }, thumbnail_url: { type: 'string' }, matched_project_title: { type: 'string' }, professional_context: { type: 'string' } }, required: ['title','summary','description','technologies','skills','github_url','live_url','youtube_url','thumbnail_url','matched_project_title','professional_context'] } },
          featured_videos: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, video_url: { type: 'string' }, thumbnail_url: { type: 'string' }, description: { type: 'string' }, published_at: { type: 'string' }, project_name: { type: 'string' }, matched_project_title: { type: 'string' }, technologies: { type: 'array', items: { type: 'string' } }, skills: { type: 'array', items: { type: 'string' } } }, required: ['title','video_url','thumbnail_url','description','published_at','project_name','matched_project_title','technologies','skills'] } },
          experience: { type: 'array', items: { type: 'object', properties: { role: { type: 'string' }, organization: { type: 'string' }, period: { type: 'string' }, summary: { type: 'string' } }, required: ['role','organization','period','summary'] } },
          education: { type: 'array', items: { type: 'object', properties: { institution: { type: 'string' }, program: { type: 'string' }, period: { type: 'string' } }, required: ['institution','program','period'] } },
          certifications: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, issuer: { type: 'string' }, year: { type: 'string' } }, required: ['name','issuer','year'] } },
          source_status: { type: 'array', items: { type: 'object', properties: { platform: { type: 'string' }, url: { type: 'string' }, status: { type: 'string', enum: ['used','limited','unavailable'] }, summary: { type: 'string' } }, required: ['platform','url','status','summary'] } },
          portfolio_theme: { type: 'string', enum: ['editorial','minimal','bold','raw','playful','cinematic'] },
          background_color: { type: 'string' }, surface_color: { type: 'string' }, text_color: { type: 'string' }, accent_color: { type: 'string' },
          heading_font: { type: 'string', enum: ['editorial','modern','expressive','classic'] }, body_font: { type: 'string', enum: ['modern','humanist','classic'] },
          typography_scale: { type: 'string', enum: ['restrained','balanced','oversized'] }, layout_style: { type: 'string', enum: ['grid','stacked','asymmetric','full_bleed','mixed'] },
          gallery_style: { type: 'string', enum: ['grid','masonry','editorial','full_bleed','mixed'] }, hero_style: { type: 'string', enum: ['split','image_first','type_first','full_bleed'] },
          spacing_style: { type: 'string', enum: ['compact','balanced','generous'] }, border_style: { type: 'string', enum: ['none','fine','strong'] }, animation_style: { type: 'string', enum: ['none','subtle','expressive'] }
        },
        required: ['headline','tagline','about','capabilities','enriched_projects','featured_videos','experience','education','certifications','source_status','portfolio_theme','background_color','surface_color','text_color','accent_color','heading_font','body_font','typography_scale','layout_style','gallery_style','hero_style','spacing_style','border_style','animation_style','mood']
      }
    };
    let result;
    try {
      result = await base44.asServiceRole.integrations.Core.InvokeLLM(invokeOptions);
    } catch (sourceError) {
      if (!sources.length) throw sourceError;
      result = await base44.asServiceRole.integrations.Core.InvokeLLM({ ...invokeOptions, prompt: `${prompt}\nExternal source retrieval was unavailable. Return no external facts, videos, projects, skills, roles, or accomplishments. Mark every supplied source unavailable and complete the portfolio only from questionnaire, existing portfolio, structured projects, and attached work.`, model: 'automatic', add_context_from_internet: false });
    }
    result.source_status = sources.map(source => {
      const reported = Array.isArray(result.source_status) ? result.source_status.find(item => item.url === source.url) : null;
      if (source.platform === 'youtube' && verifiedYouTubeVideos.length) return { platform: 'youtube', url: source.url, status: 'used', summary: `${verifiedYouTubeVideos.length} public channel videos were found and parsed.` };
      return reported ? { ...reported, platform: source.platform, url: source.url } : { platform: source.platform, url: source.url, status: 'unavailable', summary: 'No reliable public information was available.' };
    });
    if (verifiedYouTubeVideos.length) {
      const generatedVideos = Array.isArray(result.featured_videos) ? result.featured_videos : [];
      const ranked = generatedVideos.map(video => {
        const verified = verifiedYouTubeVideos.find(item => videoIdFromUrl(item.video_url) === videoIdFromUrl(video.video_url));
        return verified ? { ...verified, ...video, video_url: verified.video_url, thumbnail_url: verified.thumbnail_url } : null;
      }).filter(Boolean);
      result.featured_videos = ranked.length ? ranked.slice(0, 6) : verifiedYouTubeVideos.slice(0, 6);
    } else if (!sources.some(source => source.platform === 'youtube') || !Array.isArray(result.featured_videos) || !result.featured_videos.length) {
      result.featured_videos = Array.isArray(existingPortfolio.featured_videos) ? existingPortfolio.featured_videos : [];
    }
    if (!sources.some(source => source.platform === 'linkedin')) {
      result.experience = Array.isArray(existingPortfolio.experience) ? existingPortfolio.experience : [];
      result.education = Array.isArray(existingPortfolio.education) ? existingPortfolio.education : [];
      result.certifications = Array.isArray(existingPortfolio.certifications) ? existingPortfolio.certifications : [];
    }
    return Response.json({ portfolio: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}