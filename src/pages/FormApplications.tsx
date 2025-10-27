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
  AlertCircle
} from 'lucide-react';

const FormApplications = () => {
  const navigate = useNavigate();
  const { applications } = useApplicationSubmissions();
  const { forms, universities, courses } = useFormsData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  // Application stages
  const stages = [
    { value: 'submitted', label: 'Submitted', icon: FileText, color: 'bg-blue-500' },
    { value: 'under_review', label: 'In Review', icon: Clock, color: 'bg-yellow-500' },
    { value: 'shortlisted', label: 'Shortlisted', icon: Target, color: 'bg-purple-500' },
    { value: 'interview_scheduled', label: 'In Progress', icon: AlertCircle, color: 'bg-orange-500' },
    { value: 'accepted', label: 'Selected', icon: CheckCircle, color: 'bg-green-500' },
    { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'bg-red-500' },
  ];

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUniversity = selectedUniversity === 'all' || 
        courses.find(c => c.id === app.courseId)?.universityId === selectedUniversity;
      
      const matchesCourse = selectedCourse === 'all' || app.courseId === selectedCourse;
      
      const matchesStage = selectedStage === 'all' || app.status === selectedStage;

      return matchesSearch && matchesUniversity && matchesCourse && matchesStage;
    });
  }, [applications, searchTerm, selectedUniversity, selectedCourse, selectedStage, courses]);

  // Get statistics
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Collected Applications</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all applications collected through application forms
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
