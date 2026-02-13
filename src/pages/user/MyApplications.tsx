import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  ArrowRight,
  Download,
  MessageSquare,
  Award,
  Calendar,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useApplicationSubmissions, ApplicationSubmission } from "@/hooks/useApplicationSubmissions";

const STAGE_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview Scheduled',
  accepted: 'Accepted',
  rejected: 'Rejected',
  waitlisted: 'Waitlisted',
};

const APPLICATION_STAGES = ['submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'accepted'] as const;

const MyApplications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { applications } = useApplicationSubmissions();

  const filteredApplications = applications.filter(app =>
    app.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.universityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'under_review': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'shortlisted': return <Award className="h-4 w-4 text-purple-600" />;
      case 'interview_scheduled': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'waitlisted': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'submitted': return <FileCheck className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      accepted: "default",
      rejected: "destructive",
      under_review: "secondary",
      shortlisted: "secondary",
      interview_scheduled: "secondary",
      waitlisted: "outline",
      submitted: "outline",
    };

    return (
      <Badge variant={variants[status] || "outline"} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {STAGE_LABELS[status] || status}
      </Badge>
    );
  };

  const renderApplicationCard = (app: ApplicationSubmission) => {
    const currentIdx = APPLICATION_STAGES.indexOf(app.status as any);

    return (
      <Card key={app.id}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg">{app.courseName}</h3>
              <p className="text-muted-foreground">{app.universityName}</p>
            </div>
            {getStatusBadge(app.status)}
          </div>

          {/* Stage Progress */}
          <div className="mb-4">
            <div className="flex items-center gap-0.5 mb-1">
              {APPLICATION_STAGES.map((stage, idx) => {
                const isActive = app.status !== 'rejected' && idx <= currentIdx;
                return (
                  <div key={stage} className="flex-1 flex flex-col items-center">
                    <div className={`h-1.5 w-full rounded-full ${
                      app.status === 'rejected' ? 'bg-destructive/30' :
                      isActive ? 'bg-primary' : 'bg-muted'
                    }`} />
                    <span className={`text-[9px] mt-1 ${
                      stage === app.status ? 'font-bold text-primary' : 'text-muted-foreground'
                    }`}>
                      {STAGE_LABELS[stage]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
            <div>
              <p className="text-muted-foreground">Match Score</p>
              <p className={`font-medium ${
                app.matchScore > 80 ? 'text-green-600' : 
                app.matchScore >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>{app.matchScore}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{new Date(app.lastUpdated).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Submitted</p>
              <p className="font-medium">{new Date(app.submittedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Application ID</p>
              <p className="font-medium">{app.id}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/user/applications/${app.id}`)}
            >
              View Details
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/user/communications/${app.id}`)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Messages
            </Button>
            {app.status === 'accepted' && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-green-600 border-green-200"
                onClick={() => toast.success(`Downloading offer letter for ${app.courseName}`)}
              >
                <Download className="h-4 w-4 mr-1" />
                Offer Letter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">Track and manage all your university applications</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by course or university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full max-w-2xl grid-cols-6">
          <TabsTrigger value="all">All ({filteredApplications.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.map(renderApplicationCard)}
          {filteredApplications.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No applications found</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {filteredApplications.filter(a => a.status === 'submitted').map(renderApplicationCard)}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {filteredApplications.filter(a => ['under_review', 'shortlisted'].includes(a.status)).map(renderApplicationCard)}
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          {filteredApplications.filter(a => a.status === 'interview_scheduled').map(renderApplicationCard)}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {filteredApplications.filter(a => a.status === 'accepted').map(renderApplicationCard)}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filteredApplications.filter(a => ['rejected', 'waitlisted'].includes(a.status)).map(renderApplicationCard)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyApplications;
