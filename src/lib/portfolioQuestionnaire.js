export const questionnaireKeys = [
  'discipline', 'identity_description', 'aesthetic_direction', 'style_tags',
  'inspirations', 'portfolio_url', 'instagram_url', 'behance_url', 'youtube_url',
  'linkedin_url', 'personal_website_url', 'other_links', 'hero_image'
];

export function questionnaireValues(portfolio = {}) {
  return Object.fromEntries(questionnaireKeys.filter(key => portfolio[key] !== undefined).map(key => [key, portfolio[key]]));
}

const time = value => value ? new Date(value).getTime() || 0 : 0;

export function restoreQuestionnaire(portfolio) {
  const submitted = portfolio.questionnaire_responses?.values || {};
  const current = questionnaireValues(portfolio);
  const values = { ...submitted, ...current };
  const draft = portfolio.questionnaire_draft;
  const stableAt = Math.max(time(portfolio.questionnaire_submitted_at), time(portfolio.portfolio_content_updated_at));
  const draftAt = time(draft?.lastUpdated || portfolio.questionnaire_draft_updated_at);
  const useDraft = draftAt > stableAt && Array.isArray(draft?.dirty_fields);
  if (useDraft) draft.dirty_fields.forEach(key => {
    if (questionnaireKeys.includes(key) && draft.values?.[key] !== undefined) values[key] = draft.values[key];
  });
  return { values, dirtyFields: useDraft ? draft.dirty_fields : [], usedDraft: useDraft };
}

export function cleanPortfolioRecord(record) {
  const { id, created_date, updated_date, created_by_id, created_by, ...data } = record;
  return data;
}