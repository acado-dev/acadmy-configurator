import { useCallback, useEffect, useState } from 'react';
import { AssessmentQuestion } from '@/types/selection';
import { ensureQuestionSeed, readQuestions, writeQuestions } from '@/lib/assessmentQuestions';

export const useAssessmentQuestions = (assessmentId?: string) => {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);

  const load = useCallback(() => {
    ensureQuestionSeed();
    const all = readQuestions()
      .filter((q) => q.assessmentId === assessmentId)
      .sort((a, b) => a.order - b.order);
    setQuestions(all);
  }, [assessmentId]);

  useEffect(() => {
    load();
  }, [load]);

  const persist = (next: AssessmentQuestion[]) => {
    const others = readQuestions().filter((q) => q.assessmentId !== assessmentId);
    const ordered = next.map((q, i) => ({ ...q, order: i }));
    writeQuestions([...others, ...ordered]);
    setQuestions(ordered);
  };

  const addQuestion = (question: AssessmentQuestion) => persist([...questions, question]);

  const addQuestions = (list: AssessmentQuestion[]) => persist([...questions, ...list]);

  const updateQuestion = (id: string, data: Partial<AssessmentQuestion>) =>
    persist(questions.map((q) => (q.id === id ? { ...q, ...data } : q)));

  const deleteQuestion = (id: string) => persist(questions.filter((q) => q.id !== id));

  const reorder = (from: number, to: number) => {
    const next = [...questions];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persist(next);
  };

  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  return { questions, addQuestion, addQuestions, updateQuestion, deleteQuestion, reorder, totalMarks, reload: load };
};

export const questionCountFor = (assessmentId: string) =>
  readQuestions().filter((q) => q.assessmentId === assessmentId).length;
