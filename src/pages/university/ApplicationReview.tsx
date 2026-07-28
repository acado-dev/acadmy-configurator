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
import { useFormsData } from '@/hooks/useFormsData';
import { useToast } from '@/hooks/use-toast';

const ApplicationReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getApplicationById, updateApplicationStatus } = useApplicationSubmissions();
  const { courses } = useFormsData();
  
  const [application, setApplication] = useState<any>(null);
  const [showCommunicationDialog, setShowCommunicationDialog] = useState(false);
  const [showAcceptanceDialog, setShowAcceptanceDialog] = useState(false);
  const [communicationType, setCommunicationType] = useState('email');
  const [communicationMessage, setCommunicationMessage] = useState('');

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
      case 'under-review': return 'text-blue-600';
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
                Based on configured evaluation criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-bold ${getScoreColor(application.matchScore)}`}>
                    {application.matchScore}%
                  </div>
                  <Badge variant={application.matchScore >= 80 ? 'default' : application.matchScore >= 60 ? 'secondary' : 'destructive'}>
                    {application.matchScore >= 80 ? 'Excellent Match' : application.matchScore >= 60 ? 'Good Match' : 'Fair Match'}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  View Criteria
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                {application.matchDetails?.map((detail: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{detail.category}</span>
                      <span className="text-muted-foreground">
                        {detail.score}/{detail.maxScore}
                      </span>
                    </div>
                    <Progress value={(detail.score / detail.maxScore) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Application Data */}
          <Card>
            <CardHeader>
              <CardTitle>Application Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(application.formData.personalInfo || {}).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="font-medium">{value as string}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="academic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(application.formData.academicBackground || {}).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="font-medium">{value as string}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="experience" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(application.formData.workExperience || {}).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="font-medium">{value as string}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
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
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('-', ' ')}
                </span>
              </div>
              
              <Select value={application.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
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
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Request Documents
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
    </div>
  );
};

export default ApplicationReview;