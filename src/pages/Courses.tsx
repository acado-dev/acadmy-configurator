import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Copy, ListChecks, Eye, Edit, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Course } from '@/types/course';
import { CourseCategory } from '@/types/courseCategory';
import { CourseLevel } from '@/types/courseLevel';
import { CourseType } from '@/types/courseType';
import { LearningOutcome } from '@/types/learningOutcome';
import { University } from '@/types/application';
import LearningOutcomeAssignDialog from '@/components/courses/LearningOutcomeAssignDialog';
import { toast } from '@/hooks/use-toast';
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

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [levels, setLevels] = useState<CourseLevel[]>([]);
  const [types, setTypes] = useState<CourseType[]>([]);
  const [organizations, setOrganizations] = useState<University[]>([]);
  const [learningOutcomes, setLearningOutcomes] = useState<LearningOutcome[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterOrganization, setFilterOrganization] = useState('');
  const [isAssignOutcomesOpen, setIsAssignOutcomesOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedCourses = localStorage.getItem('courses');
    const storedCategories = localStorage.getItem('courseCategories');
    const storedLevels = localStorage.getItem('courseLevels');
    const storedTypes = localStorage.getItem('courseTypes');
    const storedUniversities = localStorage.getItem('universities');
    const storedOutcomes = localStorage.getItem('learningOutcomes');

    if (!storedCourses) {
      const sampleCourses: Course[] = [
        {
          id: '1',
          name: 'Master of Computer Science',
          shortName: 'MSc CS',
          courseCode: 'CS-501',
          description: 'Advanced computer science program focusing on AI, ML, and software engineering',
          courseCategoryId: '1',
          courseLevelId: '1',
          courseTypeId: '1',
          organizationId: '1',
          learningOutcomeIds: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('courses', JSON.stringify(sampleCourses));
      setCourses(sampleCourses);
    } else {
      setCourses(JSON.parse(storedCourses));
    }

    setCategories(JSON.parse(storedCategories || '[]'));
    setLevels(JSON.parse(storedLevels || '[]'));
    setTypes(JSON.parse(storedTypes || '[]'));
    setOrganizations(JSON.parse(storedUniversities || '[]'));
    setLearningOutcomes(JSON.parse(storedOutcomes || '[]'));
  };


  const handleDelete = () => {
    if (!courseToDelete) return;
    
    const updated = courses.filter((c) => c.id !== courseToDelete.id);
    setCourses(updated);
    localStorage.setItem('courses', JSON.stringify(updated));
    toast({ title: 'Success', description: 'Course deleted successfully' });
    setCourseToDelete(null);
  };

  const handleToggleActive = (course: Course) => {
    const updated = courses.map((c) =>
      c.id === course.id ? { ...c, isActive: !c.isActive, updatedAt: new Date().toISOString() } : c
    );
    setCourses(updated);
    localStorage.setItem('courses', JSON.stringify(updated));
    toast({
      title: 'Success',
      description: `Course ${!course.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  };

  const handleDuplicate = (course: Course) => {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      name: `${course.name} (Copy)`,
      shortName: `${course.shortName} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...courses, newCourse];
    setCourses(updated);
    localStorage.setItem('courses', JSON.stringify(updated));
    toast({ title: 'Success', description: 'Course duplicated successfully' });
  };

  const handleAssignOutcomes = (outcomeIds: string[]) => {
    if (!selectedCourse) return;

    const updated = courses.map((c) =>
      c.id === selectedCourse.id
        ? { ...c, learningOutcomeIds: outcomeIds, updatedAt: new Date().toISOString() }
        : c
    );
    setCourses(updated);
    localStorage.setItem('courses', JSON.stringify(updated));
    toast({ title: 'Success', description: 'Learning outcomes assigned successfully' });
    setSelectedCourse(null);
  };

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || 'N/A';
  const getLevelName = (id: string) => levels.find((l) => l.id === id)?.name || 'N/A';
  const getTypeName = (id: string) => types.find((t) => t.id === id)?.name || 'N/A';
  const getOrganizationName = (id: string) => organizations.find((o) => o.id === id)?.name || 'N/A';

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || course.courseCategoryId === filterCategory;
    const matchesLevel = !filterLevel || course.courseLevelId === filterLevel;
    const matchesType = !filterType || course.courseTypeId === filterType;
    const matchesOrganization = !filterOrganization || course.organizationId === filterOrganization;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesType && matchesOrganization;
  });

  const clearFilters = () => {
    setFilterCategory('');
    setFilterLevel('');
    setFilterType('');
    setFilterOrganization('');
    setSearchQuery('');
  };

  const hasActiveFilters = filterCategory || filterLevel || filterType || filterOrganization || searchQuery;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground mt-1">Manage university courses and programs</p>
        </div>
        <Button
          variant="gradient"
          className="gap-2"
          onClick={() => navigate('/courses/add')}
        >
          <Plus className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses by name, short name, or code..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

            <Select value={filterOrganization} onValueChange={setFilterOrganization}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
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
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setFilterCategory('')}
                />
              </Badge>
            )}
            {filterLevel && (
              <Badge variant="secondary" className="gap-1">
                Level: {getLevelName(filterLevel)}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setFilterLevel('')}
                />
              </Badge>
            )}
            {filterType && (
              <Badge variant="secondary" className="gap-1">
                Type: {getTypeName(filterType)}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setFilterType('')}
                />
              </Badge>
            )}
            {filterOrganization && (
              <Badge variant="secondary" className="gap-1">
                Org: {getOrganizationName(filterOrganization)}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setFilterOrganization('')}
                />
              </Badge>
            )}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
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
                <p className="text-xs text-muted-foreground mt-1">
                  {getOrganizationName(course.organizationId)}
                </p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {course.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/courses/edit/${course.id}`)}
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
                  onClick={() => {
                    setSelectedCourse(course);
                    setIsAssignOutcomesOpen(true);
                  }}
                >
                  <ListChecks className="w-3 h-3 mr-1" />
                  Outcomes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCourseToDelete(course)}
                  className="text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
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

      {selectedCourse && (
        <LearningOutcomeAssignDialog
          isOpen={isAssignOutcomesOpen}
          onClose={() => {
            setIsAssignOutcomesOpen(false);
            setSelectedCourse(null);
          }}
          onSave={handleAssignOutcomes}
          assignedOutcomeIds={selectedCourse.learningOutcomeIds || []}
          availableOutcomes={learningOutcomes}
          courseName={selectedCourse.name}
        />
      )}

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
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Courses;