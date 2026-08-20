import { useCallback, useEffect, useState } from 'react';
import { SelectionActivity, SelectionActivityKind } from '@/types/selectionActivity';

const storageKey = (kind: SelectionActivityKind) => `university_${kind}s`;

export interface CourseOption {
  id: string;
  name: string;
}

const sampleData = (kind: SelectionActivityKind, courses: CourseOption[]): SelectionActivity[] => {
  const course = courses[0] ?? { id: '1', name: 'Master of Business Administration' };
  const now = new Date().toISOString();
  if (kind === 'assessment') {
    return [
      {
        id: 'as-1',
        kind,
        title: 'MBA Aptitude Assessment',
        courseId: course.id,
        courseName: course.name,
        description: 'Quantitative and verbal aptitude screening test for MBA applicants.',
        startDate: '2026-09-01T10:00',
        endDate: '2026-09-15T18:00',
        status: 'active',
        questionCount: 40,
        durationMinutes: 60,
        totalMarks: 100,
        passingMarks: 50,
        maxAttempts: 1,
        responses: 32,
        createdAt: now,
        updatedAt: now,
      },
    ];
  }
  if (kind === 'assignment') {
    return [
      {
        id: 'ag-1',
        kind,
        title: 'Case Study Submission',
        courseId: course.id,
        courseName: course.name,
        description: 'Write a 1000-word analysis on the provided business case.',
        startDate: '2026-09-05T10:00',
        endDate: '2026-09-20T23:59',
        status: 'scheduled',
        submissionFormat: 'PDF',
        allowLateSubmission: false,
        totalMarks: 50,
        responses: 12,
        createdAt: now,
        updatedAt: now,
      },
    ];
  }
  return [
    {
      id: 'iv-1',
      kind,
      title: 'Personal Interview Round',
      courseId: course.id,
      courseName: course.name,
      description: 'Final panel interview for shortlisted candidates.',
      startDate: '2026-09-25T09:00',
      endDate: '2026-09-27T17:00',
      status: 'draft',
      mode: 'online',
      interviewer: 'Admissions Panel',
      responses: 0,
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export const useSelectionActivities = (kind: SelectionActivityKind) => {
  const [activities, setActivities] = useState<SelectionActivity[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);

  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem('universityCourses') || '[]');
    const courseOptions: CourseOption[] = storedCourses.map((c: any) => ({ id: String(c.id), name: c.name }));
    setCourses(courseOptions);

    const stored = localStorage.getItem(storageKey(kind));
    if (stored) {
      setActivities(JSON.parse(stored));
    } else {
      const seed = sampleData(kind, courseOptions);
      localStorage.setItem(storageKey(kind), JSON.stringify(seed));
      setActivities(seed);
    }
  }, [kind]);

  const persist = useCallback(
    (next: SelectionActivity[]) => {
      setActivities(next);
      localStorage.setItem(storageKey(kind), JSON.stringify(next));
    },
    [kind]
  );

  const readAll = useCallback((): SelectionActivity[] => {
    return JSON.parse(localStorage.getItem(storageKey(kind)) || '[]');
  }, [kind]);

  const createActivity = useCallback(
    (data: Omit<SelectionActivity, 'id' | 'kind' | 'responses' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const next: SelectionActivity = {
        ...data,
        kind,
        id: `${kind}-${Date.now()}`,
        responses: 0,
        createdAt: now,
        updatedAt: now,
      };
      persist([...readAll(), next]);
      return next.id;
    },
    [kind, persist, readAll]
  );

  const updateActivity = useCallback(
    (id: string, updates: Partial<SelectionActivity>) => {
      persist(
        readAll().map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a))
      );
    },
    [persist, readAll]
  );

  const deleteActivity = useCallback(
    (id: string) => {
      persist(readAll().filter((a) => a.id !== id));
    },
    [persist, readAll]
  );

  const getActivity = useCallback((id: string) => readAll().find((a) => a.id === id), [readAll]);

  return { activities, courses, createActivity, updateActivity, deleteActivity, getActivity };
};
