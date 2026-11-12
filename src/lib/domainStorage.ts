import { deletionBlock, validateDomain, validateMapping, type ContentMapping, type DomainRecord } from './domainRules';
export * from './domainRules';
const KEY = 'acado_domains';
const MAP_KEY = 'acado_domain_mappings';
export function readArray<T>(key: string): T[] {
  try { const data = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(data) ? data : []; } catch { return []; }
}
export function getDomains(): DomainRecord[] {
  if (!localStorage.getItem(KEY)) {
    const createdAt = '2026-11-01T09:00:00Z';
    const make = (id: string, name: string, description: string, universityId = '', parentId?: string, active = true): DomainRecord => ({ id, name, description, universityId, parentId, active, image: '', createdAt, createdBy: 'Super Admin' });
    localStorage.setItem(KEY, JSON.stringify([
      make('dom-technology', 'Technology', 'Computing, digital innovation and engineering.'),
      make('dom-business', 'Business & Management', 'Leadership, entrepreneurship and global business.'),
      make('dom-health', 'Health & Wellbeing', 'Healthcare, wellbeing and human sciences.'),
      make('dom-arts', 'Arts & Design', 'Creative practice and design.', '', undefined, false),
      make('sub-ai', 'Artificial Intelligence', 'Machine learning and intelligent systems.', '', 'dom-technology'),
      make('sub-software', 'Software Development', 'Programming and software engineering.', '', 'dom-technology'),
      make('sub-leadership', 'Leadership', 'Management and organisational development.', '', 'dom-business'),
      make('sub-entrepreneurship', 'Entrepreneurship', 'Startups and business innovation.', '', 'dom-business'),
      make('dom-jamk', 'Applied Sciences', 'Industry-focused learning at JAMK.', 'u-jamk'),
      make('sub-jamk', 'Sustainable Engineering', 'Sustainable systems and engineering practice.', 'u-jamk', 'dom-jamk'),
    ]));
  }
  return readArray(KEY);
}
export function domainUniversities(): { id: string; name: string }[] {
  const records = [...readArray<{id: string; name: string}>('acado_universities'), ...readArray<{id: string; name: string}>('universities')];
  const admin = getDomainAdmin();
  if (admin.universityId) records.push({ id: admin.universityId, name: admin.universityName || admin.universityId });
  records.push({ id: 'u-jamk', name: 'JAMK University of Applied Sciences' });
  return [...new Map(records.filter(r => r.id && r.name).map(r => [r.id, r])).values()];
}
export function getDomainAdmin(): { universityId?: string; universityName?: string } {
  try { return JSON.parse(localStorage.getItem('universityAdmin') || '{}') || {}; } catch { return {}; }
}
export const CONTENT_SOURCES = [
  { type: 'course', key: 'courses', label: 'Course', edit: (id: string) => `/courses/edit/${id}` },
  { type: 'university-course', key: 'universityCourses', label: 'Course', edit: (id: string) => `/university/courses/${id}/edit` },
  { type: 'event', key: 'events', label: 'Event', edit: (id: string) => `/events/edit/${id}` },
  { type: 'post', key: 'communityPosts', label: 'Post', edit: (id: string) => `/communities/edit/${id}` },
  { type: 'wall', key: 'wallPosts', label: 'Wall post', edit: (id: string) => `/wall/edit/${id}` },
  { type: 'job', key: 'jobOpportunities', label: 'Job / Internship', edit: (id: string) => `/jobs/${id}/edit` },
] as const;
type Content = { id: string; name?: string; title?: string; description?: string; organizationId?: string; universityId?: string };
export function getMappings(): ContentMapping[] {
  return readArray<ContentMapping>(MAP_KEY).filter(m => {
    const source = CONTENT_SOURCES.find(s => s.type === m.contentType);
    return source && readArray<Content>(source.key).some(c => c.id === m.contentId);
  });
}
export function readMapping(contentType: string, contentId: string): ContentMapping | undefined {
  return getMappings().find(m => m.contentType === contentType && m.contentId === contentId);
}
export function saveMapping(mapping: ContentMapping): void {
  const records = getDomains();
  const error = validateMapping(records, mapping, readMapping(mapping.contentType, mapping.contentId));
  if (error) throw new Error(error);
  const next = getMappings().filter(m => m.contentType !== mapping.contentType || m.contentId !== mapping.contentId);
  if (mapping.domainId) next.push(mapping);
  localStorage.setItem(MAP_KEY, JSON.stringify(next));
}
export function saveDomain(record: DomainRecord): void {
  const records = getDomains();
  const error = validateDomain(record, records, getMappings());
  if (error) throw new Error(error);
  localStorage.setItem(KEY, JSON.stringify([...records.filter(r => r.id !== record.id), { ...record, name: record.name.trim(), description: record.description.trim() }]));
}
export function deleteDomain(id: string): void {
  const records = getDomains(); const record = records.find(r => r.id === id);
  if (!record) return;
  const error = deletionBlock(record, records, getMappings());
  if (error) throw new Error(error);
  localStorage.setItem(KEY, JSON.stringify(records.filter(r => r.id !== id)));
}
export function mappedContent(mapping: ContentMapping) {
  const source = CONTENT_SOURCES.find(s => s.type === mapping.contentType);
  const content = source ? readArray<Content>(source.key).find(c => c.id === mapping.contentId) : undefined;
  return { title: content?.name || content?.title || content?.description?.slice(0, 80) || mapping.contentId, type: source?.label || mapping.contentType, url: source?.edit(mapping.contentId) };
}