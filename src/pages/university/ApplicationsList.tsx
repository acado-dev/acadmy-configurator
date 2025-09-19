import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Target,
  ChevronRight
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ApplicationsList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');

  const applications = [
    {
      id: '1',
      applicantName: 'John Doe',
      email: 'john.doe@example.com',
      course: 'MBA',
      matchScore: 92,
      status: 'shortlisted',
      submittedAt: '2024-01-15',
      lastActivity: '2 hours ago'
    },
    {
      id: '2',
      applicantName: 'Jane Smith',
      email: 'jane.smith@example.com',
      course: 'Computer Science',
      matchScore: 87,
      status: 'under_review',
      submittedAt: '2024-01-14',
      lastActivity: '1 day ago'
    },
    {
      id: '3',
      applicantName: 'Mike Johnson',
      email: 'mike.j@example.com',
      course: 'Engineering',
      matchScore: 78,
      status: 'document_requested',
      submittedAt: '2024-01-13',
      lastActivity: '3 days ago'
    },
    {
      id: '4',
      applicantName: 'Sarah Williams',
      email: 'sarah.w@example.com',
      course: 'MBA',
      matchScore: 95,
      status: 'accepted',
      submittedAt: '2024-01-12',
      lastActivity: '1 week ago'
    },
    {
      id: '5',
      applicantName: 'David Brown',
      email: 'david.b@example.com',
      course: 'Computer Science',
      matchScore: 65,
      status: 'rejected',
      submittedAt: '2024-01-11',
      lastActivity: '2 weeks ago'
    }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesScore = scoreFilter === 'all' ||
                        (scoreFilter === 'high' && app.matchScore >= 80) ||
                        (scoreFilter === 'medium' && app.matchScore >= 60 && app.matchScore < 80) ||
                        (scoreFilter === 'low' && app.matchScore < 60);
    const matchesCourse = !courseId || app.course === courseId;
    
    return matchesSearch && matchesStatus && matchesScore && matchesCourse;
  });

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      submitted: Clock,
      under_review: AlertCircle,
      document_requested: AlertCircle,
      interview_scheduled: Clock,
      shortlisted: AlertCircle,
      accepted: CheckCircle,
      rejected: XCircle
    };
    return icons[status] || Clock;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: 'default',
      under_review: 'warning',
      document_requested: 'warning',
      interview_scheduled: 'secondary',
      shortlisted: 'secondary',
      accepted: 'success',
      rejected: 'destructive'
    };
    return colors[status] || 'default';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Applications</h1>
            <p className="text-muted-foreground">Review and manage student applications</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="document_requested">Document Requested</SelectItem>
                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Scores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High (80%+)</SelectItem>
                  <SelectItem value="medium">Medium (60-79%)</SelectItem>
                  <SelectItem value="low">Low (&lt;60%)</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {applications.filter(a => a.status === 'under_review').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {applications.filter(a => a.status === 'shortlisted').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {applications.filter(a => a.status === 'accepted').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Application List</CardTitle>
            <CardDescription>
              {filteredApplications.length} applications found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const StatusIcon = getStatusIcon(application.status);
                
                return (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/university/applications/${application.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{application.applicantName}</h4>
                        <Badge variant={getStatusColor(application.status) as any}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {application.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{application.email}</span>
                        <span>•</span>
                        <span>{application.course}</span>
                        <span>•</span>
                        <span>Submitted {application.submittedAt}</span>
                        <span>•</span>
                        <span>{application.lastActivity}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className={`text-2xl font-bold ${getScoreColor(application.matchScore)}`}>
                            {application.matchScore}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Match Score</p>
                      </div>
                      
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationsList;