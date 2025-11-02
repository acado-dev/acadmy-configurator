import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApplicationSubmissions } from "@/hooks/useApplicationSubmissions";
import { useFormsData } from "@/hooks/useFormsData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  FileText,
  CheckCircle,
  Clock,
  Target,
  XCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
  Award,
} from "lucide-react";

const ApplicationReview = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getApplicationById, updateApplicationStatus } = useApplicationSubmissions();
  const { forms, universities, courses } = useFormsData();

  const application = getApplicationById(applicationId || "");
  const [selectedStatus, setSelectedStatus] = useState(application?.status || "submitted");
  const [isCommDialogOpen, setIsCommDialogOpen] = useState(false);
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const [isDocRequestDialogOpen, setIsDocRequestDialogOpen] = useState(false);
  const [isAcceptanceDialogOpen, setIsAcceptanceDialogOpen] = useState(false);

  const [commMessage, setCommMessage] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [docRequest, setDocRequest] = useState("");

  const stages = [
    { value: "submitted", label: "Submitted", icon: FileText, color: "bg-blue-500" },
    { value: "under_review", label: "In Review", icon: Clock, color: "bg-yellow-500" },
    { value: "shortlisted", label: "Shortlisted", icon: Target, color: "bg-purple-500" },
    { value: "interview_scheduled", label: "In Progress", icon: AlertCircle, color: "bg-orange-500" },
    { value: "accepted", label: "Selected", icon: CheckCircle, color: "bg-green-500" },
    { value: "rejected", label: "Rejected", icon: XCircle, color: "bg-red-500" },
  ];

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Application Not Found</h2>
        <p className="text-muted-foreground mb-4">The application you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/form-applications")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
      </div>
    );
  }

  const form = forms.find((f) => f.id === application.formId);
  const course = courses.find((c) => c.id === application.courseId);
  const university = universities.find((u) => u.id === application.universityId);
  const currentStage = stages.find((s) => s.value === application.status);
  const StageIcon = currentStage?.icon || FileText;

  const handleStatusChange = (newStatus: string) => {
    const typedStatus = newStatus as typeof selectedStatus;
    setSelectedStatus(typedStatus);
    updateApplicationStatus(application.id, typedStatus as any);
    toast({
      title: "Status Updated",
      description: `Application status changed to ${stages.find((s) => s.value === newStatus)?.label}`,
    });
  };

  const handleSendCommunication = () => {
    toast({
      title: "Communication Sent",
      description: "Your message has been sent to the applicant.",
    });
    setCommMessage("");
    setIsCommDialogOpen(false);
  };

  const handleScheduleInterview = () => {
    toast({
      title: "Interview Scheduled",
      description: `Interview scheduled for ${interviewDate} at ${interviewTime}`,
    });
    setInterviewDate("");
    setInterviewTime("");
    setIsInterviewDialogOpen(false);
  };

  const handleRequestDocuments = () => {
    toast({
      title: "Document Request Sent",
      description: "Document request has been sent to the applicant.",
    });
    setDocRequest("");
    setIsDocRequestDialogOpen(false);
  };

  const handleGenerateAcceptance = () => {
    toast({
      title: "Acceptance Letter Generated",
      description: "Acceptance letter has been generated and sent to the applicant.",
    });
    updateApplicationStatus(application.id, "accepted");
    setSelectedStatus("accepted");
    setIsAcceptanceDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/form-applications")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Application Review2222</h1>
          <p className="text-muted-foreground mt-1">Review and manage application details</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${currentStage?.color}`} />
          {currentStage?.label}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium text-foreground">{application.applicantName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{application.applicantEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{application.applicantPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Application ID</p>
                    <p className="font-medium text-foreground">{application.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program Information */}
          <Card>
            <CardHeader>
              <CardTitle>Program Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">University</p>
                    <p className="font-medium text-foreground">{university?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Course</p>
                    <p className="font-medium text-foreground">{course?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Form Used</p>
                    <p className="font-medium text-foreground">{form?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Match Score</p>
                    <p
                      className={`font-bold text-lg ${
                        application.matchScore >= 80
                          ? "text-green-600"
                          : application.matchScore >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {application.matchScore}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Data */}
          <Card>
            <CardHeader>
              <CardTitle>Application Form Data</CardTitle>
              <CardDescription>Information submitted by the applicant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(application.formData).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                    <span className="text-sm font-medium text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-sm text-foreground font-semibold">{String(value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Submitted</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(application.submittedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(application.lastUpdated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Change the current stage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => {
                    const Icon = stage.icon;
                    return (
                      <SelectItem key={stage.value} value={stage.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                          {stage.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Communicate with applicant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Send Communication */}
              <Dialog open={isCommDialogOpen} onOpenChange={setIsCommDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Communication
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Communication</DialogTitle>
                    <DialogDescription>Send a message to the applicant</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Type your message here..."
                        value={commMessage}
                        onChange={(e) => setCommMessage(e.target.value)}
                        rows={5}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCommDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendCommunication}>Send Message</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Schedule Interview */}
              <Dialog open={isInterviewDialogOpen} onOpenChange={setIsInterviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule Interview</DialogTitle>
                    <DialogDescription>Set interview date and time</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Interview Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Interview Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={interviewTime}
                        onChange={(e) => setInterviewTime(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsInterviewDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleScheduleInterview}>Schedule</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Request Documents */}
              <Dialog open={isDocRequestDialogOpen} onOpenChange={setIsDocRequestDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Request Documents
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Documents</DialogTitle>
                    <DialogDescription>Request additional documents from applicant</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="docrequest">Document Details</Label>
                      <Textarea
                        id="docrequest"
                        placeholder="Specify which documents you need..."
                        value={docRequest}
                        onChange={(e) => setDocRequest(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsDocRequestDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleRequestDocuments}>Send Request</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Separator />

              {/* Generate Acceptance */}
              <Dialog open={isAcceptanceDialogOpen} onOpenChange={setIsAcceptanceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                    <Award className="h-4 w-4 mr-2" />
                    Generate Acceptance
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Acceptance Letter</DialogTitle>
                    <DialogDescription>
                      This will generate and send an acceptance letter to the applicant
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to generate an acceptance letter for {application.applicantName}? This will
                      automatically change the application status to "Selected".
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAcceptanceDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleGenerateAcceptance} className="bg-green-600 hover:bg-green-700">
                        Generate & Send
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReview;
