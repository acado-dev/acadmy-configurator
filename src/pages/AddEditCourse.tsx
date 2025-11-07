import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Upload, Image as ImageIcon, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Course } from '@/types/course';
import { CourseCategory } from '@/types/courseCategory';
import { CourseLevel } from '@/types/courseLevel';
import { CourseType } from '@/types/courseType';
import { University } from '@/types/application';
import { toast } from '@/hooks/use-toast';

const AddEditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [courseCategoryId, setCourseCategoryId] = useState('');
  const [courseLevelId, setCourseLevelId] = useState('');
  const [courseTypeId, setCourseTypeId] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Reference data
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [levels, setLevels] = useState<CourseLevel[]>([]);
  const [types, setTypes] = useState<CourseType[]>([]);
  const [organizations, setOrganizations] = useState<University[]>([]);

  useEffect(() => {
    loadReferenceData();
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadReferenceData = () => {
    setCategories(JSON.parse(localStorage.getItem('courseCategories') || '[]'));
    setLevels(JSON.parse(localStorage.getItem('courseLevels') || '[]'));
    setTypes(JSON.parse(localStorage.getItem('courseTypes') || '[]'));
    setOrganizations(JSON.parse(localStorage.getItem('universities') || '[]'));
  };

  const loadCourse = () => {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const course = courses.find((c: Course) => c.id === courseId);
    if (course) {
      setName(course.name);
      setShortName(course.shortName);
      setCourseCode(course.courseCode || '');
      setThumbnail(course.thumbnail || '');
      setBannerImage(course.bannerImage || '');
      setVideoUrl(course.videoUrl || '');
      setDescription(course.description);
      setKeywords(course.keywords || '');
      setCourseCategoryId(course.courseCategoryId);
      setCourseLevelId(course.courseLevelId);
      setCourseTypeId(course.courseTypeId);
      setOrganizationId(course.organizationId);
      setStartDate(course.startDate || '');
      setEndDate(course.endDate || '');
      setIsActive(course.isActive);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !shortName.trim() || !description.trim() || !courseCategoryId || !courseLevelId || !courseTypeId || !organizationId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const now = new Date().toISOString();

    const courseData: Course = {
      id: courseId || Date.now().toString(),
      name: name.trim(),
      shortName: shortName.trim(),
      courseCode: courseCode.trim() || undefined,
      thumbnail: thumbnail.trim() || undefined,
      bannerImage: bannerImage.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      description: description.trim(),
      keywords: keywords.trim() || undefined,
      courseCategoryId,
      courseLevelId,
      courseTypeId,
      organizationId,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      learningOutcomeIds: courseId ? courses.find((c: Course) => c.id === courseId)?.learningOutcomeIds || [] : [],
      isActive,
      createdAt: courseId ? courses.find((c: Course) => c.id === courseId)?.createdAt || now : now,
      updatedAt: now,
    };

    if (courseId) {
      const updated = courses.map((c: Course) => (c.id === courseId ? courseData : c));
      localStorage.setItem('courses', JSON.stringify(updated));
      toast({ title: 'Success', description: 'Course updated successfully' });
    } else {
      localStorage.setItem('courses', JSON.stringify([...courses, courseData]));
      toast({ title: 'Success', description: 'Course created successfully' });
    }

    setLoading(false);
    navigate('/courses');
  };

  const activeCategories = categories.filter(c => c.isActive);
  const activeLevels = levels.filter(l => l.isActive);
  const activeTypes = types.filter(t => t.isActive);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/courses')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{courseId ? 'Edit Course' : 'Create New Course'}</h1>
            <p className="text-muted-foreground mt-1">
              {courseId ? 'Update course information and settings' : 'Fill in the details to create a new course'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/courses')}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleSubmit} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : courseId ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Basic Information</h2>
              <p className="text-sm text-muted-foreground">Essential details about the course</p>
            </div>
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Master of Computer Science"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortName">Short Name <span className="text-destructive">*</span></Label>
                <Input
                  id="shortName"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="e.g., MSc CS"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g., CS-501"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationId">Organization <span className="text-destructive">*</span></Label>
                <Select value={organizationId} onValueChange={setOrganizationId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the course..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., Computer Science, AI, Machine Learning (comma separated)"
              />
            </div>
          </div>
        </Card>

        {/* Classification */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Course Classification</h2>
              <p className="text-sm text-muted-foreground">Categorize and classify the course</p>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseCategoryId">Category <span className="text-destructive">*</span></Label>
                <Select value={courseCategoryId} onValueChange={setCourseCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseLevelId">Level <span className="text-destructive">*</span></Label>
                <Select value={courseLevelId} onValueChange={setCourseLevelId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeLevels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseTypeId">Type <span className="text-destructive">*</span></Label>
                <Select value={courseTypeId} onValueChange={setCourseTypeId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Media & Resources */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Media & Resources</h2>
              <p className="text-sm text-muted-foreground">Add visual content and video resources</p>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Thumbnail Image URL
                </Label>
                <Input
                  id="thumbnail"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://example.com/thumbnail.jpg"
                  type="url"
                />
                {thumbnail && (
                  <div className="mt-2 rounded-md border overflow-hidden">
                    <img src={thumbnail} alt="Thumbnail preview" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bannerImage" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Banner Image URL
                </Label>
                <Input
                  id="bannerImage"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  type="url"
                />
                {bannerImage && (
                  <div className="mt-2 rounded-md border overflow-hidden">
                    <img src={bannerImage} alt="Banner preview" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="videoUrl" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Course Video URL
                </Label>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/embed/..."
                  type="url"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Schedule & Status */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Schedule & Status</h2>
              <p className="text-sm text-muted-foreground">Set course duration and availability</p>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive" className="text-base">Course Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {isActive ? 'Course is currently active and visible' : 'Course is inactive and hidden'}
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default AddEditCourse;
