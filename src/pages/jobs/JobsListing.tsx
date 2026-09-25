import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, Eye, Pencil, Trash2, Users, QrCode, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { deleteOpportunity, getAllJobApplications, getOpportunities, Opportunity } from '@/lib/jobsStorage';
import OpportunityQRDialog from '@/components/jobs/OpportunityQRDialog';

export const useJobsBase = () => (useLocation().pathname.startsWith('/university') ? '/university/jobs' : '/jobs');

export default function JobsListing() {
  const navigate = useNavigate();
  const base = useJobsBase();
  const [opps, setOpps] = useState(getOpportunities());
  const apps = getAllJobApplications();
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [mode, setMode] = useState('all');
  const [qr, setQr] = useState<Opportunity | null>(null);
  const [toDelete, setToDelete] = useState<Opportunity | null>(null);

  const count = (id: string) => apps.filter((a) => a.opportunityId === id).length;
  const filtered = useMemo(() => opps.filter((o) =>
    (type === 'all' || o.type === type) && (status === 'all' || o.status === status) && (mode === 'all' || o.workMode === mode) &&
    [o.title, o.companyName, o.location].join(' ').toLowerCase().includes(q.toLowerCase())
  ), [opps, q, type, status, mode]);

  const stats = [
    { label: 'Total', value: opps.length },
    { label: 'Jobs', value: opps.filter((o) => o.type === 'Job').length },
    { label: 'Internships', value: opps.filter((o) => o.type === 'Internship').length },
    { label: 'Applications', value: apps.filter((a) => opps.some((o) => o.id === a.opportunityId)).length },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Briefcase className="h-6 w-6 text-primary" />Jobs & Internships</h1>
          <p className="text-muted-foreground text-sm">Create opportunities, share QR codes and manage applicants.</p>
        </div>
        <Button onClick={() => navigate(`${base}/new`)}><Plus className="h-4 w-4 mr-2" />Create Job / Internship</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}><CardContent className="p-4"><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search title, company, location..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Select value={type} onValueChange={setType}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All types</SelectItem><SelectItem value="Job">Job</SelectItem><SelectItem value="Internship">Internship</SelectItem></SelectContent></Select>
            <Select value={mode} onValueChange={setMode}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All work modes</SelectItem><SelectItem value="On-site">On-site</SelectItem><SelectItem value="Hybrid">Hybrid</SelectItem><SelectItem value="Remote">Remote</SelectItem></SelectContent></Select>
            <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Open">Open</SelectItem><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Closed">Closed</SelectItem></SelectContent></Select>
          </div>

          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Company</TableHead><TableHead>Location</TableHead>
              <TableHead>Status</TableHead><TableHead>Applications</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No opportunities found.</TableCell></TableRow>}
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.title}</TableCell>
                  <TableCell><Badge variant={o.type === 'Job' ? 'default' : 'secondary'}>{o.type}</Badge></TableCell>
                  <TableCell>{o.companyName}</TableCell>
                  <TableCell>{o.location} <span className="text-xs text-muted-foreground">({o.workMode})</span></TableCell>
                  <TableCell><Badge variant={o.status === 'Open' ? 'default' : 'outline'}>{o.status}</Badge></TableCell>
                  <TableCell>
                    <Button variant="link" className="p-0 h-auto" onClick={() => navigate(`${base}/${o.id}/applicants`)}>{count(o.id)}</Button>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" title="View" onClick={() => navigate(`${base}/${o.id}`)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Edit" onClick={() => navigate(`${base}/${o.id}/edit`)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="View Applications" onClick={() => navigate(`${base}/${o.id}/applicants`)}><Users className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="View / Generate QR" onClick={() => setQr(o)}><QrCode className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Delete" onClick={() => setToDelete(o)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OpportunityQRDialog opportunity={qr} onClose={() => setQr(null)} />
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete "{toDelete?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>This also removes its applications. This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { deleteOpportunity(toDelete!.id); setOpps(getOpportunities()); setToDelete(null); toast.success('Deleted'); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
