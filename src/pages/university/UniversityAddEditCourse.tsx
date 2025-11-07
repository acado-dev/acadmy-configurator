import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Link2, FileText, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Course } from '@/types/course';
import { CourseCategory } from '@/types/courseCategory';
import { CourseLevel } from '@/types/courseLevel';
import { CourseType } from '@/types/courseType';
import { toast } from '@/hooks/use-toast';

const UniversityAddEditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailMode, setThumbnailMode] = useState<'upload' | 'url'>('url');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerMode, setBannerMode] = useState<'upload' | 'url'>('url');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoMode, setVideoMode] = useState<'upload' | 'url'>('url');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [courseCategoryId, setCourseCategoryId] = useState('');
  const [courseLevelId, setCourseLevelId] = useState('');
  const [courseTypeId, setCourseTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  // University-specific fields
  const [applicationLink, setApplicationLink] = useState('');
  const [applicationFormId, setApplicationFormId] = useState('');
  const [informationCollected, setInformationCollected] = useState('');
  const [matchingCriteriaConfigured, setMatchingCriteriaConfigured] = useState(false);

  // Reference data
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [levels, setLevels] = useState<CourseLevel[]>([]);
  const [types, setTypes] = useState<CourseType[]>([]);
  const [applicationForms, setApplicationForms] = useState<any[]>([]);

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
    // Load application forms specific to university
    const universityAdmin = JSON.parse(localStorage.getItem('universityAdmin') || '{}');
    const forms = JSON.parse(localStorage.getItem('applicationForms') || '[]');
    setApplicationForms(forms.filter((f: any) => f.universityId === universityAdmin.universityId));
  };

  const loadCourse = () => {
    const courses = JSON.parse(localStorage.getItem('universityCourses') || '[]');
    const course = courses.find((c: any) => c.id === courseId);
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
      setStartDate(course.startDate || '');
      setEndDate(course.endDate || '');
      setIsActive(course.isActive);
      setApplicationLink(course.applicationLink || '');
      setApplicationFormId(course.applicationFormId || '');
      setInformationCollected(course.informationCollected || '');
      setMatchingCriteriaConfigured(course.matchingCriteriaConfigured || false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !shortName.trim() || !description.trim() || !courseCategoryId || !courseLevelId || !courseTypeId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const universityAdmin = JSON.parse(localStorage.getItem('universityAdmin') || '{}');
    const courses = JSON.parse(localStorage.getItem('universityCourses') || '[]');

    const courseData: any = {
      id: courseId || Date.now().toString(),
      name,
      shortName,
      courseCode,
      thumbnail,
      bannerImage,
      videoUrl,
      description,
      keywords,
      courseCategoryId,
      courseLevelId,
      courseTypeId,
      organizationId: universityAdmin.universityId,
      startDate,
      endDate,
      isActive,
      applicationLink,
      applicationFormId,
      informationCollected,
      matchingCriteriaConfigured,
      createdAt: courseId ? courses.find((c: any) => c.id === courseId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedCourses = courseId
      ? courses.map((c: any) => (c.id === courseId ? courseData : c))
      : [...courses, courseData];

    localStorage.setItem('universityCourses', JSON.stringify(updatedCourses));
    
    toast({
      title: 'Success',
      description: `Course ${courseId ? 'updated' : 'created'} successfully`,
    });
    
    setLoading(false);
    navigate('/university/courses');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/university/courses')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{courseId ? 'Edit Course' : 'Add New Course'}</h1>
        <p className="text-muted-foreground mt-1">
          {courseId ? 'Update course information and settings' : 'Create a new course for your university'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Master of Computer Science"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortName">Short Name *</Label>
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
              <Label htmlFor="courseCategoryId">Category *</Label>
              <Select value={courseCategoryId} onValueChange={setCourseCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c.isActive).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseLevelId">Level *</Label>
              <Select value={courseLevelId} onValueChange={setCourseLevelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.filter(l => l.isActive).map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseTypeId">Type *</Label>
              <Select value={courseTypeId} onValueChange={setCourseTypeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {types.filter(t => t.isActive).map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the course"
              rows={4}
              required
            />
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., computer science, artificial intelligence, machine learning"
            />
            <p className="text-xs text-muted-foreground">Comma-separated keywords for search optimization</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Application Configuration</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="applicationLink">Application Link</Label>
              <div className="flex gap-2">
                <Link2 className="w-4 h-4 text-muted-foreground mt-2.5" />
                <Input
                  id="applicationLink"
                  type="url"
                  value={applicationLink}
                  onChange={(e) => setApplicationLink(e.target.value)}
                  placeholder="https://apply.university.edu/course"
                />
              </div>
              <p className="text-xs text-muted-foreground">Direct link to the application portal</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationFormId">Application Form</Label>
              <Select value={applicationFormId} onValueChange={setApplicationFormId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select application form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No form configured</SelectItem>
                  {applicationForms.map((form) => (
                    <SelectItem key={form.id} value={form.id}>
                      {form.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {applicationFormId && applicationFormId !== 'none' ? 'Configured ✓' : 'Not configured'}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="informationCollected">Information Collected</Label>
            <Textarea
              id="informationCollected"
              value={informationCollected}
              onChange={(e) => setInformationCollected(e.target.value)}
              placeholder="Describe what information is collected from applicants (e.g., academic transcripts, personal statement, letters of recommendation...)"
              rows={3}
            />
          </div>

          <div className="mt-4 flex items-center justify-between p-4 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <Label htmlFor="matchingCriteria" className="font-medium">Matching Criteria Configured</Label>
                <p className="text-xs text-muted-foreground">Enable if evaluation criteria has been set up</p>
              </div>
            </div>
            <Switch
              id="matchingCriteria"
              checked={matchingCriteriaConfigured}
              onCheckedChange={setMatchingCriteriaConfigured}
            />
          </div>

          {applicationFormId && applicationFormId !== 'none' && (
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => navigate(`/university/forms/${applicationFormId}`)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Edit Application Form
            </Button>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Media</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Thumbnail Image</Label>
              <Tabs value={thumbnailMode} onValueChange={(v) => setThumbnailMode(v as 'upload' | 'url')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="space-y-2">
                  <div className="flex gap-2">
                    <Link2 className="w-4 h-4 text-muted-foreground mt-2.5" />
                    <Input
                      type="url"
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="upload">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setThumbnail)}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload thumbnail image</p>
                    </label>
                  </div>
                </TabsContent>
              </Tabs>
              {thumbnail && (
                <div className="mt-2">
                  <img src={thumbnail} alt="Thumbnail preview" className="w-32 h-32 object-cover rounded-md" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Banner Image</Label>
              <Tabs value={bannerMode} onValueChange={(v) => setBannerMode(v as 'upload' | 'url')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="space-y-2">
                  <div className="flex gap-2">
                    <Link2 className="w-4 h-4 text-muted-foreground mt-2.5" />
                    <Input
                      type="url"
                      value={bannerImage}
                      onChange={(e) => setBannerImage(e.target.value)}
                      placeholder="https://example.com/banner.jpg"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="upload">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setBannerImage)}
                      className="hidden"
                      id="banner-upload"
                    />
                    <label htmlFor="banner-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload banner image</p>
                    </label>
                  </div>
                </TabsContent>
              </Tabs>
              {bannerImage && (
                <div className="mt-2">
                  <img src={bannerImage} alt="Banner preview" className="w-full h-32 object-cover rounded-md" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Video</Label>
              <Tabs value={videoMode} onValueChange={(v) => setVideoMode(v as 'upload' | 'url')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="space-y-2">
                  <div className="flex gap-2">
                    <Link2 className="w-4 h-4 text-muted-foreground mt-2.5" />
                    <Input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </TabsContent>
                <TabsContent value="upload">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, setVideoUrl)}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload video</p>
                    </label>
                  </div>
                </TabsContent>
              </Tabs>
              {videoUrl && (
                <div className="mt-2">
                  <video src={videoUrl} controls className="w-full h-48 rounded-md" />
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isActive" className="text-base font-semibold">Course Status</Label>
              <p className="text-sm text-muted-foreground">Make this course visible to applicants</p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/university/courses')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : courseId ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UniversityAddEditCourse;
