import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const instruction = String(body.instruction || '').trim().slice(0, 600);
    const current = body.current || {};
    if (!instruction) return Response.json({ error: 'Tell us what to change' }, { status: 400 });
    const prompt = `Update a creator portfolio design system from this instruction: "${instruction}". Current system: ${JSON.stringify(current).slice(0, 3000)}. Preserve all content and return only revised visual tokens. Select coherent values from the allowed enums and valid accessible hex colors. Avoid copying any named website or living artist.`;
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          portfolio_theme: { type: 'string', enum: ['editorial','minimal','bold','raw','playful','cinematic'] },
          background_color: { type: 'string' }, surface_color: { type: 'string' }, text_color: { type: 'string' }, accent_color: { type: 'string' },
          heading_font: { type: 'string', enum: ['editorial','modern','expressive','classic'] }, body_font: { type: 'string', enum: ['modern','humanist','classic'] },
          typography_scale: { type: 'string', enum: ['restrained','balanced','oversized'] }, layout_style: { type: 'string', enum: ['grid','stacked','asymmetric','full_bleed','mixed'] },
          gallery_style: { type: 'string', enum: ['grid','masonry','editorial','full_bleed','mixed'] }, hero_style: { type: 'string', enum: ['split','image_first','type_first','full_bleed'] },
          spacing_style: { type: 'string', enum: ['compact','balanced','generous'] }, border_style: { type: 'string', enum: ['none','fine','strong'] }, animation_style: { type: 'string', enum: ['none','subtle','expressive'] }, mood: { type: 'string' }
        },
        required: ['portfolio_theme','background_color','surface_color','text_color','accent_color','heading_font','body_font','typography_scale','layout_style','gallery_style','hero_style','spacing_style','border_style','animation_style','mood']
      }
    });
    return Response.json({ design: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}