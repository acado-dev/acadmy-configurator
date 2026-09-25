import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';
import { getIndustryCompanies, getOpportunity, saveOpportunity, SKILL_OPTIONS, Opportunity } from '@/lib/jobsStorage';
import { useJobsBase } from './JobsListing';
import OpportunityQRDialog from '@/components/jobs/OpportunityQRDialog';

export default function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const base = useJobsBase();
  const companies = getIndustryCompanies();
  const existing = id ? getOpportunity(id) : undefined;
  const [f, setF] = useState<any>(existing || {
    title: '', type: 'Job', companyId: '', description: '', location: '', workMode: 'On-site', eligibility: '',
    skills: [], startDate: '', endDate: '', duration: '', stipendOrSalary: '', openings: 1, status: 'Open',
  });
  const [created, setCreated] = useState<Opportunity | null>(null);
  const set = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!f.title || !f.companyId || !f.location || !f.startDate || !f.endDate) return toast.error('Please fill title, company, location and dates');
    if (f.endDate < f.startDate) return toast.error('End date must be after start date');
    if (f.type === 'Internship' && !f.duration) return toast.error('Please enter internship duration');
    const company = companies.find((c) => c.id === f.companyId);
    const saved = saveOpportunity({
      ...f, companyName: company?.name || f.companyName, duration: f.type === 'Internship' ? f.duration : undefined,
      openings: Number(f.openings) || undefined, createdBy: base.startsWith('/university') ? 'university_admin' : 'super_admin',
    });
    toast.success(existing ? 'Opportunity updated' : 'Opportunity created');
    if (existing) navigate(base); else setCreated(saved);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate(base)}><ArrowLeft className="h-4 w-4 mr-2" />Back to Jobs & Internships</Button>
      <h1 className="text-2xl font-bold">{existing ? 'Edit' : 'Create'} Job / Internship</h1>

      <Card>
        <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2"><Label>Title *</Label><Input value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Software Engineer" /></div>
          <div className="space-y-2"><Label>Type *</Label>
            <Select value={f.type} onValueChange={(v) => set('type', v)}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Job">Job</SelectItem><SelectItem value="Internship">Internship</SelectItem></SelectContent></Select></div>
          {f.type === 'Internship' && (
            <div className="space-y-2"><Label>Duration *</Label><Input value={f.duration} onChange={(e) => set('duration', e.target.value)} placeholder="e.g. 6 months" /></div>
          )}
          <div className="space-y-2"><Label>Work Mode</Label>
            <Select value={f.workMode} onValueChange={(v) => set('workMode', v)}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="On-site">On-site</SelectItem><SelectItem value="Hybrid">Hybrid</SelectItem><SelectItem value="Remote">Remote</SelectItem></SelectContent></Select></div>
          <div className="space-y-2"><Label>Location *</Label><Input value={f.location} onChange={(e) => set('location', e.target.value)} /></div>
          <div className="md:col-span-2 space-y-2"><Label>Description</Label><Textarea rows={4} value={f.description} onChange={(e) => set('description', e.target.value)} /></div>
          <div className="md:col-span-2 space-y-2"><Label>Experience / Eligibility</Label><Input value={f.eligibility} onChange={(e) => set('eligibility', e.target.value)} placeholder="e.g. 0-2 years, any graduate" /></div>
          <div className="md:col-span-2 space-y-2"><Label>Skills Required</Label>
            <Select value="" onValueChange={(v) => !f.skills.includes(v) && set('skills', [...f.skills, v])}>
              <SelectTrigger><SelectValue placeholder="Add a skill" /></SelectTrigger>
              <SelectContent>{SKILL_OPTIONS.filter((s) => !f.skills.includes(s)).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <div className="flex flex-wrap gap-2">{f.skills.map((s: string) => (
              <Badge key={s} variant="secondary" className="gap-1">{s}<X className="h-3 w-3 cursor-pointer" onClick={() => set('skills', f.skills.filter((x: string) => x !== s))} /></Badge>
            ))}</div></div>
          <div className="space-y-2"><Label>Application Start Date *</Label><Input type="date" value={f.startDate} onChange={(e) => set('startDate', e.target.value)} /></div>
          <div className="space-y-2"><Label>Application End Date *</Label><Input type="date" value={f.endDate} onChange={(e) => set('endDate', e.target.value)} /></div>
          <div className="space-y-2"><Label>{f.type === 'Internship' ? 'Stipend' : 'Salary / CTC'}</Label><Input value={f.stipendOrSalary} onChange={(e) => set('stipendOrSalary', e.target.value)} /></div>
          <div className="space-y-2"><Label>Openings</Label><Input type="number" min={1} value={f.openings} onChange={(e) => set('openings', e.target.value)} /></div>
          <div className="space-y-2"><Label>Status</Label>
            <Select value={f.status} onValueChange={(v) => set('status', v)}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Open">Open</SelectItem><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Closed">Closed</SelectItem></SelectContent></Select></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Company Mapping</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Label>Offered By / Company *</Label>
          <Select value={f.companyId} onValueChange={(v) => set('companyId', v)}>
            <SelectTrigger><SelectValue placeholder="Select an Industry organization" /></SelectTrigger>
            <SelectContent>{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}{c.city ? ` · ${c.city}` : ''}</SelectItem>)}</SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Only organizations with institution type "Industry" are listed.</p>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate(base)}>Cancel</Button>
        <Button onClick={submit}>{existing ? 'Save Changes' : 'Save Opportunity'}</Button>
      </div>

      <OpportunityQRDialog opportunity={created} onClose={() => navigate(base)} />
    </div>
  );
}
