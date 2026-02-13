import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  User, 
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  GraduationCap,
  MessageSquare,
  Download,
  Bell,
  ArrowRight,
  ExternalLink,
  Mail,
  Award,
  AlertTriangle,
  Calendar,
  XCircle,
  FileCheck
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
import { useApplicationSubmissions, ApplicationSubmission } from '@/hooks/useApplicationSubmissions';
import { useUserNotifications } from '@/hooks/useUserNotifications';

const APPLICATION_STAGES = [
  'submitted',
  'under_review',
  'shortlisted',
  'interview_scheduled',
  'accepted',
] as const;

const STAGE_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview',
  accepted: 'Accepted',
  rejected: 'Rejected',
  waitlisted: 'Waitlisted',
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [acceptanceDialog, setAcceptanceDialog] = useState(false);
  const [offerDialog, setOfferDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<ApplicationSubmission | null>(null);
  const userAuth = localStorage.getItem("userAuth");
  const user = userAuth ? JSON.parse(userAuth) : null;
  
  const { applications } = useApplicationSubmissions();
  const { notifications, unreadCount, actionRequired, markAsRead } = useUserNotifications();

  // Compute stats from real data
  const uniqueUniversities = new Set(applications.map(a => a.universityId)).size;
  const acceptedApps = applications.filter(a => a.status === 'accepted');
  const stats = {
    profileCompletion: 65,
    coursesApplied: applications.length,
    universitiesApplied: uniqueUniversities,
    acceptanceLetters: acceptedApps.length,
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; icon: any; color?: string }> = {
      accepted: { variant: 'default', icon: CheckCircle },
      shortlisted: { variant: 'secondary', icon: Award },
      under_review: { variant: 'secondary', icon: Clock },
      interview_scheduled: { variant: 'secondary', icon: Calendar },
      submitted: { variant: 'outline', icon: FileCheck },
      rejected: { variant: 'destructive', icon: XCircle },
      waitlisted: { variant: 'outline', icon: AlertCircle },
    };
    const { variant, icon: Icon } = config[status] || config.submitted;
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {STAGE_LABELS[status] || status}
      </Badge>
    );
  };

  const getStageProgress = (status: string) => {
    const idx = APPLICATION_STAGES.indexOf(status as any);
    if (status === 'rejected') return 100;
    if (idx === -1) return 10;
    return ((idx + 1) / APPLICATION_STAGES.length) * 100;
  };

  const handleDownloadOffer = (app: ApplicationSubmission) => {
    toast.success(`Downloading offer letter for ${app.courseName}`);
  };

  const handleAcceptOffer = (app: ApplicationSubmission) => {
    toast.success(`Offer accepted for ${app.courseName}! Enrollment confirmed.`);
    setOfferDialog(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Track your applications, notifications, and opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          {actionRequired.length > 0 && (
            <Badge variant="destructive" className="gap-1 animate-pulse">
              <AlertTriangle className="h-3 w-3" />
              {actionRequired.length} action{actionRequired.length > 1 ? 's' : ''} needed
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={() => navigate('/user/notifications')}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Action Required Banner */}
      {actionRequired.length > 0 && (
        <Card className="mb-6 border-destructive/50 bg-destructive/5">
          <CardContent className="p-4">
            <h3 className="font-semibold flex items-center gap-2 text-destructive mb-3">
              <AlertTriangle className="h-4 w-4" />
              Action Required
            </h3>
            <div className="space-y-2">
              {actionRequired.slice(0, 3).map(notif => (
                <div
                  key={notif.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border cursor-pointer hover:shadow-sm transition"
                  onClick={() => {
                    markAsRead(notif.id);
                    if (notif.actionRoute) navigate(notif.actionRoute);
                  }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.courseName} • {notif.universityName}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    {notif.actionLabel || 'View'}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => navigate('/user/applications')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coursesApplied}</div>
            <p className="text-xs text-muted-foreground">Across {stats.universitiesApplied} universities</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => setAcceptanceDialog(true)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offer Letters</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.acceptanceLetters}</div>
            <p className="text-xs text-muted-foreground">
              {stats.acceptanceLetters > 0 ? 'Congratulations! 🎉' : 'Pending decisions'}
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => navigate('/user/notifications')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => navigate('/user/portfolio')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{stats.profileCompletion}%</div>
            <Progress value={stats.profileCompletion} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Application Pipeline */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Application Pipeline</CardTitle>
              <CardDescription>Track your applications through each stage</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/user/applications')}>
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No applications yet. Start exploring courses!</p>
              <Button className="mt-4" onClick={() => navigate('/user/courses')}>
                Browse Courses
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4 hover:shadow-sm transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{app.courseName}</h4>
                      <p className="text-sm text-muted-foreground">{app.universityName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(app.status)}
                      {app.status === 'accepted' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => {
                            setSelectedOffer(app);
                            setOfferDialog(true);
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Offer Letter
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      {APPLICATION_STAGES.map((stage, idx) => {
                        const currentIdx = APPLICATION_STAGES.indexOf(app.status as any);
                        const isActive = idx <= currentIdx;
                        const isCurrent = stage === app.status;
                        return (
                          <div key={stage} className="flex flex-col items-center flex-1">
                            <div className={`h-2 w-full rounded-full ${idx === 0 ? 'rounded-l-full' : ''} ${idx === APPLICATION_STAGES.length - 1 ? 'rounded-r-full' : ''} ${
                              app.status === 'rejected' ? 'bg-destructive/30' :
                              isActive ? 'bg-primary' : 'bg-muted'
                            }`} />
                            <span className={`text-[10px] mt-1 ${isCurrent ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                              {STAGE_LABELS[stage]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Match Score: <span className={`font-semibold ${
                        app.matchScore > 80 ? 'text-green-600' : 
                        app.matchScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{app.matchScore}%</span>
                    </span>
                    <span className="text-muted-foreground">
                      Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-3">
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
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Messages
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Latest updates from universities</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/user/notifications')}>
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.slice(0, 5).map(notif => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  !notif.isRead ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  markAsRead(notif.id);
                  if (notif.actionRoute) navigate(notif.actionRoute);
                }}
              >
                {!notif.isRead && <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notif.isRead ? 'font-semibold' : 'font-medium text-muted-foreground'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{notif.message}</p>
                  <span className="text-xs text-muted-foreground">{notif.courseName}</span>
                </div>
                {notif.isActionRequired && (
                  <Badge variant="outline" className="text-xs shrink-0">Action</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate("/user/courses")}>
              <BookOpen className="h-5 w-5" />
              <span>Browse Courses</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate("/user/applications")}>
              <FileText className="h-5 w-5" />
              <span>My Applications</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate("/user/notifications")}>
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate("/user/portfolio")}>
              <User className="h-5 w-5" />
              <span>My Portfolio</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offer Letters Dialog */}
      <Dialog open={acceptanceDialog} onOpenChange={setAcceptanceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Offer Letters</DialogTitle>
            <DialogDescription>
              {acceptedApps.length > 0 
                ? 'Congratulations! Download your official offer letters below.'
                : 'No offer letters yet. Keep track of your applications!'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {acceptedApps.map((app) => (
                <div key={app.id} className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{app.courseName}</h4>
                      <p className="text-sm text-muted-foreground">{app.universityName}</p>
                      <p className="text-sm text-green-600 mt-1">
                        Accepted on {new Date(app.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOffer(app);
                          setAcceptanceDialog(false);
                          setOfferDialog(true);
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" onClick={() => handleDownloadOffer(app)}>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {acceptedApps.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No offer letters yet. Your applications are being reviewed.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Offer Letter Detail Dialog */}
      <Dialog open={offerDialog} onOpenChange={setOfferDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Offer Letter</DialogTitle>
            <DialogDescription>{selectedOffer?.courseName} at {selectedOffer?.universityName}</DialogDescription>
          </DialogHeader>
          {selectedOffer && (
            <div className="space-y-6">
              <div className="border rounded-lg p-6 bg-muted/30">
                <div className="text-center mb-6">
                  <Award className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">Official Offer of Admission</h3>
                  <p className="text-muted-foreground">{selectedOffer.universityName}</p>
                </div>
                <div className="space-y-3 text-sm">
                  <p>Dear {selectedOffer.applicantName},</p>
                  <p>
                    We are pleased to offer you admission to the <strong>{selectedOffer.courseName}</strong> program 
                    at {selectedOffer.universityName} for the upcoming academic year.
                  </p>
                  <p>
                    Your application (Reference: <strong>{selectedOffer.id}</strong>) has been reviewed 
                    and approved. Your match score of <strong>{selectedOffer.matchScore}%</strong> demonstrates 
                    your strong fit for this program.
                  </p>
                  <div className="border-t pt-3 mt-3">
                    <p className="font-semibold mb-2">Next Steps:</p>
                    <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Accept this offer by March 1, 2024</li>
                      <li>Pay the enrollment deposit</li>
                      <li>Submit visa application documents</li>
                      <li>Complete housing registration</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => handleDownloadOffer(selectedOffer)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleAcceptOffer(selectedOffer)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Offer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
