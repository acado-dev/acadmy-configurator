import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ACTIVITY_STATUSES, ActivityStatus, Assignment } from '@/types/selection';
import { useSelectionActivities } from '@/hooks/useSelectionActivities';

const toLocalInput = (iso?: string) => (iso ? new Date(iso).toISOString().slice(0, 16) : '');

const AssignmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activities, courses, createActivity, updateActivity } = useSelectionActivities('assignment');
  const isEdit = !!id;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    courseId: '',
    title: '',
    description: '',
    startAt: '',
    endAt: '',
    assignmentType: 'Case Study',
    maximumMarks: 100,
    passingScore: 40,
    shortlistingScore: 70,
    submissionType: 'file' as Assignment['submissionType'],
    allowedFileTypes: 'pdf, doc, docx',
    maxFileSizeMb: 10,
    lateSubmissionAllowed: false,
    referenceFileUrl: '',
    referenceFileName: '',
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
      assignmentType: existing.assignmentType,
      maximumMarks: existing.maximumMarks,
      passingScore: existing.passingScore,
      shortlistingScore: existing.shortlistingScore,
      submissionType: existing.submissionType,
      allowedFileTypes: existing.allowedFileTypes,
      maxFileSizeMb: existing.maxFileSizeMb,
      lateSubmissionAllowed: existing.lateSubmissionAllowed,
      referenceFileUrl: existing.referenceFileUrl ?? '',
      referenceFileName: existing.referenceFileName ?? '',
      status: existing.status,
    });
  }, [isEdit, id, activities.length]);

  const set = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      set('referenceFileUrl', String(reader.result));
      set('referenceFileName', file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.courseId || !form.title || !form.startAt || !form.endAt) {
      toast({
        title: 'Missing details',
        description: 'Course, title, start date and submission deadline are required.',
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
      toast({ title: 'Assignment updated' });
    } else {
      createActivity(payload as any);
      toast({ title: 'Assignment created' });
    }
    navigate('/university/assignments');
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => navigate('/university/assignments')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to assignments
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{isEdit ? 'Edit Assignment' : 'Create New Assignment'}</h1>
        <p className="text-sm text-muted-foreground">Set instructions, deadline and how students should submit.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assignment details</CardTitle>
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
            <Label htmlFor="title">Assignment Title *</Label>
            <Input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description / Instructions</Label>
            <Textarea id="description" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startAt">Start Date &amp; Time *</Label>
            <Input id="startAt" type="datetime-local" value={form.startAt} onChange={(e) => set('startAt', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endAt">Submission Deadline *</Label>
            <Input id="endAt" type="datetime-local" value={form.endAt} onChange={(e) => set('endAt', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignmentType">Assignment Type</Label>
            <Input id="assignmentType" value={form.assignmentType} onChange={(e) => set('assignmentType', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maximumMarks">Maximum Marks</Label>
            <Input
              id="maximumMarks"
              type="number"
              min={1}
              value={form.maximumMarks}
              onChange={(e) => set('maximumMarks', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passingScore">Passing Marks</Label>
            <Input
              id="passingScore"
              type="number"
              min={0}
              value={form.passingScore}
              onChange={(e) => set('passingScore', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortlistingScore">Shortlisting Marks</Label>
            <Input
              id="shortlistingScore"
              type="number"
              min={0}
              value={form.shortlistingScore}
              onChange={(e) => set('shortlistingScore', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Submission Type</Label>
            <Select value={form.submissionType} onValueChange={(v) => set('submissionType', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="file">File Upload</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
            <Input
              id="allowedFileTypes"
              value={form.allowedFileTypes}
              onChange={(e) => set('allowedFileTypes', e.target.value)}
              placeholder="pdf, doc, docx"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxFileSizeMb">Maximum File Size (MB)</Label>
            <Input
              id="maxFileSizeMb"
              type="number"
              min={1}
              value={form.maxFileSizeMb}
              onChange={(e) => set('maxFileSizeMb', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Reference / attachment file</Label>
            <Tabs defaultValue="upload">
              <TabsList>
                <TabsTrigger value="upload">Upload file</TabsTrigger>
                <TabsTrigger value="url">Use URL</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="pt-3">
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose file
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {form.referenceFileName || 'No file selected'}
                  </span>
                </div>
              </TabsContent>
              <TabsContent value="url" className="pt-3">
                <Input
                  placeholder="https://example.com/reference.pdf"
                  value={form.referenceFileUrl.startsWith('data:') ? '' : form.referenceFileUrl}
                  onChange={(e) => {
                    set('referenceFileUrl', e.target.value);
                    set('referenceFileName', e.target.value.split('/').pop() ?? '');
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium">Allow late submissions</p>
              <p className="text-xs text-muted-foreground">Accept work submitted after the deadline</p>
            </div>
            <Switch checked={form.lateSubmissionAllowed} onCheckedChange={(v) => set('lateSubmissionAllowed', v)} />
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
        <Button variant="outline" onClick={() => navigate('/university/assignments')}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          {isEdit ? 'Save changes' : 'Create assignment'}
        </Button>
      </div>
    </div>
  );
};

export default AssignmentForm;
