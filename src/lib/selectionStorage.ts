import {
  ActivityResponse,
  Assessment,
  Assignment,
  Interview,
  SelectionModule,
} from '@/types/selection';

export const STORAGE_KEYS = {
  assessment: 'universityAssessments',
  assignment: 'universityAssignments',
  interview: 'universityInterviews',
} as const;

export const RESPONSE_KEYS = {
  assessment: 'universityAssessmentResponses',
  assignment: 'universityAssignmentSubmissions',
  interview: 'universityInterviewResponses',
} as const;

export const STATUS_HISTORY_KEY = 'studentSelectionStatus';

export const read = <T,>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
};

export const write = <T,>(key: string, value: T[]) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const maskEmail = (email: string) => {
  const [name, domain] = email.split('@');
  if (!domain) return email;
  const visible = name.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(name.length - 2, 2))}@${domain}`;
};

const iso = (daysFromNow: number, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

const STUDENTS = [
  { id: 'stu-1', name: 'Aarav Sharma', email: 'aarav.sharma@example.com' },
  { id: 'stu-2', name: 'Diya Patel', email: 'diya.patel@example.com' },
  { id: 'stu-3', name: 'Rohan Mehta', email: 'rohan.mehta@example.com' },
  { id: 'stu-4', name: 'Ananya Iyer', email: 'ananya.iyer@example.com' },
  { id: 'stu-5', name: 'Kabir Singh', email: 'kabir.singh@example.com' },
];

const sampleAssessments = (courseIds: string[]): Assessment[] => [
  {
    id: 'as-1',
    courseId: courseIds[0] ?? '1',
    title: 'MBA Aptitude Screening Test',
    description: 'Quantitative, verbal and logical reasoning screening test for MBA applicants.',
    status: 'active',
    startAt: iso(-5, 9),
    endAt: iso(7, 18),
    passingScore: 40,
    shortlistingScore: 70,
    numberOfQuestions: 4,
    questionType: 'mixed',
    durationMinutes: 60,
    maxAttempts: 1,
    randomizeQuestions: true,
    negativeMarking: false,
    instructions: 'No calculators allowed. All questions are compulsory.',
    createdAt: iso(-10),
    updatedAt: iso(-5),
  },
  {
    id: 'as-2',
    courseId: courseIds[1] ?? courseIds[0] ?? '2',
    title: 'Engineering Fundamentals Test',
    description: 'Core physics, mathematics and programming basics.',
    status: 'draft',
    startAt: iso(10, 10),
    endAt: iso(20, 18),
    passingScore: 50,
    shortlistingScore: 75,
    numberOfQuestions: 3,
    questionType: 'mcq',
    durationMinutes: 45,
    maxAttempts: 2,
    randomizeQuestions: false,
    negativeMarking: true,
    createdAt: iso(-3),
    updatedAt: iso(-3),
  },
];

const sampleAssignments = (courseIds: string[]): Assignment[] => [
  {
    id: 'ag-1',
    courseId: courseIds[0] ?? '1',
    title: 'Business Case Study Analysis',
    description: 'Analyse the provided retail turnaround case and submit a 1000-word report.',
    status: 'active',
    startAt: iso(-6, 9),
    endAt: iso(4, 23),
    passingScore: 40,
    shortlistingScore: 70,
    assignmentType: 'Case Study',
    maximumMarks: 100,
    submissionType: 'file',
    allowedFileTypes: 'pdf, doc, docx',
    maxFileSizeMb: 10,
    lateSubmissionAllowed: true,
    createdAt: iso(-8),
    updatedAt: iso(-6),
  },
  {
    id: 'ag-2',
    courseId: courseIds[1] ?? courseIds[0] ?? '2',
    title: 'Statement of Purpose',
    description: 'Write a statement of purpose explaining your motivation for the programme.',
    status: 'closed',
    startAt: iso(-25, 9),
    endAt: iso(-5, 23),
    passingScore: 50,
    shortlistingScore: 80,
    assignmentType: 'Essay',
    maximumMarks: 50,
    submissionType: 'text',
    allowedFileTypes: '',
    maxFileSizeMb: 5,
    lateSubmissionAllowed: false,
    createdAt: iso(-30),
    updatedAt: iso(-5),
  },
];

const sampleInterviews = (courseIds: string[]): Interview[] => [
  {
    id: 'iv-1',
    courseId: courseIds[0] ?? '1',
    title: 'MBA Personal Interview Round',
    description: 'Asynchronous video interview covering motivation, leadership and goals.',
    status: 'active',
    startAt: iso(-2, 11),
    endAt: iso(9, 18),
    passingScore: 50,
    shortlistingScore: 75,
    interviewType: 'video',
    durationMinutes: 20,
    preparationTimeSeconds: 30,
    responseTimeSeconds: 120,
    questions: [
      { id: 'q1', text: 'Why do you want to pursue this programme?', mandatory: true },
      { id: 'q2', text: 'Describe a time you led a team through a difficult situation.', mandatory: true },
      { id: 'q3', text: 'Where do you see yourself five years from now?', mandatory: false },
    ],
    createdAt: iso(-7),
    updatedAt: iso(-2),
  },
];

const sampleResponses = (): ActivityResponse[] => {
  const out: ActivityResponse[] = [];
  const assessmentAnswers = [
    { q: 'If a train travels 300 km in 4 hours, what is its average speed?', a: '75 km/h', c: '75 km/h', max: 25 },
    { q: 'Choose the word closest in meaning to "prudent".', a: 'Careful', c: 'Careful', max: 25 },
    { q: 'Complete the series: 2, 6, 12, 20, ?', a: '28', c: '30', max: 25 },
    { q: 'Briefly explain how you would improve a failing product line.', a: 'I would start with a cost and demand analysis, cut low-margin SKUs and reposition the remaining range around the strongest customer segment.', max: 25 },
  ];
  STUDENTS.forEach((s, i) => {
    const scores = [88, 72, 64, 45, 30];
    out.push({
      id: `resp-as1-${i}`,
      activityId: 'as-1',
      module: 'assessment',
      studentId: s.id,
      studentName: s.name,
      studentEmail: s.email,
      courseId: '1',
      submittedAt: iso(-(i + 1), 12),
      score: scores[i],
      maxScore: 100,
      selectionStatus: i === 0 ? 'shortlisted' : 'pending',
      answers: assessmentAnswers.map((x, j) => ({
        id: `a-${j}`,
        question: x.q,
        answer: x.a,
        correctAnswer: x.c,
        marks: Math.round((scores[i] / 100) * x.max),
        maxMarks: x.max,
      })),
    });
  });

  STUDENTS.slice(0, 4).forEach((s, i) => {
    const marks = [92, 68, 55, 0];
    out.push({
      id: `resp-ag1-${i}`,
      activityId: 'ag-1',
      module: 'assignment',
      studentId: s.id,
      studentName: s.name,
      studentEmail: s.email,
      courseId: '1',
      submittedAt: iso(-(i + 1), 20),
      score: marks[i],
      maxScore: 100,
      selectionStatus: 'pending',
      submissionState: i === 3 ? 'pending' : i === 2 ? 'late' : 'on_time',
      submissionType: 'file',
      submissionContent: i === 3 ? '' : 'https://example.com/uploads/case-study.pdf',
      submissionFileName: i === 3 ? undefined : `${s.name.split(' ')[0].toLowerCase()}-case-study.pdf`,
      answers: [],
      remarks: i === 0 ? 'Excellent structure and clear recommendations.' : undefined,
    });
  });

  STUDENTS.slice(0, 3).forEach((s, i) => {
    const scores = [85, 70, 48];
    out.push({
      id: `resp-iv1-${i}`,
      activityId: 'iv-1',
      module: 'interview',
      studentId: s.id,
      studentName: s.name,
      studentEmail: s.email,
      courseId: '1',
      submittedAt: iso(-(i + 1), 15),
      score: scores[i],
      maxScore: 100,
      selectionStatus: 'pending',
      completionStatus: i === 2 ? 'partial' : 'completed',
      answers: [
        {
          id: 'q1',
          question: 'Why do you want to pursue this programme?',
          answer: 'I want to move from an engineering role into product leadership and this programme has the strongest product management track.',
          maxMarks: 40,
          marks: Math.round(scores[i] * 0.4),
          mandatory: true,
          videoUrl: 'https://example.com/interviews/q1.mp4',
          rating: 4,
        },
        {
          id: 'q2',
          question: 'Describe a time you led a team through a difficult situation.',
          answer: 'During a production outage I coordinated a four-person response team and we restored service within two hours.',
          maxMarks: 40,
          marks: Math.round(scores[i] * 0.4),
          mandatory: true,
          videoUrl: 'https://example.com/interviews/q2.mp4',
          rating: 3,
        },
        {
          id: 'q3',
          question: 'Where do you see yourself five years from now?',
          answer: i === 2 ? '' : 'Leading a product organisation at a growth-stage company.',
          maxMarks: 20,
          marks: i === 2 ? 0 : Math.round(scores[i] * 0.2),
          mandatory: false,
          rating: i === 2 ? 0 : 4,
        },
      ],
    });
  });

  return out;
};

export const getCourses = (): { id: string; name: string }[] => {
  const stored = read<any>('universityCourses');
  return stored.map((c) => ({ id: String(c.id), name: c.name ?? c.shortName ?? 'Untitled course' }));
};

export const ensureSeed = () => {
  const courseIds = getCourses().map((c) => c.id);
  if (!localStorage.getItem(STORAGE_KEYS.assessment)) {
    write(STORAGE_KEYS.assessment, sampleAssessments(courseIds));
  }
  if (!localStorage.getItem(STORAGE_KEYS.assignment)) {
    write(STORAGE_KEYS.assignment, sampleAssignments(courseIds));
  }
  if (!localStorage.getItem(STORAGE_KEYS.interview)) {
    write(STORAGE_KEYS.interview, sampleInterviews(courseIds));
  }
  const all = sampleResponses();
  (['assessment', 'assignment', 'interview'] as SelectionModule[]).forEach((m) => {
    if (!localStorage.getItem(RESPONSE_KEYS[m])) {
      write(
        RESPONSE_KEYS[m],
        all.filter((r) => r.module === m)
      );
    }
  });
};
