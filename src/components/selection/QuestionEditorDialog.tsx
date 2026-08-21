import React, { useEffect, useRef, useState } from 'react';
import { Paperclip, Plus, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { AssessmentQuestion, QuestionType } from '@/types/selection';
import { QUESTION_TYPES, isMcq, trueFalseOptions } from '@/lib/assessmentQuestions';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: AssessmentQuestion | null;
  onSave: (question: AssessmentQuestion) => void;
}

const QuestionEditorDialog = ({ open, onOpenChange, question, onSave }: Props) => {
  const [draft, setDraft] = useState<AssessmentQuestion | null>(question);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(question);
  }, [question, open]);

  if (!draft) return null;

  const set = (data: Partial<AssessmentQuestion>) => setDraft((prev) => (prev ? { ...prev, ...data } : prev));

  const changeType = (type: QuestionType) => {
    if (type === 'true_false') {
      set({ type, options: trueFalseOptions, correctOptionIds: [] });
    } else if (isMcq(type)) {
      const options = draft.options.length && draft.options[0].id !== 'true' ? draft.options : [
        { id: 'o1', text: '' },
        { id: 'o2', text: '' },
        { id: 'o3', text: '' },
        { id: 'o4', text: '' },
      ];
      set({ type, options, correctOptionIds: type === 'mcq_single' ? draft.correctOptionIds.slice(0, 1) : draft.correctOptionIds });
    } else {
      set({ type, options: [], correctOptionIds: [] });
    }
  };

  const setOption = (id: string, text: string) =>
    set({ options: draft.options.map((o) => (o.id === id ? { ...o, text } : o)) });

  const addOption = () =>
    set({ options: [...draft.options, { id: `o${Date.now()}`, text: '' }] });

  const removeOption = (id: string) =>
    set({
      options: draft.options.filter((o) => o.id !== id),
      correctOptionIds: draft.correctOptionIds.filter((c) => c !== id),
    });

  const toggleCorrect = (id: string) => {
    if (draft.type === 'mcq_multiple') {
      set({
        correctOptionIds: draft.correctOptionIds.includes(id)
          ? draft.correctOptionIds.filter((c) => c !== id)
          : [...draft.correctOptionIds, id],
      });
    } else {
      set({ correctOptionIds: [id] });
    }
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please attach a file under 5 MB.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set({ mediaUrl: String(reader.result), mediaName: file.name });
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!draft.text.trim()) {
      toast({ title: 'Question required', description: 'Enter the question text.', variant: 'destructive' });
      return;
    }
    if (isMcq(draft.type)) {
      const filled = draft.options.filter((o) => o.text.trim());
      if (filled.length < 2) {
        toast({ title: 'Add answer options', description: 'MCQ questions need at least two options.', variant: 'destructive' });
        return;
      }
      if (!draft.correctOptionIds.length) {
        toast({ title: 'Mark the correct answer', variant: 'destructive' });
        return;
      }
      onSave({ ...draft, options: filled });
      return;
    }
    if (draft.type === 'true_false' && !draft.correctOptionIds.length) {
      toast({ title: 'Mark the correct answer', variant: 'destructive' });
      return;
    }
    onSave(draft);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question?.text ? 'Edit question' : 'Add question'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Question Type *</Label>
            <Select value={draft.type} onValueChange={(v) => changeType(v as QuestionType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUESTION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qtext">Question *</Label>
            <Textarea id="qtext" rows={3} value={draft.text} onChange={(e) => set({ text: e.target.value })} />
          </div>

          {isMcq(draft.type) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Answer options — mark the correct {draft.type === 'mcq_multiple' ? 'answers' : 'answer'}</Label>
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add option
                </Button>
              </div>
              {draft.options.map((o, i) => (
                <div key={o.id} className="flex items-center gap-2">
                  {draft.type === 'mcq_multiple' ? (
                    <Checkbox
                      checked={draft.correctOptionIds.includes(o.id)}
                      onCheckedChange={() => toggleCorrect(o.id)}
                      aria-label={`Mark option ${i + 1} correct`}
                    />
                  ) : (
                    <input
                      type="radio"
                      className="h-4 w-4 accent-primary"
                      checked={draft.correctOptionIds.includes(o.id)}
                      onChange={() => toggleCorrect(o.id)}
                      aria-label={`Mark option ${i + 1} correct`}
                    />
                  )}
                  <span className="w-5 text-sm text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
                  <Input value={o.text} onChange={(e) => setOption(o.id, e.target.value)} placeholder={`Option ${i + 1}`} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeOption(o.id)}
                    aria-label="Remove option"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {draft.type === 'true_false' && (
            <div className="space-y-2">
              <Label>Correct answer</Label>
              <RadioGroup
                value={draft.correctOptionIds[0] ?? ''}
                onValueChange={(v) => set({ correctOptionIds: [v] })}
                className="flex gap-6"
              >
                {trueFalseOptions.map((o) => (
                  <div key={o.id} className="flex items-center gap-2">
                    <RadioGroupItem value={o.id} id={`tf-${o.id}`} />
                    <Label htmlFor={`tf-${o.id}`} className="font-normal">
                      {o.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {draft.type === 'descriptive' && (
            <div className="space-y-2">
              <Label htmlFor="model">Model answer / evaluation guidance</Label>
              <Textarea
                id="model"
                rows={3}
                value={draft.modelAnswer ?? ''}
                onChange={(e) => set({ modelAnswer: e.target.value })}
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="marks">Marks *</Label>
              <Input
                id="marks"
                type="number"
                min={0}
                value={draft.marks}
                onChange={(e) => set({ marks: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neg">Negative marking</Label>
              <Input
                id="neg"
                type="number"
                min={0}
                step="0.25"
                value={draft.negativeMarks}
                onChange={(e) => set({ negativeMarks: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qinstr">Question-level instructions</Label>
            <Textarea
              id="qinstr"
              rows={2}
              value={draft.instructions ?? ''}
              onChange={(e) => set({ instructions: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Attach image / file / media</Label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <Paperclip className="mr-2 h-4 w-4" />
                Upload file
              </Button>
              <Input
                placeholder="…or paste a media URL"
                value={draft.mediaUrl?.startsWith('data:') ? '' : draft.mediaUrl ?? ''}
                onChange={(e) => set({ mediaUrl: e.target.value, mediaName: undefined })}
                className="max-w-xs"
              />
              {draft.mediaUrl && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="max-w-[180px] truncate">{draft.mediaName ?? draft.mediaUrl}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => set({ mediaUrl: undefined, mediaName: undefined })}
                    aria-label="Remove media"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save question</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionEditorDialog;
