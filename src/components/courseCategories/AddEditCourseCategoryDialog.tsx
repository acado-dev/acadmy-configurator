import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CourseCategory } from '@/types/courseCategory';

interface AddEditCourseCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<CourseCategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  category?: CourseCategory | null;
  categories: CourseCategory[];
}

export const AddEditCourseCategoryDialog: React.FC<AddEditCourseCategoryDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  categories,
}) => {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [code, setCode] = useState('');
  const [parentId, setParentId] = useState<string>('none');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setShortName(category.shortName);
      setCode(category.code || '');
      setParentId(category.parentId || 'none');
      setDescription(category.description || '');
      setKeywords(category.keywords || '');
    } else {
      resetForm();
    }
  }, [category]);

  const resetForm = () => {
    setName('');
    setShortName('');
    setCode('');
    setParentId('none');
    setDescription('');
    setKeywords('');
  };

  const handleSubmit = () => {
    if (!name.trim() || !shortName.trim()) {
      return;
    }

    onSave({
      name: name.trim(),
      shortName: shortName.trim(),
      code: code.trim() || undefined,
      parentId: parentId === 'none' ? null : parentId,
      description: description.trim() || undefined,
      keywords: keywords.trim() || undefined,
      isActive: category?.isActive ?? true,
    });

    resetForm();
    onClose();
  };

  // Filter out current category and its descendants from parent options
  const getAvailableParents = () => {
    if (!category) return categories;
    
    const getAllDescendants = (catId: string): string[] => {
      const children = categories.filter(c => c.parentId === catId);
      return [catId, ...children.flatMap(c => getAllDescendants(c.id))];
    };
    
    const excludedIds = getAllDescendants(category.id);
    return categories.filter(c => !excludedIds.includes(c.id));
  };

  const availableParents = getAvailableParents();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogDescription>
            {category ? 'Update category details' : 'Create a new course category'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Computer Science"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortName">Short Name *</Label>
              <Input
                id="shortName"
                placeholder="e.g., CS"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                placeholder="e.g., CS101"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Category</Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Root Category)</SelectItem>
                  {availableParents.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter category description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              placeholder="e.g., programming, software, algorithms"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || !shortName.trim()}>
            {category ? 'Update' : 'Add'} Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
