import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

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
    if (!identity || !profile.display_name || !profile.creative_role) return Response.json({ error: 'Missing creator identity' }, { status: 400 });
    const prompt = `You are the creative director for NYC Creative Hub. Build a distinctive portfolio concept for ${profile.display_name}, a ${profile.creative_role} based in ${profile.neighborhood || 'New York City'}. Their own words: ${identity}. Primary aesthetic: ${aesthetic}. Supporting tags: ${styleTags.join(', ')}. Influences: ${inspirations || 'not provided'}. Existing bio: ${String(profile.short_bio || '').slice(0, 800)}. Services: ${services.map(service => `${service.name}: ${service.description || ''}`).join('; ') || 'not listed'}. Study the attached work when present. Return concise creator-approved copy and a cohesive, technically usable design system. Choose one theme from editorial, minimal, bold, raw, playful, cinematic. Use valid hex colors with strong readability. Never imitate a named living artist directly. Make the result feel like an individual creative website, not a marketplace profile.`;
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      file_urls: fileUrls,
      response_json_schema: {
        type: 'object',
        properties: {
          headline: { type: 'string' }, tagline: { type: 'string' }, about: { type: 'string' },
          capabilities: { type: 'array', items: { type: 'string' } }, generated_sections: { type: 'array', items: { type: 'string' } },
          suggested_categories: { type: 'array', items: { type: 'string' } }, suggested_project_titles: { type: 'array', items: { type: 'string' } },
          service_descriptions: { type: 'array', items: { type: 'string' } }, mood: { type: 'string' },
          portfolio_theme: { type: 'string', enum: ['editorial','minimal','bold','raw','playful','cinematic'] },
          background_color: { type: 'string' }, surface_color: { type: 'string' }, text_color: { type: 'string' }, accent_color: { type: 'string' },
          heading_font: { type: 'string', enum: ['editorial','modern','expressive','classic'] }, body_font: { type: 'string', enum: ['modern','humanist','classic'] },
          typography_scale: { type: 'string', enum: ['restrained','balanced','oversized'] }, layout_style: { type: 'string', enum: ['grid','stacked','asymmetric','full_bleed','mixed'] },
          gallery_style: { type: 'string', enum: ['grid','masonry','editorial','full_bleed','mixed'] }, hero_style: { type: 'string', enum: ['split','image_first','type_first','full_bleed'] },
          spacing_style: { type: 'string', enum: ['compact','balanced','generous'] }, border_style: { type: 'string', enum: ['none','fine','strong'] }, animation_style: { type: 'string', enum: ['none','subtle','expressive'] }
        },
        required: ['headline','tagline','about','capabilities','portfolio_theme','background_color','surface_color','text_color','accent_color','heading_font','body_font','typography_scale','layout_style','gallery_style','hero_style','spacing_style','border_style','animation_style','mood']
      }
    });
    return Response.json({ portfolio: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}