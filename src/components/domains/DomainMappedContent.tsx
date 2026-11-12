import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { domainUniversities, type DomainRecord } from '@/lib/domainStorage';
import { getDomainContentRows, mappedContentTabs } from '@/lib/domainMappedContent';

export default function DomainMappedContent({ domainId, records, scope }: { domainId: string; records: DomainRecord[]; scope?: string }) {
  const navigate = useNavigate();
  const [universityFilter, setUniversityFilter] = useState('all');
  const universities = domainUniversities();
  const allRows = getDomainContentRows(domainId, scope);
  const rows = allRows.filter(r => universityFilter === 'all' || r.universityId === (universityFilter === 'platform' ? '' : universityFilter));
  const universityName = (id: string) => universities.find(u => u.id === id)?.name || id || 'Platform-wide';
  const tabs = mappedContentTabs.filter(tab => tab !== 'Other' || allRows.some(r => r.tab === 'Other'));
  return <section className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-semibold">Mapped Content ({rows.length})</h2>
      {scope === undefined && <Select value={universityFilter} onValueChange={setUniversityFilter}><SelectTrigger className="w-56" aria-label="Mapped content university filter"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All universities</SelectItem><SelectItem value="platform">Platform-wide</SelectItem>{universities.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select>}
    </div>
    <Tabs defaultValue="Courses">
      <div className="overflow-x-auto"><TabsList aria-label="Mapped content types" className="h-auto justify-start">{tabs.map(tab => <TabsTrigger key={tab} value={tab}>{tab} <span className="ml-2 text-xs">({rows.filter(r => r.tab === tab).length})</span></TabsTrigger>)}</TabsList></div>
      {tabs.map(tab => <TabsContent key={tab} value={tab} className="mt-4">
        <div className="overflow-x-auto rounded-md border border-border"><Table><TableHeader><TableRow>
          <TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Sub-domain</TableHead><TableHead>Created Date</TableHead><TableHead>Status</TableHead>{scope === undefined && <TableHead>University</TableHead>}
        </TableRow></TableHeader><TableBody>{rows.filter(r => r.tab === tab).map(r => <TableRow key={r.id}>
          <TableCell className="min-w-56"><div className="space-y-2">{r.url ? <Button variant="link" className="h-auto whitespace-normal p-0 text-left" onClick={() => navigate(scope !== undefined && (r.contentType === 'event' || r.contentType === 'job') ? `/university${r.url}` : r.url || '/')}>{r.name}</Button> : <span className="font-medium">{r.name}</span>}{r.sample && <div><Badge variant="outline">Sample</Badge></div>}</div></TableCell>
          <TableCell className="min-w-64 max-w-sm whitespace-normal">{r.description.replace(/<[^>]*>/g, '')}</TableCell>
          <TableCell className="min-w-40">{records.find(s => s.id === r.subdomainId)?.name || '—'}</TableCell>
          <TableCell className="whitespace-nowrap">{r.createdAt && !Number.isNaN(Date.parse(r.createdAt)) ? new Date(r.createdAt).toLocaleDateString() : '—'}</TableCell>
          <TableCell><Badge variant={r.status.toLowerCase() === 'draft' || r.status === '—' ? 'outline' : 'secondary'} className="capitalize">{r.status}</Badge></TableCell>
          {scope === undefined && <TableCell className="min-w-48">{universityName(r.universityId)}</TableCell>}
        </TableRow>)}{!rows.some(r => r.tab === tab) && <TableRow><TableCell colSpan={scope === undefined ? 6 : 5} className="py-10 text-center text-muted-foreground">No {tab.toLowerCase()} mapped.</TableCell></TableRow>}</TableBody></Table></div>
      </TabsContent>)}
    </Tabs>
  </section>;
}