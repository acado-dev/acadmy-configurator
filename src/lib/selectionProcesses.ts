// Persistence for configured Selection Processes (course -> ordered steps)
import { SelectionModule } from '@/types/selection';
import { read, write } from '@/lib/selectionStorage';

export type ProcessStepType =
  | 'application'
  | 'interview'
  | 'test'
  | 'sop'
  | 'assignment'
  | 'document-review'
  | 'committee-review'
  | 'final-decision';

export interface StoredProcessStep {
  id: string;
  name: string;
  type: ProcessStepType;
  description: string;
  duration: string;
  responsible: string;
  order: number;
  weight: number;
  activityId?: string;
}

export interface StoredSelectionProcess {
  id: string;
  courseId: string;
  courseName: string;
  steps: StoredProcessStep[];
  totalDuration: string;
  status: 'active' | 'draft';
  updatedAt: string;
}

export const PROCESS_KEY = 'selectionProcesses';

// Step types backed by an activity module (responses live in selection storage)
export const STEP_MODULE: Partial<Record<ProcessStepType, SelectionModule>> = {
  test: 'assessment',
  assignment: 'assignment',
  sop: 'assignment',
  interview: 'interview',
};

export const totalDurationOf = (steps: StoredProcessStep[]) => {
  const days = steps.reduce((sum, s) => {
    const n = parseInt(String(s.duration ?? '').replace(/[^0-9]/g, ''), 10);
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0);
  return days ? `${days} days` : '—';
};

const sampleProcesses = (): StoredSelectionProcess[] => [
  {
    id: 'proc-1',
    courseId: '1',
    courseName: 'Master of Business Administration',
    status: 'active',
    totalDuration: '10 days',
    updatedAt: new Date().toISOString(),
    steps: [
      {
        id: 's1',
        name: 'Application Overview',
        type: 'application',
        description: 'Review of the submitted application form and profile match score.',
        duration: '1 day',
        responsible: 'Admissions Team',
        order: 1,
        weight: 10,
      },
      {
        id: 's2',
        name: 'Document Review',
        type: 'document-review',
        description: 'Verification of academic transcripts, ID and supporting documents.',
        duration: '2 days',
        responsible: 'Verification Desk',
        order: 2,
        weight: 15,
      },
      {
        id: 's3',
        name: 'Assessment',
        type: 'test',
        description: 'Aptitude screening test.',
        duration: '2 days',
        responsible: 'Testing Centre',
        order: 3,
        weight: 25,
        activityId: 'as-1',
      },
      {
        id: 's4',
        name: 'Assignment',
        type: 'assignment',
        description: 'Business case study analysis.',
        duration: '2 days',
        responsible: 'Faculty',
        order: 4,
        weight: 20,
        activityId: 'ag-1',
      },
      {
        id: 's5',
        name: 'Interview',
        type: 'interview',
        description: 'Personal interview round.',
        duration: '2 days',
        responsible: 'Faculty Panel',
        order: 5,
        weight: 20,
        activityId: 'iv-1',
      },
      {
        id: 's6',
        name: 'Final Review',
        type: 'final-decision',
        description: 'Committee decision on admission.',
        duration: '1 day',
        responsible: 'Admission Committee',
        order: 6,
        weight: 10,
      },
    ],
  },
];

export const getProcesses = (): StoredSelectionProcess[] => {
  if (!localStorage.getItem(PROCESS_KEY)) {
    write(PROCESS_KEY, sampleProcesses());
  }
  return read<StoredSelectionProcess>(PROCESS_KEY);
};

export const saveProcess = (process: StoredSelectionProcess) => {
  const all = getProcesses();
  const idx = all.findIndex((p) => p.id === process.id || p.courseId === process.courseId);
  if (idx >= 0) all[idx] = process;
  else all.unshift(process);
  write(PROCESS_KEY, all);
  return process;
};

export const deleteProcess = (id: string) => {
  write(
    PROCESS_KEY,
    getProcesses().filter((p) => p.id !== id)
  );
};

export const getProcess = (id: string) => getProcesses().find((p) => p.id === id);
