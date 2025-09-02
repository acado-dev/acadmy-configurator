import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface AddSubcategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  onAdd: (subcategory: { name: string }) => void;
}

export const AddSubcategoryDialog: React.FC<AddSubcategoryDialogProps> = ({
  isOpen,
  onClose,
  categoryName,
  onAdd,
}) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    onAdd({ name });
    
    // Reset form
    setName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subcategory</DialogTitle>
          <DialogDescription>
            Add a new subcategory to "{categoryName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subcategory-name">Subcategory Name *</Label>
            <Input
              id="subcategory-name"
              placeholder="e.g., Medical History"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            <Plus className="w-4 h-4 mr-1" />
            Add Subcategory
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};