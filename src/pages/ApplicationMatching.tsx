import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useApplicationSubmissions, ApplicationSubmission } from '@/hooks/useApplicationSubmissions';
import { useApplicationProcess } from '@/hooks/useApplicationProcess';
import { useFormsData } from '@/hooks/useFormsData';
import {
  ArrowLeft, Bot, Loader2, Send, Sparkles, CheckCircle2, FileSearch, CalendarClock,
  XCircle, Mail, RotateCcw, Users, Target,
} from 'lucide-react';

interface AgentMessage {
  role: 'user' | 'agent';
  text: string;
  matchedIds?: string[];
  suggestedAction?: string;
}

interface CommunicationLog {
  id: string;
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  subject: string;
  message: string;
  sentAt: string;
}

const EXAMPLES = [
  'Show applications above 80% match that are still under review',
  'Who has GPA above 3.5 and strong test scores? Recommend the top ones',
  'Find applicants missing work experience and suggest what to do',
];

const statusMeta: Record<string, { label: string; className: string }> = {
  submitted: { label: 'Submitted', className: 'bg-muted text-muted-foreground' },
  under_review: { label: 'Under review / Docs', className: 'bg-amber-100 text-amber-800' },
  shortlisted: { label: 'Shortlisted', className: 'bg-blue-100 text-blue-800' },
  interview_scheduled: { label: 'Interview', className: 'bg-purple-100 text-purple-800' },
  accepted: { label: 'Accepted', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
  waitlisted: { label: 'Waitlisted', className: 'bg-slate-100 text-slate-700' },
};

const scoreTone = (score: number) =>
  score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';

const ApplicationMatching: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isUniversity = location.pathname.startsWith('/university');

  const { applications, stats, bulkUpdateStatus } = useApplicationSubmissions();
  const { getCriteriaByCoursId } = useApplicationProcess();
  const { courses } = useFormsData();

  const [courseFilter, setCourseFilter] = useState(searchParams.get('course') || 'all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minScore, setMinScore] = useState(0);
  const [search, setSearch] = useState('');

  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [agentIds, setAgentIds] = useState<string[] | null>(null);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);

  const [mailOpen, setMailOpen] = useState(false);
  const [mailSubject, setMailSubject] = useState('Update on your application');
  const [mailBody, setMailBody] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const rubric = courseFilter !== 'all' ? getCriteriaByCoursId(courseFilter) : undefined;

  const baseFiltered = useMemo(() => {
    return applications.filter(app => {
      if (courseFilter !== 'all' && app.courseId !== courseFilter) return false;
      if (statusFilter !== 'all' && app.status !== statusFilter) return false;
      if (app.matchScore < minScore) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!app.applicantName.toLowerCase().includes(q) && !app.applicantEmail.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [applications, courseFilter, statusFilter, minScore, search]);

  const visible = useMemo(() => {
    const list = agentIds ? baseFiltered.filter(a => agentIds.includes(a.id)) : baseFiltered;
    return [...list].sort((a, b) => {
      if (agentIds) return agentIds.indexOf(a.id) - agentIds.indexOf(b.id);
      return b.matchScore - a.matchScore;
    });
  }, [baseFiltered, agentIds]);

  const selectedApps = applications.filter(a => selected.includes(a.id));

  const toggle = (id: string) =>
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const toggleAll = () =>
    setSelected(prev => (prev.length === visible.length ? [] : visible.map(a => a.id)));

  const runAgent = async (text?: string) => {
    const prompt = (text ?? instruction).trim();
    if (prompt.length < 4) {
      toast({ title: 'Tell the agent a bit more', description: 'Describe how you want to filter the applications.', variant: 'destructive' });
      return;
    }
    if (!baseFiltered.length) {
      toast({ title: 'No applications in scope', description: 'Adjust the filters above first.', variant: 'destructive' });
      return;
    }

    setMessages(prev => [...prev, { role: 'user', text: prompt }]);
    setInstruction('');
    setLoading(true);
    try {
      const payload = baseFiltered.map(a => ({
        id: a.id,
        name: a.applicantName,
        course: a.courseName,
        matchScore: a.matchScore,
        status: a.status,
        data: a.formData,
      }));

      const { data, error } = await supabase.functions.invoke('match-applications', {
        body: {
          instruction: prompt,
          applications: payload,
          criteria: rubric?.criteria ?? [],
          context: courseFilter !== 'all'
            ? `Course: ${courses.find(c => c.id === courseFilter)?.name ?? courseFilter}`
            : 'All courses',
        },
      });

      if (error) throw new Error(error.message);
      if ((data as any)?.error) throw new Error((data as any).error);

      const ids: string[] = Array.isArray(data?.matchedIds) ? data.matchedIds : [];
      const reasonMap: Record<string, string> = {};
      (data?.reasons ?? []).forEach((r: { id: string; reason: string }) => { reasonMap[r.id] = r.reason; });

      setAgentIds(ids);
      setReasons(reasonMap);
      setSelected(ids);
      setMessages(prev => [...prev, {
        role: 'agent',
        text: `${data?.reply ?? 'Done.'}${data?.actionRationale ? `\n\nRecommended: ${data.actionRationale}` : ''}`,
        matchedIds: ids,
        suggestedAction: data?.suggestedAction,
      }]);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong.';
      setMessages(prev => [...prev, { role: 'agent', text: `I could not complete that: ${message}` }]);
      toast({ title: 'Agent error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const applyStatus = (status: ApplicationSubmission['status'], label: string) => {
    if (!selected.length) return;
    bulkUpdateStatus(selected, status);
    toast({ title: label, description: `${selected.length} application(s) updated.` });
    setMessages(prev => [...prev, { role: 'agent', text: `${label}: ${selected.length} application(s) moved to "${statusMeta[status].label}".` }]);
  };

  const sendCommunication = () => {
    if (!mailBody.trim() || !selectedApps.length) return;
    const stored: CommunicationLog[] = JSON.parse(localStorage.getItem('applicationCommunications') || '[]');
    const logs: CommunicationLog[] = selectedApps.map(app => ({
      id: `COM-${Date.now()}-${app.id}`,
      applicationId: app.id,
      applicantName: app.applicantName,
      applicantEmail: app.applicantEmail,
      subject: mailSubject,
      message: mailBody,
      sentAt: new Date().toISOString(),
    }));
    localStorage.setItem('applicationCommunications', JSON.stringify([...stored, ...logs]));
    setMailOpen(false);
    setMailBody('');
    toast({ title: 'Communication queued', description: `Sent to ${logs.length} candidate(s).` });
    setMessages(prev => [...prev, { role: 'agent', text: `Communication "${mailSubject}" sent to ${logs.length} candidate(s).` }]);
  };

  const resetAgent = () => {
    setAgentIds(null);
    setReasons({});
    setSelected([]);
    setMessages([]);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" /> Application Matching
            </h1>
            <p className="text-muted-foreground mt-2">
              Applications scored against your evaluation criteria. Ask the agent to narrow them down, then act in bulk.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(
              courseFilter !== 'all'
                ? (isUniversity ? `/university/application-process/${courseFilter}/agent` : `/criteria-agent/${courseFilter}`)
                : (isUniversity ? '/university/application-process-list' : '/applications/selection-process')
            )}
          >
            <Sparkles className="w-4 h-4 mr-2" /> Evaluation criteria
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'In scope', value: baseFiltered.length, icon: Users },
          { label: 'High match (>80%)', value: baseFiltered.filter(a => a.matchScore > 80).length, icon: CheckCircle2 },
          { label: 'Shortlisted', value: stats.byStatus['shortlisted'] || 0, icon: Target },
          { label: 'Avg match score', value: `${stats.averageMatchScore}%`, icon: Bot },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
              <s.icon className="w-8 h-8 text-muted-foreground/40" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Agent panel */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-primary" /> Matching Agent
            </CardTitle>
            <CardDescription>
              {rubric
                ? `Using the saved rubric (${rubric.criteria.length} criteria, cut-off ${rubric.minimumScore}%).`
                : 'No rubric for this scope — the agent uses match scores and form data.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3">
            <div ref={scrollRef} className="flex-1 min-h-[220px] max-h-[380px] overflow-y-auto space-y-3 pr-1">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Try one of these:</p>
                  {EXAMPLES.map(ex => (
                    <button
                      key={ex}
                      onClick={() => runAgent(ex)}
                      className="w-full text-left text-sm rounded-md border border-border px-3 py-2 hover:bg-muted transition-colors"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === 'user' ? 'bg-primary text-primary-foreground ml-6' : 'bg-muted mr-6'
                  }`}
                >
                  {m.text}
                  {m.role === 'agent' && m.matchedIds && (
                    <div className="mt-2">
                      <Badge variant="secondary">{m.matchedIds.length} matched</Badge>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Reviewing applications…
                </div>
              )}
            </div>

            <Separator />
            <Textarea
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
              placeholder="e.g. Shortlist the top 5 with GPA above 3.5 and IELTS 7+"
              rows={3}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) runAgent();
              }}
            />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => runAgent()} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                Ask agent
              </Button>
              <Button variant="outline" onClick={resetAgent} disabled={loading}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg">Applications ({visible.length})</CardTitle>
                <CardDescription>
                  {agentIds ? 'Filtered by the agent' : 'All applications matching the filters below'}
                </CardDescription>
              </div>
              {agentIds && (
                <Button variant="ghost" size="sm" onClick={() => { setAgentIds(null); setReasons({}); }}>
                  Clear agent filter
                </Button>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-4">
              <Input placeholder="Search name or email" value={search} onChange={e => setSearch(e.target.value)} />
              <Select value={courseFilter} onValueChange={v => { setCourseFilter(v); setAgentIds(null); }}>
                <SelectTrigger><SelectValue placeholder="Course" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All courses</SelectItem>
                  {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {Object.entries(statusMeta).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={String(minScore)} onValueChange={v => setMinScore(Number(v))}>
                <SelectTrigger><SelectValue placeholder="Min score" /></SelectTrigger>
                <SelectContent>
                  {[0, 50, 60, 70, 80, 90].map(s => <SelectItem key={s} value={String(s)}>Min score {s}%</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 mr-auto">
                <Checkbox
                  checked={visible.length > 0 && selected.length === visible.length}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
                <span className="text-sm text-muted-foreground">{selected.length} selected</span>
              </div>
              <Button size="sm" disabled={!selected.length} onClick={() => applyStatus('shortlisted', 'Shortlisted')}>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Shortlist
              </Button>
              <Button size="sm" variant="outline" disabled={!selected.length} onClick={() => applyStatus('under_review', 'Sent for document review')}>
                <FileSearch className="w-4 h-4 mr-2" /> Document review
              </Button>
              <Button size="sm" variant="outline" disabled={!selected.length} onClick={() => applyStatus('interview_scheduled', 'Interview scheduled')}>
                <CalendarClock className="w-4 h-4 mr-2" /> Interview
              </Button>
              <Button size="sm" variant="outline" disabled={!selected.length} onClick={() => setMailOpen(true)}>
                <Mail className="w-4 h-4 mr-2" /> Communicate
              </Button>
              <Button size="sm" variant="outline" className="text-destructive" disabled={!selected.length} onClick={() => applyStatus('rejected', 'Rejected')}>
                <XCircle className="w-4 h-4 mr-2" /> Reject
              </Button>
            </div>

            {visible.length === 0 ? (
              <Alert>
                <AlertDescription>No applications match the current filters.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {visible.map(app => (
                  <div key={app.id} className="flex gap-3 rounded-lg border border-border p-4">
                    <Checkbox
                      className="mt-1"
                      checked={selected.includes(app.id)}
                      onCheckedChange={() => toggle(app.id)}
                      aria-label={`Select ${app.applicantName}`}
                    />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{app.applicantName}</span>
                        <Badge className={statusMeta[app.status]?.className}>{statusMeta[app.status]?.label ?? app.status}</Badge>
                        <span className="text-xs text-muted-foreground truncate">{app.courseName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={app.matchScore} className="h-2 w-40" />
                        <span className={`text-sm font-semibold ${scoreTone(app.matchScore)}`}>{app.matchScore}% match</span>
                      </div>
                      {reasons[app.id] && (
                        <p className="text-sm text-muted-foreground flex gap-2">
                          <Bot className="w-4 h-4 mt-0.5 shrink-0 text-primary" /> {reasons[app.id]}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(isUniversity ? `/university/applications/${app.id}` : `/form-applications/${app.id}`)}
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={mailOpen} onOpenChange={setMailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send communication</DialogTitle>
            <DialogDescription>
              Message {selectedApps.length} selected candidate(s).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Subject</Label>
              <Input value={mailSubject} onChange={e => setMailSubject(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Message</Label>
              <Textarea
                rows={6}
                value={mailBody}
                onChange={e => setMailBody(e.target.value)}
                placeholder="Dear applicant, we would like to invite you to the next stage…"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Recipients: {selectedApps.map(a => a.applicantName).join(', ') || 'none'}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMailOpen(false)}>Cancel</Button>
            <Button onClick={sendCommunication} disabled={!mailBody.trim() || !selectedApps.length}>
              <Mail className="w-4 h-4 mr-2" /> Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationMatching;
