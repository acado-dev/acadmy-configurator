import { AssessmentQuestion, QuestionType } from '@/types/selection';
import { read, write } from '@/lib/selectionStorage';

export const QUESTIONS_KEY = 'universityAssessmentQuestions';

export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'mcq_single', label: 'MCQ – Single Choice' },
  { value: 'mcq_multiple', label: 'MCQ – Multiple Choice' },
  { value: 'true_false', label: 'True / False' },
  { value: 'descriptive', label: 'Subjective / Descriptive' },
];

export const questionTypeLabel = (type: QuestionType) =>
  QUESTION_TYPES.find((t) => t.value === type)?.label ?? type;

export const isMcq = (type: QuestionType) => type === 'mcq_single' || type === 'mcq_multiple';

export const readQuestions = () => read<AssessmentQuestion>(QUESTIONS_KEY);
export const writeQuestions = (list: AssessmentQuestion[]) => write(QUESTIONS_KEY, list);

export const correctAnswerText = (q: AssessmentQuestion): string => {
  if (q.type === 'descriptive') return q.modelAnswer ? 'Manual evaluation' : '—';
  if (q.type === 'true_false') return q.correctOptionIds.includes('true') ? 'True' : 'False';
  const labels = q.options
    .map((o, i) => ({ ...o, letter: String.fromCharCode(65 + i) }))
    .filter((o) => q.correctOptionIds.includes(o.id))
    .map((o) => `${o.letter}. ${o.text}`);
  return labels.length ? labels.join(', ') : '—';
};

export const blankQuestion = (assessmentId: string, order: number): AssessmentQuestion => ({
  id: `q-${Date.now()}`,
  assessmentId,
  order,
  type: 'mcq_single',
  text: '',
  options: [
    { id: 'o1', text: '' },
    { id: 'o2', text: '' },
    { id: 'o3', text: '' },
    { id: 'o4', text: '' },
  ],
  correctOptionIds: [],
  marks: 1,
  negativeMarks: 0,
});

export const trueFalseOptions = [
  { id: 'true', text: 'True' },
  { id: 'false', text: 'False' },
];

// Bulk upload: CSV lines "question | type | optionA;optionB;... | correct (letters or True/False) | marks | negative"
export const parseBulkQuestions = (
  raw: string,
  assessmentId: string,
  startOrder: number
): { questions: AssessmentQuestion[]; errors: string[] } => {
  const questions: AssessmentQuestion[] = [];
  const errors: string[] = [];
  raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line, idx) => {
      const parts = line.split('|').map((p) => p.trim());
      if (parts.length < 2) {
        errors.push(`Line ${idx + 1}: needs at least question and type.`);
        return;
      }
      const [text, typeRaw, optionsRaw = '', correctRaw = '', marksRaw = '1', negRaw = '0'] = parts;
      const typeKey = typeRaw.toLowerCase().replace(/[^a-z]/g, '');
      const type: QuestionType =
        typeKey.startsWith('mcqmultiple') || typeKey === 'multiple'
          ? 'mcq_multiple'
          : typeKey.startsWith('true')
            ? 'true_false'
            : typeKey.startsWith('desc') || typeKey.startsWith('subj')
              ? 'descriptive'
              : 'mcq_single';

      const options =
        type === 'true_false'
          ? trueFalseOptions
          : isMcq(type)
            ? optionsRaw
                .split(';')
                .map((o) => o.trim())
                .filter(Boolean)
                .map((o, i) => ({ id: `o${i + 1}`, text: o }))
            : [];

      let correctOptionIds: string[] = [];
      if (type === 'true_false') {
        correctOptionIds = [correctRaw.toLowerCase().startsWith('t') ? 'true' : 'false'];
      } else if (isMcq(type)) {
        correctOptionIds = correctRaw
          .split(/[;,]/)
          .map((c) => c.trim())
          .filter(Boolean)
          .map((c) => {
            const letter = c.toUpperCase().charCodeAt(0) - 65;
            return options[letter]?.id ?? '';
          })
          .filter(Boolean);
        if (!correctOptionIds.length) errors.push(`Line ${idx + 1}: no valid correct answer, saved without one.`);
      }

      questions.push({
        id: `q-${Date.now()}-${idx}`,
        assessmentId,
        order: startOrder + idx,
        type,
        text,
        options,
        correctOptionIds,
        marks: Number(marksRaw) || 1,
        negativeMarks: Number(negRaw) || 0,
      });
    });
  return { questions, errors };
};

const seedFor = (assessmentId: string): AssessmentQuestion[] => [
  {
    id: `${assessmentId}-sq1`,
    assessmentId,
    order: 0,
    type: 'mcq_single',
    text: 'If a train travels 300 km in 4 hours, what is its average speed?',
    options: [
      { id: 'o1', text: '60 km/h' },
      { id: 'o2', text: '75 km/h' },
      { id: 'o3', text: '80 km/h' },
      { id: 'o4', text: '90 km/h' },
    ],
    correctOptionIds: ['o2'],
    marks: 25,
    negativeMarks: 0,
  },
  {
    id: `${assessmentId}-sq2`,
    assessmentId,
    order: 1,
    type: 'true_false',
    text: 'A balance sheet reports a company’s financial position at a point in time.',
    options: trueFalseOptions,
    correctOptionIds: ['true'],
    marks: 25,
    negativeMarks: 0,
  },
  {
    id: `${assessmentId}-sq3`,
    assessmentId,
    order: 2,
    type: 'descriptive',
    text: 'Briefly explain how you would improve a failing product line.',
    options: [],
    correctOptionIds: [],
    marks: 25,
    negativeMarks: 0,
    instructions: 'Answer in 150–200 words.',
  },
];

export const ensureQuestionSeed = () => {
  if (localStorage.getItem(QUESTIONS_KEY)) return;
  writeQuestions(seedFor('as-1'));
};
