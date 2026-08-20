import { useCallback, useEffect, useState } from 'react';
import {
  ActivityResponse,
  Assessment,
  Assignment,
  Interview,
  SelectionModule,
  SelectionStatus,
  SelectionStatusEntry,
} from '@/types/selection';
import {
  ensureSeed,
  getCourses,
  read,
  RESPONSE_KEYS,
  STATUS_HISTORY_KEY,
  STORAGE_KEYS,
  write,
} from '@/lib/selectionStorage';

type ActivityFor<M extends SelectionModule> = M extends 'assessment'
  ? Assessment
  : M extends 'assignment'
    ? Assignment
    : Interview;

export const useSelectionActivities = <M extends SelectionModule>(module: M) => {
  type Activity = ActivityFor<M>;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [responses, setResponses] = useState<ActivityResponse[]>([]);
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);

  const load = useCallback(() => {
    ensureSeed();
    setActivities(read<Activity>(STORAGE_KEYS[module]));
    setResponses(read<ActivityResponse>(RESPONSE_KEYS[module]));
    setCourses(getCourses());
  }, [module]);

  useEffect(() => {
    load();
  }, [load]);

  const persist = (next: Activity[]) => {
    write(STORAGE_KEYS[module], next);
    setActivities(next);
  };

  const persistResponses = (next: ActivityResponse[]) => {
    write(RESPONSE_KEYS[module], next);
    setResponses(next);
  };

  const createActivity = (data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const activity = { ...data, id: `${module}-${Date.now()}`, createdAt: now, updatedAt: now } as Activity;
    persist([activity, ...read<Activity>(STORAGE_KEYS[module])]);
    return activity;
  };

  const updateActivity = (id: string, data: Partial<Activity>) => {
    const next = read<Activity>(STORAGE_KEYS[module]).map((a) =>
      a.id === id ? ({ ...a, ...data, updatedAt: new Date().toISOString() } as Activity) : a
    );
    persist(next);
  };

  const deleteActivity = (id: string) => {
    persist(read<Activity>(STORAGE_KEYS[module]).filter((a) => a.id !== id));
    persistResponses(read<ActivityResponse>(RESPONSE_KEYS[module]).filter((r) => r.activityId !== id));
  };

  const getActivity = (id?: string) => activities.find((a) => a.id === id);

  const getResponses = (activityId: string) => responses.filter((r) => r.activityId === activityId);

  const responseCount = (activityId: string) => responses.filter((r) => r.activityId === activityId).length;

  const updateResponse = (id: string, data: Partial<ActivityResponse>) => {
    const next = read<ActivityResponse>(RESPONSE_KEYS[module]).map((r) =>
      r.id === id ? { ...r, ...data } : r
    );
    persistResponses(next);
  };

  const setSelectionStatus = (response: ActivityResponse, status: SelectionStatus, remarks?: string) => {
    updateResponse(response.id, { selectionStatus: status, ...(remarks !== undefined ? { remarks } : {}) });
    const history = read<SelectionStatusEntry>(STATUS_HISTORY_KEY);
    history.push({
      studentId: response.studentId,
      module,
      activityId: response.activityId,
      status,
      updatedAt: new Date().toISOString(),
      remarks,
    });
    write(STATUS_HISTORY_KEY, history);
  };

  const courseName = (courseId: string) => courses.find((c) => c.id === courseId)?.name ?? 'Unassigned course';

  return {
    activities,
    responses,
    courses,
    reload: load,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivity,
    getResponses,
    responseCount,
    updateResponse,
    setSelectionStatus,
    courseName,
  };
};

export const useStudentSelectionProgress = (studentId?: string) => {
  const [entries, setEntries] = useState<SelectionStatusEntry[]>([]);

  useEffect(() => {
    setEntries(read<SelectionStatusEntry>(STATUS_HISTORY_KEY));
  }, [studentId]);

  const latestFor = (module: SelectionModule): SelectionStatus | undefined => {
    const filtered = entries
      .filter((e) => e.studentId === studentId && e.module === module)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return filtered[0]?.status;
  };

  return { entries, latestFor };
};
