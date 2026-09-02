// Shared types for the Selection Process modules: Assessment, Assignment, Interview

export type SelectionStatus = 'pending' | 'shortlisted' | 'accepted' | 'rejected' | 'on_hold';

export const SELECTION_STATUSES: { value: SelectionStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'on_hold', label: 'On Hold' },
];

export type ActivityStatus = 'draft' | 'active' | 'closed';

export const ACTIVITY_STATUSES: { value: ActivityStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
];

export type SelectionModule = 'assessment' | 'assignment' | 'interview';

export interface BaseActivity {
  id: string;
  courseId: string;
  title: string;
  description: string;
  status: ActivityStatus;
  startAt: string;
  endAt: string;
  passingScore: number;
  shortlistingScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Assessment extends BaseActivity {
  numberOfQuestions: number;
  maximumMarks: number;
  questionType: 'mcq' | 'descriptive' | 'mixed';
  durationMinutes: number;
  maxAttempts: number;
  randomizeQuestions: boolean;
  negativeMarking: boolean;
  instructions?: string;
}

export interface Assignment extends BaseActivity {
  assignmentType: string;
  maximumMarks: number;
  submissionType: 'file' | 'text' | 'link' | 'other';
  allowedFileTypes: string;
  maxFileSizeMb: number;
  lateSubmissionAllowed: boolean;
  referenceFileUrl?: string;
  referenceFileName?: string;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  mandatory: boolean;
  marks?: number;
}

export interface Interview extends BaseActivity {
  interviewType: 'video' | 'live' | 'other';
  durationMinutes: number;
  questions: InterviewQuestion[];
  maximumMarks?: number;
  preparationTimeSeconds: number;
  responseTimeSeconds: number;
  meetingLink?: string;
  meetingPlatform?: 'zoom' | 'teams' | 'google_meet' | 'other';
}

export interface ResponseAnswer {
  id: string;
  question: string;
  answer: string;
  correctAnswer?: string;
  marks?: number;
  maxMarks: number;
  mandatory?: boolean;
  videoUrl?: string;
  rating?: number;
}

export interface ActivityResponse {
  id: string;
  activityId: string;
  module: SelectionModule;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  submittedAt: string;
  score: number;
  maxScore: number;
  selectionStatus: SelectionStatus;
  remarks?: string;
  answers: ResponseAnswer[];
  // assignment specific
  submissionState?: 'on_time' | 'late' | 'pending';
  submissionType?: 'file' | 'text' | 'link' | 'other';
  submissionContent?: string;
  submissionFileName?: string;
  // interview specific
  completionStatus?: 'completed' | 'partial' | 'not_attempted';
}

export interface SelectionStatusEntry {
  studentId: string;
  module: SelectionModule;
  activityId: string;
  status: SelectionStatus;
  updatedAt: string;
  remarks?: string;
}

export const MODULE_LABEL: Record<SelectionModule, string> = {
  assessment: 'Assessment',
  assignment: 'Assignment',
  interview: 'Interview',
};

export type QuestionType = 'mcq_single' | 'mcq_multiple' | 'true_false' | 'descriptive';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  order: number;
  type: QuestionType;
  text: string;
  options: QuestionOption[];
  correctOptionIds: string[];
  modelAnswer?: string;
  marks: number;
  negativeMarks: number;
  instructions?: string;
  mediaUrl?: string;
  mediaName?: string;
}
