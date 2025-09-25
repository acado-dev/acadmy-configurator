import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  CheckCircle, 
  Clock,
  MessageSquare,
  Calendar,
  User
} from "lucide-react";
import { toast } from "sonner";

const ApplicationDetail = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  // Mock application data - in production, this would come from your backend
  const application = {
    id: applicationId,
    courseName: "Artificial Intelligence – AI Now-a-Days",
    universityName: "Metropolia University",
    status: "accepted",
    submittedDate: "2024-01-10",
    lastUpdated: "2024-01-15",
    applicationNumber: "APP-2024-001234",
    
    // Personal Information
    personalInfo: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 234 567 8900",
      dateOfBirth: "1998-05-15",
      nationality: "United States",
      address: "123 Main St, New York, NY 10001"
    },
    
    // Academic Information
    academicInfo: {
      previousEducation: "Bachelor of Science in Computer Science",
      university: "New York University",
      gpa: "3.8/4.0",
      graduationYear: "2022"
    },
    
    // Documents
    documents: [
      { name: "Transcript", status: "approved", uploadedDate: "2024-01-10" },
      { name: "Letter of Recommendation 1", status: "approved", uploadedDate: "2024-01-10" },
      { name: "Letter of Recommendation 2", status: "approved", uploadedDate: "2024-01-10" },
      { name: "Statement of Purpose", status: "approved", uploadedDate: "2024-01-10" },
      { name: "English Proficiency Certificate", status: "approved", uploadedDate: "2024-01-10" },
    ],
    
    // Timeline
    timeline: [
      { date: "2024-01-10", event: "Application Submitted", status: "completed" },
      { date: "2024-01-11", event: "Application Under Review", status: "completed" },
      { date: "2024-01-13", event: "Interview Scheduled", status: "completed" },
      { date: "2024-01-14", event: "Interview Completed", status: "completed" },
      { date: "2024-01-15", event: "Application Accepted", status: "completed" },
    ],
    
    // Communications
    communications: [
      { 
        date: "2024-01-15", 
        type: "success", 
        subject: "Congratulations! Application Accepted",
        message: "We are pleased to inform you that your application has been accepted."
      },
      { 
        date: "2024-01-14", 
        type: "info", 
        subject: "Interview Completed",
        message: "Thank you for attending the interview. We will review and get back to you soon."
      },
      { 
        date: "2024-01-13", 
        type: "info", 
        subject: "Interview Scheduled",
        message: "Your interview has been scheduled for January 14, 2024 at 2:00 PM EST."
      },
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      case 'under-review':
        return 'text-yellow-600 bg-yellow-50';
      case 'draft':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleDownloadDocument = (docName: string) => {
    toast.success(`Downloading ${docName}`);
  };

  const handleDownloadAcceptanceLetter = () => {
    toast.success("Downloading acceptance letter");
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/user/applications')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{application.courseName}</h1>
            <p className="text-muted-foreground text-lg">{application.universityName}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Application Number: {application.applicationNumber}
            </p>
          </div>
          <div className="text-right">
            <Badge className={`${getStatusColor(application.status)} border-0 mb-2`}>
              {application.status === 'accepted' && <CheckCircle className="h-4 w-4 mr-1" />}
              {application.status === 'under-review' && <Clock className="h-4 w-4 mr-1" />}
              {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('-', ' ')}
            </Badge>
            {application.status === 'accepted' && (
              <div>
                <Button onClick={handleDownloadAcceptanceLetter}>
                  <Download className="h-4 w-4 mr-2" />
                  Acceptance Letter
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="details">Application Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        {/* Application Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{application.personalInfo.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{application.personalInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{application.personalInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{application.personalInfo.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nationality</p>
                <p className="font-medium">{application.personalInfo.nationality}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{application.personalInfo.address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Previous Education</p>
                <p className="font-medium">{application.academicInfo.previousEducation}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">University</p>
                <p className="font-medium">{application.academicInfo.university}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GPA</p>
                <p className="font-medium">{application.academicInfo.gpa}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Graduation Year</p>
                <p className="font-medium">{application.academicInfo.graduationYear}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Documents</CardTitle>
              <CardDescription>All documents submitted with your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {application.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded on {doc.uploadedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={doc.status === 'approved' ? 'default' : 'secondary'}>
                        {doc.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadDocument(doc.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>Track the progress of your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application.timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'completed' ? 'bg-green-600' : 'bg-gray-300'
                      }`} />
                      {index < application.timeline.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <p className="font-medium">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communications</CardTitle>
              <CardDescription>Messages from the university regarding your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application.communications.map((comm, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className={`h-5 w-5 ${
                          comm.type === 'success' ? 'text-green-600' :
                          comm.type === 'error' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                        <h4 className="font-medium">{comm.subject}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{comm.date}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{comm.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationDetail;