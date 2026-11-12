import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { domainUniversities, mappedContent, type ContentMapping } from '@/lib/domainStorage';

const tabs = [
  { id: 'course', name: 'Courses' },
  { id: 'event', name: 'Events' },
  { id: 'podcast', name: 'Podcasts' },
  { id: 'blog', name: 'Blogs' },
  { id: 'newsletter', name: 'Newsletter' },
];

// Reference rows stay separate from content records and mapping/deletion counts.
const referenceRows = [
  { id: 'course', name: 'BSc in Information Technology', description: 'Software engineering, cloud computing and practical digital projects.', date: '2026-11-01', status: 'Published' },
  { id: 'course', name: 'Applied Artificial Intelligence', description: 'Machine learning and responsible AI for real-world applications.', date: '2026-11-03', status: 'Draft' },
  { id: 'event', name: 'Technology & Innovation Open Day', description: 'Meet teaching teams and explore technology programmes and student projects.', date: '2026-11-02', status: 'Published' },
  { id: 'event', name: 'Build Your First AI Application', description: 'A practical workshop covering AI tools, prototypes and product ideas.', date: '2026-11-05', status: 'Draft' },
  { id: 'podcast', name: 'Inside the Future of AI', description: 'Researchers and students discuss the next generation of intelligent systems.', date: '2026-11-04', status: 'Published' },
  { id: 'podcast', name: 'From Campus to a Tech Career', description: 'Graduate stories about internships, portfolios and working in technology.', date: '2026-11-06', status: 'Draft' },
  { id: 'blog', name: 'Studying Software Engineering in Finland', description: 'A look at practical learning, student projects and career pathways.', date: '2026-11-03', status: 'Published' },
  { id: 'blog', name: 'Five Emerging Technology Skills', description: 'Explore skills in data, cybersecurity, cloud services and digital innovation.', date: '2026-11-07', status: 'Draft' },
  { id: 'newsletter', name: 'Technology Programmes — November Update', description: 'Programme highlights, upcoming events and technology learning opportunities.', date: '2026-11-08', status: 'Draft' },
  { id: 'newsletter', name: 'Digital Innovation Campus Digest', description: 'Research news, student achievements and recent campus projects.', date: '2026-11-10', status: 'Draft' },
];

export default function DomainMappedContent({ domainId, mappings, scope }: { domainId: string; mappings: ContentMapping[]; scope?: string }) {
  const navigate = useNavigate();
  const [universityFilter, setUniversityFilter] = useState('all');
  const universities = domainUniversities();
  const actual = mappings.filter(m => m.domainId === domainId && (scope === undefined || m.universityId === scope)).map(m => {
    const content = mappedContent(m);
    return { key: `${m.contentType}-${m.contentId}`, id: m.contentType === 'university-course' ? 'course' : m.contentType, name: content.title, description: content.description, date: content.createdAt, status: content.status, universityId: m.universityId, sample: false, url: content.url };
  });
  const samples = domainId === 'dom-technology' && (scope === undefined || scope === 'u-jamk') ? referenceRows.map((row, index) => ({ ...row, key: `reference-${index}`, universityId: 'u-jamk', sample: true, url: undefined as string | undefined })) : [];
  const rows = [...actual, ...samples].filter(row => universityFilter === 'all' || row.universityId === (universityFilter === 'platform' ? '' : universityFilter));
  const allTabs = actual.some(row => !tabs.some(tab => tab.id === row.id)) ? [...tabs, { id: 'other', name: 'Other' }] : tabs;
  const rowsFor = (id: string) => rows.filter(row => id === 'other' ? !tabs.some(tab => tab.id === row.id) : row.id === id);
  return <section className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-semibold">Mapped Content</h2>
      {scope === undefined && <Select value={universityFilter} onValueChange={setUniversityFilter}><SelectTrigger className="w-64" aria-label="Mapped content university filter"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All universities</SelectItem><SelectItem value="platform">Platform-wide</SelectItem>{universities.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select>}
    </div>
    <Tabs defaultValue="course">
      <div className="overflow-x-auto"><TabsList aria-label="Mapped content types" className="w-max"><>{allTabs.map(tab => <TabsTrigger key={tab.id} value={tab.id}>{tab.name} ({rowsFor(tab.id).length})</TabsTrigger>)}</></TabsList></div>
      {allTabs.map(tab => <TabsContent key={tab.id} value={tab.id} className="mt-4">
        <div className="overflow-x-auto rounded-md border border-border"><Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead className="whitespace-nowrap">Created Date</TableHead><TableHead>Status</TableHead>{scope === undefined && <TableHead>University</TableHead>}<TableHead className="text-right"><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
          <TableBody>{rowsFor(tab.id).map(row => <TableRow key={row.key}>
            <TableCell className="min-w-56 font-medium"><div className="space-y-2"><p>{row.name}</p>{row.sample && <Badge variant="outline">Sample</Badge>}</div></TableCell>
            <TableCell className="min-w-64 max-w-md whitespace-normal text-muted-foreground">{row.description || '—'}</TableCell>
            <TableCell className="whitespace-nowrap">{row.date && !Number.isNaN(Date.parse(row.date)) ? new Date(row.date).toLocaleDateString() : '—'}</TableCell>
            <TableCell><Badge variant={['published', 'active'].includes(row.status.toLowerCase()) ? 'secondary' : 'outline'}>{row.status}</Badge></TableCell>
            {scope === undefined && <TableCell className="min-w-48">{universities.find(u => u.id === row.universityId)?.name || row.universityId || 'Platform-wide'}</TableCell>}
            <TableCell>{row.url && <Button variant="ghost" size="sm" onClick={() => navigate(scope !== undefined && (row.id === 'event' || row.id === 'job') ? `/university${row.url}` : row.url || '/domains')}>Edit content</Button>}</TableCell>
          </TableRow>)}{!rowsFor(tab.id).length && <TableRow><TableCell colSpan={scope === undefined ? 6 : 5} className="py-10 text-center text-muted-foreground">No {tab.name.toLowerCase()} mapped.</TableCell></TableRow>}</TableBody>
        </Table></div>
      </TabsContent>)}
    </Tabs>
  </section>;
}