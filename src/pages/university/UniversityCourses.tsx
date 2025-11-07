import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Users,
  Target,
  MoreVertical,
  Filter,
  X,
  Link2,
  Copy,
  ListChecks
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
          applications: 45,
          applicationFormId: 'form-2',
          matchingCriteriaConfigured: true,
          isActive: true,
          applicationLink: 'https://apply.university.edu/cs-exchange',
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
          applications: 0,
          applicationFormId: null,
          matchingCriteriaConfigured: false,
          isActive: false,
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

  const handleDuplicate = (course: any) => {
    const newCourse: any = {
      ...course,
      id: Date.now().toString(),
      name: `${course.name} (Copy)`,
      shortName: `${course.shortName} (Copy)`,
      applications: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...courses, newCourse];
    setCourses(updated);
    localStorage.setItem('universityCourses', JSON.stringify(updated));
    toast({ title: 'Success', description: 'Course duplicated successfully' });
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

  const renderCourseCard = (course: any) => (
    <Card key={course.id} className="p-6 hover-lift">
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">{getTypeName(course.courseTypeId)}</Badge>
            <Badge variant="outline">{getLevelName(course.courseLevelId)}</Badge>
          </div>
          <Switch
            checked={course.isActive}
            onCheckedChange={() => handleToggleActive(course)}
          />
        </div>

        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt={course.name}
            className="w-full h-32 object-cover rounded-md"
          />
        )}

        <div>
          <h3 className="font-semibold text-lg">{course.name}</h3>
          <p className="text-sm text-muted-foreground">{course.shortName}</p>
          {course.courseCode && (
            <p className="text-xs text-muted-foreground mt-1">Code: {course.courseCode}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {course.description}
          </p>
        </div>

        <div className="bg-primary/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Collected Applications</p>
              <p className="text-2xl font-bold text-primary">{course.applications || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-3 border-t border-primary/20">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Application Form</p>
              <p className="text-sm font-medium">
                {course.applicationFormId ? '✓ Configured' : '✗ Not Configured'}
              </p>
            </div>
            {!course.applicationFormId && (
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => navigate(`/university/forms/new?courseId=${course.id}`)}
              >
                Setup
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate(`/university/applications?courseId=${course.id}`)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Applications
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/university/courses/${course.id}`)}
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/university/courses/${course.id}/edit`)}
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDuplicate(course)}
          >
            <Copy className="w-3 h-3 mr-1" />
            Duplicate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/university/courses/${course.id}/outcomes`)}
          >
            <ListChecks className="w-3 h-3 mr-1" />
            Outcomes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCourseToDelete(course)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );

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

        <Card className="p-4 space-y-4 mb-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => renderCourseCard(course))}
            </div>
            {filteredCourses.length === 0 && (
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  <p>No courses found</p>
                  {hasActiveFilters ? (
                    <p className="text-sm mt-1">Try adjusting your filters or search query</p>
                  ) : (
                    <p className="text-sm mt-1">Get started by creating your first course</p>
                  )}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => renderCourseCard(course))}
            </div>
            {filteredCourses.length === 0 && (
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  <p>No active courses found</p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => renderCourseCard(course))}
            </div>
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
