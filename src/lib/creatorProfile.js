import { base44 } from '@/api/base44Client';

export async function loadCreatorProfile() {
  const user = await base44.auth.me();
  const profiles = await base44.entities.CreativeProfile.filter({ user_id: user.id }, '-updated_date', 1);
  return { user, profile: profiles[0] || null };
}

export async function saveCreatorProfile(user, values) {
  await base44.auth.updateMe({ account_type: 'creative' });
  const profiles = await base44.entities.CreativeProfile.filter({ user_id: user.id }, '-updated_date', 1);
  const data = { ...values, user_id: user.id, city: 'NYC' };
  return profiles[0]
    ? base44.entities.CreativeProfile.update(profiles[0].id, data)
    : base44.entities.CreativeProfile.create(data);
}

export async function saveHiringAccount() {
  await base44.auth.updateMe({ account_type: 'hiring' });
}