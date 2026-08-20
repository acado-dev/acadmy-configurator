import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SelectionModule, MODULE_LABEL, SelectionStatus } from '@/types/selection';
import { SelectionStatusBadge } from './SelectionStatusBadge';
import { useStudentSelectionProgress } from '@/hooks/useSelectionActivities';

const MODULES: SelectionModule[] = ['assessment', 'assignment', 'interview'];

export const StageProgressStrip = ({
  studentId,
  currentModule,
  currentStatus,
}: {
  studentId: string;
  currentModule: SelectionModule;
  currentStatus: SelectionStatus;
}) => {
  const { latestFor } = useStudentSelectionProgress(studentId);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {MODULES.map((m, i) => {
        const status = m === currentModule ? currentStatus : latestFor(m) ?? 'pending';
        return (
          <React.Fragment key={m}>
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
              <span className="text-xs font-medium text-muted-foreground">{MODULE_LABEL[m]}</span>
              <SelectionStatusBadge status={status} />
            </div>
            {i < MODULES.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
