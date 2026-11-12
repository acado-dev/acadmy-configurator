export interface DomainRecord {
  id: string;
  name: string;
  description: string;
  image: string;
  active: boolean;
  universityId: string;
  parentId?: string;
  createdAt: string;
  createdBy: string;
}
export interface ContentMapping {
  contentType: string;
  contentId: string;
  universityId: string;
  domainId: string;
  subdomainId: string;
}
export const availableDomains = (records: DomainRecord[], scope: string) => records.filter(r => !r.parentId && r.active && (!r.universityId || r.universityId === scope));
export const availableSubdomains = (records: DomainRecord[], parentId: string) => records.filter(r => r.parentId === parentId && r.active && records.some(p => p.id === parentId && p.active && !p.parentId));
export function validateMapping(records: DomainRecord[], mapping: ContentMapping, previous?: ContentMapping): string {
  if (!mapping.domainId) return mapping.subdomainId ? 'Select a parent domain first.' : '';
  const domain = records.find(r => r.id === mapping.domainId && !r.parentId);
  if (!domain || (domain.universityId && domain.universityId !== mapping.universityId)) return 'This domain is not available for this university.';
  const unchanged = previous?.domainId === mapping.domainId && previous?.subdomainId === mapping.subdomainId;
  if (!domain.active && !unchanged) return 'Only active domains can be used for new mappings.';
  if (mapping.subdomainId) {
    const sub = records.find(r => r.id === mapping.subdomainId && r.parentId === domain.id);
    if (!sub) return 'The sub-domain must belong to the selected domain.';
    if (!sub.active && !unchanged) return 'Only active sub-domains can be used for new mappings.';
  }
  return '';
}
export function deletionBlock(record: DomainRecord, records: DomainRecord[], mappings: ContentMapping[]): string {
  if (mappings.some(m => m.domainId === record.id || m.subdomainId === record.id)) return 'This item has mapped content. Reassign or remove its content mappings before deleting.';
  if (records.some(r => r.parentId === record.id)) return 'This domain has sub-domains. Reassign or delete them before deleting the domain.';
  return '';
}
export function validateDomain(record: DomainRecord, records: DomainRecord[], mappings: ContentMapping[]): string {
  if (!record.name.trim()) return 'Name is required.';
  if (records.some(r => r.id !== record.id && r.universityId === record.universityId && r.parentId === record.parentId && r.name.trim().toLowerCase() === record.name.trim().toLowerCase())) return 'A record with this name already exists.';
  const old = records.find(r => r.id === record.id);
  if (old && old.universityId !== record.universityId && (records.some(r => r.parentId === record.id) || mappings.some(m => m.domainId === record.id || m.subdomainId === record.id))) return 'University cannot change while sub-domains or content are mapped.';
  if (record.parentId) {
    const parent = records.find(r => r.id === record.parentId && !r.parentId);
    if (!parent || parent.universityId !== record.universityId) return 'Select a parent domain in the same university scope.';
    if (!parent.active && old?.parentId !== record.parentId) return 'Select an active parent domain.';
    if (old?.parentId !== record.parentId && mappings.some(m => m.subdomainId === record.id)) return 'Reassign mapped content before changing this sub-domain’s parent.';
  }
  return '';
}