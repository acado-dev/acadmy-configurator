import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  User, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  GraduationCap,
  MessageSquare,
  Download,
  Bell,
  FileCheck,
  Inbox,
  ArrowRight,
  ExternalLink,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [acceptanceDialog, setAcceptanceDialog] = useState(false);
  const [selectedAcceptance, setSelectedAcceptance] = useState<any>(null);
  const userAuth = localStorage.getItem("userAuth");
  const user = userAuth ? JSON.parse(userAuth) : null;
  
  // Enhanced stats with university and course applications
  const stats = {
    profileCompletion: 65,
    coursesApplied: 4,
    universitiesApplied: 3,
    acceptanceLetters: 2,
  };
  
  // Enhanced applications with status and communications
  const applications = [
    {
      id: "1",
      courseName: "Artificial Intelligence – AI Now-a-Days",
      universityName: "Metropolia University",
      universityId: "uni-1",
      status: "accepted",
      lastUpdated: "2024-01-15",
      hasAcceptanceLetter: true,
      communications: [
        { type: 'success', message: 'Congratulations! You have been accepted', date: '2024-01-15' },
        { type: 'info', message: 'Please submit enrollment confirmation by Feb 1st', date: '2024-01-16' }
      ],
      nextSteps: ['Submit enrollment confirmation', 'Pay registration fee', 'Submit visa documents']
    },
    {
      id: "2",
      courseName: "Business Management",
      universityName: "Oxford University",
      universityId: "uni-2",
      status: "under-review",
      lastUpdated: "2024-01-10",
      progress: 100,
      communications: [
        { type: 'info', message: 'Application received and under review', date: '2024-01-10' },
        { type: 'warning', message: 'Additional transcript required', date: '2024-01-12' }
      ],
      documentsRequired: ['Official transcript', 'English proficiency certificate']
    },
    {
      id: "3",
      courseName: "Data Science Fundamentals",
      universityName: "MIT",
      universityId: "uni-3",
      status: "accepted",
      lastUpdated: "2024-01-14",
      hasAcceptanceLetter: true,
      communications: [
        { type: 'success', message: 'You have been accepted to the program', date: '2024-01-14' }
      ],
      nextSteps: ['Accept offer by Jan 30th', 'Submit housing preferences']
    },
    {
      id: "4",
      courseName: "Healthcare Management",
      universityName: "Harvard University",
      universityId: "uni-2",
      status: "draft",
      lastUpdated: "2024-01-18",
      progress: 45,
      communications: []
    }
  ];
  
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const pendingCommunications = applications.filter(app => 
    app.communications && app.communications.length > 0
  );

  const handleDownloadAcceptance = (application: any) => {
    toast.success(`Downloading acceptance letter for ${application.courseName}`);
    // In real app, this would download the actual PDF
  };

  const handleViewAcceptance = (application: any) => {
    setSelectedAcceptance(application);
    setAcceptanceDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; icon: any; label: string }> = {
      'accepted': { variant: 'default', icon: CheckCircle, label: 'Accepted' },
      'under-review': { variant: 'secondary', icon: Clock, label: 'Under Review' },
      'draft': { variant: 'outline', icon: FileText, label: 'Draft' },
      'rejected': { variant: 'destructive', icon: AlertCircle, label: 'Rejected' },
      'submitted': { variant: 'default', icon: FileCheck, label: 'Submitted' }
    };
    
    const { variant, icon: Icon, label } = variants[status] || variants['draft'];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header with Notifications */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Track your applications and discover new opportunities
          </p>
        </div>
        {acceptedApplications.length > 0 && (
          <Badge variant="default" className="gap-1 animate-pulse bg-green-600 text-white">
            <Bell className="h-3 w-3" />
            {acceptedApplications.length} Acceptance{acceptedApplications.length > 1 ? 's' : ''}!
          </Badge>
        )}
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Applied</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{stats.coursesApplied}</div>
            <p className="text-xs text-muted-foreground">
              Across all universities
            </p>
            <Button 
              variant="link" 
              className="px-0 mt-2"
              onClick={() => navigate("/user/applications")}
            >
              View Applications →
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Universities Applied</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.universitiesApplied}</div>
            <p className="text-xs text-muted-foreground">
              Different institutions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Letters</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.acceptanceLetters}</div>
            <p className="text-xs text-muted-foreground">
              Congratulations! 🎉
            </p>
            {stats.acceptanceLetters > 0 && (
              <Button 
                variant="link" 
                className="px-0 mt-2"
                onClick={() => setAcceptanceDialog(true)}
              >
                View Letters →
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{stats.profileCompletion}%</div>
            <Progress value={stats.profileCompletion} className="h-2" />
            <Button 
              variant="link" 
              className="px-0 mt-2"
              onClick={() => navigate("/user/portfolio")}
            >
              Complete Profile →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Application Status & Communications */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Application Status & Communications</CardTitle>
          <CardDescription>
            Track your applications and university messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
              <TabsTrigger value="accepted">
                Accepted ({acceptedApplications.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({applications.filter(a => a.status === 'under-review').length})
              </TabsTrigger>
              <TabsTrigger value="action-required">
                Action Required ({applications.filter(a => a.documentsRequired).length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{app.courseName}</h4>
                      <p className="text-sm text-muted-foreground">{app.universityName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(app.status)}
                      {app.hasAcceptanceLetter && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewAcceptance(app)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Letter
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Communications */}
                  {app.communications && app.communications.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {app.communications.slice(0, 2).map((comm, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <MessageSquare className={`h-4 w-4 mt-0.5 ${
                            comm.type === 'success' ? 'text-green-600' :
                            comm.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                          <div className="flex-1">
                            <p>{comm.message}</p>
                            <span className="text-xs text-muted-foreground">{comm.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Required Documents */}
                  {app.documentsRequired && app.documentsRequired.length > 0 && (
                    <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                        Documents Required:
                      </p>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
                        {app.documentsRequired.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Next Steps */}
                  {app.nextSteps && app.nextSteps.length > 0 && (
                    <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Next Steps:
                      </p>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        {app.nextSteps.map((step, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant={app.status === 'draft' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => navigate(`/user/applications/${app.id}`)}
                    >
                      {app.status === 'draft' ? 'Continue Application' : 'View Details'}
                    </Button>
                    {app.communications && app.communications.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/user/communications/${app.id}`)}
                      >
                        <Inbox className="h-3 w-3 mr-1" />
                        Messages ({app.communications.length})
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="accepted" className="space-y-4">
              {acceptedApplications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{app.courseName}</h4>
                      <p className="text-sm text-muted-foreground">{app.universityName}</p>
                    </div>
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleViewAcceptance(app)}
                      >
                      <Download className="h-3 w-3 mr-1" />
                      Acceptance Letter
                    </Button>
                  </div>
                  {app.nextSteps && app.nextSteps.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Complete these steps:</p>
                      {app.nextSteps.map((step, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          {step}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              {applications
                .filter(app => app.status === 'under-review')
                .map((app) => (
                  <div key={app.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold">{app.courseName}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{app.universityName}</p>
                    <p className="text-sm">Application submitted and under review</p>
                    <p className="text-xs text-muted-foreground mt-1">Last updated: {app.lastUpdated}</p>
                  </div>
                ))}
            </TabsContent>
            
            <TabsContent value="action-required" className="space-y-4">
              {applications
                .filter(app => app.documentsRequired)
                .map((app) => (
                  <div key={app.id} className="border rounded-lg p-4 border-yellow-500">
                    <h4 className="font-semibold">{app.courseName}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{app.universityName}</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        Documents Required:
                      </p>
                      {app.documentsRequired?.map((doc, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground">• {doc}</p>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate(`/user/applications/${app.id}`)}
                    >
                      Upload Documents
                    </Button>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/user/courses")}
            >
              <BookOpen className="h-5 w-5" />
              <span>Browse Courses</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/user/applications")}
            >
              <FileText className="h-5 w-5" />
              <span>My Applications</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => setAcceptanceDialog(true)}
            >
              <Mail className="h-5 w-5" />
              <span>Acceptance Letters</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/user/portfolio")}
            >
              <User className="h-5 w-5" />
              <span>My Portfolio</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Acceptance Letter Dialog */}
      <Dialog open={acceptanceDialog} onOpenChange={setAcceptanceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Acceptance Letters</DialogTitle>
            <DialogDescription>
              Congratulations on your acceptances! Download your official letters below.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {acceptedApplications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{app.courseName}</h4>
                      <p className="text-sm text-muted-foreground">{app.universityName}</p>
                      <p className="text-sm text-green-600 mt-1">
                        Accepted on {app.lastUpdated}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast.success(`Opening acceptance letter for ${app.courseName}`);
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownloadAcceptance(app)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  {app.nextSteps && app.nextSteps.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-medium mb-2">Next Steps:</p>
                      <ul className="space-y-1">
                        {app.nextSteps.map((step, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-1">
                            <CheckCircle className="h-3 w-3 mt-0.5 text-green-600" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;