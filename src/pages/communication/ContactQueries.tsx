import { useState } from 'react';
import { Mail, Phone, Search, Eye, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getContactQueries, ContactQuery, updateContactQuery, maskContactEmail, maskContactPhone } from '@/lib/websiteCommunication';
import { toast } from 'sonner';

export default function ContactQueries() {
  const [queries, setQueries] = useState(getContactQueries);
  const [search, setSearch] = useState(''); const [type, setType] = useState('all'); const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<ContactQuery | null>(null);
  const [notes, setNotes] = useState(''); const [reviewStatus, setReviewStatus] = useState<ContactQuery['status']>('New');
  const open = (query: ContactQuery) => { setSelected(query); setNotes(query.notes); setReviewStatus(query.status); };
  const filtered = queries.filter(q => (type === 'all' || q.userType === type) && (status === 'all' || q.status === status) && `${q.firstName} ${q.lastName} ${q.university} ${q.query} ${maskContactEmail(q.email)}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" />Contact Us</h1><span className="text-sm text-muted-foreground">{queries.length} queries · {queries.filter(q => q.status === 'New').length} new</span></header>
    {queries.some(q => q.sample) && <p className="text-sm text-muted-foreground">Sample queries are marked below.</p>}
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-48"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search queries" placeholder="Search name, university or query…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
      <Select value={type} onValueChange={setType}><SelectTrigger className="w-56"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All user types</SelectItem><SelectItem value="Student / Individual">Student / Individual</SelectItem><SelectItem value="University representative">University representative</SelectItem></SelectContent></Select>
      <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent>{['all', 'New', 'Contacted', 'Resolved'].map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All statuses' : s}</SelectItem>)}</SelectContent></Select>
    </div>
    <div className="rounded-lg border overflow-x-auto"><Table><TableHeader><TableRow><TableHead>User details</TableHead><TableHead>User type</TableHead><TableHead className="min-w-56">Query</TableHead><TableHead className="whitespace-nowrap">Submitted</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
      <TableBody>{filtered.map(q => <TableRow key={q.id}><TableCell className="min-w-48"><div className="font-medium">{q.firstName} {q.lastName} {q.sample && <Badge variant="outline">Sample</Badge>}</div><div className="text-xs text-muted-foreground">{maskContactEmail(q.email)}</div><div className="text-xs text-muted-foreground">{maskContactPhone(q.phone)}</div></TableCell><TableCell><div>{q.userType}</div><div className="text-xs text-muted-foreground">{q.university}</div></TableCell><TableCell><p className="line-clamp-2 break-words">{q.query}</p></TableCell><TableCell>{new Date(q.submittedAt).toLocaleDateString()}</TableCell><TableCell><Badge variant={q.status === 'New' ? 'default' : 'secondary'}>{q.status}</Badge></TableCell><TableCell><Button variant="ghost" size="icon" aria-label={`View query from ${q.firstName}`} title="View query and contact user" onClick={() => open(q)}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label={`Email ${q.firstName}`} title="Email user" onClick={() => { open(q); }}><Mail className="h-4 w-4" /></Button></TableCell></TableRow>)}{!filtered.length && <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No queries found.</TableCell></TableRow>}</TableBody>
    </Table></div>
    <Dialog open={Boolean(selected)} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Contact query · {selected?.firstName} {selected?.lastName}</DialogTitle></DialogHeader>{selected && <>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"><div><dt className="text-muted-foreground">User type</dt><dd>{selected.userType}</dd></div>{selected.university && <div><dt className="text-muted-foreground">University</dt><dd>{selected.university}</dd></div>}<div><dt className="text-muted-foreground">Email</dt><dd className="break-all">{selected.email}</dd></div><div><dt className="text-muted-foreground">Phone</dt><dd>{selected.phone}</dd></div><div><dt className="text-muted-foreground">Submitted</dt><dd>{new Date(selected.submittedAt).toLocaleString()}</dd></div></dl>
      <section className="border-y py-4"><h2 className="font-medium mb-2">Query</h2><p className="whitespace-pre-wrap break-words text-sm">{selected.query}</p></section>
      <div className="flex flex-wrap gap-2"><Button variant="outline" asChild><a href={`mailto:${encodeURIComponent(selected.email)}?subject=${encodeURIComponent('Re: Your ACADO enquiry')}`}><Mail className="h-4 w-4 mr-2" />Email user</a></Button><Button variant="outline" asChild><a href={`tel:${selected.phone.replace(/[^+\d]/g, '')}`}><Phone className="h-4 w-4 mr-2" />Call user</a></Button></div>
      <div className="space-y-2"><Label htmlFor="query-status">Status</Label><Select value={reviewStatus} onValueChange={v => setReviewStatus(v as ContactQuery['status'])}><SelectTrigger id="query-status"><SelectValue /></SelectTrigger><SelectContent>{['New', 'Contacted', 'Resolved'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-2"><Label htmlFor="query-notes">Follow-up notes</Label><Textarea id="query-notes" maxLength={5000} value={notes} onChange={e => setNotes(e.target.value)} rows={3} /></div>
      <DialogFooter><Button variant="outline" onClick={() => setSelected(null)}>Close</Button><Button onClick={() => { try { updateContactQuery(selected.id, reviewStatus, notes); setQueries(getContactQueries()); setSelected(null); toast.success('Query updated'); } catch { toast.error('Unable to save query'); } }}>Save changes</Button></DialogFooter>
    </>}</DialogContent></Dialog>
  </div>;
}