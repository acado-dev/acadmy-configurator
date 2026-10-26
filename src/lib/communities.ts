import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
export type Community = Database['public']['Tables']['communities']['Row'];
export type Category = Database['public']['Tables']['community_categories']['Row'];
export type Member = Database['public']['Tables']['community_members']['Row'];
export type Post = Database['public']['Tables']['community_posts']['Row'];
export type University = Database['public']['Tables']['community_universities']['Row'];
export type CommunityRole = Database['public']['Tables']['user_roles']['Row'];
export const communityQueryKey = ['community-management'];
export function activePostCategories(categories: Category[], universityId: string) {
  return categories.filter(c => c.active && c.university_id === universityId);
}
export function visibleLearnerCommunities(communities: Community[]) { return communities.filter(c => c.active); }
export function communityCounts(id: string, members: Member[], posts: Post[]) {
  return { members: members.filter(m => m.community_id === id).length, posts: posts.filter(p => p.community_id === id).length };
}
export function canManageUniversity(roles: CommunityRole[], universityId: string) {
  return roles.some(r => r.role === 'super_admin' || (r.role === 'organization_admin' && r.university_id === universityId));
}
export async function fetchCommunityData() {
  const results = await Promise.all([
    supabase.from('communities').select('*'), supabase.from('community_categories').select('*'),
    supabase.from('community_members').select('*'), supabase.from('community_posts').select('*'),
    supabase.from('community_universities').select('*').order('name'),
  ]);
  for (const result of results) if (result.error) throw result.error;
  return { communities: results[0].data ?? [], categories: results[1].data ?? [], members: results[2].data ?? [], posts: results[3].data ?? [], universities: results[4].data ?? [] };
}
export async function resolveCommunityImage(value: string) {
  if (!value) return '';
  if (/^https:\/\//i.test(value)) return value;
  const { data, error } = await supabase.storage.from('community-media').createSignedUrl(value, 3600);
  if (error) return '';
  return data.signedUrl;
}
export function validateThumbnail(file: Pick<File, 'type' | 'size'>) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Select a JPG, PNG or WebP image.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Image must be 10 MB or smaller.');
}
export async function uploadCommunityImage(file: File, universityId: string) {
  validateThumbnail(file);
  const ext = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
  const path = `${universityId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('community-media').upload(path, file);
  if (error) throw error;
  return path;
}
