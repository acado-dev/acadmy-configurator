import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  GraduationCap,
  Link2,
  PauseCircle,
  PenLine,
  Search,
  Users,
  Video,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { SelectionStatusBadge } from '@/components/selection/SelectionStatusBadge';
import { ActivityResponse, SelectionModule, SelectionStatus, SelectionStatusEntry } from '@/types/selection';
import {
  RESPONSE_KEYS,
  STATUS_HISTORY_KEY,
  STORAGE_KEYS,
  ensureSeed,
  read,
  write,
} from '@/lib/selectionStorage';
import { STEP_MODULE, StoredProcessStep, getProcess } from '@/lib/selectionProcesses';

interface AppSubmission {
  id: string;
  applicantName: string;
  applicantEmail: string;
  courseId: string;
  courseName: string;
  formData: Record<string, any>;
  matchScore: number;
  status: string;
  submittedAt: string;
  documents?: { id: string; name: string; url: string; size?: string; type?: string; status?: string }[];
}

type StepRow =
  | { kind: 'response'; id: string; name: string; email: string; submittedAt?: string; score?: number; maxScore?: number; status: SelectionStatus; response: ActivityResponse }
  | { kind: 'application'; id: string; name: string; email: string; submittedAt?: string; score?: number; maxScore?: number; status: SelectionStatus; application: AppSubmission };

const APP_KEY = 'applicationSubmissions';

const appStatusToSelection = (s: string): SelectionStatus => {
  if (s === 'accepted') return 'accepted';
  if (s === 'rejected') return 'rejected';
  if (s === 'waitlisted') return 'on_hold';
  if (s === 'shortlisted' || s === 'interview_scheduled') return 'shortlisted';
  return 'pending';
};

const selectionToAppStatus = (s: SelectionStatus) =>
  s === 'accepted' ? 'accepted' : s === 'rejected' ? 'rejected' : s === 'on_hold' ? 'waitlisted' : 'under_review';

const stepIcon = (type: StoredProcessStep['type']) => {
  switch (type) {
    case 'application':
      return <FileText className="h-4 w-4" />;
    case 'document-review':
      return <FileText className="h-4 w-4" />;
    case 'test':
      return <ClipboardList className="h-4 w-4" />;
    case 'assignment':
      return <PenLine className="h-4 w-4" />;
    case 'sop':
      return <PenLine className="h-4 w-4" />;
    case 'interview':
      return <Video className="h-4 w-4" />;
    case 'committee-review':
      return <Users className="h-4 w-4" />;
    default:
      return <GraduationCap className="h-4 w-4" />;
  }
};

