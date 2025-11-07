import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, BookOpen, Building2, Tag, GraduationCap } from 'lucide-react';
import { Course } from '@/types/course';
import { CourseCategory } from '@/types/courseCategory';
import { CourseLevel } from '@/types/courseLevel';
import { CourseType } from '@/types/courseType';
import { LearningOutcome } from '@/types/learningOutcome';
import { University } from '@/types/application';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [category, setCategory] = useState<CourseCategory | null>(null);
  const [level, setLevel] = useState<CourseLevel | null>(null);
  const [type, setType] = useState<CourseType | null>(null);
  const [organization, setOrganization] = useState<University | null>(null);
  const [learningOutcomes, setLearningOutcomes] = useState<LearningOutcome[]>([]);

  useEffect(() => {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const categories = JSON.parse(localStorage.getItem('courseCategories') || '[]');
    const levels = JSON.parse(localStorage.getItem('courseLevels') || '[]');
    const types = JSON.parse(localStorage.getItem('courseTypes') || '[]');
    const universities = JSON.parse(localStorage.getItem('universities') || '[]');
    const outcomes = JSON.parse(localStorage.getItem('learningOutcomes') || '[]');

    const foundCourse = courses.find((c: Course) => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      setCategory(categories.find((c: CourseCategory) => c.id === foundCourse.courseCategoryId));
      setLevel(levels.find((l: CourseLevel) => l.id === foundCourse.courseLevelId));
      setType(types.find((t: CourseType) => t.id === foundCourse.courseTypeId));
      setOrganization(universities.find((u: University) => u.id === foundCourse.organizationId));
      
      if (foundCourse.learningOutcomeIds?.length) {
        setLearningOutcomes(
          outcomes.filter((o: LearningOutcome) => 
            foundCourse.learningOutcomeIds?.includes(o.id)
          )
        );
      }
    }
  }, [courseId]);

  if (!course) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/courses')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <p className="text-muted-foreground">{course.shortName}</p>
        </div>
      </div>

      {course.bannerImage && (
        <Card className="overflow-hidden">
          <img
            src={course.bannerImage}
            alt={course.name}
            className="w-full h-64 object-cover"
          />
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Course Overview</h2>
            <div className="prose max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">{course.description}</p>
            </div>
          </div>

          {course.videoUrl && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Course Video</h3>
              <div className="aspect-video">
                <iframe
                  src={course.videoUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {learningOutcomes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Learning Outcomes
              </h3>
              <div className="space-y-2">
                {learningOutcomes.map((outcome) => (
                  <div key={outcome.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium">{outcome.name}</p>
                      {outcome.description && (
                        <p className="text-sm text-muted-foreground">{outcome.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Course Details</h3>
            
            {organization && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Organization</p>
                  <p className="font-medium">{organization.name}</p>
                </div>
              </div>
            )}

            {category && (
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{category.name}</p>
                </div>
              </div>
            )}

            {level && (
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-medium">{level.name}</p>
                </div>
              </div>
            )}

            {type && (
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{type.name}</p>
                </div>
              </div>
            )}

            {course.courseCode && (
              <div>
                <p className="text-sm text-muted-foreground">Course Code</p>
                <p className="font-medium">{course.courseCode}</p>
              </div>
            )}

            {(course.startDate || course.endDate) && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {course.startDate && new Date(course.startDate).toLocaleDateString()} 
                    {course.endDate && ` - ${new Date(course.endDate).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
            )}

            <div>
              <Badge variant={course.isActive ? 'secondary' : 'outline'}>
                {course.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </Card>

          {course.keywords && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {course.keywords.split(',').map((keyword, index) => (
                  <Badge key={index} variant="outline">
                    {keyword.trim()}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
