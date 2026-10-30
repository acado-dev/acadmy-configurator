import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Award, Mail, Eye, Search, Users, Send, MailCheck, MailPlus, RotateCw } from 'lucide-react';
import { useApplicationSubmissions, ApplicationSubmission } from '@/hooks/useApplicationSubmissions';
import { useFormsData } from '@/hooks/useFormsData';
import { loadAcceptanceLetters, sendAcceptanceLetter, AcceptanceLetterRecord } from '@/lib/acceptanceLetters';
import { toast } from '@/hooks/use-toast';

interface AcceptanceLettersProps {
  scope?: 'super' | 'university';
}

const AcceptanceLetters = ({ scope = 'super' }: AcceptanceLettersProps) => {
  const navigate = useNavigate();
  const { applications } = useApplicationSubmissions();
  const { universities, courses } = useFormsData();

  const universityAdmin = useMemo(
    () => (scope === 'university' ? JSON.parse(localStorage.getItem('universityAdmin') || '{}') : null),
    [scope]
  );
  const scopedUniversityId = scope === 'university' ? universityAdmin?.universityId || '' : '';

  const [selectedUniversity, setSelectedUniversity] = useState<string>(scopedUniversityId || 'all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [letterFilter, setLetterFilter] = useState<'all' | 'sent' | 'not_sent'>('all');
  const [letters, setLetters] = useState<Record<string, AcceptanceLetterRecord>>(() => loadAcceptanceLetters());
  const [sendTarget, setSendTarget] = useState<ApplicationSubmission | null>(null);
  const [resendTarget, setResendTarget] = useState<ApplicationSubmission | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    document.title = 'Acceptance Letters | ACADO Admin';
  }, []);

  // Universities that actually have applications, merged with the master list.
  const universityOptions = useMemo(() => {
    const fromApps = new Map(applications.map(a => [a.universityId, a.universityName]));
    const merged = new Map(universities.map(u => [u.id, u.name]));
    fromApps.forEach((name, id) => { if (!merged.has(id)) merged.set(id, name); });
    if (scope === 'university') {
      return [...merged.entries()]
        .filter(([id]) => id === scopedUniversityId)
        .map(([id, name]) => ({ id, name }));
    }
    return [...merged.entries()].map(([id, name]) => ({ id, name }));
  }, [applications, universities, scope, scopedUniversityId]);

  // Courses available for the selected university (dynamic).
  const courseOptions = useMemo(() => {
    const universityId = scope === 'university' ? scopedUniversityId : selectedUniversity;
    const fromApps = new Map(
      applications
        .filter(a => universityId === 'all' || a.universityId === universityId)
        .map(a => [a.courseId, a.courseName])
    );
    const merged = new Map(
      courses
        .filter(c => universityId === 'all' || c.universityId === universityId)
        .map(c => [c.id, c.name])
    );
    fromApps.forEach((name, id) => { if (!merged.has(id)) merged.set(id, name); });
    return [...merged.entries()].map(([id, name]) => ({ id, name }));
  }, [applications, courses, selectedUniversity, scope, scopedUniversityId]);

  // Candidates who completed the selection process successfully.
  const eligible = useMemo(() => {
    const universityId = scope === 'university' ? scopedUniversityId : selectedUniversity;
    return applications.filter(app => {
      if (app.status !== 'accepted') return false;
      if (universityId !== 'all' && app.universityId !== universityId) return false;
      if (selectedCourse !== 'all' && app.courseId !== selectedCourse) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (!app.applicantName.toLowerCase().includes(q) && !app.applicantEmail.toLowerCase().includes(q)) return false;
      }
      const sent = !!letters[app.id];
      if (letterFilter === 'sent' && !sent) return false;
      if (letterFilter === 'not_sent' && sent) return false;
      return true;
    });
  }, [applications, selectedUniversity, selectedCourse, searchTerm, letterFilter, letters, scope, scopedUniversityId]);

  const summary = useMemo(() => {
    const universityId = scope === 'university' ? scopedUniversityId : selectedUniversity;
    const base = applications.filter(a =>
      a.status === 'accepted' &&
      (universityId === 'all' || a.universityId === universityId) &&
      (selectedCourse === 'all' || a.courseId === selectedCourse)
    );
    const sent = base.filter(a => letters[a.id]).length;
    return { total: base.length, sent, pending: base.length - sent };
  }, [applications, letters, selectedUniversity, selectedCourse, scope, scopedUniversityId]);

  const senderName = scope === 'university'
    ? universityAdmin?.name || universityAdmin?.email || 'University Admin'
    : 'Super Admin';

  const confirmSend = () => {
    if (!sendTarget) return;
    sendAcceptanceLetter(sendTarget.id, senderName, note.trim());
    setLetters(loadAcceptanceLetters());
    toast({
      title: 'Acceptance letter sent',
      description: `The acceptance letter was sent to ${sendTarget.applicantName} (${sendTarget.applicantEmail}).`,
    });
    setSendTarget(null);
    setNote('');
  };

  const confirmResend = () => {
    if (!resendTarget) return;
    sendAcceptanceLetter(resendTarget.id, senderName);
    setLetters(loadAcceptanceLetters());
    toast({
      title: 'Acceptance letter resent',
      description: `The acceptance letter was resent to ${resendTarget.applicantName}.`,
    });
    setResendTarget(null);
  };

  const reviewPath = (id: string) =>
    scope === 'university' ? `/university/applications/${id}` : `/applications/${id}`;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Acceptance Letters</h1>
          <p className="text-muted-foreground">
            Candidates who completed the selection process and are ready to receive their acceptance letter
          </p>
        </div>
      </header>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eligible Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
            <p className="text-xs text-muted-foreground">Completed the selection process</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Letters Sent</CardTitle>
            <MailCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.sent}</div>
            <p className="text-xs text-muted-foreground">Acceptance letters delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Letters</CardTitle>
            <MailPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pending}</div>
            <p className="text-xs text-muted-foreground">Waiting to be sent</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            {scope === 'university'
              ? 'Select a course to view its accepted candidates'
              : 'Select a university and course to view accepted candidates'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {scope === 'super' && (
              <div className="space-y-2">
                <Label>University</Label>
                <Select
                  value={selectedUniversity}
                  onValueChange={value => { setSelectedUniversity(value); setSelectedCourse('all'); }}
                >
                  <SelectTrigger><SelectValue placeholder="All universities" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All universities</SelectItem>
                    {universityOptions.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger><SelectValue placeholder="All courses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All courses</SelectItem>
                  {courseOptions.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Letter status</Label>
              <Select value={letterFilter} onValueChange={v => setLetterFilter(v as typeof letterFilter)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="not_sent">Not sent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidate listing */}
      <Card>
        <CardHeader>
          <CardTitle>Accepted Candidates</CardTitle>
          <CardDescription>
            {eligible.length} {eligible.length === 1 ? 'candidate' : 'candidates'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {eligible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Award className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="font-medium">No accepted candidates found</p>
              <p className="text-sm text-muted-foreground">
                Candidates appear here once they have successfully completed every step of the selection process.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {eligible.map(app => {
                const letter = letters[app.id];
                return (
                  <div
                    key={app.id}
                    className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium">{app.applicantName}</h4>
                        <Badge variant="default" className="gap-1">
                          <Award className="h-3 w-3" /> Accepted
                        </Badge>
                        {letter ? (
                          <Badge variant="secondary" className="gap-1">
                            <MailCheck className="h-3 w-3" /> Letter Sent
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <Mail className="h-3 w-3" /> Not Sent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {app.applicantEmail} • {app.courseName}
                        {scope === 'super' && ` • ${app.universityName}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Completed {new Date(app.lastUpdated).toLocaleDateString()}
                        {letter && (
                          <> • Letter sent {new Date(letter.sentAt).toLocaleDateString()} by {letter.sentBy}
                            {letter.resendCount > 0 && ` (resent ${letter.resendCount}×)`}</>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(reviewPath(app.id))}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </Button>
                      {letter ? (
                        <Button size="sm" variant="ghost" onClick={() => setResendTarget(app)}>
                          <RotateCw className="mr-2 h-4 w-4" /> Resend
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => { setSendTarget(app); setNote(''); }}>
                          <Send className="mr-2 h-4 w-4" /> Send Letter
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send letter dialog */}
      <Dialog open={!!sendTarget} onOpenChange={open => { if (!open) setSendTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Acceptance Letter</DialogTitle>
            <DialogDescription>
              Send the acceptance letter to {sendTarget?.applicantName} for {sendTarget?.courseName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-3 text-sm">
              <p><span className="text-muted-foreground">Candidate:</span> {sendTarget?.applicantName}</p>
              <p><span className="text-muted-foreground">Email:</span> {sendTarget?.applicantEmail}</p>
              <p><span className="text-muted-foreground">Course:</span> {sendTarget?.courseName}</p>
              <p><span className="text-muted-foreground">University:</span> {sendTarget?.universityName}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="letter-note">Message to include (optional)</Label>
              <Textarea
                id="letter-note"
                placeholder="Any additional information for the acceptance letter..."
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendTarget(null)}>Cancel</Button>
            <Button onClick={confirmSend}>
              <Send className="mr-2 h-4 w-4" /> Send Letter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resend confirmation */}
      <AlertDialog open={!!resendTarget} onOpenChange={open => { if (!open) setResendTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resend acceptance letter?</AlertDialogTitle>
            <AlertDialogDescription>
              An acceptance letter was already sent to {resendTarget?.applicantName}
              {resendTarget && letters[resendTarget.id] &&
                ` on ${new Date(letters[resendTarget.id].sentAt).toLocaleDateString()}`}.
              Resending will deliver another copy to the candidate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResend}>Resend Letter</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AcceptanceLetters;
