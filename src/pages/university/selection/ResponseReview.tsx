import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download, FileText, Link2, Save, Video, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { MODULE_LABEL, SelectionModule, SelectionStatus } from '@/types/selection';
import { useSelectionActivities } from '@/hooks/useSelectionActivities';
import { SelectionStatusSelect } from '@/components/selection/SelectionStatusSelect';
import { StageProgressStrip } from '@/components/selection/StageProgressStrip';
import { selBase } from '@/lib/selectionPaths';

const basePath: Record<SelectionModule, string> = {
  assessment: `${selBase()}/assessments`,
  assignment: `${selBase()}/assignments`,
  interview: `${selBase()}/interviews`,
};

const ResponseReview = ({ module }: { module: SelectionModule }) => {
  const { id, responseId } = useParams();
  const navigate = useNavigate();
  const { getActivity, responses, updateResponse, setSelectionStatus, courseName } =
    useSelectionActivities(module);

  const activity = getActivity(id) as any;
  const response = responses.find((r) => r.id === responseId);

  const [status, setStatus] = useState<SelectionStatus>('pending');
  const [remarks, setRemarks] = useState('');
  const [marks, setMarks] = useState<number>(0);
  const [answerMarks, setAnswerMarks] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!response) return;
    setStatus(response.selectionStatus);
    setRemarks(response.remarks ?? '');
    setMarks(response.score);
    setAnswerMarks(
      response.answers.reduce<Record<string, number>>((acc, a) => {
        acc[a.id] = a.marks ?? 0;
        return acc;
      }, {})
    );
  }, [response?.id]);

  if (!response) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(basePath[module])}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="text-muted-foreground">This record could not be found.</p>
      </div>
    );
  }

  const maxMarks = activity?.maximumMarks ?? response.maxScore;

  const handleSave = () => {
    if (module === 'assignment' && (marks < 0 || marks > maxMarks)) {
      toast({
        title: 'Invalid marks',
        description: `Marks must be between 0 and ${maxMarks}.`,
        variant: 'destructive',
      });
      return;
    }
    const updatedAnswers = response.answers.map((a) => ({ ...a, marks: answerMarks[a.id] ?? a.marks }));
    const computed =
      module === 'assignment'
        ? marks
        : updatedAnswers.reduce((sum, a) => sum + (a.marks ?? 0), 0);
    updateResponse(response.id, { answers: updatedAnswers, score: computed, remarks });
    setSelectionStatus({ ...response, remarks }, status, remarks);
    toast({ title: 'Evaluation saved', description: `${response.studentName}'s record has been updated.` });
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 -ml-2"
          onClick={() => navigate(`${basePath[module]}/${id}/responses`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {module === 'assignment' ? 'submissions' : 'responses'}
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{response.studentName}</h1>
        <p className="text-sm text-muted-foreground">
          {MODULE_LABEL[module]}: {activity?.title} · {courseName(response.courseId)} ·{' '}
          {new Date(response.submittedAt).toLocaleString()}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Progress across stages</CardTitle>
        </CardHeader>
        <CardContent>
          <StageProgressStrip studentId={response.studentId} currentModule={module} currentStatus={status} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {module === 'assignment' ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Submitted work</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant="outline" className="capitalize">
                    {(response.submissionType ?? 'file').replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    {response.submissionState === 'on_time'
                      ? 'On time'
                      : response.submissionState === 'late'
                        ? 'Late submission'
                        : 'Not submitted'}
                  </Badge>
                </div>
                {response.submissionType === 'file' && response.submissionContent && (
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm">{response.submissionFileName ?? 'Submitted file'}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={response.submissionContent} target="_blank" rel="noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                )}
                {response.submissionType === 'link' && response.submissionContent && (
                  <a
                    href={response.submissionContent}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-primary underline"
                  >
                    <Link2 className="h-4 w-4" />
                    {response.submissionContent}
                  </a>
                )}
                {(response.submissionType === 'text' || response.submissionType === 'other') && (
                  <p className="whitespace-pre-wrap rounded-lg bg-muted/40 p-4 text-sm">
                    {response.submissionContent || 'No content submitted.'}
                  </p>
                )}
                {!response.submissionContent && response.submissionType === 'file' && (
                  <p className="text-sm text-muted-foreground">The student has not submitted any work yet.</p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {module === 'interview' ? 'Interview responses' : 'Question-wise response'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {response.answers.length === 0 && (
                  <p className="text-sm text-muted-foreground">No answers recorded.</p>
                )}
                {response.answers.map((a, index) => {
                  const correct = a.correctAnswer ? a.answer.trim() === a.correctAnswer.trim() : undefined;
                  return (
                    <div key={a.id} className="rounded-lg border border-border p-4">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <p className="text-sm font-medium">
                          Q{index + 1}. {a.question}
                        </p>
                        <div className="flex shrink-0 items-center gap-2">
                          {a.mandatory !== undefined && (
                            <Badge variant="outline">{a.mandatory ? 'Mandatory' : 'Optional'}</Badge>
                          )}
                          {correct !== undefined &&
                            (correct ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-destructive" />
                            ))}
                        </div>
                      </div>
                      {a.videoUrl && (
                        <div className="mb-3 flex items-center gap-2 rounded-md bg-muted/40 p-3 text-sm">
                          <Video className="h-4 w-4 text-primary" />
                          <a href={a.videoUrl} target="_blank" rel="noreferrer" className="text-primary underline">
                            Play recorded answer
                          </a>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap rounded-md bg-muted/40 p-3 text-sm">
                        {a.answer || 'No answer provided.'}
                      </p>
                      {a.correctAnswer && (
                        <p className="mt-2 text-xs text-muted-foreground">Expected answer: {a.correctAnswer}</p>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Marks</Label>
                        <Input
                          type="number"
                          className="h-8 w-24"
                          value={answerMarks[a.id] ?? 0}
                          min={0}
                          max={a.maxMarks}
                          onChange={(e) =>
                            setAnswerMarks((prev) => ({ ...prev, [a.id]: Number(e.target.value) }))
                          }
                        />
                        <span className="text-xs text-muted-foreground">/ {a.maxMarks}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evaluation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Current score</p>
                <p className="text-2xl font-bold">
                  {module === 'assignment'
                    ? marks
                    : response.answers.reduce((s, a) => s + (answerMarks[a.id] ?? 0), 0)}
                  <span className="text-base font-normal text-muted-foreground">/{maxMarks}</span>
                </p>
                {activity && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Passing {activity.passingScore} · Shortlisting {activity.shortlistingScore}
                  </p>
                )}
              </div>

              {module === 'assignment' && (
                <div className="space-y-2">
                  <Label htmlFor="marks">Marks awarded (max {maxMarks})</Label>
                  <Input
                    id="marks"
                    type="number"
                    min={0}
                    max={maxMarks}
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks / feedback</Label>
                <Textarea
                  id="remarks"
                  rows={5}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add evaluation notes for this student"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Selection status</Label>
                <SelectionStatusSelect value={status} onChange={setStatus} className="w-full" />
              </div>

              <Button className="w-full" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save evaluation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResponseReview;
