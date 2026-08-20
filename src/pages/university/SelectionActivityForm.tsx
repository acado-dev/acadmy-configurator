import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useSelectionActivities } from '@/hooks/useSelectionActivities';
import { ACTIVITY_LABELS, ACTIVITY_STATUSES, SelectionActivityKind, SelectionActivityStatus } from '@/types/selectionActivity';

interface Props {
  kind: SelectionActivityKind;
  basePath?: string;
}

const SelectionActivityForm: React.FC<Props> = ({ kind, basePath }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { courses, createActivity, updateActivity, getActivity } = useSelectionActivities(kind);

  const labels = ACTIVITY_LABELS[kind];
  const root = basePath ?? `/university/${kind}s`;
  const isEdit = !!id;

  const [form, setForm] = useState({
    courseId: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'draft' as SelectionActivityStatus,
    instructions: '',
    questionCount: '',
    durationMinutes: '',
    totalMarks: '',
    passingMarks: '',
    maxAttempts: '1',
    submissionFormat: 'PDF',
    allowLateSubmission: false,
    mode: 'online' as 'online' | 'in-person' | 'telephonic',
    interviewer: '',
    meetingLink: '',
  });

  useEffect(() => {
    if (!id) return;
    const existing = getActivity(id);
    if (!existing) return;
    setForm((prev) => ({
      ...prev,
      courseId: existing.courseId,
      title: existing.title,
      description: existing.description ?? '',
      startDate: existing.startDate ?? '',
      endDate: existing.endDate ?? '',
      status: existing.status,
      instructions: existing.instructions ?? '',
      questionCount: existing.questionCount?.toString() ?? '',
      durationMinutes: existing.durationMinutes?.toString() ?? '',
      totalMarks: existing.totalMarks?.toString() ?? '',
      passingMarks: existing.passingMarks?.toString() ?? '',
      maxAttempts: existing.maxAttempts?.toString() ?? '1',
      submissionFormat: existing.submissionFormat ?? 'PDF',
      allowLateSubmission: existing.allowLateSubmission ?? false,
      mode: existing.mode ?? 'online',
      interviewer: existing.interviewer ?? '',
      meetingLink: existing.meetingLink ?? '',
    }));
  }, [id, getActivity]);

  const set = (key: keyof typeof form, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.courseId) {
      toast({
        title: 'Missing information',
        description: 'Course and title are required.',
        variant: 'destructive',
      });
      return;
    }
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      toast({ title: 'Invalid dates', description: 'End date must be after start date.', variant: 'destructive' });
      return;
    }

    const num = (v: string) => (v === '' ? undefined : Number(v));
    const payload = {
      courseId: form.courseId,
      courseName: courses.find((c) => c.id === form.courseId)?.name ?? '',
      title: form.title.trim(),
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
      instructions: form.instructions,
      totalMarks: num(form.totalMarks),
      ...(kind === 'assessment'
        ? {
            questionCount: num(form.questionCount),
            durationMinutes: num(form.durationMinutes),
            passingMarks: num(form.passingMarks),
            maxAttempts: num(form.maxAttempts),
          }
        : {}),
      ...(kind === 'assignment'
        ? { submissionFormat: form.submissionFormat, allowLateSubmission: form.allowLateSubmission }
        : {}),
      ...(kind === 'interview'
        ? { mode: form.mode, interviewer: form.interviewer, meetingLink: form.meetingLink }
        : {}),
    };

    if (isEdit && id) {
      updateActivity(id, payload);
      toast({ title: `${labels.singular} updated` });
    } else {
      createActivity(payload as any);
      toast({ title: `${labels.singular} created` });
    }
    navigate(root);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(root)} aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEdit ? `Edit ${labels.singular}` : `Create New ${labels.singular}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure the {labels.singular.toLowerCase()} details for the selection process.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Details</CardTitle>
            <CardDescription>Course, title and description</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="course">Select Course *</Label>
              <Select value={form.courseId} onValueChange={(v) => set('courseId', v)}>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">{labels.singular} Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder={`e.g. MBA ${labels.singular} Round 1`}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder={`Brief description of this ${labels.singular.toLowerCase()}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule & Status</CardTitle>
            <CardDescription>Availability window and current state</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date & Time</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date & Time</Label>
              <Input
                id="endDate"
                type="datetime-local"
                min={form.startDate}
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v)}>
                <SelectTrigger id="status" className="capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{labels.singular} Configuration</CardTitle>
            <CardDescription>Evaluation setup and candidate guidance</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {kind === 'assessment' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="questionCount">No. of Questions</Label>
                  <Input
                    id="questionCount"
                    type="number"
                    min={0}
                    value={form.questionCount}
                    onChange={(e) => set('questionCount', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                  <Input
                    id="durationMinutes"
                    type="number"
                    min={0}
                    value={form.durationMinutes}
                    onChange={(e) => set('durationMinutes', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Max Attempts</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    min={1}
                    value={form.maxAttempts}
                    onChange={(e) => set('maxAttempts', e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input
                id="totalMarks"
                type="number"
                min={0}
                value={form.totalMarks}
                onChange={(e) => set('totalMarks', e.target.value)}
              />
            </div>

            {kind === 'assessment' && (
              <div className="space-y-2">
                <Label htmlFor="passingMarks">Passing Marks</Label>
                <Input
                  id="passingMarks"
                  type="number"
                  min={0}
                  value={form.passingMarks}
                  onChange={(e) => set('passingMarks', e.target.value)}
                />
              </div>
            )}

            {kind === 'assignment' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="submissionFormat">Submission Format</Label>
                  <Select value={form.submissionFormat} onValueChange={(v) => set('submissionFormat', v)}>
                    <SelectTrigger id="submissionFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="DOC/DOCX">DOC/DOCX</SelectItem>
                      <SelectItem value="Presentation">Presentation</SelectItem>
                      <SelectItem value="Link">Link / URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3 md:col-span-1">
                  <div>
                    <Label htmlFor="late">Allow late submission</Label>
                    <p className="text-xs text-muted-foreground">Accept after end date</p>
                  </div>
                  <Switch
                    id="late"
                    checked={form.allowLateSubmission}
                    onCheckedChange={(v) => set('allowLateSubmission', v)}
                  />
                </div>
              </>
            )}

            {kind === 'interview' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="mode">Interview Mode</Label>
                  <Select value={form.mode} onValueChange={(v) => set('mode', v)}>
                    <SelectTrigger id="mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="in-person">In-person</SelectItem>
                      <SelectItem value="telephonic">Telephonic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interviewer">Interviewer / Panel</Label>
                  <Input
                    id="interviewer"
                    value={form.interviewer}
                    onChange={(e) => set('interviewer', e.target.value)}
                    placeholder="e.g. Admissions Panel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingLink">Meeting Link</Label>
                  <Input
                    id="meetingLink"
                    value={form.meetingLink}
                    onChange={(e) => set('meetingLink', e.target.value)}
                    placeholder="https://"
                  />
                </div>
              </>
            )}

            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="instructions">Instructions for Candidates</Label>
              <Textarea
                id="instructions"
                rows={3}
                value={form.instructions}
                onChange={(e) => set('instructions', e.target.value)}
                placeholder="Rules, resources allowed, evaluation notes…"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(root)}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            {isEdit ? 'Save Changes' : `Create ${labels.singular}`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SelectionActivityForm;
