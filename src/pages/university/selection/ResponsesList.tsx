import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Search, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MODULE_LABEL, SELECTION_STATUSES, SelectionModule } from '@/types/selection';
import { useSelectionActivities } from '@/hooks/useSelectionActivities';
import { SelectionStatusSelect } from '@/components/selection/SelectionStatusSelect';
import { maskEmail } from '@/lib/selectionStorage';

const basePath: Record<SelectionModule, string> = {
  assessment: '/university/assessments',
  assignment: '/university/assignments',
  interview: '/university/interviews',
};

const ResponsesList = ({ module }: { module: SelectionModule }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getActivity, getResponses, setSelectionStatus, courseName } = useSelectionActivities(module);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const activity = getActivity(id) as any;
  const responses = useMemo(() => getResponses(id ?? ''), [getResponses, id]);

  const filtered = responses.filter((r) => {
    const matchesSearch =
      !search ||
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.studentEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.selectionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const passingScore = activity?.passingScore ?? 0;
  const label = MODULE_LABEL[module];
  const submissionColumn = module === 'assignment' ? 'Submission Status' : module === 'interview' ? 'Completion' : 'Result';

  const submissionStateLabel = (state?: string) =>
    state === 'on_time' ? 'On time' : state === 'late' ? 'Late' : 'Pending';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(basePath[module])} className="mb-2 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {label}s
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {module === 'assignment' ? 'Submissions' : 'Responses'} — {activity?.title ?? label}
          </h1>
          <p className="text-sm text-muted-foreground">
            {activity ? courseName(activity.courseId) : ''} · {responses.length}{' '}
            {module === 'assignment' ? 'submissions' : 'responses'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search &amp; filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by student name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Selection status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All selection statuses</SelectItem>
              {SELECTION_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
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
                <TableHead>Student Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>{module === 'interview' ? 'Interview Date' : 'Submission Date'}</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>{submissionColumn}</TableHead>
                <TableHead>Selection Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    No {module === 'assignment' ? 'submissions' : 'responses'} found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.studentName}</TableCell>
                  <TableCell className="text-muted-foreground">{maskEmail(r.studentEmail)}</TableCell>
                  <TableCell>{courseName(activity?.courseId ?? r.courseId)}</TableCell>
                  <TableCell>{new Date(r.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {r.score}/{r.maxScore}
                  </TableCell>
                  <TableCell>
                    {module === 'assignment' ? (
                      <Badge variant="outline">{submissionStateLabel(r.submissionState)}</Badge>
                    ) : module === 'interview' ? (
                      <Badge variant="outline" className="capitalize">
                        {(r.completionStatus ?? 'not_attempted').replace('_', ' ')}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className={
                          r.score >= passingScore
                            ? 'border-transparent bg-emerald-500/10 text-emerald-600'
                            : 'border-transparent bg-destructive/10 text-destructive'
                        }
                      >
                        {r.score >= passingScore ? 'Pass' : 'Fail'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <SelectionStatusSelect
                      value={r.selectionStatus}
                      onChange={(status) => setSelectionStatus(r, status)}
                      className="w-[150px]"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`${basePath[module]}/${id}/responses/${r.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View {module === 'assignment' ? 'Submission' : module === 'interview' ? 'Interview' : 'Response'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsesList;
