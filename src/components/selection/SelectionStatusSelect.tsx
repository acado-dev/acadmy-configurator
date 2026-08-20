import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SELECTION_STATUSES, SelectionStatus } from '@/types/selection';

export const SelectionStatusSelect = ({
  value,
  onChange,
  className,
}: {
  value: SelectionStatus;
  onChange: (value: SelectionStatus) => void;
  className?: string;
}) => (
  <Select value={value} onValueChange={(v) => onChange(v as SelectionStatus)}>
    <SelectTrigger className={className ?? 'w-[170px]'}>
      <SelectValue placeholder="Selection status" />
    </SelectTrigger>
    <SelectContent>
      {SELECTION_STATUSES.map((s) => (
        <SelectItem key={s.value} value={s.value}>
          {s.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
