import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Search, FileText, CheckCircle2, XCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { getApplicationsForOpportunity, getOpportunity, JobApplication, setShortlistStatus, ShortlistStatus } from '@/lib/jobsStorage';
import { useJobsBase } from './JobsListing';

const mask = (e: string) => e.replace(/^(.{2}).*(@.*)$/, '$1***$2');
const maskPhone = (p?: string) => (p ? p.slice(0, 4) + ' ***** ' + p.slice(-3) : '—');

export default function JobApplicants() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const base = useJobsBase();
  const opp = getOpportunity(id);
  const [apps, setApps] = useState(getApplicationsForOpportunity(id));
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [resumeOf, setResumeOf] = useState<JobApplication | null>(null);

  const filtered = useMemo(() => apps.filter((a) =>
    (filter === 'all' || a.shortlistStatus === filter) && `${a.applicantName} ${a.email}`.toLowerCase().includes(q.toLowerCase())), [apps, q, filter]);

  if (!opp) return <div className="p-6">Opportunity not found. <Button variant="link" onClick={() => navigate(base)}>Back</Button></div>;

  const update = (a: JobApplication, s: ShortlistStatus) => {
    setShortlistStatus(a.id, s, base.startsWith('/university') ? 'University Admin' : 'Super Admin');
    setApps(getApplicationsForOpportunity(id));
    toast.success(`${a.applicantName} marked ${s}`);
  };
  const badge = (s: ShortlistStatus) =>
    <Badge variant={s === 'Shortlisted' ? 'default' : s === 'Not Shortlisted' ? 'destructive' : 'outline'}>{s}</Badge>;

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(base)}><ArrowLeft className="h-4 w-4 mr-2" />Back to Jobs & Internships</Button>
      <div>
        <p className="text-sm text-muted-foreground">Applicants for</p>
        <h1 className="text-2xl font-bold">{opp.title} <Badge className="align-middle ml-2">{opp.type}</Badge></h1>
        <p className="text-muted-foreground">{opp.companyName} · {opp.location}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[['Total', apps.length], ['Shortlisted', apps.filter((a) => a.shortlistStatus === 'Shortlisted').length],
          ['Not Shortlisted', apps.filter((a) => a.shortlistStatus === 'Not Shortlisted').length], ['Pending', apps.filter((a) => a.shortlistStatus === 'Pending').length]]
          .map(([l, v]) => <Card key={l as string}><CardContent className="p-4"><p className="text-sm text-muted-foreground">{l}</p><p className="text-2xl font-bold">{v}</p></CardContent></Card>)}
      </div>

      <Card><CardContent className="p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search applicant..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={filter} onValueChange={setFilter}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All shortlist statuses</SelectItem><SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Shortlisted">Shortlisted</SelectItem><SelectItem value="Not Shortlisted">Not Shortlisted</SelectItem></SelectContent></Select>
        </div>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Applicant</TableHead><TableHead>Email / Contact</TableHead><TableHead>Applied</TableHead><TableHead>Resume</TableHead>
            <TableHead>Application Status</TableHead><TableHead>Shortlist</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No applicants for this opportunity yet.</TableCell></TableRow>}
            {filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.applicantName}</TableCell>
                <TableCell className="text-sm">{mask(a.email)}<div className="text-xs text-muted-foreground">{maskPhone(a.phone)}</div></TableCell>
                <TableCell>{new Date(a.appliedAt).toLocaleDateString()}</TableCell>
                <TableCell><Button variant="link" className="p-0 h-auto" onClick={() => setResumeOf(a)}><FileText className="h-4 w-4 mr-1" />{a.resume.fileName}</Button></TableCell>
                <TableCell><Badge variant="secondary">{a.applicationStatus}</Badge></TableCell>
                <TableCell>{badge(a.shortlistStatus)}</TableCell>
                <TableCell className="text-right whitespace-nowrap space-x-1">
                  <Button size="sm" variant="outline" onClick={() => setResumeOf(a)}>View Resume</Button>
                  <Button size="sm" disabled={a.shortlistStatus === 'Shortlisted'} onClick={() => update(a, 'Shortlisted')}><CheckCircle2 className="h-4 w-4 mr-1" />Shortlist</Button>
                  <Button size="sm" variant="outline" disabled={a.shortlistStatus === 'Not Shortlisted'} onClick={() => update(a, 'Not Shortlisted')}><XCircle className="h-4 w-4 mr-1" />Not Shortlisted</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={!!resumeOf} onOpenChange={(o) => !o && setResumeOf(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{resumeOf?.applicantName} — Resume</DialogTitle>
            <DialogDescription>{resumeOf?.resume.fileName} · Application {resumeOf?.id} · {opp.title}</DialogDescription>
          </DialogHeader>
          {resumeOf?.resume.dataUrl ? (
            <iframe title="resume" src={resumeOf.resume.dataUrl} className="w-full h-[60vh] border rounded bg-card" />
          ) : <p className="text-muted-foreground">No file content available.</p>}
          {resumeOf && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">Shortlist: {badge(resumeOf.shortlistStatus)}</div>
              <div className="flex gap-2">
                {resumeOf.resume.dataUrl && <Button variant="outline" asChild><a href={resumeOf.resume.dataUrl} download={resumeOf.resume.fileName}><Download className="h-4 w-4 mr-2" />Download</a></Button>}
                <Button onClick={() => { update(resumeOf, 'Shortlisted'); setResumeOf(null); }}>Shortlist</Button>
                <Button variant="outline" onClick={() => { update(resumeOf, 'Not Shortlisted'); setResumeOf(null); }}>Not Shortlisted</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
