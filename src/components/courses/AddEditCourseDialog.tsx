import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Course } from '@/types/course';
import { CourseCategory } from '@/types/courseCategory';
import { CourseLevel } from '@/types/courseLevel';
import { CourseType } from '@/types/courseType';
import { University } from '@/types/application';
import { toast } from '@/hooks/use-toast';

interface AddEditCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void;
  course?: Course | null;
  categories: CourseCategory[];
  levels: CourseLevel[];
  types: CourseType[];
  organizations: University[];
}

const AddEditCourseDialog: React.FC<AddEditCourseDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  course,
  categories,
  levels,
  types,
  organizations,
}) => {
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

  useEffect(() => {
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
    } else {
      setName('');
      setShortName('');
      setCourseCode('');
      setThumbnail('');
      setBannerImage('');
      setVideoUrl('');
      setDescription('');
      setKeywords('');
      setCourseCategoryId('');
      setCourseLevelId('');
      setCourseTypeId('');
      setOrganizationId('');
      setStartDate('');
      setEndDate('');
      setIsActive(true);
    }
  }, [course, isOpen]);

  const handleSubmit = () => {
    if (!name.trim() || !shortName.trim() || !description.trim() || !courseCategoryId || !courseLevelId || !courseTypeId || !organizationId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    onSave({
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
      learningOutcomeIds: course?.learningOutcomeIds || [],
      isActive,
    });
    onClose();
  };

  const activeCategories = categories.filter(c => c.isActive);
  const activeLevels = levels.filter(l => l.isActive);
  const activeTypes = types.filter(t => t.isActive);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Course Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter course name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortName">Short Name *</Label>
            <Input
              id="shortName"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              placeholder="Enter short name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseCode">Course Code</Label>
            <Input
              id="courseCode"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Enter course code"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationId">Organization *</Label>
            <Select value={organizationId} onValueChange={setOrganizationId}>
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

          <div className="space-y-2">
            <Label htmlFor="courseCategoryId">Course Category *</Label>
            <Select value={courseCategoryId} onValueChange={setCourseCategoryId}>
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
            <Label htmlFor="courseLevelId">Course Level *</Label>
            <Select value={courseLevelId} onValueChange={setCourseLevelId}>
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
            <Label htmlFor="courseTypeId">Course Type *</Label>
            <Select value={courseTypeId} onValueChange={setCourseTypeId}>
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

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Course Thumbnail URL</Label>
            <Input
              id="thumbnail"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="Enter thumbnail URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bannerImage">Banner Image URL</Label>
            <Input
              id="bannerImage"
              value={bannerImage}
              onChange={(e) => setBannerImage(e.target.value)}
              placeholder="Enter banner image URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Course Video URL</Label>
            <Input
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter video URL"
            />
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

        <div className="space-y-2 col-span-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter course description"
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Input
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Enter keywords (comma separated)"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {course ? 'Update' : 'Add'} Course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCourseDialog;
