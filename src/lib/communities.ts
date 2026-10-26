import { readCommunityPrototype } from './communityPrototype';
import type { Database } from '@/integrations/supabase/types';
export type Community = Database['public']['Tables']['communities']['Row'];
export type Category = Database['public']['Tables']['community_categories']['Row'];
export type Member = Database['public']['Tables']['community_members']['Row'];
export type Post = Database['public']['Tables']['community_posts']['Row'];
export type University = Database['public']['Tables']['community_universities']['Row'];
export type CommunityRole = Database['public']['Tables']['user_roles']['Row'];
export const communityQueryKey = ['community-management'];
export { activePostCategories, visibleLearnerCommunities, communityCounts, canManageUniversity } from './communityRules';
export async function fetchCommunityData() { return readCommunityPrototype(); }
export async function resolveCommunityImage(value: string) { return value; }
export function validateThumbnail(file: Pick<File, 'type' | 'size'>) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Select a JPG, PNG or WebP image.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Image must be 10 MB or smaller.');
}
export async function uploadCommunityImage(file: File, universityId: string) {
  validateThumbnail(file);
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read image.'));
    reader.readAsDataURL(file);
  });
}
