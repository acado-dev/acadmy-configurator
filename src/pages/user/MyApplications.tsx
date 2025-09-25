import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

const MyApplications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock applications data - in production, this would come from your backend
  const applications = [
    {
      id: "1",
      courseName: "Artificial Intelligence – AI Now-a-Days",
      universityName: "Metropolia University",
      universityId: "uni-1",
      status: "accepted",
      submittedDate: "2024-01-10",
      lastUpdated: "2024-01-15",
      progress: 100,
      hasAcceptanceLetter: true,
      messages: 2
    },
    {
      id: "2",
      courseName: "Business Informatics",
      universityName: "Oxford University",
      universityId: "uni-2",
      status: "under-review",
      submittedDate: "2024-01-08",
      lastUpdated: "2024-01-10",
      progress: 100,
      messages: 1
    },
    {
      id: "3",
      courseName: "Healthcare & Diagnostics Technologies",
      universityName: "MIT",
      universityId: "uni-3",
      status: "accepted",
      submittedDate: "2024-01-12",
      lastUpdated: "2024-01-14",
      progress: 100,
      hasAcceptanceLetter: true,
      messages: 3
    },
    {
      id: "4",
      courseName: "Creativity & Arts",
      universityName: "Harvard University",
      universityId: "uni-2",
      status: "draft",
      submittedDate: null,
      lastUpdated: "2024-01-18",
      progress: 45,
      messages: 0
    },
    {
      id: "5",
      courseName: "Construction & Real Estate",
      universityName: "Stanford University",
      universityId: "uni-1",
      status: "rejected",
      submittedDate: "2024-01-05",
      lastUpdated: "2024-01-16",
      progress: 100,
      messages: 1
    }
  ];

  const filteredApplications = applications.filter(app =>
    app.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.universityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'under-review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'draft':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      accepted: "default",
      rejected: "destructive",
      "under-review": "secondary",
      draft: "outline"
    };

    return (
      <Badge variant={variants[status] || "outline"} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const handleViewApplication = (appId: string) => {
    navigate(`/user/applications/${appId}`);
  };

  const handleContinueApplication = (appId: string) => {
    navigate(`/user/apply/${appId}`);
  };

  const handleViewMessages = (appId: string) => {
    navigate(`/user/communications/${appId}`);
  };

  const handleDownloadLetter = (app: any) => {
    toast.success(`Downloading acceptance letter for ${app.courseName}`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">Track and manage all your university applications</p>
      </div>

      {/* Search Bar */}
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

      {/* Applications Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full max-w-lg grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{app.courseName}</h3>
                        <p className="text-muted-foreground">{app.universityName}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-medium">{app.progress}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{app.lastUpdated}</p>
                      </div>
                      {app.submittedDate && (
                        <div>
                          <p className="text-muted-foreground">Submitted</p>
                          <p className="font-medium">{app.submittedDate}</p>
                        </div>
                      )}
                      {app.messages > 0 && (
                        <div>
                          <p className="text-muted-foreground">Messages</p>
                          <p className="font-medium">{app.messages} unread</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {app.status === 'draft' ? (
                        <Button 
                          size="sm"
                          onClick={() => handleContinueApplication(app.id)}
                        >
                          Continue Application
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewApplication(app.id)}
                        >
                          View Application
                        </Button>
                      )}
                      
                      {app.messages > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewMessages(app.id)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Messages ({app.messages})
                        </Button>
                      )}
                      
                      {app.hasAcceptanceLetter && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadLetter(app)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Acceptance Letter
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {filteredApplications.filter(app => app.status === 'draft').map((app) => (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{app.courseName}</h3>
                    <p className="text-muted-foreground">{app.universityName}</p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Progress: {app.progress}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${app.progress}%` }}
                    />
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleContinueApplication(app.id)}
                >
                  Continue Application
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {filteredApplications.filter(app => app.status === 'under-review').map((app) => (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{app.courseName}</h3>
                    <p className="text-muted-foreground">{app.universityName}</p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Submitted on {app.submittedDate}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewApplication(app.id)}
                >
                  View Application
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {filteredApplications.filter(app => app.status === 'accepted').map((app) => (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{app.courseName}</h3>
                    <p className="text-muted-foreground">{app.universityName}</p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
                <p className="text-sm text-green-600 mb-3">
                  Congratulations! You've been accepted.
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => handleDownloadLetter(app)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download Letter
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewApplication(app.id)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filteredApplications.filter(app => app.status === 'rejected').map((app) => (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{app.courseName}</h3>
                    <p className="text-muted-foreground">{app.universityName}</p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewApplication(app.id)}
                >
                  View Application
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyApplications;