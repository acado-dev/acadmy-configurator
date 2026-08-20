import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ActivityStatus, SelectionStatus } from '@/types/selection';

const selectionStyles: Record<SelectionStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  shortlisted: 'bg-primary/10 text-primary',
  accepted: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-destructive/10 text-destructive',
  on_hold: 'bg-amber-500/10 text-amber-600',
};

const selectionLabels: Record<SelectionStatus, string> = {
  pending: 'Pending',
  shortlisted: 'Shortlisted',
  accepted: 'Accepted',
  rejected: 'Rejected',
  on_hold: 'On Hold',
};

export const SelectionStatusBadge = ({
  status,
  className,
}: {
  status: SelectionStatus;
  className?: string;
}) => (
  <Badge variant="outline" className={cn('border-transparent font-medium', selectionStyles[status], className)}>
    {selectionLabels[status]}
  </Badge>
);

const activityStyles: Record<ActivityStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-emerald-500/10 text-emerald-600',
  closed: 'bg-destructive/10 text-destructive',
};

export const ActivityStatusBadge = ({ status }: { status: ActivityStatus }) => (
  <Badge variant="outline" className={cn('border-transparent capitalize font-medium', activityStyles[status])}>
    {status}
  </Badge>
);
