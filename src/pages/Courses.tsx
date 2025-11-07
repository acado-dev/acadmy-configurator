import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Copy, ListChecks, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Course } from '@/types/course';
import { CourseCategory } from '@/types/courseCategory';
import { CourseLevel } from '@/types/courseLevel';
import { CourseType } from '@/types/courseType';
import { LearningOutcome } from '@/types/learningOutcome';
import { University } from '@/types/application';
import AddEditCourseDialog from '@/components/courses/AddEditCourseDialog';
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
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
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

  const handleAddEdit = (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    if (selectedCourse) {
      const updated = courses.map((c) =>
        c.id === selectedCourse.id
          ? { ...courseData, id: c.id, createdAt: c.createdAt, updatedAt: now }
          : c
      );
      setCourses(updated);
      localStorage.setItem('courses', JSON.stringify(updated));
      toast({ title: 'Success', description: 'Course updated successfully' });
    } else {
      const newCourse: Course = {
        ...courseData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };
      const updated = [...courses, newCourse];
      setCourses(updated);
      localStorage.setItem('courses', JSON.stringify(updated));
      toast({ title: 'Success', description: 'Course added successfully' });
    }
    setSelectedCourse(null);
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

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.courseCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          onClick={() => {
            setSelectedCourse(null);
            setIsAddEditOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
                  onClick={() => {
                    setSelectedCourse(course);
                    setIsAddEditOpen(true);
                  }}
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
            {searchQuery && (
              <p className="text-sm mt-1">Try adjusting your search query</p>
            )}
          </div>
        </Card>
      )}

      <AddEditCourseDialog
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setSelectedCourse(null);
        }}
        onSave={handleAddEdit}
        course={selectedCourse}
        categories={categories}
        levels={levels}
        types={types}
        organizations={organizations}
      />

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