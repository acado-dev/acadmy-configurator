export function activePostCategories<T extends { active: boolean; university_id: string }>(categories: T[], universityId: string) {
  return categories.filter(c => c.active && c.university_id === universityId);
}
export function visibleLearnerCommunities<T extends { active: boolean }>(communities: T[]) { return communities.filter(c => c.active); }
export function communityCounts(id: string, members: { community_id: string }[], posts: { community_id: string }[]) {
  return { members: members.filter(m => m.community_id === id).length, posts: posts.filter(p => p.community_id === id).length };
}
export function canManageUniversity(roles: { role: string; university_id: string | null }[], universityId: string) {
  return roles.some(r => r.role === 'super_admin' || (r.role === 'organization_admin' && r.university_id === universityId));
}
