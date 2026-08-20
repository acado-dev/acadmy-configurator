import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ACTIVITY_STATUSES, ActivityStatus, Assessment } from '@/types/selection';
import { useSelectionActivities } from '@/hooks/useSelectionActivities';
import { selBase } from '@/lib/selectionPaths';

const toLocalInput = (iso?: string) => (iso ? new Date(iso).toISOString().slice(0, 16) : '');

const AssessmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activities, courses, createActivity, updateActivity } = useSelectionActivities('assessment');
  const isEdit = !!id;

  const [form, setForm] = useState({
    courseId: '',
    title: '',
    description: '',
    startAt: '',
    endAt: '',
    numberOfQuestions: 10,
    questionType: 'mcq' as Assessment['questionType'],
    durationMinutes: 60,
    maxAttempts: 1,
    passingScore: 40,
    shortlistingScore: 70,
    randomizeQuestions: false,
    negativeMarking: false,
    instructions: '',
    status: 'draft' as ActivityStatus,
  });

  useEffect(() => {
    if (!isEdit) return;
    const existing = activities.find((a) => a.id === id);
    if (!existing) return;
    setForm({
      courseId: existing.courseId,
      title: existing.title,
      description: existing.description,
      startAt: toLocalInput(existing.startAt),
      endAt: toLocalInput(existing.endAt),
      numberOfQuestions: existing.numberOfQuestions,
      questionType: existing.questionType,
      durationMinutes: existing.durationMinutes,
      maxAttempts: existing.maxAttempts,
      passingScore: existing.passingScore,
      shortlistingScore: existing.shortlistingScore,
      randomizeQuestions: existing.randomizeQuestions,
      negativeMarking: existing.negativeMarking,
      instructions: existing.instructions ?? '',
      status: existing.status,
    });
  }, [isEdit, id, activities.length]);

  const set = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.courseId || !form.title || !form.startAt || !form.endAt) {
      toast({
        title: 'Missing details',
        description: 'Course, title, start and end date & time are required.',
        variant: 'destructive',
      });
      return;
    }
    const payload = {
      ...form,
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
    };
    if (isEdit && id) {
      updateActivity(id, payload as any);
      toast({ title: 'Assessment updated' });
    } else {
      createActivity(payload as any);
      toast({ title: 'Assessment created' });
    }
    navigate(`${selBase()}/assessments`);
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => navigate(`${selBase()}/assessments`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to assessments
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{isEdit ? 'Edit Assessment' : 'Create New Assessment'}</h1>
        <p className="text-sm text-muted-foreground">Configure the assessment window, questions and shortlisting rules.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assessment details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Select Course *</Label>
            <Select value={form.courseId} onValueChange={(v) => set('courseId', v)}>
              <SelectTrigger>
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
            <Label htmlFor="title">Assessment Title *</Label>
            <Input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startAt">Start Date &amp; Time *</Label>
            <Input id="startAt" type="datetime-local" value={form.startAt} onChange={(e) => set('startAt', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endAt">End Date &amp; Time *</Label>
            <Input id="endAt" type="datetime-local" value={form.endAt} onChange={(e) => set('endAt', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numberOfQuestions">Number of Questions</Label>
            <Input
              id="numberOfQuestions"
              type="number"
              min={1}
              value={form.numberOfQuestions}
              onChange={(e) => set('numberOfQuestions', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Question Type</Label>
            <Select value={form.questionType} onValueChange={(v) => set('questionType', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">Multiple choice</SelectItem>
                <SelectItem value="descriptive">Descriptive</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="passingScore">Passing Score (%)</Label>
            <Input
              id="passingScore"
              type="number"
              min={0}
              max={100}
              value={form.passingScore}
              onChange={(e) => set('passingScore', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortlistingScore">Shortlisting Score (%)</Label>
            <Input
              id="shortlistingScore"
              type="number"
              min={0}
              max={100}
              value={form.shortlistingScore}
              onChange={(e) => set('shortlistingScore', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="durationMinutes">Duration (minutes)</Label>
            <Input
              id="durationMinutes"
              type="number"
              min={1}
              value={form.durationMinutes}
              onChange={(e) => set('durationMinutes', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxAttempts">Maximum Attempts</Label>
            <Input
              id="maxAttempts"
              type="number"
              min={1}
              value={form.maxAttempts}
              onChange={(e) => set('maxAttempts', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="instructions">Instructions for candidates</Label>
            <Textarea
              id="instructions"
              rows={3}
              value={form.instructions}
              onChange={(e) => set('instructions', e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium">Randomize questions</p>
              <p className="text-xs text-muted-foreground">Shuffle question order for every candidate</p>
            </div>
            <Switch checked={form.randomizeQuestions} onCheckedChange={(v) => set('randomizeQuestions', v)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium">Negative marking</p>
              <p className="text-xs text-muted-foreground">Deduct marks for incorrect answers</p>
            </div>
            <Switch checked={form.negativeMarking} onCheckedChange={(v) => set('negativeMarking', v)} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set('status', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(`${selBase()}/assessments`)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          {isEdit ? 'Save changes' : 'Create assessment'}
        </Button>
      </div>
    </div>
  );
};

export default AssessmentForm;
