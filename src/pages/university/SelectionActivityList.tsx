import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useSelectionActivities } from '@/hooks/useSelectionActivities';
import { ACTIVITY_LABELS, ACTIVITY_STATUSES, SelectionActivityKind } from '@/types/selectionActivity';

const statusVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'scheduled':
      return 'secondary';
    case 'closed':
      return 'outline';
    default:
      return 'outline';
  }
};

interface Props {
  kind: SelectionActivityKind;
  basePath?: string;
}

const SelectionActivityList: React.FC<Props> = ({ kind, basePath }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activities, deleteActivity } = useSelectionActivities(kind);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const labels = ACTIVITY_LABELS[kind];
  const root = basePath ?? `/university/${kind}s`;

  const filtered = useMemo(
    () =>
      activities.filter((a) => {
        const matchesSearch =
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.courseName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [activities, search, statusFilter]
  );

  const handleDelete = () => {
    if (!pendingDelete) return;
    deleteActivity(pendingDelete);
    setPendingDelete(null);
    toast({ title: `${labels.singular} deleted` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{labels.plural}</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage {labels.plural.toLowerCase()} used in the selection process.
          </p>
        </div>
        <Button onClick={() => navigate(`${root}/new`)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New {labels.singular}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-primary" />
            All {labels.plural}
          </CardTitle>
          <CardDescription>{filtered.length} record(s)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={`Search by ${labels.singular.toLowerCase()} or course name`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ACTIVITY_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{labels.singular} Name</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Responses</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No {labels.plural.toLowerCase()} found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell>{a.courseName || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(a.status) as any} className="capitalize">
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{a.responses}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${a.title}`}
                            onClick={() => navigate(`${root}/${a.id}/edit`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${a.title}`}
                            className="text-destructive"
                            onClick={() => setPendingDelete(a.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {labels.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the {labels.singular.toLowerCase()} and its configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SelectionActivityList;
