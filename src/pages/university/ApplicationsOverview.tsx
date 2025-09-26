import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Users,
  Target,
  TrendingUp,
  Award,
  Eye,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useApplicationSubmissions } from '@/hooks/useApplicationSubmissions';
import { useFormsData } from '@/hooks/useFormsData';
import { useApplicationProcess } from '@/hooks/useApplicationProcess';

const ApplicationsOverview = () => {
  const navigate = useNavigate();
  const { applications, stats } = useApplicationSubmissions();
  const { forms, courses } = useFormsData();
  const { criteriaConfigs } = useApplicationProcess();
  const [selectedForm, setSelectedForm] = useState<string>('all');

  // Get active forms with application counts
  const formsWithApplications = forms.map(form => {
    const formApplications = applications.filter(app => app.formId === form.id);
    const averageScore = formApplications.length > 0
      ? Math.round(formApplications.reduce((sum, app) => sum + app.matchScore, 0) / formApplications.length)
      : 0;
    
    return {
      ...form,
      applicationCount: formApplications.length,
      averageMatchScore: averageScore,
      hasMatchingCriteria: form.courseIds.some(courseId => 
        criteriaConfigs.some(config => config.courseId === courseId)
      )
    };
  });

  const getFormApplications = (formId: string) => {
    return applications.filter(app => app.formId === formId);
  };

  const getCourseStats = (courseId: string) => {
    const courseApplications = applications.filter(app => app.courseId === courseId);
    return {
      total: courseApplications.length,
      avgScore: courseApplications.length > 0
        ? Math.round(courseApplications.reduce((sum, app) => sum + app.matchScore, 0) / courseApplications.length)
        : 0,
      highMatch: courseApplications.filter(app => app.matchScore > 80).length,
      underReview: courseApplications.filter(app => app.status === 'under_review').length
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Applications Overview</h1>
            <p className="text-muted-foreground">Monitor all applications across forms and courses</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/university/forms')}>
              <FileText className="h-4 w-4 mr-2" />
              Manage Forms
            </Button>
            <Button variant="outline" onClick={() => navigate('/university/application-process')}>
              <Target className="h-4 w-4 mr-2" />
              Configure Matching
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalApplications}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across {forms.length} forms
                  </p>
                </div>
                <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Match Score</p>
                  <p className="text-3xl font-bold">{stats.averageMatchScore}%</p>
                  <Progress value={stats.averageMatchScore} className="mt-2 h-2" />
                </div>
                <div className="h-14 w-14 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Target className="h-7 w-7 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Match Rate</p>
                  <p className="text-3xl font-bold text-green-600">{stats.highMatchCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Score &gt; 80%
                  </p>
                </div>
                <div className="h-14 w-14 bg-green-500/10 rounded-full flex items-center justify-center">
                  <Award className="h-7 w-7 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                  <p className="text-3xl font-bold">{Object.keys(stats.byCourse).length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    With applications
                  </p>
                </div>
                <div className="h-14 w-14 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <Users className="h-7 w-7 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="forms" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="forms">By Forms</TabsTrigger>
            <TabsTrigger value="courses">By Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="space-y-6">
            <div className="grid gap-6">
              {formsWithApplications.map(form => (
                <Card key={form.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{form.name}</CardTitle>
                        <CardDescription>{form.description}</CardDescription>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={form.isLaunched ? "default" : "secondary"}>
                            {form.isLaunched ? "Active" : "Draft"}
                          </Badge>
                          {form.hasMatchingCriteria && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <Target className="h-3 w-3 mr-1" />
                              Matching Configured
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/university/applications?form=${form.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Applications
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Applications</p>
                        <p className="text-2xl font-bold">{form.applicationCount}</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Avg Match Score</p>
                        <p className="text-2xl font-bold">{form.averageMatchScore}%</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Courses</p>
                        <p className="text-2xl font-bold">{form.courseIds.length}</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p className="text-sm font-medium">
                          {new Date(form.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {form.applicationCount > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Match Score Distribution</span>
                          <span className="text-sm font-medium">{form.averageMatchScore}% avg</span>
                        </div>
                        <Progress value={form.averageMatchScore} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid gap-4">
              {courses.map(course => {
                const courseStats = getCourseStats(course.id);
                const hasConfig = criteriaConfigs.some(config => config.courseId === course.id);
                
                return (
                  <Card key={course.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{course.name}</h3>
                          <p className="text-sm text-muted-foreground">{course.type}</p>
                          <div className="flex gap-2 mt-2">
                            {hasConfig && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <Target className="h-3 w-3 mr-1" />
                                Matching Active
                              </Badge>
                            )}
                            {courseStats.total > 0 && (
                              <Badge variant="secondary">
                                {courseStats.total} applications
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{courseStats.avgScore}%</p>
                            <p className="text-xs text-muted-foreground">Avg Score</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{courseStats.highMatch}</p>
                            <p className="text-xs text-muted-foreground">High Match</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">{courseStats.underReview}</p>
                            <p className="text-xs text-muted-foreground">Under Review</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/university/applications?course=${course.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Application Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.byStatus).map(([status, count]) => (
                      <div key={status} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
                        </div>
                        <span className="font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Match Score Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-600" />
                        <span className="text-sm">High Match (&gt;80%)</span>
                      </div>
                      <span className="font-semibold">{stats.highMatchCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-600" />
                        <span className="text-sm">Medium Match (50-80%)</span>
                      </div>
                      <span className="font-semibold">{stats.mediumMatchCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-600" />
                        <span className="text-sm">Low Match (&lt;50%)</span>
                      </div>
                      <span className="font-semibold">{stats.lowMatchCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Top Performing Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.byCourse)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([courseName, count]) => (
                        <div key={courseName} className="flex justify-between items-center">
                          <span className="text-sm">{courseName}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={(count / stats.totalApplications) * 100} className="w-24 h-2" />
                            <span className="font-semibold text-sm w-12 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApplicationsOverview;