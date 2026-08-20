import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ACTIVITY_STATUSES, ActivityStatus, Interview, InterviewQuestion } from '@/types/selection';
import { useSelectionActivities } from '@/hooks/useSelectionActivities';

const toLocalInput = (iso?: string) => (iso ? new Date(iso).toISOString().slice(0, 16) : '');

const InterviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activities, courses, createActivity, updateActivity } = useSelectionActivities('interview');
  const isEdit = !!id;

  const [form, setForm] = useState({
    courseId: '',
    title: '',
    description: '',
    interviewType: 'video' as Interview['interviewType'],
    startAt: '',
    endAt: '',
    durationMinutes: 20,
    preparationTimeSeconds: 30,
    responseTimeSeconds: 120,
    passingScore: 50,
    shortlistingScore: 75,
    status: 'draft' as ActivityStatus,
  });
  const [questions, setQuestions] = useState<InterviewQuestion[]>([
    { id: `q-${Date.now()}`, text: '', mandatory: true },
  ]);

  useEffect(() => {
    if (!isEdit) return;
    const existing = activities.find((a) => a.id === id);
    if (!existing) return;
    setForm({
      courseId: existing.courseId,
      title: existing.title,
      description: existing.description,
      interviewType: existing.interviewType,
      startAt: toLocalInput(existing.startAt),
      endAt: toLocalInput(existing.endAt),
      durationMinutes: existing.durationMinutes,
      preparationTimeSeconds: existing.preparationTimeSeconds,
      responseTimeSeconds: existing.responseTimeSeconds,
      passingScore: existing.passingScore,
      shortlistingScore: existing.shortlistingScore,
      status: existing.status,
    });
    setQuestions(existing.questions?.length ? existing.questions : [{ id: 'q-1', text: '', mandatory: true }]);
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
    const cleanQuestions = questions.filter((q) => q.text.trim());
    const payload = {
      ...form,
      questions: cleanQuestions,
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
    };
    if (isEdit && id) {
      updateActivity(id, payload as any);
      toast({ title: 'Interview updated' });
    } else {
      createActivity(payload as any);
      toast({ title: 'Interview created' });
    }
    navigate('/university/interviews');
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => navigate('/university/interviews')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to interviews
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{isEdit ? 'Edit Interview' : 'Create New Interview'}</h1>
        <p className="text-sm text-muted-foreground">Define the interview format, timing and question pool.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Interview details</CardTitle>
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
            <Label htmlFor="title">Interview Title *</Label>
            <Input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description / Instructions</Label>
            <Textarea id="description" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Interview Type</Label>
            <Select value={form.interviewType} onValueChange={(v) => set('interviewType', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video (recorded)</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
            <Label htmlFor="startAt">Start Date &amp; Time *</Label>
            <Input id="startAt" type="datetime-local" value={form.startAt} onChange={(e) => set('startAt', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endAt">End Date &amp; Time *</Label>
            <Input id="endAt" type="datetime-local" value={form.endAt} onChange={(e) => set('endAt', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preparationTimeSeconds">Preparation Time (seconds)</Label>
            <Input
              id="preparationTimeSeconds"
              type="number"
              min={0}
              value={form.preparationTimeSeconds}
              onChange={(e) => set('preparationTimeSeconds', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responseTimeSeconds">Response Time per Question (seconds)</Label>
            <Input
              id="responseTimeSeconds"
              type="number"
              min={0}
              value={form.responseTimeSeconds}
              onChange={(e) => set('responseTimeSeconds', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passingScore">Passing Score</Label>
            <Input
              id="passingScore"
              type="number"
              min={0}
              value={form.passingScore}
              onChange={(e) => set('passingScore', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortlistingScore">Shortlisting Score</Label>
            <Input
              id="shortlistingScore"
              type="number"
              min={0}
              value={form.shortlistingScore}
              onChange={(e) => set('shortlistingScore', Number(e.target.value))}
            />
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Question pool ({questions.filter((q) => q.text.trim()).length})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuestions((prev) => [...prev, { id: `q-${Date.now()}`, text: '', mandatory: true }])}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add question
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q, index) => (
            <div key={q.id} className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium">Question {index + 1}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">Mandatory</Label>
                    <Switch
                      checked={q.mandatory}
                      onCheckedChange={(v) =>
                        setQuestions((prev) => prev.map((x) => (x.id === q.id ? { ...x, mandatory: v } : x)))
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setQuestions((prev) => prev.filter((x) => x.id !== q.id))}
                    aria-label="Remove question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                rows={2}
                placeholder="Enter the interview question"
                value={q.text}
                onChange={(e) =>
                  setQuestions((prev) => prev.map((x) => (x.id === q.id ? { ...x, text: e.target.value } : x)))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/university/interviews')}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          {isEdit ? 'Save changes' : 'Create interview'}
        </Button>
      </div>
    </div>
  );
};

export default InterviewForm;
