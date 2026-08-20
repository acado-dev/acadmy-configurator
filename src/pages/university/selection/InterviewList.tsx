import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Eye, Plus, Search, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { toast } from '@/hooks/use-toast';
import { ACTIVITY_STATUSES } from '@/types/selection';
import { useSelectionActivities } from '@/hooks/useSelectionActivities';
import { ActivityStatusBadge } from '@/components/selection/SelectionStatusBadge';
import { selBase } from '@/lib/selectionPaths';

const InterviewList = () => {
  const navigate = useNavigate();
  const { activities, courses, courseName, responseCount, deleteActivity } = useSelectionActivities('interview');
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDelete, setToDelete] = useState<string | null>(null);

  const filtered = activities.filter((a) => {
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === 'all' || a.courseId === courseFilter;
    const matchesType = typeFilter === 'all' || a.interviewType === typeFilter;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesDate = !fromDate || new Date(a.startAt) >= new Date(fromDate);
    return matchesSearch && matchesCourse && matchesType && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Interview</h1>
          <p className="text-sm text-muted-foreground">
            Schedule interview rounds, review recorded answers and evaluate candidates.
          </p>
        </div>
        <Button onClick={() => navigate(`${selBase()}/interviews/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Interview
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search &amp; filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by interview name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ACTIVITY_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            className="w-[170px]"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            aria-label="Scheduled on or after"
          />
          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setCourseFilter('all');
              setTypeFilter('all');
              setStatusFilter('all');
              setFromDate('');
            }}
          >
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Interview Name</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scheduled / Duration</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    No interviews found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell>{courseName(a.courseId)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {a.interviewType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(a.startAt).toLocaleDateString()} · {a.durationMinutes} min
                  </TableCell>
                  <TableCell>{a.questions?.length ?? 0}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      onClick={() => navigate(`${selBase()}/interviews/${a.id}/responses`)}
                    >
                      {responseCount(a.id)} attempts
                    </Button>
                  </TableCell>
                  <TableCell>
                    <ActivityStatusBadge status={a.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`${selBase()}/interviews/${a.id}/responses`)}
                        aria-label="View responses"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`${selBase()}/interviews/${a.id}/edit`)}
                        aria-label="Edit interview"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setToDelete(a.id)}
                        aria-label="Delete interview"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this interview?</AlertDialogTitle>
            <AlertDialogDescription>
              The interview and all recorded responses linked to it will be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) deleteActivity(toDelete);
                setToDelete(null);
                toast({ title: 'Interview deleted' });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InterviewList;
