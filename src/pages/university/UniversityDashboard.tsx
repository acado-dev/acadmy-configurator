import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  GraduationCap,
  FileText,
  Users,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Target,
  Send
} from 'lucide-react';

const UniversityDashboard = () => {
  const navigate = useNavigate();

  const stats = {
    totalCourses: 12,
    activeForms: 8,
    totalApplications: 245,
    pendingReview: 67,
    shortlisted: 42,
    accepted: 28
  };

  const recentApplications = [
    {
      id: '1',
      name: 'John Doe',
      course: 'MBA',
      matchScore: 92,
      status: 'pending',
      submittedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      course: 'Computer Science',
      matchScore: 87,
      status: 'shortlisted',
      submittedAt: '2024-01-14'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      course: 'Engineering',
      matchScore: 78,
      status: 'under_review',
      submittedAt: '2024-01-13'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'warning',
      shortlisted: 'secondary',
      under_review: 'default',
      accepted: 'success',
      rejected: 'destructive'
    };
    return colors[status] || 'default';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">University Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage courses, applications, and admissions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/university/courses')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">+2 this month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/university/forms')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeForms}</div>
              <p className="text-xs text-muted-foreground">4 forms configured</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/university/applications')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">{stats.pendingReview} pending review</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">11.4%</div>
              <Progress value={11.4} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications">Recent Applications</TabsTrigger>
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest applications requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium">{app.name}</h4>
                        <p className="text-sm text-muted-foreground">{app.course} • Submitted {app.submittedAt}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{app.matchScore}%</div>
                          <p className="text-xs text-muted-foreground">Match Score</p>
                        </div>
                        <Badge variant={getStatusColor(app.status) as any}>
                          {app.status.replace('_', ' ')}
                        </Badge>
                        <Button size="sm" onClick={() => navigate(`/university/applications/${app.id}`)}>
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline" onClick={() => navigate('/university/applications')}>
                  View All Applications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/university/courses/new')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Create New Course
                  </CardTitle>
                  <CardDescription>Add a new course to your offerings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Create Course</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/university/forms/new')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Build Application Form
                  </CardTitle>
                  <CardDescription>Create custom application forms</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Build Form</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/university/matching-criteria')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Configure Matching Criteria
                  </CardTitle>
                  <CardDescription>Set up application evaluation rules</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Configure Criteria</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/university/communications')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Communications
                  </CardTitle>
                  <CardDescription>Message applicants and send updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Manage Communications</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Application Analytics
                </CardTitle>
                <CardDescription>Overview of application statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-warning" />
                    <div className="text-2xl font-bold">{stats.pendingReview}</div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-secondary" />
                    <div className="text-2xl font-bold">{stats.shortlisted}</div>
                    <p className="text-sm text-muted-foreground">Shortlisted</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                    <div className="text-2xl font-bold">{stats.accepted}</div>
                    <p className="text-sm text-muted-foreground">Accepted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UniversityDashboard;