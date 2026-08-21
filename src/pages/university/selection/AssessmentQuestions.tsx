import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, GripVertical, Paperclip, Plus, Trash2, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { AssessmentQuestion } from '@/types/selection';
import { useSelectionActivities } from '@/hooks/useSelectionActivities';
import { useAssessmentQuestions } from '@/hooks/useAssessmentQuestions';
import { blankQuestion, correctAnswerText, parseBulkQuestions, questionTypeLabel } from '@/lib/assessmentQuestions';
import QuestionEditorDialog from '@/components/selection/QuestionEditorDialog';
import { selBase } from '@/lib/selectionPaths';

const AssessmentQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getActivity, courseName, updateActivity } = useSelectionActivities('assessment');
  const { questions, addQuestion, addQuestions, updateQuestion, deleteQuestion, reorder, totalMarks } =
    useAssessmentQuestions(id);

  const assessment = getActivity(id);
  const target = assessment?.numberOfQuestions ?? 0;

  const [editing, setEditing] = useState<AssessmentQuestion | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const progress = useMemo(
    () => (target > 0 ? Math.min(100, Math.round((questions.length / target) * 100)) : questions.length ? 100 : 0),
    [questions.length, target]
  );

  const openNew = () => {
    setEditing(blankQuestion(id ?? '', questions.length));
    setEditorOpen(true);
  };

  const openEdit = (q: AssessmentQuestion) => {
    setEditing(q);
    setEditorOpen(true);
  };

  const handleSave = (q: AssessmentQuestion) => {
    const exists = questions.some((x) => x.id === q.id);
    if (exists) {
      updateQuestion(q.id, q);
      toast({ title: 'Question updated' });
    } else {
      addQuestion(q);
      toast({ title: 'Question added' });
    }
    setEditorOpen(false);
  };

  const handleBulk = () => {
    const { questions: parsed, errors } = parseBulkQuestions(bulkText, id ?? '', questions.length);
    if (!parsed.length) {
      toast({ title: 'Nothing to import', description: 'Add at least one valid line.', variant: 'destructive' });
      return;
    }
    addQuestions(parsed);
    setBulkOpen(false);
    setBulkText('');
    toast({
      title: `${parsed.length} question${parsed.length > 1 ? 's' : ''} imported`,
      description: errors.length ? errors.slice(0, 3).join(' ') : undefined,
    });
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    reorder(dragIndex, index);
    setDragIndex(null);
  };

  const publish = () => {
    if (!id) return;
    if (questions.length === 0) {
      toast({ title: 'Add at least one question before publishing', variant: 'destructive' });
      return;
    }
    updateActivity(id, { status: 'active', numberOfQuestions: questions.length } as any);
    toast({ title: 'Assessment published', description: `${questions.length} questions are live.` });
    navigate(`${selBase()}/assessments`);
  };

  if (!assessment) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`${selBase()}/assessments`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to assessments
        </Button>
        <p className="text-muted-foreground">Assessment not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => navigate(`${selBase()}/assessments`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to assessments
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Questions — {assessment.title}</h1>
        <p className="text-sm text-muted-foreground">
          {courseName(assessment.courseId)} · Review the question paper, then save or publish the assessment.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 pb-3">
          <div className="space-y-1">
            <CardTitle className="text-base">
              {questions.length}
              {target ? `/${target}` : ''} Questions Added
            </CardTitle>
            <p className="text-xs text-muted-foreground">Total marks: {totalMarks}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setBulkOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload Questions
            </Button>
            <Button onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead className="w-16">#</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Question Type</TableHead>
                <TableHead className="w-20">Marks</TableHead>
                <TableHead>Correct Answer</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No questions added yet. Use “Add Question” or bulk upload.
                  </TableCell>
                </TableRow>
              )}
              {questions.map((q, index) => (
                <TableRow
                  key={q.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  className={dragIndex === index ? 'opacity-60' : undefined}
                >
                  <TableCell className="cursor-grab text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="max-w-[320px]">
                    <p className="font-medium">{q.text}</p>
                    {q.instructions && <p className="text-xs text-muted-foreground">{q.instructions}</p>}
                    {q.mediaUrl && (
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Paperclip className="h-3 w-3" />
                        {q.mediaName ?? 'Attachment'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{questionTypeLabel(q.type)}</Badge>
                  </TableCell>
                  <TableCell>
                    {q.marks}
                    {q.negativeMarks ? <span className="text-xs text-destructive"> / -{q.negativeMarks}</span> : null}
                  </TableCell>
                  <TableCell className="max-w-[220px] text-sm">{correctAnswerText(q)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(q)} aria-label="Edit question">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setToDelete(q.id)}
                        aria-label="Delete question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(`${selBase()}/assessments/${assessment.id}/edit`)}>
          Edit assessment details
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (id) updateActivity(id, { numberOfQuestions: questions.length } as any);
            toast({ title: 'Questions saved' });
            navigate(`${selBase()}/assessments`);
          }}
        >
          Save as draft
        </Button>
        <Button onClick={publish}>Publish assessment</Button>
      </div>

      <QuestionEditorDialog open={editorOpen} onOpenChange={setEditorOpen} question={editing} onSave={handleSave} />

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk upload questions</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              One question per line, fields separated by <code>|</code>:
              <br />
              <code>Question | Type | Option A;Option B;Option C | Correct (A or A,C or True) | Marks | Negative</code>
              <br />
              Types: MCQ Single, MCQ Multiple, True/False, Descriptive.
            </p>
            <Textarea
              rows={8}
              placeholder={'What is 2+2? | MCQ Single | 3;4;5;6 | B | 2 | 0.5\nThe earth is flat. | True/False | | False | 1 | 0'}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />
            <div>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setBulkText(String(reader.result));
                  reader.readAsText(file);
                }}
                className="text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulk}>Import questions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this question?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) deleteQuestion(toDelete);
                setToDelete(null);
                toast({ title: 'Question deleted' });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssessmentQuestions;
