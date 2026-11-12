import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { availableDomains, availableSubdomains, domainUniversities, getDomains, readMapping, saveMapping, validateMapping, type ContentMapping } from '@/lib/domainStorage';

export function useContentDomain(contentType: string, contentId?: string, fixedUniversity?: string) {
  const [value, setValue] = useState<ContentMapping>(() => readMapping(contentType, contentId || '') || { contentType, contentId: contentId || '', universityId: fixedUniversity || '', domainId: '', subdomainId: '' });
  useEffect(() => {
    setValue(readMapping(contentType, contentId || '') || { contentType, contentId: contentId || '', universityId: fixedUniversity || '', domainId: '', subdomainId: '' });
  }, [contentType, contentId]);
  const mapping = { ...value, universityId: fixedUniversity ?? value.universityId };
  return {
    value: mapping,
    onChange: setValue,
    error: () => validateMapping(getDomains(), mapping, readMapping(contentType, contentId || '')),
    save: (id: string) => saveMapping({ ...mapping, contentId: id }),
  };
}

export default function ContentDomainMapping({ value, onChange, selectUniversity = false }: { value: ContentMapping; onChange: (value: ContentMapping) => void; selectUniversity?: boolean }) {
  const records = getDomains();
  const domains = availableDomains(records, value.universityId);
  const selected = records.find(r => r.id === value.domainId);
  const selectedSub = records.find(r => r.id === value.subdomainId);
  const subs = availableSubdomains(records, value.domainId);
  const unavailable = (r: typeof selected) => r ? `${r.name} (existing · unavailable for new mappings)` : 'Previously mapped item';
  return <section className="space-y-4 border-t border-border pt-5">
    <h2 className="text-lg font-semibold">Domain Mapping</h2>
    <div className="grid gap-4 md:grid-cols-2">
      {selectUniversity && <div className="space-y-2"><Label>University</Label><Select value={value.universityId || 'platform'} onValueChange={v => onChange({ ...value, universityId: v === 'platform' ? '' : v, domainId: '', subdomainId: '' })}><SelectTrigger aria-label="Mapping university"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="platform">Platform-wide</SelectItem>{domainUniversities().map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select></div>}
      <div className="space-y-2"><Label>Domain</Label><Select value={value.domainId || 'none'} onValueChange={v => onChange({ ...value, domainId: v === 'none' ? '' : v, subdomainId: '' })}><SelectTrigger aria-label="Content domain"><SelectValue placeholder="Select domain" /></SelectTrigger><SelectContent><SelectItem value="none">No domain</SelectItem>{value.domainId && !domains.some(d => d.id === value.domainId) && <SelectItem value={value.domainId} disabled>{unavailable(selected)}</SelectItem>}{domains.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-2"><Label>Sub-domain</Label><Select disabled={!value.domainId || !selected?.active} value={value.subdomainId || 'none'} onValueChange={v => onChange({ ...value, subdomainId: v === 'none' ? '' : v })}><SelectTrigger aria-label="Content sub-domain"><SelectValue placeholder="Select sub-domain" /></SelectTrigger><SelectContent><SelectItem value="none">No sub-domain</SelectItem>{value.subdomainId && !subs.some(d => d.id === value.subdomainId) && <SelectItem value={value.subdomainId} disabled>{unavailable(selectedSub)}</SelectItem>}{subs.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
    </div>
  </section>;
}