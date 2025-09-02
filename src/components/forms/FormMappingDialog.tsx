import React, { useState } from 'react';
import { Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { University, Course } from '@/types/application';

interface FormMappingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  universities: University[];
  courses: Course[];
  selectedUniversityId: string;
  selectedCourseIds: string[];
  onSave: (universityId: string, courseIds: string[]) => void;
}

export const FormMappingDialog: React.FC<FormMappingDialogProps> = ({
  isOpen,
  onClose,
  universities,
  courses,
  selectedUniversityId,
  selectedCourseIds,
  onSave,
}) => {
  const [universityId, setUniversityId] = useState(selectedUniversityId);
  const [courseIds, setCourseIds] = useState<string[]>(selectedCourseIds);

  const filteredCourses = courses.filter(c => c.universityId === universityId);

  const handleCourseToggle = (courseId: string, checked: boolean) => {
    if (checked) {
      setCourseIds([...courseIds, courseId]);
    } else {
      setCourseIds(courseIds.filter(id => id !== courseId));
    }
  };

  const handleSave = () => {
    onSave(universityId, courseIds);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Map Form to University & Courses</DialogTitle>
          <DialogDescription>
            Associate this application form with a university and its courses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* University Selection */}
          <div className="space-y-2">
            <Label htmlFor="university">Select University</Label>
            <Select value={universityId} onValueChange={setUniversityId}>
              <SelectTrigger id="university">
                <SelectValue placeholder="Choose a university" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((uni) => (
                  <SelectItem key={uni.id} value={uni.id}>
                    {uni.name} - {uni.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Course Selection */}
          {universityId && (
            <div className="space-y-2">
              <Label>Select Courses</Label>
              {filteredCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  No courses available for this university
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
                  {filteredCourses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={course.id}
                        checked={courseIds.includes(course.id)}
                        onCheckedChange={(checked) => 
                          handleCourseToggle(course.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={course.id}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {course.name} ({course.type})
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Link className="w-4 h-4" />
            Save Mapping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};