export default function SelectionProcessDetail() {
  const { processId } = useParams();
  const navigate = useNavigate();
  const process = useMemo(() => (processId ? getProcess(processId) : undefined), [processId]);

  const [responses, setResponses] = useState<Record<SelectionModule, ActivityResponse[]>>({
    assessment: [],
    assignment: [],
    interview: [],
  });
  const [applications, setApplications] = useState<AppSubmission[]>([]);
  const [search, setSearch] = useState('');
  const [openRow, setOpenRow] = useState<{ row: StepRow; step: StoredProcessStep } | null>(null);

  const load = () => {
    ensureSeed();
    setResponses({
      assessment: read<ActivityResponse>(RESPONSE_KEYS.assessment),
      assignment: read<ActivityResponse>(RESPONSE_KEYS.assignment),
      interview: read<ActivityResponse>(RESPONSE_KEYS.interview),
    });
    setApplications(read<AppSubmission>(APP_KEY));
  };

  useEffect(() => {
    load();
  }, [processId]);

  const activityTitle = (module: SelectionModule, activityId?: string) => {
    if (!activityId) return undefined;
    const found = read<any>(STORAGE_KEYS[module]).find((a) => a.id === activityId);
    return found?.title as string | undefined;
  };

  const rowsForStep = (step: StoredProcessStep): StepRow[] => {
    const module = STEP_MODULE[step.type];
    let rows: StepRow[];
    if (module) {
      const list = responses[module].filter((r) => (step.activityId ? r.activityId === step.activityId : true));
      rows = list.map((r) => ({
        kind: 'response' as const,
        id: r.id,
        name: r.studentName,
        email: r.studentEmail,
        submittedAt: r.submittedAt,
        score: r.score,
        maxScore: r.maxScore,
        status: r.selectionStatus,
        response: r,
      }));
    } else {
      const scoped = applications.filter(
        (a) => String(a.courseId) === String(process?.courseId) || applications.length > 0
      );
      rows = scoped.map((a) => ({
        kind: 'application' as const,
        id: a.id,
        name: a.applicantName,
        email: a.applicantEmail,
        submittedAt: typeof a.submittedAt === 'string' ? a.submittedAt : undefined,
        score: a.matchScore,
        maxScore: 100,
        status: appStatusToSelection(a.status),
        application: a,
      }));
    }
    const q = search.trim().toLowerCase();
    return q ? rows.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)) : rows;
  };

  const applyStatus = (row: StepRow, step: StoredProcessStep, status: SelectionStatus) => {
    if (row.kind === 'response') {
      const module = STEP_MODULE[step.type]!;
      const next = read<ActivityResponse>(RESPONSE_KEYS[module]).map((r) =>
        r.id === row.id ? { ...r, selectionStatus: status } : r
      );
      write(RESPONSE_KEYS[module], next);
      const history = read<SelectionStatusEntry>(STATUS_HISTORY_KEY);
      history.push({
        studentId: row.response.studentId,
        module,
        activityId: row.response.activityId,
        status,
        updatedAt: new Date().toISOString(),
      });
      write(STATUS_HISTORY_KEY, history);
    } else {
      const next = read<AppSubmission>(APP_KEY).map((a) =>
        a.id === row.id ? { ...a, status: selectionToAppStatus(status) } : a
      );
      write(APP_KEY, next);
    }
    load();
    setOpenRow(null);
    toast({ title: 'Status updated', description: `${row.name} marked as ${status.replace('_', ' ')}.` });
  };

  if (!process) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/university/process-steps')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to selection processes
        </Button>
        <p className="text-muted-foreground">This selection process could not be found.</p>
      </div>
    );
  }

  const steps = [...process.steps].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => navigate('/university/process-steps')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to selection processes
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{process.courseName}</h1>
            <p className="text-sm text-muted-foreground">
              {steps.length} steps · {process.totalDuration} · updated{' '}
              {new Date(process.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students"
                className="w-[240px] pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => navigate(`/university/process-configuration/${process.courseId}`)}>
              Edit process
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Selection steps</CardTitle>
          <CardDescription>Steps appear in the order configured for this course.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <Badge variant="outline" className="gap-1 py-1">
                  {stepIcon(s.type)}
                  {i + 1}. {s.name}
                </Badge>
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      <Accordion type="multiple" defaultValue={[steps[0]?.id]} className="space-y-3">
        {steps.map((step, index) => {
          const rows = rowsForStep(step);
          const module = STEP_MODULE[step.type];
          const title = module ? activityTitle(module, step.activityId) : undefined;
          return (
            <AccordionItem key={step.id} value={step.id} className="rounded-lg border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-1 flex-wrap items-center justify-between gap-3 pr-3 text-left">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{step.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {title ? `${title} · ` : ''}
                        {step.responsible} · {step.duration}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{rows.length} students</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {rows.length === 0 ? (
                  <p className="pb-4 text-sm text-muted-foreground">No students at this step yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="cursor-pointer"
                          onClick={() => setOpenRow({ row, step })}
                        >
                          <TableCell>
                            <div className="font-medium">{row.name}</div>
                            <div className="text-xs text-muted-foreground">{row.email}</div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {row.submittedAt ? new Date(row.submittedAt).toLocaleDateString() : '—'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {row.score !== undefined ? `${row.score}/${row.maxScore ?? 100}` : '—'}
                          </TableCell>
                          <TableCell>
                            <SelectionStatusBadge status={row.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenRow({ row, step });
                              }}
                            >
                              View response
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Sheet open={!!openRow} onOpenChange={(open) => !open && setOpenRow(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {openRow && (
            <>
              <SheetHeader>
                <SheetTitle>{openRow.row.name}</SheetTitle>
                <SheetDescription>
                  {openRow.step.name} · {openRow.row.email}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-5 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <SelectionStatusBadge status={openRow.row.status} />
                  {openRow.row.score !== undefined && (
                    <Badge variant="outline">
                      Score {openRow.row.score}/{openRow.row.maxScore ?? 100}
                    </Badge>
                  )}
                  {openRow.row.submittedAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(openRow.row.submittedAt).toLocaleString()}
                    </span>
                  )}
                </div>

                <Separator />

                {openRow.row.kind === 'application' ? (
                  <div className="space-y-4">
                    {openRow.step.type === 'document-review' ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Documents</p>
                        {(openRow.row.application.documents ?? []).length === 0 && (
                          <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                        )}
                        {(openRow.row.application.documents ?? []).map((d) => (
                          <div
                            key={d.id}
                            className="flex items-center justify-between rounded-lg border border-border p-3"
                          >
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-primary" />
                              <span>{d.name}</span>
                              {d.status && (
                                <Badge variant="outline" className="capitalize">
                                  {d.status}
                                </Badge>
                              )}
                            </div>
                            {d.url && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={d.url} target="_blank" rel="noreferrer">
                                  <Download className="mr-2 h-4 w-4" />
                                  Open
                                </a>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Application details</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {Object.entries(openRow.row.application.formData ?? {})
                            .filter(([, v]) => typeof v !== 'object')
                            .map(([k, v]) => (
                              <div key={k} className="rounded-md bg-muted/40 p-3">
                                <p className="text-xs capitalize text-muted-foreground">
                                  {k.replace(/[_-]/g, ' ')}
                                </p>
                                <p className="text-sm">{String(v)}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : openRow.step.type === 'assignment' || openRow.step.type === 'sop' ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Submitted work</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="capitalize">
                        {(openRow.row.response.submissionType ?? 'file').replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {openRow.row.response.submissionState === 'on_time'
                          ? 'On time'
                          : openRow.row.response.submissionState === 'late'
                            ? 'Late submission'
                            : 'Not submitted'}
                      </Badge>
                    </div>
                    {openRow.row.response.submissionType === 'file' && openRow.row.response.submissionContent && (
                      <div className="flex items-center justify-between rounded-lg border border-border p-3">
                        <span className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-primary" />
                          {openRow.row.response.submissionFileName ?? 'Submitted file'}
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <a href={openRow.row.response.submissionContent} target="_blank" rel="noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      </div>
                    )}
                    {openRow.row.response.submissionType === 'link' && openRow.row.response.submissionContent && (
                      <a
                        href={openRow.row.response.submissionContent}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-primary underline"
                      >
                        <Link2 className="h-4 w-4" />
                        {openRow.row.response.submissionContent}
                      </a>
                    )}
                    {(openRow.row.response.submissionType === 'text' ||
                      openRow.row.response.submissionType === 'other') && (
                      <p className="whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-sm">
                        {openRow.row.response.submissionContent || 'No content submitted.'}
                      </p>
                    )}
                    {openRow.row.response.remarks && (
                      <p className="text-sm text-muted-foreground">Remarks: {openRow.row.response.remarks}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-medium">
                      {openRow.step.type === 'interview' ? 'Interview responses' : 'Question-wise response'}
                    </p>
                    {openRow.row.response.answers.length === 0 && (
                      <p className="text-sm text-muted-foreground">No answers recorded.</p>
                    )}
                    {openRow.row.response.answers.map((a, i) => {
                      const correct = a.correctAnswer ? a.answer.trim() === a.correctAnswer.trim() : undefined;
                      return (
                        <div key={a.id} className="rounded-lg border border-border p-3">
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <p className="text-sm font-medium">
                              Q{i + 1}. {a.question}
                            </p>
                            <div className="flex shrink-0 items-center gap-2">
                              <Badge variant="outline">
                                {a.marks ?? 0}/{a.maxMarks}
                              </Badge>
                              {correct !== undefined &&
                                (correct ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-destructive" />
                                ))}
                            </div>
                          </div>
                          {a.videoUrl && (
                            <a
                              href={a.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mb-2 flex items-center gap-2 text-sm text-primary underline"
                            >
                              <Video className="h-4 w-4" />
                              Play recorded answer
                            </a>
                          )}
                          <p className="whitespace-pre-wrap rounded-md bg-muted/40 p-3 text-sm">
                            {a.answer || 'No answer provided.'}
                          </p>
                          {a.correctAnswer && (
                            <p className="mt-2 text-xs text-muted-foreground">Expected: {a.correctAnswer}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <Separator />

                <div className="flex flex-wrap gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => applyStatus(openRow.row, openRow.step, 'accepted')}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => applyStatus(openRow.row, openRow.step, 'on_hold')}
                  >
                    <PauseCircle className="mr-2 h-4 w-4" />
                    On Hold
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => applyStatus(openRow.row, openRow.step, 'rejected')}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
