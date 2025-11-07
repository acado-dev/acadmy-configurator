import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CourseLevel } from '@/types/courseLevel';

interface AddEditCourseLevelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (level: Omit<CourseLevel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  level?: CourseLevel | null;
}

export function AddEditCourseLevelDialog({
  isOpen,
  onClose,
  onSave,
  level,
}: AddEditCourseLevelDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    description: '',
    keywords: '',
    isActive: true,
  });

  useEffect(() => {
    if (level) {
      setFormData({
        name: level.name,
        shortName: level.shortName,
        description: level.description || '',
        keywords: level.keywords || '',
        isActive: level.isActive,
      });
    } else {
      setFormData({
        name: '',
        shortName: '',
        description: '',
        keywords: '',
        isActive: true,
      });
    }
  }, [level, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.shortName.trim()) {
      return;
    }

    onSave({
      name: formData.name.trim(),
      shortName: formData.shortName.trim(),
      description: formData.description.trim() || undefined,
      keywords: formData.keywords.trim() || undefined,
      isActive: formData.isActive,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{level ? 'Edit Course Level' : 'Add Course Level'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Undergraduate"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortName">Short Name *</Label>
              <Input
                id="shortName"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                placeholder="e.g., UG"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this level"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="Comma-separated keywords"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {level ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
