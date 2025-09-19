import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Users,
  Calendar,
  Target,
  MoreVertical,
  GraduationCap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const UniversityCourses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const courses = [
    {
      id: '1',
      name: 'Master of Business Administration',
      code: 'MBA-2024',
      type: 'degree',
      duration: '2 years',
      intake: 'Fall 2024',
      applications: 87,
      formId: 'form-1',
      hasMatchingCriteria: true,
      status: 'active'
    },
    {
      id: '2',
      name: 'Computer Science Exchange Program',
      code: 'CS-EX-2024',
      type: 'exchange',
      duration: '1 semester',
      intake: 'Spring 2024',
      applications: 45,
      formId: 'form-2',
      hasMatchingCriteria: true,
      status: 'active'
    },
    {
      id: '3',
      name: 'Engineering Pathway',
      code: 'ENG-PW-2024',
      type: 'pathway',
      duration: '1 year',
      intake: 'Fall 2024',
      applications: 62,
      formId: null,
      hasMatchingCriteria: false,
      status: 'draft'
    }
  ];

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCourse = (courseId: string) => {
    toast({
      title: "Course deleted",
      description: "The course has been removed successfully",
    });
  };

  const getCourseTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      degree: 'default',
      exchange: 'secondary',
      pathway: 'outline',
      diploma: 'default',
      certification: 'secondary'
    };
    return colors[type] || 'default';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
            <p className="text-muted-foreground">Manage your university courses and programs</p>
          </div>
          <Button onClick={() => navigate('/university/courses/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Course
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5" />
                          {course.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Code: {course.code} • {course.intake}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getCourseTypeColor(course.type) as any}>
                          {course.type}
                        </Badge>
                        <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                          {course.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/university/courses/${course.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/university/courses/${course.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/university/forms/${course.formId || 'new'}`)}>
                              <FileText className="h-4 w-4 mr-2" />
                              {course.formId ? 'Edit Form' : 'Create Form'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/university/matching-criteria/${course.id}`)}>
                              <Target className="h-4 w-4 mr-2" />
                              {course.hasMatchingCriteria ? 'Edit Criteria' : 'Set Criteria'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCourse(course.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-sm text-muted-foreground">{course.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Applications</p>
                          <p className="text-sm text-muted-foreground">{course.applications}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Application Form</p>
                          <p className="text-sm text-muted-foreground">
                            {course.formId ? 'Configured' : 'Not Set'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Matching Criteria</p>
                          <p className="text-sm text-muted-foreground">
                            {course.hasMatchingCriteria ? 'Configured' : 'Not Set'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/university/applications?course=${course.id}`)}
                      >
                        View Applications
                      </Button>
                      {!course.formId && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/university/forms/new?course=${course.id}`)}
                        >
                          Setup Form
                        </Button>
                      )}
                      {course.formId && !course.hasMatchingCriteria && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/university/matching-criteria/${course.id}`)}
                        >
                          Setup Criteria
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredCourses
                .filter(course => course.status === 'active')
                .map((course) => (
                  <Card key={course.id}>
                    {/* Same card content as above */}
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredCourses
                .filter(course => course.status === 'draft')
                .map((course) => (
                  <Card key={course.id}>
                    {/* Same card content as above */}
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UniversityCourses;