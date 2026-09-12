import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, FileText, Eye, ChevronDown, ChevronRight, BellDot, Inbox } from 'lucide-react';
import { useApplicationSubmissions } from '@/hooks/useApplicationSubmissions';
import {
  getDocumentRequests,
  DocumentRequest,
  REASON_LABELS,
} from '@/lib/documentRequests';
import DocumentRequestViewer from './DocumentRequestViewer';

interface ApplicationRequestGroup {
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  courseName: string;
  requested: number;
  received: number;
  pending: number;
  accepted: number;
  newSubmissions: number;
  lastUpdated: string;
  requests: DocumentRequest[];
}

const statusVariant = (status: DocumentRequest['status']) =>
  status === 'accepted' ? 'default' : status === 'cancelled' ? 'outline' : 'secondary';

const DocumentRequestsList = () => {
  const navigate = useNavigate();
  const { applications } = useApplicationSubmissions();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openRequestId, setOpenRequestId] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const groups = useMemo<ApplicationRequestGroup[]>(() => {
    const rows = getDocumentRequests();
    const map = new Map<string, ApplicationRequestGroup>();

    rows.forEach((r) => {
      const app = applications.find((a) => a.id === r.applicationId);
      const existing =
        map.get(r.applicationId) ||
        ({
          applicationId: r.applicationId,
          applicantName: r.applicantName || app?.applicantName || 'Unknown applicant',
          applicantEmail: r.applicantEmail || app?.applicantEmail || '',
          courseName: app?.courseName || '—',
          requested: 0,
          received: 0,
          pending: 0,
          accepted: 0,
          newSubmissions: 0,
          lastUpdated: r.updatedAt,
          requests: [],
        } as ApplicationRequestGroup);

      existing.requested += 1;
      if (r.status === 'received' || r.status === 'accepted') existing.received += 1;
      if (r.status === 'pending') existing.pending += 1;
      if (r.status === 'accepted') existing.accepted += 1;
      if (r.status === 'received') existing.newSubmissions += 1;
      if (r.updatedAt > existing.lastUpdated) existing.lastUpdated = r.updatedAt;
      existing.requests.push(r);
      map.set(r.applicationId, existing);
    });

    return Array.from(map.values()).sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications, version]);

  const filtered = groups.filter((g) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      g.applicantName.toLowerCase().includes(q) ||
      g.applicationId.toLowerCase().includes(q) ||
      g.courseName.toLowerCase().includes(q)
    );
  });

  const totals = groups.reduce(
    (acc, g) => ({
      requested: acc.requested + g.requested,
      received: acc.received + g.received,
      pending: acc.pending + g.pending,
      newSubmissions: acc.newSubmissions + g.newSubmissions,
    }),
    { requested: 0, received: 0, pending: 0, newSubmissions: 0 },
  );

  const summary = [
    { label: 'Applications with requests', value: groups.length, icon: FileText },
    { label: 'Documents requested', value: totals.requested, icon: Inbox },
    { label: 'Documents received', value: totals.received, icon: FileText },
    { label: 'Awaiting review', value: totals.newSubmissions, icon: BellDot },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Document Requests</h1>
        <p className="text-sm text-muted-foreground">
          All documents requested from applicants, grouped application wise.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-semibold">{s.value}</p>
              </div>
              <s.icon className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Requests by application</CardTitle>
            <CardDescription>
              Expand a row to view every requested document and its submission status.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search application, candidate or course"
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Inbox className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No document requests yet. Raise one from an application review screen.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Application</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-center">Requested</TableHead>
                  <TableHead className="text-center">Received</TableHead>
                  <TableHead>New submission</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((g) => {
                  const isOpen = expanded === g.applicationId;
                  return (
                    <React.Fragment key={g.applicationId}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => setExpanded(isOpen ? null : g.applicationId)}
                      >
                        <TableCell>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{g.applicationId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{g.applicantName}</p>
                            <p className="text-xs text-muted-foreground">{g.applicantEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{g.courseName}</TableCell>
                        <TableCell className="text-center">{g.requested}</TableCell>
                        <TableCell className="text-center">{g.received}</TableCell>
                        <TableCell>
                          {g.newSubmissions > 0 ? (
                            <Badge className="gap-1">
                              <BellDot className="h-3 w-3" />
                              {g.newSubmissions} new to review
                            </Badge>
                          ) : g.pending > 0 ? (
                            <Badge variant="secondary">{g.pending} awaiting upload</Badge>
                          ) : (
                            <Badge variant="outline">All reviewed</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/university/applications/${g.applicationId}`);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Application
                          </Button>
                        </TableCell>
                      </TableRow>

                      {isOpen && (
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={8} className="p-0">
                            <div className="divide-y divide-border">
                              {g.requests.map((r) => (
                                <div
                                  key={r.id}
                                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-3"
                                >
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium">{r.documentType}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {REASON_LABELS[r.reason]} · Requested{' '}
                                      {new Date(r.requestedAt).toLocaleDateString()}
                                      {r.uploadedDocument
                                        ? ` · Uploaded ${new Date(
                                            r.uploadedDocument.uploadedAt,
                                          ).toLocaleDateString()}`
                                        : ' · Not uploaded yet'}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {r.status === 'received' && (
                                      <Badge className="gap-1">
                                        <BellDot className="h-3 w-3" />
                                        New submission
                                      </Badge>
                                    )}
                                    <Badge variant={statusVariant(r.status)} className="capitalize">
                                      {r.status}
                                    </Badge>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setOpenRequestId(r.id)}
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View request
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!openRequestId} onOpenChange={(open) => !open && setOpenRequestId(null)}>
        <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document request</DialogTitle>
          </DialogHeader>
          {openRequestId && (
            <DocumentRequestViewer
              requestId={openRequestId}
              onClose={() => setOpenRequestId(null)}
              onUpdate={() => setVersion((v) => v + 1)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentRequestsList;
