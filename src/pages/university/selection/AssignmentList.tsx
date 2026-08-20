import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Eye, Plus, Search, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const AssignmentList = () => {
  const navigate = useNavigate();
  const { activities, courses, courseName, responseCount, deleteActivity } = useSelectionActivities('assignment');
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deadlineBefore, setDeadlineBefore] = useState('');
  const [toDelete, setToDelete] = useState<string | null>(null);

  const filtered = activities.filter((a) => {
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === 'all' || a.courseId === courseFilter;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesDeadline = !deadlineBefore || new Date(a.endAt) <= new Date(`${deadlineBefore}T23:59:59`);
    return matchesSearch && matchesCourse && matchesStatus && matchesDeadline;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignment</h1>
          <p className="text-sm text-muted-foreground">
            Publish assignments, collect submissions and award marks with feedback.
          </p>
        </div>
        <Button onClick={() => navigate('/university/assignments/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Assignment
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
              placeholder="Search by assignment name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-[210px]">
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
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
            value={deadlineBefore}
            onChange={(e) => setDeadlineBefore(e.target.value)}
            aria-label="Deadline on or before"
          />
          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setCourseFilter('all');
              setStatusFilter('all');
              setDeadlineBefore('');
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
                <TableHead>Assignment Name</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Submission Deadline</TableHead>
                <TableHead>Total Submissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No assignments found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell>{courseName(a.courseId)}</TableCell>
                  <TableCell>{new Date(a.startAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(a.endAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      onClick={() => navigate(`/university/assignments/${a.id}/responses`)}
                    >
                      {responseCount(a.id)} submissions
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
                        onClick={() => navigate(`/university/assignments/${a.id}/responses`)}
                        aria-label="View submissions"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/university/assignments/${a.id}/edit`)}
                        aria-label="Edit assignment"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setToDelete(a.id)}
                        aria-label="Delete assignment"
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
            <AlertDialogTitle>Delete this assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              The assignment and all submissions linked to it will be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) deleteActivity(toDelete);
                setToDelete(null);
                toast({ title: 'Assignment deleted' });
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

export default AssignmentList;
