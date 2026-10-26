import campusImage from '@/assets/courses/business-informatics.jpg';
import careerImage from '@/assets/courses/business-leadership.jpg';
import artsImage from '@/assets/courses/creativity-arts.jpg';
import type { Category, Community, Member, Post, University } from './communities';
export const COMMUNITY_PROTOTYPE_KEY = 'acado_community_prototype_v1';
export type Candidate = { user_id: string; display_name: string; university_id: string };
export type CommunityData = { universities: University[]; communities: Community[]; categories: Category[]; members: Member[]; posts: Post[]; candidates: Candidate[] };
function localAccount(key: string): Record<string, unknown> {
  try { const value = JSON.parse(localStorage.getItem(key) || '{}'); return value && typeof value === 'object' ? value : {}; } catch { return {}; }
}
export function prototypeUniversity() {
  const account = localAccount('universityAdmin');
  return { id: typeof account.universityId === 'string' && account.universityId ? account.universityId : 'u-jamk', name: typeof account.universityName === 'string' && account.universityName ? account.universityName : 'JAMK University of Applied Sciences' };
}
export function seedCommunityData(universities: University[]): CommunityData {
  const categories: Category[] = []; const communities: Community[] = []; const candidates: Candidate[] = []; const members: Member[] = []; const posts: Post[] = [];
  const date = '2026-10-20T09:00:00.000Z';
  for (const university of universities) {
    const topics = ['Campus Life', 'Induction', 'Academics', 'Career', 'Alumni'];
    topics.forEach((name, index) => categories.push({ id: `${university.id}-cat-${index}`, university_id: university.id, name, description: ['Campus updates, clubs and student life.', 'Orientation and support for new students.', 'Study groups, coursework and academic discussions.', 'Internships, career advice and professional connections.', 'Alumni experiences and mentoring.'][index], active: index !== 4, created_at: date }));
    ['Aisha Khan', 'Daniel Mensah', 'Mei Lin', 'Sofia Patel', 'Alex Morgan'].forEach((name, i) => candidates.push({ user_id: `${university.id}-learner-${i}`, display_name: name, university_id: university.id }));
    ['Campus Connect', 'Career & Internships', 'New Student Induction'].forEach((name, index) => {
      const id = `${university.id}-community-${index}`;
      const catId = `${university.id}-cat-${[0, 3, 1][index]}`;
      communities.push({ id, university_id: university.id, category_id: catId, name, description: ['Connect with students, discover clubs and share campus experiences.', 'Explore internship opportunities, exchange career advice and prepare for your next step.', 'Orientation updates and a welcoming space for incoming students.'][index], thumbnail: [campusImage, careerImage, artsImage][index], active: index !== 2, created_at: date });
      const roster = candidates.filter(c => c.university_id === university.id).slice(0, index === 0 ? 3 : 2);
      roster.forEach((c, i) => members.push({ id: `${id}-member-${i}`, community_id: id, user_id: c.user_id, display_name: c.display_name, joined_at: date }));
      const titles = index === 0 ? ['Welcome to Campus Connect', 'Student clubs meet-up'] : index === 1 ? ['Internship preparation workshop', 'Share your career goals'] : ['Orientation checklist'];
      titles.forEach((title, i) => { const author = roster[i % roster.length]; if (!author) return; posts.push({ id: `${id}-post-${i}`, community_id: id, category_id: catId, author_id: author.user_id, author_name: author.display_name, title, body: ['Introduce yourself and connect with other students. What are you looking forward to this semester?', 'Join the discussion and share your questions, experiences and ideas with the community.'][i % 2], created_at: date }); });
    });
  }
  return { universities, categories, communities, candidates, members, posts };
}
export function readCommunityPrototype(): CommunityData {
  let data: CommunityData | null = null;
  try { const parsed = JSON.parse(localStorage.getItem(COMMUNITY_PROTOTYPE_KEY) || 'null'); if (parsed && ['universities','communities','categories','members','posts','candidates'].every(k => Array.isArray(parsed[k]))) data = parsed; } catch { /* Initialize an isolated prototype store. */ }
  const assigned = prototypeUniversity();
  if (!data) {
    let existing: University[] = [];
    try { const raw = JSON.parse(localStorage.getItem('acado_universities') || '[]'); if (Array.isArray(raw)) existing = raw.filter(u => typeof u?.id === 'string' && typeof u?.name === 'string').map(u => ({ id: u.id, name: u.name })); } catch { /* Demo universities are available below. */ }
    const universities = [{ id: 'u-jamk', name: 'JAMK University of Applied Sciences' }, { id: 'u-harvard', name: 'Harvard University' }, ...existing, assigned];
    data = seedCommunityData([...new Map(universities.map(u => [u.id, u])).values()]);
    writeCommunityPrototype(data);
  }
  if (!data.universities.some(u => u.id === assigned.id)) {
    const extra = seedCommunityData([assigned]);
    for (const key of ['universities','communities','categories','members','posts','candidates'] as const) (data[key] as unknown[]).push(...extra[key]);
    writeCommunityPrototype(data);
  }
  return data;
}
export function writeCommunityPrototype(data: CommunityData) { localStorage.setItem(COMMUNITY_PROTOTYPE_KEY, JSON.stringify(data)); }
function validateName(name: string, max: number) { if (!name.trim() || name.trim().length > max) throw new Error(`Enter a name of 1–${max} characters.`); }
export async function savePrototypeCommunity(fields: Pick<Community,'name'|'description'|'university_id'|'category_id'|'active'|'thumbnail'>, id?: string) {
  const data = readCommunityPrototype(); validateName(fields.name, 150);
  if (data.communities.some(c => c.id !== id && c.university_id === fields.university_id && c.name.trim().toLowerCase() === fields.name.trim().toLowerCase())) throw new Error('A community with this name already exists.');
  const category = data.categories.find(c => c.id === fields.category_id && c.university_id === fields.university_id);
  const previous = data.communities.find(c => c.id === id);
  if (!category || (!category.active && previous?.category_id !== category.id)) throw new Error('Select an active category from this university.');
  const item: Community = { ...fields, name: fields.name.trim(), id: id ?? crypto.randomUUID(), created_at: previous?.created_at ?? new Date().toISOString() };
  data.communities = previous ? data.communities.map(c => c.id === id ? item : c) : [...data.communities, item]; writeCommunityPrototype(data);
}
export async function deletePrototypeCommunity(id: string) {
  const data = readCommunityPrototype(); data.communities = data.communities.filter(c => c.id !== id); data.members = data.members.filter(m => m.community_id !== id); data.posts = data.posts.filter(p => p.community_id !== id); writeCommunityPrototype(data);
}
export async function setPrototypeCommunityStatus(id: string, active: boolean) { const data = readCommunityPrototype(); data.communities = data.communities.map(c => c.id === id ? { ...c, active } : c); writeCommunityPrototype(data); }
export async function savePrototypeCategory(fields: Pick<Category,'name'|'description'|'university_id'|'active'>, id?: string) {
  const data = readCommunityPrototype(); validateName(fields.name, 100);
  if (!data.universities.some(u => u.id === fields.university_id)) throw new Error('Select a university.');
  if (data.categories.some(c => c.id !== id && c.university_id === fields.university_id && c.name.trim().toLowerCase() === fields.name.trim().toLowerCase())) throw new Error('A category with this name already exists.');
  const previous = data.categories.find(c => c.id === id); const item: Category = { ...fields, name: fields.name.trim(), id: id ?? crypto.randomUUID(), created_at: previous?.created_at ?? new Date().toISOString() };
  data.categories = previous ? data.categories.map(c => c.id === id ? item : c) : [...data.categories, item]; writeCommunityPrototype(data);
}
export async function deletePrototypeCategory(id: string) { const data = readCommunityPrototype(); if (data.posts.some(p => p.category_id === id) || data.communities.some(c => c.category_id === id)) throw new Error('This category is in use. Deactivate it instead.'); data.categories = data.categories.filter(c => c.id !== id); writeCommunityPrototype(data); }
export async function getPrototypeCandidates(universityId: string) { return readCommunityPrototype().candidates.filter(c => c.university_id === universityId); }
export async function addPrototypeMember(communityId: string, userId: string) {
  const data = readCommunityPrototype(); const community = data.communities.find(c => c.id === communityId); const candidate = data.candidates.find(c => c.user_id === userId && c.university_id === community?.university_id);
  if (!candidate) throw new Error('Select a learner from this university.');
  if (data.members.some(m => m.community_id === communityId && m.user_id === userId)) throw new Error('This learner is already a member.');
  data.members.push({ id: crypto.randomUUID(), community_id: communityId, user_id: userId, display_name: candidate.display_name, joined_at: new Date().toISOString() }); writeCommunityPrototype(data);
}
export async function removePrototypeMember(id: string) { const data = readCommunityPrototype(); data.members = data.members.filter(m => m.id !== id); writeCommunityPrototype(data); }
export async function deletePrototypePost(id: string) { const data = readCommunityPrototype(); data.posts = data.posts.filter(p => p.id !== id); writeCommunityPrototype(data); }
export async function createPrototypePost(fields: Omit<Post,'id'|'created_at'>) {
  const data = readCommunityPrototype(); const community = data.communities.find(c => c.id === fields.community_id && c.active); const category = data.categories.find(c => c.id === fields.category_id && c.active && c.university_id === community?.university_id);
  if (!community || !category) throw new Error('Select an active community and category.');
  validateName(fields.title, 200);
  data.posts.push({ ...fields, id: crypto.randomUUID(), created_at: new Date().toISOString() }); writeCommunityPrototype(data);
}
