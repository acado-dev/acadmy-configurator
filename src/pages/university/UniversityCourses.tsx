import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
  GraduationCap,
  Filter,
  X,
  Link2,
  Info
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CourseCategory } from '@/types/courseCategory';
import { CourseLevel } from '@/types/courseLevel';
import { CourseType } from '@/types/courseType';
import { toast } from '@/hooks/use-toast';

const UniversityCourses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [levels, setLevels] = useState<CourseLevel[]>([]);
  const [types, setTypes] = useState<CourseType[]>([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [courseToDelete, setCourseToDelete] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedCourses = localStorage.getItem('universityCourses');
    const storedCategories = localStorage.getItem('courseCategories');
    const storedLevels = localStorage.getItem('courseLevels');
    const storedTypes = localStorage.getItem('courseTypes');

    if (!storedCourses) {
      const sampleCourses = [
        {
          id: '1',
          name: 'Master of Business Administration',
          shortName: 'MBA',
          courseCode: 'MBA-2024',
          courseCategoryId: '1',
          courseLevelId: '1',
          courseTypeId: '1',
          description: 'Advanced business administration program',
          duration: '2 years',
          intake: 'Fall 2024',
          applications: 87,
          applicationFormId: 'form-1',
          matchingCriteriaConfigured: true,
          isActive: true,
          applicationLink: 'https://apply.university.edu/mba',
          informationCollected: 'Academic transcripts, work experience, GMAT scores'
        },
        {
          id: '2',
          name: 'Computer Science Exchange Program',
          shortName: 'CS Exchange',
          courseCode: 'CS-EX-2024',
          courseCategoryId: '2',
          courseLevelId: '2',
          courseTypeId: '2',
          description: 'International exchange program for computer science students',
          duration: '1 semester',
          intake: 'Spring 2024',
          applications: 45,
          applicationFormId: 'form-2',
          matchingCriteriaConfigured: true,
          isActive: true,
          applicationLink: 'https://apply.university.edu/cs-exchange',
          informationCollected: 'Academic records, language proficiency'
        },
        {
          id: '3',
          name: 'Engineering Pathway',
          shortName: 'Eng Pathway',
          courseCode: 'ENG-PW-2024',
          courseCategoryId: '3',
          courseLevelId: '1',
          courseTypeId: '3',
          description: 'Foundation program for engineering students',
          duration: '1 year',
          intake: 'Fall 2024',
          applications: 62,
          applicationFormId: null,
          matchingCriteriaConfigured: false,
          isActive: false,
          applicationLink: '',
          informationCollected: ''
        }
      ];
      localStorage.setItem('universityCourses', JSON.stringify(sampleCourses));
      setCourses(sampleCourses);
    } else {
      setCourses(JSON.parse(storedCourses));
    }

    setCategories(JSON.parse(storedCategories || '[]'));
    setLevels(JSON.parse(storedLevels || '[]'));
    setTypes(JSON.parse(storedTypes || '[]'));
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.shortName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || filterCategory === 'all' || course.courseCategoryId === filterCategory;
    const matchesLevel = !filterLevel || filterLevel === 'all' || course.courseLevelId === filterLevel;
    const matchesType = !filterType || filterType === 'all' || course.courseTypeId === filterType;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && course.isActive) ||
      (filterStatus === 'draft' && !course.isActive);
    
    return matchesSearch && matchesCategory && matchesLevel && matchesType && matchesStatus;
  });

  const handleDeleteCourse = () => {
    if (!courseToDelete) return;
    
    const updated = courses.filter((c) => c.id !== courseToDelete.id);
    setCourses(updated);
    localStorage.setItem('universityCourses', JSON.stringify(updated));
    toast({
      title: "Course deleted",
      description: "The course has been removed successfully",
    });
    setCourseToDelete(null);
  };

  const handleToggleActive = (course: any) => {
    const updated = courses.map((c) =>
      c.id === course.id ? { ...c, isActive: !c.isActive } : c
    );
    setCourses(updated);
    localStorage.setItem('universityCourses', JSON.stringify(updated));
    toast({
      title: 'Success',
      description: `Course ${!course.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  };

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || 'N/A';
  const getLevelName = (id: string) => levels.find((l) => l.id === id)?.name || 'N/A';
  const getTypeName = (id: string) => types.find((t) => t.id === id)?.name || 'N/A';

  const clearFilters = () => {
    setFilterCategory('');
    setFilterLevel('');
    setFilterType('');
    setSearchTerm('');
  };

  const hasActiveFilters = filterCategory || filterLevel || filterType || searchTerm;

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

        <Card className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search courses by name, code, or short name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.filter(c => c.isActive).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.filter(l => l.isActive).map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.filter(t => t.isActive).map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {filterCategory && (
                <Badge variant="secondary" className="gap-1">
                  Category: {getCategoryName(filterCategory)}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterCategory('')} />
                </Badge>
              )}
              {filterLevel && (
                <Badge variant="secondary" className="gap-1">
                  Level: {getLevelName(filterLevel)}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterLevel('')} />
                </Badge>
              )}
              {filterType && (
                <Badge variant="secondary" className="gap-1">
                  Type: {getTypeName(filterType)}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterType('')} />
                </Badge>
              )}
            </div>
          )}
        </Card>

        <Tabs value={filterStatus} onValueChange={setFilterStatus} className="space-y-4">
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
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5" />
                          {course.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {course.courseCode && `Code: ${course.courseCode} • `}
                          {course.intake || 'No intake specified'}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{getTypeName(course.courseTypeId)}</Badge>
                        <Badge variant="outline">{getLevelName(course.courseLevelId)}</Badge>
                        <Switch
                          checked={course.isActive}
                          onCheckedChange={() => handleToggleActive(course)}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/university/courses/${course.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/university/forms/${course.applicationFormId || 'new'}?courseId=${course.id}`)}>
                              <FileText className="h-4 w-4 mr-2" />
                              {course.applicationFormId ? 'Edit Form' : 'Create Form'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/university/application-process/${course.id}`)}>
                              <Target className="h-4 w-4 mr-2" />
                              {course.matchingCriteriaConfigured ? 'Edit Criteria' : 'Set Criteria'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setCourseToDelete(course)}
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
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm font-medium">Duration</p>
                            <p className="text-sm text-muted-foreground">{course.duration || 'Not specified'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm font-medium">Applications</p>
                            <p className="text-sm text-muted-foreground">{course.applications || 0}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm font-medium">Application Form</p>
                            <p className="text-sm text-muted-foreground">
                              {course.applicationFormId ? '✓ Configured' : '✗ Not Set'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm font-medium">Matching Criteria</p>
                            <p className="text-sm text-muted-foreground">
                              {course.matchingCriteriaConfigured ? '✓ Configured' : '✗ Not Set'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {course.applicationLink && (
                        <div className="flex items-start gap-2 p-3 bg-accent/50 rounded-lg">
                          <Link2 className="h-4 w-4 text-primary mt-1" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Application Link</p>
                            <a 
                              href={course.applicationLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline truncate block"
                            >
                              {course.applicationLink}
                            </a>
                          </div>
                        </div>
                      )}

                      {course.informationCollected && (
                        <div className="flex items-start gap-2 p-3 bg-accent/50 rounded-lg">
                          <Info className="h-4 w-4 text-primary mt-1" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Information Collected</p>
                            <p className="text-xs text-muted-foreground mt-1">{course.informationCollected}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/university/applications?courseId=${course.id}`)}
                        >
                          <Users className="h-3 w-3 mr-1" />
                          View Applications
                        </Button>
                        {!course.applicationFormId && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/university/forms/new?courseId=${course.id}`)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Setup Form
                          </Button>
                        )}
                        {course.applicationFormId && !course.matchingCriteriaConfigured && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/university/application-process/${course.id}`)}
                          >
                            <Target className="h-3 w-3 mr-1" />
                            Setup Criteria
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {filteredCourses.length === 0 ? (
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No courses found</p>
                  {hasActiveFilters ? (
                    <p className="text-sm mt-1">Try adjusting your filters or search query</p>
                  ) : (
                    <p className="text-sm mt-1">Get started by creating your first course</p>
                  )}
                </div>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {filteredCourses.length === 0 && (
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  <p>No active courses found</p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {filteredCourses.length === 0 && (
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  <p>No draft courses found</p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{courseToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UniversityCourses;