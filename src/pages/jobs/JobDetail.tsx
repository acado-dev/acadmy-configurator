import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, QrCode, Users } from 'lucide-react';
import { getApplicationsForOpportunity, getOpportunity } from '@/lib/jobsStorage';
import { useJobsBase } from './JobsListing';
import OpportunityQRDialog from '@/components/jobs/OpportunityQRDialog';

export default function JobDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const base = useJobsBase();
  const o = getOpportunity(id);
  const [qr, setQr] = useState(false);
  if (!o) return <div className="p-6">Opportunity not found. <Button variant="link" onClick={() => navigate(base)}>Back</Button></div>;
  const apps = getApplicationsForOpportunity(id);
  const rows: [string, string | undefined][] = [
    ['Company', o.companyName], ['Location', o.location], ['Work Mode', o.workMode], ['Eligibility', o.eligibility],
    ['Application Window', `${o.startDate} → ${o.endDate}`], ['Duration', o.duration], [o.type === 'Internship' ? 'Stipend' : 'Salary', o.stipendOrSalary],
    ['Openings', o.openings?.toString()],
  ];
  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <Button variant="ghost" onClick={() => navigate(base)}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <div className="flex gap-2 mb-1"><Badge>{o.type}</Badge><Badge variant="outline">{o.status}</Badge></div>
          <h1 className="text-2xl font-bold">{o.title}</h1>
          <p className="text-muted-foreground">{o.companyName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setQr(true)}><QrCode className="h-4 w-4 mr-2" />QR</Button>
          <Button variant="outline" onClick={() => navigate(`${base}/${id}/edit`)}><Pencil className="h-4 w-4 mr-2" />Edit</Button>
          <Button onClick={() => navigate(`${base}/${id}/applicants`)}><Users className="h-4 w-4 mr-2" />Applicants ({apps.length})</Button>
        </div>
      </div>
      <Card><CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {rows.filter(([, v]) => v).map(([k, v]) => <div key={k}><p className="text-xs text-muted-foreground">{k}</p><p className="font-medium">{v}</p></div>)}
          <div className="md:col-span-2"><p className="text-xs text-muted-foreground">Description</p><p className="whitespace-pre-wrap">{o.description || '—'}</p></div>
          <div className="md:col-span-2"><p className="text-xs text-muted-foreground mb-1">Skills</p><div className="flex flex-wrap gap-2">{o.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}</div></div>
        </CardContent>
      </Card>
      <OpportunityQRDialog opportunity={qr ? o : null} onClose={() => setQr(false)} />
    </div>
  );
}
