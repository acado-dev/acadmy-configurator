import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Building2, BookOpen, Users, TrendingUp, Clock, CheckCircle, AlertCircle, XCircle, Target, Send, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApplicationSubmissions } from '@/hooks/useApplicationSubmissions';
import { useFormsData } from '@/hooks/useFormsData';

const Dashboard = () => {
  const navigate = useNavigate();
  const { applications, stats: appStats } = useApplicationSubmissions();
  const { forms, universities, courses } = useFormsData();

  const liveForms = forms.filter(f => f.isLaunched).length;
  const totalForms = forms.length;

  const stats = [
    {
      title: 'Total Universities',
      value: universities.length.toString(),
      change: '+3 this month',
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary-light',
      onClick: () => navigate('/universities'),
    },
    {
      title: 'Active Courses',
      value: courses.length.toString(),
      change: '+12 this week',
      icon: BookOpen,
      color: 'text-secondary',
      bgColor: 'bg-secondary-light',
      onClick: () => navigate('/courses'),
    },
    {
      title: 'Application Forms',
      value: totalForms.toString(),
      change: `${liveForms} live`,
      icon: FileText,
      color: 'text-success',
      bgColor: 'bg-success-light',
      onClick: () => navigate('/forms'),
    },
    {
      title: 'Total Applications',
      value: appStats.totalApplications.toString(),
      change: `${appStats.byStatus.pending || 0} pending`,
      icon: Users,
      color: 'text-warning',
      bgColor: 'bg-warning-light',
      onClick: () => navigate('/applications-overview'),
    },
  ];

  const recentActivity = [
    { id: 1, action: 'New form created', university: 'Oxford University', time: '2 hours ago' },
    { id: 2, action: 'Course added', university: 'MIT', time: '4 hours ago' },
    { id: 3, action: 'Form updated', university: 'Stanford University', time: '6 hours ago' },
    { id: 4, action: 'University onboarded', university: 'Harvard University', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome to ACADO Admin Portal</h1>
        <p className="text-muted-foreground mt-1">
          Manage university applications and admissions efficiently
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card 
            key={stat.title} 
            className="p-6 hover-lift cursor-pointer transition-shadow"
            onClick={stat.onClick}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Application Status Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Application Status Overview</h2>
            <p className="text-sm text-muted-foreground">Track applications across all stages</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/applications-overview')}>
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{appStats.byStatus.pending || 0}</div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </div>
          <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{appStats.byStatus.under_review || 0}</div>
            <p className="text-sm text-muted-foreground">Under Review</p>
          </div>
          <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{appStats.byStatus.shortlisted || 0}</div>
            <p className="text-sm text-muted-foreground">Shortlisted</p>
          </div>
          <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{appStats.byStatus.accepted || 0}</div>
            <p className="text-sm text-muted-foreground">Accepted</p>
          </div>
          <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <XCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{appStats.byStatus.rejected || 0}</div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </div>
        </div>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="applications">Recent Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.university}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/forms/new')}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Create Application Form</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure a new application form template
                </p>
                <Button className="w-full">Create Form</Button>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/forms')}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-success" />
                  <h3 className="font-semibold">Manage Forms</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  View and edit all application forms
                </p>
                <Button className="w-full" variant="outline">View Forms</Button>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/universities')}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-5 w-5 text-secondary" />
                  <h3 className="font-semibold">Add University</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Onboard a new educational institution
                </p>
                <Button className="w-full">Add University</Button>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/applications-overview')}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-warning" />
                  <h3 className="font-semibold">View Applications</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Review all collected applications
                </p>
                <Button className="w-full" variant="outline">View Applications</Button>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/courses')}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Manage Courses</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Add or update course offerings
                </p>
                <Button className="w-full" variant="outline">View Courses</Button>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/master-fields')}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold">Master Fields</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure global form field templates
                </p>
                <Button className="w-full" variant="outline">Manage Fields</Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Recent Applications</h2>
                <p className="text-sm text-muted-foreground">Latest submissions across all universities</p>
              </div>
            </div>
            <div className="space-y-4">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium">{app.applicantName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {courses.find(c => c.id === app.courseId)?.name || 'Unknown Course'} • 
                      {' '}{universities.find(u => u.id === app.universityId)?.name || 'Unknown University'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{app.matchScore}%</div>
                      <p className="text-xs text-muted-foreground">Match</p>
                    </div>
                    <Badge variant={
                      app.status === 'accepted' ? 'default' :
                      app.status === 'rejected' ? 'destructive' :
                      app.status === 'shortlisted' ? 'secondary' : 'outline'
                    }>
                      {app.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              className="w-full mt-4" 
              variant="outline" 
              onClick={() => navigate('/applications-overview')}
            >
              View All Applications
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default Dashboard;