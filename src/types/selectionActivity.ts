export type SelectionActivityKind = 'assessment' | 'assignment' | 'interview';

export type SelectionActivityStatus = 'draft' | 'scheduled' | 'active' | 'closed';

export interface SelectionActivity {
  id: string;
  kind: SelectionActivityKind;
  title: string;
  courseId: string;
  courseName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: SelectionActivityStatus;
  instructions?: string;
  responses: number;
  /** Assessment specific */
  questionCount?: number;
  durationMinutes?: number;
  totalMarks?: number;
  passingMarks?: number;
  maxAttempts?: number;
  /** Assignment specific */
  submissionFormat?: string;
  allowLateSubmission?: boolean;
  /** Interview specific */
  mode?: 'online' | 'in-person' | 'telephonic';
  interviewer?: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

export const ACTIVITY_LABELS: Record<SelectionActivityKind, { singular: string; plural: string }> = {
  assessment: { singular: 'Assessment', plural: 'Assessments' },
  assignment: { singular: 'Assignment', plural: 'Assignments' },
  interview: { singular: 'Interview', plural: 'Interviews' },
};

export const ACTIVITY_STATUSES: SelectionActivityStatus[] = ['draft', 'scheduled', 'active', 'closed'];
