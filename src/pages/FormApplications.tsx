import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationSubmissions } from '@/hooks/useApplicationSubmissions';
import { useFormsData } from '@/hooks/useFormsData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Eye, 
  FileText,
  CheckCircle,
  Clock,
  Target,
  XCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

const FormApplications = () => {
  const navigate = useNavigate();
  const { applications } = useApplicationSubmissions();
  const { forms, universities, courses } = useFormsData();
  
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  
  // Filters for form list page
  const [formListUniversity, setFormListUniversity] = useState<string>('all');
  const [formListCourse, setFormListCourse] = useState<string>('all');

  // Application stages
  const stages = [
    { value: 'submitted', label: 'Submitted', icon: FileText, color: 'bg-blue-500' },
    { value: 'under_review', label: 'In Review', icon: Clock, color: 'bg-yellow-500' },
    { value: 'shortlisted', label: 'Shortlisted', icon: Target, color: 'bg-purple-500' },
    { value: 'interview_scheduled', label: 'In Progress', icon: AlertCircle, color: 'bg-orange-500' },
    { value: 'accepted', label: 'Selected', icon: CheckCircle, color: 'bg-green-500' },
    { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'bg-red-500' },
  ];

  // Get form statistics with filters
  const formsWithStats = useMemo(() => {
    return forms.map(form => {
      const formApplications = applications.filter(app => app.formId === form.id);
      const stats = stages.map(stage => ({
        ...stage,
        count: formApplications.filter(app => app.status === stage.value).length
      }));
      return {
        ...form,
        totalApplications: formApplications.length,
        stats
      };
    });
  }, [forms, applications]);

  // Filter forms for the list view
  const filteredForms = useMemo(() => {
    return formsWithStats.filter(form => {
      const formApplications = applications.filter(app => app.formId === form.id);
      
      // Filter by university
      if (formListUniversity !== 'all') {
        const hasUniversityApp = formApplications.some(app => {
          const course = courses.find(c => c.id === app.courseId);
          return course?.universityId === formListUniversity;
        });
        if (!hasUniversityApp) return false;
      }
      
      // Filter by course
      if (formListCourse !== 'all') {
        const hasCourseApp = formApplications.some(app => app.courseId === formListCourse);
        if (!hasCourseApp) return false;
      }
      
      return true;
    });
  }, [formsWithStats, applications, courses, formListUniversity, formListCourse]);

  // Calculate overview statistics
  const overviewStats = useMemo(() => {
    const totalForms = forms.length;
    
    // Get unique universities that have created forms
    const universitiesWithForms = new Set(
      applications
        .map(app => courses.find(c => c.id === app.courseId)?.universityId)
        .filter(Boolean)
    );
    
    // Get unique courses mapped to forms
    const coursesMapped = new Set(applications.map(app => app.courseId));
    
    const totalApplications = applications.length;
    
    const applicationsByStage = stages.map(stage => ({
      ...stage,
      count: applications.filter(app => app.status === stage.value).length
    }));
    
    return {
      totalForms,
      universitiesWithForms: universitiesWithForms.size,
      coursesMapped: coursesMapped.size,
      totalApplications,
      applicationsByStage
    };
  }, [forms, applications, courses]);

  // Filter applications for selected form
  const filteredApplications = useMemo(() => {
    if (!selectedFormId) return [];
    
    return applications.filter(app => {
      const matchesForm = app.formId === selectedFormId;
      const matchesSearch = 
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUniversity = selectedUniversity === 'all' || 
        courses.find(c => c.id === app.courseId)?.universityId === selectedUniversity;
      
      const matchesCourse = selectedCourse === 'all' || app.courseId === selectedCourse;
      
      const matchesStage = selectedStage === 'all' || app.status === selectedStage;

      return matchesForm && matchesSearch && matchesUniversity && matchesCourse && matchesStage;
    });
  }, [applications, selectedFormId, searchTerm, selectedUniversity, selectedCourse, selectedStage, courses]);

  // Get statistics for selected form
  const stats = useMemo(() => {
    const total = filteredApplications.length;
    const byStage = stages.map(stage => ({
      ...stage,
      count: filteredApplications.filter(app => app.status === stage.value).length
    }));
    return { total, byStage };
  }, [filteredApplications]);

  const getStageInfo = (status: string) => {
    return stages.find(s => s.value === status) || stages[0];
  };

  const getCourseName = (courseId: string) => {
    return courses.find(c => c.id === courseId)?.name || 'Unknown Course';
  };

  const getUniversityName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return universities.find(u => u.id === course?.universityId)?.name || 'Unknown University';
  };

  const selectedForm = forms.find(f => f.id === selectedFormId);

  // Show form list if no form is selected
  if (!selectedFormId) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Application Forms</h1>
            <p className="text-muted-foreground mt-1">
              View applications collected through each form
            </p>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{overviewStats.totalForms}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Universities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{overviewStats.universitiesWithForms}</div>
              <p className="text-xs text-muted-foreground mt-1">Created forms</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Courses Mapped</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{overviewStats.coursesMapped}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{overviewStats.totalApplications}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">By Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {overviewStats.applicationsByStage.map(stage => (
                  <div key={stage.value} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <span className="text-muted-foreground">{stage.label}:</span>
                    <span className="font-semibold">{stage.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Select value={formListUniversity} onValueChange={setFormListUniversity}>
                <SelectTrigger>
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {universities.map(uni => (
                    <SelectItem key={uni.id} value={uni.id}>{uni.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={formListCourse} onValueChange={setFormListCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses
                    .filter(course => formListUniversity === 'all' || course.universityId === formListUniversity)
                    .map(course => (
                      <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Forms List */}
        <div className="grid gap-4">
          {filteredForms.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground">No forms found</p>
                <p className="text-sm text-muted-foreground">Create application forms to start collecting applications</p>
              </CardContent>
            </Card>
          ) : (
            filteredForms.map(form => (
              <Card 
                key={form.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedFormId(form.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-1">
                        {form.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {form.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          {form.totalApplications} Total Applications
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Stage Statistics */}
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {form.stats.map(stage => {
                      const Icon = stage.icon;
                      return (
                        <div key={stage.value} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                            <span className="text-xs text-muted-foreground">{stage.label}</span>
                          </div>
                          <span className="text-2xl font-bold text-foreground">{stage.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // Show applications for selected form
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedFormId(null);
            setSearchTerm('');
            setSelectedUniversity('all');
            setSelectedCourse('all');
            setSelectedStage('all');
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forms
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{selectedForm?.name}</h1>
          <p className="text-muted-foreground mt-1">
            Applications collected through this form
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        {stats.byStage.map(stage => {
          const Icon = stage.icon;
          return (
            <Card key={stage.value}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  {stage.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stage.count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger>
                <SelectValue placeholder="All Universities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Universities</SelectItem>
                {universities.map(uni => (
                  <SelectItem key={uni.id} value={uni.id}>{uni.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses
                  .filter(course => selectedUniversity === 'all' || course.universityId === selectedUniversity)
                  .map(course => (
                    <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger>
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map(stage => (
                  <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No applications found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map(app => {
            const stageInfo = getStageInfo(app.status);
            const StageIcon = stageInfo.icon;
            
            return (
              <Card 
                key={app.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/applications/${app.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {app.applicantName}
                        </h3>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${stageInfo.color}`} />
                          {stageInfo.label}
                        </Badge>
                      </div>
                      <div className="grid gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {app.applicantEmail}
                          </span>
                          <span>•</span>
                          <span>{getUniversityName(app.courseId)}</span>
                          <span>•</span>
                          <span>{getCourseName(app.courseId)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Match Score:</span>
                          <span className={`font-semibold ${
                            app.matchScore >= 80 ? 'text-green-600' : 
                            app.matchScore >= 60 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {app.matchScore}%
                          </span>
                        </div>
                        <div className="text-xs">
                          Applied: {new Date(app.submittedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FormApplications;
