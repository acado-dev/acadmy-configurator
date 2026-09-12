import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  GraduationCap,
  Calendar,
  FileText,
  Download,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Send,
  Printer,
  ChevronRight,
  Star,
  Target,
  Award,
  BookOpen,
  MapPin,
  Globe,
  Building
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApplicationSubmissions } from '@/hooks/useApplicationSubmissions';
import { useApplicationProcess } from '@/hooks/useApplicationProcess';
import { useFormsData } from '@/hooks/useFormsData';
import { useToast } from '@/hooks/use-toast';
import RequestDocumentDialog from '@/components/applications/RequestDocumentDialog';
import {
  createDocumentRequest,
  getDocumentRequests,
  updateDocumentRequestStatus,
  DocumentRequest,
  DocumentRequestReason,
  REASON_LABELS,
} from '@/lib/documentRequests';

const ApplicationReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getApplicationById, updateApplicationStatus, calculateMatchScore } = useApplicationSubmissions();
  const { getCriteriaByCoursId } = useApplicationProcess();
  const { courses } = useFormsData();

  const [application, setApplication] = useState<any>(null);
  const [showCommunicationDialog, setShowCommunicationDialog] = useState(false);
  const [showAcceptanceDialog, setShowAcceptanceDialog] = useState(false);
  const [showCriteriaDialog, setShowCriteriaDialog] = useState(false);
  const [communicationType, setCommunicationType] = useState('email');
  const [communicationMessage, setCommunicationMessage] = useState('');
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);

  useEffect(() => {
    if (id) setDocumentRequests(getDocumentRequests(id));
  }, [id]);

  const handleRequestDocument = (data: {
    documentType: string;
    reason: DocumentRequestReason;
    message: string;
    dueDate?: string;
  }) => {
    if (!application) return;
    createDocumentRequest({
      applicationId: application.id,
      applicantName: application.applicantName,
      applicantEmail: application.applicantEmail,
      ...data,
    });
    setDocumentRequests(getDocumentRequests(application.id));
    if (application.status === 'submitted') handleStatusChange('under_review');
    toast({
      title: 'Document requested',
      description: `${data.documentType} requested from ${application.applicantName} (${REASON_LABELS[data.reason]}).`,
    });
  };

  const handleRequestStatus = (requestId: string, status: 'received' | 'cancelled') => {
    if (status === 'received') {
      attachRequestedDocument(requestId);
    } else {
      updateDocumentRequestStatus(requestId, status);
    }
    setDocumentRequests(getDocumentRequests(application.id));
    toast({
      title: status === 'received' ? 'Document received' : 'Request cancelled',
      description:
        status === 'received'
          ? 'The uploaded document is now available to view and review.'
          : 'The document request has been cancelled.',
    });
  };

  const handleAcceptDocument = (requestId: string) => {
    acceptRequestedDocument(requestId);
    setDocumentRequests(getDocumentRequests(application.id));
    setViewingRequest(null);
    toast({ title: 'Document accepted', description: 'Added to the application documents.' });
  };

  const handleReRequestDocument = (req: DocumentRequest) => {
    reRequestDocument(req.id, `Please re-upload ${req.documentType}. The previous file was not acceptable.`);
    setDocumentRequests(getDocumentRequests(application.id));
    setViewingRequest(null);
    toast({
      title: 'Document re-requested',
      description: `${req.documentType} has been requested again from ${req.applicantName}.`,
    });
  };

  const handleMessageAboutDocument = (req: DocumentRequest) => {
    setViewingRequest(null);
    setCommunicationType('email');
    setCommunicationMessage(
      `Hi ${req.applicantName},\n\nRegarding the ${req.documentType} for your application ${req.applicationId}:\n\n`,
    );
    setShowCommunicationDialog(true);
  };



  useEffect(() => {
    if (id) {
      const app = getApplicationById(id);
      if (app) {
        setApplication(app);
      } else {
        // Mock data for demonstration if application not found
        setApplication({
          id,
          applicantName: 'John Doe',
          applicantEmail: 'john.doe@example.com',
          applicantPhone: '+1 234 567 8900',
          courseId: 'course-1',
          courseName: 'Master of Business Administration',
          submittedAt: new Date('2024-01-15'),
          status: 'pending',
          matchScore: 85,
          matchDetails: [
            { category: 'Academic Qualifications', score: 90, maxScore: 100 },
            { category: 'Work Experience', score: 85, maxScore: 100 },
            { category: 'English Proficiency', score: 80, maxScore: 100 },
            { category: 'Statement of Purpose', score: 85, maxScore: 100 },
          ],
          formData: {
            personalInfo: {
              firstName: 'John',
              lastName: 'Doe',
              dateOfBirth: '1995-05-15',
              nationality: 'United States',
              gender: 'Male',
            },
            academicBackground: {
              highestDegree: "Bachelor's Degree",
              fieldOfStudy: 'Computer Science',
              university: 'MIT',
              gpa: '3.8',
              graduationYear: '2018',
            },
            workExperience: {
              currentPosition: 'Software Engineer',
              company: 'Tech Corp',
              yearsOfExperience: '5',
              responsibilities: 'Full-stack development, team leadership',
            },
            documents: [
              { name: 'Resume.pdf', size: '245 KB', uploadedAt: '2024-01-10' },
              { name: 'Transcript.pdf', size: '512 KB', uploadedAt: '2024-01-10' },
              { name: 'Recommendation_Letter_1.pdf', size: '189 KB', uploadedAt: '2024-01-11' },
              { name: 'Statement_of_Purpose.pdf', size: '156 KB', uploadedAt: '2024-01-11' },
            ],
          },
          communications: [
            { type: 'email', date: '2024-01-16', subject: 'Application Received', status: 'sent' },
            { type: 'email', date: '2024-01-18', subject: 'Document Verification', status: 'sent' },
          ],
        });
      }
    }
  }, [id, getApplicationById]);

  // Live evaluation against the criteria configured for this course
  const rubric = application?.courseId ? getCriteriaByCoursId(application.courseId) : undefined;

  const evaluation = useMemo(() => {
    if (!application) return { score: 0, details: [] as any[], live: false };
    if (rubric && rubric.criteria.length) {
      const { score, details } = calculateMatchScore(application.formData || {}, application.courseId);
      return { score, details, live: true };
    }
    return {
      score: application.matchScore ?? 0,
      details: (application.matchDetails ?? []).filter((d: any) => d && d.fieldName),
      live: false,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [application, rubric]);

  const passesCutoff = rubric ? evaluation.score >= rubric.minimumScore : evaluation.score >= 60;

  const formatFieldValue = (value: any) => {
    if (value === undefined || value === null || value === '') return 'Not provided';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };
  const hasSectionedData = Boolean(
    application?.formData?.personalInfo ||
      application?.formData?.academicBackground ||
      application?.formData?.workExperience,
  );




  const handleStatusChange = (newStatus: string) => {
    if (application) {
      updateApplicationStatus(application.id, newStatus as any);
      setApplication({ ...application, status: newStatus });
      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus}`,
      });
    }
  };

  const handleSendCommunication = () => {
    toast({
      title: "Communication Sent",
      description: `${communicationType === 'email' ? 'Email' : 'SMS'} sent to applicant`,
    });
    setShowCommunicationDialog(false);
    setCommunicationMessage('');
  };

  const handleGenerateAcceptance = () => {
    toast({
      title: "Acceptance Letter Generated",
      description: "The acceptance letter has been generated and sent to the applicant",
    });
    setShowAcceptanceDialog(false);
    handleStatusChange('accepted');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-5 w-5" />;
      case 'rejected': return <XCircle className="h-5 w-5" />;
      case 'waitlisted': return <Clock className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'waitlisted': return 'text-yellow-600';
      case 'under_review': return 'text-blue-600';
      case 'shortlisted': return 'text-blue-600';
      default: return 'text-gray-600';
    }

  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!application) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading application...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/university/applications')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Application Review</h1>
            <p className="text-muted-foreground">
              Review and process application #{application.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{application.applicantName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{application.applicantEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{application.applicantPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Applied For</p>
                    <p className="font-medium">{application.courseName}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Match Score Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Match Score Analysis
              </CardTitle>
              <CardDescription>
                {rubric
                  ? `Scored live against ${rubric.criteria.length} configured criteria (cut-off ${rubric.minimumScore}%)`
                  : 'No evaluation criteria configured for this course — showing the stored score'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-bold ${getScoreColor(evaluation.score)}`}>
                    {evaluation.score}%
                  </div>
                  <Badge variant={evaluation.score >= 80 ? 'default' : evaluation.score >= 60 ? 'secondary' : 'destructive'}>
                    {evaluation.score >= 80 ? 'Excellent Match' : evaluation.score >= 60 ? 'Good Match' : 'Fair Match'}
                  </Badge>
                  {rubric && (
                    <Badge variant="outline" className={passesCutoff ? 'text-green-600' : 'text-red-600'}>
                      {passesCutoff ? 'Meets cut-off' : 'Below cut-off'}
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowCriteriaDialog(true)}>
                  View Criteria
                </Button>
              </div>

              <Progress value={evaluation.score} className="h-2" />

              <Separator />

              {evaluation.details.length === 0 ? (
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    No criteria breakdown is available for this course yet. Define the evaluation
                    criteria to get a detailed, weighted match analysis.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/university/application-process/${application.courseId}`)}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Configure evaluation criteria
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {evaluation.details.map((detail: any, index: number) => (
                    <div key={detail.criteriaId ?? index} className="space-y-2">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          {detail.matched ? (
                            <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                          )}
                          <span className="font-medium truncate">{detail.fieldName}</span>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {detail.type}
                          </Badge>
                        </div>
                        <span className="text-muted-foreground whitespace-nowrap">
                          {Math.round(detail.score)}/{detail.maxScore} pts
                        </span>
                      </div>
                      <Progress
                        value={detail.maxScore ? (detail.score / detail.maxScore) * 100 : 0}
                        className="h-2"
                      />
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                        <span>Submitted: <span className="text-foreground">{formatFieldValue(detail.actualValue)}</span></span>
                        {detail.expectedValue && (
                          <span>Expected: <span className="text-foreground">{formatFieldValue(detail.expectedValue)}</span></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>


          {/* Application Data */}
          <Card>
            <CardHeader>
              <CardTitle>Application Data</CardTitle>
            </CardHeader>
            <CardContent>
              {hasSectionedData ? (
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                  </TabsList>

                  {([
                    ['personal', 'personalInfo'],
                    ['academic', 'academicBackground'],
                    ['experience', 'workExperience'],
                  ] as const).map(([tab, section]) => (
                    <TabsContent key={tab} value={tab} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(application.formData[section] || {}).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-sm text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="font-medium">{formatFieldValue(value)}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(application.formData || {}).length === 0 ? (
                    <p className="text-sm text-muted-foreground col-span-2">No form data submitted.</p>
                  ) : (
                    Object.entries(application.formData || {}).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="font-medium">{formatFieldValue(value)}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>

          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(application.status)}
                <span className={`font-medium ${getStatusColor(application.status)}`}>
                  {String(application.status).replace(/[-_]/g, ' ').replace(/^\w/, (c: string) => c.toUpperCase())}
                </span>
              </div>
              
              <Select value={application.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>

                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Separator />

              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setShowCommunicationDialog(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Communication
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setShowDocumentDialog(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Request Document
                </Button>
                {application.status === 'shortlisted' && (
                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={() => setShowAcceptanceDialog(true)}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Generate Acceptance
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Requested Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Requested Documents</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowDocumentDialog(true)}>
                <FileText className="h-4 w-4 mr-2" />
                New
              </Button>
            </CardHeader>
            <CardContent>
              {documentRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No documents have been requested for this application yet.
                </p>
              ) : (
                <ScrollArea className="max-h-64">
                  <div className="space-y-3">
                    {documentRequests.map((req) => (
                      <div key={req.id} className="rounded-lg border border-border p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{req.documentType}</p>
                          <Badge
                            variant={
                              req.status === 'received'
                                ? 'default'
                                : req.status === 'cancelled'
                                ? 'outline'
                                : 'secondary'
                            }
                            className="capitalize"
                          >
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {REASON_LABELS[req.reason]} · Requested{' '}
                          {new Date(req.requestedAt).toLocaleDateString()}
                          {req.dueDate ? ` · Due ${new Date(req.dueDate).toLocaleDateString()}` : ''}
                        </p>
                        {req.message && <p className="text-xs">{req.message}</p>}
                        {req.status === 'pending' && (
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" variant="outline" onClick={() => handleRequestStatus(req.id, 'received')}>
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Mark received
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleRequestStatus(req.id, 'cancelled')}>
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Submitted Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {application.formData.documents?.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Communication History */}
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {application.communications?.map((comm: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{comm.subject}</p>
                          <p className="text-xs text-muted-foreground">{comm.date}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {comm.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Request Document Dialog */}
      <RequestDocumentDialog
        open={showDocumentDialog}
        onOpenChange={setShowDocumentDialog}
        applicantName={application.applicantName}
        onSubmit={handleRequestDocument}
      />

      {/* Communication Dialog */}
      <Dialog open={showCommunicationDialog} onOpenChange={setShowCommunicationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Communication</DialogTitle>
            <DialogDescription>
              Send a message to the applicant
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Communication Type</Label>
              <Select value={communicationType} onValueChange={setCommunicationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Message</Label>
              <Textarea 
                placeholder="Enter your message..."
                value={communicationMessage}
                onChange={(e) => setCommunicationMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommunicationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendCommunication}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Acceptance Letter Dialog */}
      <Dialog open={showAcceptanceDialog} onOpenChange={setShowAcceptanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Acceptance Letter</DialogTitle>
            <DialogDescription>
              Generate and send an acceptance letter to the applicant
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Start Date</Label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              />
            </div>
            <div>
              <Label>Additional Notes (Optional)</Label>
              <Textarea 
                placeholder="Any additional information for the acceptance letter..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptanceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateAcceptance}>
              <Award className="h-4 w-4 mr-2" />
              Generate & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evaluation Criteria Dialog */}
      <Dialog open={showCriteriaDialog} onOpenChange={setShowCriteriaDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Evaluation Criteria</DialogTitle>
            <DialogDescription>
              {rubric
                ? `Rubric configured for ${application.courseName} — minimum score ${rubric.minimumScore}%`
                : 'No evaluation criteria have been configured for this course yet.'}
            </DialogDescription>
          </DialogHeader>

          {rubric ? (
            <ScrollArea className="max-h-[55vh] pr-3">
              <div className="space-y-3">
                {rubric.criteria.map((criterion, index) => {
                  const detail = evaluation.details.find(
                    (d: any) => d.criteriaId === criterion.id || d.fieldName === criterion.fieldName,
                  );
                  return (
                    <div key={criterion.id ?? index} className="rounded-lg border border-border p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{criterion.fieldName}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">{criterion.type}</Badge>
                          <Badge variant="secondary">{criterion.weight} pts</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Conditions: {criterion.conditions.length ? criterion.conditions.join(' OR ') : 'Field must be present'}
                      </p>
                      {detail && (
                        <p className="text-sm flex items-center gap-2">
                          {detail.matched ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          This applicant: {formatFieldValue(detail.actualValue)} — scored {Math.round(detail.score)}/{detail.maxScore}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">
              Configure criteria to score applications automatically against your admission requirements.
            </p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCriteriaDialog(false)}>Close</Button>
            <Button onClick={() => navigate(`/university/application-process/${application.courseId}`)}>
              <Target className="h-4 w-4 mr-2" />
              Edit criteria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default ApplicationReview;