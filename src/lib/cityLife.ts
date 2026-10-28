import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { sampleCity, validateCity, type CityContent } from './cityLifeRules';
export interface CityRecord { university_id: string; university_name: string; draft: CityContent; published: CityContent | null; saved_at: string; published_at: string | null }
export async function cityAdminScope(requestedId: string | undefined, universityPanel: boolean) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const roles = await supabase.from('user_roles').select('role,university_id').eq('user_id', data.user.id);
  if (roles.error) throw roles.error;
  const admin = roles.data?.find(r => r.role === 'organization_admin' && r.university_id);
  if (universityPanel) return admin?.university_id ?? null;
  if (roles.data?.some(r => r.role === 'super_admin')) return requestedId ?? null;
  return admin?.university_id === requestedId ? requestedId : null;
}
export async function loadCity(id: string): Promise<CityRecord | null> {
  const { data, error } = await supabase.from('university_city_life').select('*').eq('university_id', id).maybeSingle();
  if (error) throw error;
  return data ? { ...data, draft: data.draft as unknown as CityContent, published: data.published as unknown as CityContent | null } : null;
}
export async function saveCity(id: string, name: string, content: CityContent, action: 'draft' | 'publish' | 'unpublish'): Promise<CityRecord> {
  if (action === 'publish') { const errors = validateCity(content); if (errors.length) throw new Error(errors.join('\n')); }
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('A Cloud admin account is required to save City Life.');
  const existing = await loadCity(id);
  const values = { university_name: name, draft: content as unknown as Json, ...(action === 'publish' ? { published: content as unknown as Json } : action === 'unpublish' ? { published: null } : {}) };
  const query = existing ? supabase.from('university_city_life').update(values).eq('university_id',id) : supabase.from('university_city_life').insert({ university_id: id, ...values });
  const { data, error } = await query.select().single();
  if (error) throw error;
  return { ...data, draft: data.draft as unknown as CityContent, published: data.published as unknown as CityContent | null };
}
export async function loadPublishedCity(id: string) {
  const { data, error } = await supabase.rpc('city_life_published', { university: id });
  if (error) throw error;
  const row = data?.[0];
  return row ? { name: row.university_name, content: { ...sampleCity(), ...(row.content as unknown as CityContent) } } : null;
}
export async function cityMediaUrl(value: string) {
  if (!value || value.startsWith('https://') || value.startsWith('/src/')) return value;
  const { data, error } = await supabase.storage.from('city-life-media').createSignedUrl(value, 3600);
  return error ? '' : data.signedUrl;
}
export async function resolveCityMedia(content: CityContent): Promise<CityContent> {
  const next = structuredClone(content);
  [next.hero, next.thumbnail] = await Promise.all([cityMediaUrl(content.hero), cityMediaUrl(content.thumbnail)]);
  await Promise.all(['seasons','places','housing','gallery'].map(async key => { const k = key as 'seasons'|'places'|'housing'|'gallery'; next[k] = await Promise.all(content[k].map(async e => ({ ...e, image: await cityMediaUrl(e.image) }))); }));
  return next;
}