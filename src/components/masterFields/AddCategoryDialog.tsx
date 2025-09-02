import React, { useState } from 'react';
import { Plus, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { FieldCategory } from '@/types/application';

interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: Omit<FieldCategory, 'id'>) => void;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Folder');

  const iconOptions = [
    'User', 'GraduationCap', 'Briefcase', 'Lightbulb', 'Award',
    'FileText', 'PenTool', 'Users', 'DollarSign', 'Settings',
    'Folder', 'Globe', 'Heart', 'Star', 'Shield'
  ];

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    onAdd({
      name,
      description,
      icon,
      order: 0, // Will be set in the hook
    });
    
    // Reset form
    setName('');
    setDescription('');
    setIcon('Folder');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new category to organize your application fields
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name *</Label>
            <Input
              id="category-name"
              placeholder="e.g., Medical Information"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              placeholder="Brief description of this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-icon">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger id="category-icon">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((iconName) => (
                  <SelectItem key={iconName} value={iconName}>
                    {iconName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            <Plus className="w-4 h-4 mr-1" />
            Add Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};