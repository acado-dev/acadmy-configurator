import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Target,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Download,
  Clock,
  ChevronRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const ApplicationReview = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [showCommunicationDialog, setShowCommunicationDialog] = useState(false);
  const [showAcceptanceDialog, setShowAcceptanceDialog] = useState(false);
  const [communicationType, setCommunicationType] = useState('');
  const [communicationMessage, setCommunicationMessage] = useState('');

  // Mock application data
  const application = {
    id: applicationId,
    applicant: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234-567-8900',
      photo: null
    },
    course: 'Master of Business Administration',
    submittedAt: '2024-01-15',
    status: 'under_review',
    matchScore: 92,
    formData: {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1998-05-15',
        nationality: 'USA',
        gender: 'Male'
      },
      education: {
        degree: 'Bachelor of Science',
        university: 'MIT',
        gpa: 3.8,
        graduationYear: 2020
      },
      testScores: {
        gre: 325,
        toefl: 110
      },
      experience: {
        years: 3,
        currentPosition: 'Software Engineer',
        company: 'Tech Corp'
      }
    },
    matchDetails: [
      { criteria: 'GPA', value: '3.8', requirement: '>3.5', matched: true, score: 30, maxScore: 30 },
      { criteria: 'GRE Score', value: '325', requirement: '>320', matched: true, score: 25, maxScore: 25 },
      { criteria: 'Work Experience', value: '3 years', requirement: '>2 years', matched: true, score: 18, maxScore: 20 },
      { criteria: 'English Proficiency', value: 'TOEFL 110', requirement: 'TOEFL/IELTS', matched: true, score: 15, maxScore: 15 },
      { criteria: 'Recommendations', value: '3 letters', requirement: '>2', matched: true, score: 4, maxScore: 10 }
    ],
    documents: [
      { name: 'Transcript.pdf', status: 'verified', size: '2.3 MB' },
      { name: 'GRE_Score.pdf', status: 'verified', size: '1.1 MB' },
      { name: 'Resume.pdf', status: 'pending', size: '456 KB' },
      { name: 'Recommendation_1.pdf', status: 'verified', size: '234 KB' }
    ],
    communications: [
      { date: '2024-01-16', type: 'notification', message: 'Application received and under review' },
      { date: '2024-01-17', type: 'document_request', message: 'Please upload your latest resume' }
    ]
  };

  const handleStatusChange = (newStatus: string) => {
    toast({
      title: "Status updated",
      description: `Application status changed to ${newStatus}`,
    });
  };

  const handleSendCommunication = () => {
    if (!communicationType || !communicationMessage) {
      toast({
        title: "Error",
        description: "Please select type and enter message",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Communication sent",
      description: "Message has been sent to the applicant",
    });
    setShowCommunicationDialog(false);
    setCommunicationType('');
    setCommunicationMessage('');
  };

  const handleGenerateAcceptance = () => {
    toast({
      title: "Acceptance letter generated",
      description: "The acceptance letter has been created and sent",
    });
    setShowAcceptanceDialog(false);
    handleStatusChange('accepted');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Application Review</h1>
            <p className="text-muted-foreground">Review and process application #{applicationId}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/university/applications')}>
              Back to Applications
            </Button>
            <Button onClick={() => setShowAcceptanceDialog(true)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept Application
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Info */}
            <Card>
              <CardHeader>
                <CardTitle>Applicant Information</CardTitle>
                <CardDescription>Basic details about the applicant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{application.applicant.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{application.applicant.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{application.applicant.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Applied For</p>
                      <p className="font-medium">{application.course}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Score Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Match Score Analysis</span>
                  <div className="text-3xl font-bold text-primary">{application.matchScore}%</div>
                </CardTitle>
                <CardDescription>Detailed breakdown of application matching criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={application.matchScore} className="mb-6" />
                <div className="space-y-4">
                  {application.matchDetails.map((detail, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{detail.criteria}</p>
                        <p className="text-sm text-muted-foreground">
                          Value: {detail.value} | Requirement: {detail.requirement}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{detail.score}/{detail.maxScore}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                        {detail.matched ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Application Data */}
            <Card>
              <CardHeader>
                <CardTitle>Application Data</CardTitle>
                <CardDescription>Submitted form information</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="scores">Test Scores</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(application.formData.personalInfo).map(([key, value]) => (
                        <div key={key}>
                          <Label className="text-muted-foreground">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Label>
                          <p className="font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="education" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(application.formData.education).map(([key, value]) => (
                        <div key={key}>
                          <Label className="text-muted-foreground">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Label>
                          <p className="font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="scores" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(application.formData.testScores).map(([key, value]) => (
                        <div key={key}>
                          <Label className="text-muted-foreground">
                            {key.toUpperCase()}
                          </Label>
                          <p className="font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(application.formData.experience).map(([key, value]) => (
                        <div key={key}>
                          <Label className="text-muted-foreground">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Label>
                          <p className="font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status & Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Status</Label>
                  <Select value={application.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="document_requested">Document Requested</SelectItem>
                      <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setShowCommunicationDialog(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Communication
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Request Documents
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Submitted application documents</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {application.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.size}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={doc.status === 'verified' ? 'secondary' : 'outline'}>
                            {doc.status}
                          </Badge>
                          <Button size="icon" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
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
                <CardDescription>Previous messages and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    {application.communications.map((comm, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {comm.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{comm.date}</span>
                        </div>
                        <p className="text-sm">{comm.message}</p>
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
              <DialogDescription>Send a message or notification to the applicant</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Communication Type</Label>
                <Select value={communicationType} onValueChange={setCommunicationType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notification">General Notification</SelectItem>
                    <SelectItem value="document_request">Document Request</SelectItem>
                    <SelectItem value="clarification">Clarification Needed</SelectItem>
                    <SelectItem value="interview">Interview Invitation</SelectItem>
                    <SelectItem value="update">Status Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={communicationMessage}
                  onChange={(e) => setCommunicationMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCommunicationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendCommunication}>
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Acceptance Letter Dialog */}
        <Dialog open={showAcceptanceDialog} onOpenChange={setShowAcceptanceDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generate Acceptance Letter</DialogTitle>
              <DialogDescription>Create and send an acceptance letter to the applicant</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  The applicant has met all requirements with a match score of {application.matchScore}%.
                  You can now generate and send the acceptance letter.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label>Additional Conditions (Optional)</Label>
                <Textarea
                  placeholder="Enter any conditions or requirements..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Program Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Response Deadline</Label>
                <Input type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAcceptanceDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateAcceptance}>
                Generate & Send Letter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ApplicationReview;