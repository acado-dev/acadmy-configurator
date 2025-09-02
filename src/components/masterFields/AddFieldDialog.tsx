import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ApplicationField, FieldCategory, FieldType } from '@/types/application';

interface AddFieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FieldCategory[];
  onAdd: (field: Omit<ApplicationField, 'id' | 'order'>) => void;
}

export const AddFieldDialog: React.FC<AddFieldDialogProps> = ({
  isOpen,
  onClose,
  categories,
  onAdd,
}) => {
  const [fieldData, setFieldData] = useState({
    name: '',
    label: '',
    type: 'text' as FieldType,
    placeholder: '',
    description: '',
    required: false,
    categoryId: '',
    subcategoryId: '',
  });

  const [options, setOptions] = useState<string[]>([]);
  const [currentOption, setCurrentOption] = useState('');

  const fieldTypes: FieldType[] = [
    'text', 'email', 'tel', 'number', 'date', 
    'select', 'multiselect', 'textarea', 'checkbox', 
    'radio', 'file', 'country', 'url'
  ];

  const selectedCategory = categories.find(c => c.id === fieldData.categoryId);
  const needsOptions = ['select', 'multiselect', 'radio'].includes(fieldData.type);

  const handleAddOption = () => {
    if (currentOption.trim()) {
      setOptions([...options, currentOption.trim()]);
      setCurrentOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!fieldData.name.trim() || !fieldData.label.trim() || !fieldData.categoryId) return;
    
    const field: Omit<ApplicationField, 'id' | 'order'> = {
      ...fieldData,
      name: fieldData.name.toLowerCase().replace(/\s+/g, '_'),
      options: needsOptions ? options.map(opt => ({ value: opt.toLowerCase().replace(/\s+/g, '_'), label: opt })) : undefined,
    };
    
    onAdd(field);
    
    // Reset form
    setFieldData({
      name: '',
      label: '',
      type: 'text',
      placeholder: '',
      description: '',
      required: false,
      categoryId: '',
      subcategoryId: '',
    });
    setOptions([]);
    setCurrentOption('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Custom Field</DialogTitle>
          <DialogDescription>
            Create a new field for application forms
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field-name">Field Name (System) *</Label>
              <Input
                id="field-name"
                placeholder="e.g., medical_condition"
                value={fieldData.name}
                onChange={(e) => setFieldData({ ...fieldData, name: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Used internally, no spaces allowed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-label">Field Label (Display) *</Label>
              <Input
                id="field-label"
                placeholder="e.g., Medical Condition"
                value={fieldData.label}
                onChange={(e) => setFieldData({ ...fieldData, label: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Shown to users in forms
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field-category">Category *</Label>
              <Select value={fieldData.categoryId} onValueChange={(value) => setFieldData({ ...fieldData, categoryId: value, subcategoryId: '' })}>
                <SelectTrigger id="field-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory?.subcategories && selectedCategory.subcategories.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="field-subcategory">Subcategory</Label>
                <Select value={fieldData.subcategoryId} onValueChange={(value) => setFieldData({ ...fieldData, subcategoryId: value })}>
                  <SelectTrigger id="field-subcategory">
                    <SelectValue placeholder="Select subcategory (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {selectedCategory.subcategories.map((subcat) => (
                      <SelectItem key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-type">Field Type *</Label>
            <Select value={fieldData.type} onValueChange={(value) => setFieldData({ ...fieldData, type: value as FieldType })}>
              <SelectTrigger id="field-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {needsOptions && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add option..."
                  value={currentOption}
                  onChange={(e) => setCurrentOption(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                />
                <Button type="button" variant="outline" onClick={handleAddOption}>
                  Add
                </Button>
              </div>
              {options.length > 0 && (
                <div className="space-y-1 mt-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                      <span className="text-sm">{option}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="field-placeholder">Placeholder Text</Label>
            <Input
              id="field-placeholder"
              placeholder="e.g., Enter your medical condition..."
              value={fieldData.placeholder}
              onChange={(e) => setFieldData({ ...fieldData, placeholder: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-description">Description/Help Text</Label>
            <Textarea
              id="field-description"
              placeholder="Additional information or instructions for this field..."
              value={fieldData.description}
              onChange={(e) => setFieldData({ ...fieldData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="field-required"
              checked={fieldData.required}
              onCheckedChange={(checked) => setFieldData({ ...fieldData, required: checked as boolean })}
            />
            <Label htmlFor="field-required" className="font-normal">
              This field is required
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!fieldData.name.trim() || !fieldData.label.trim() || !fieldData.categoryId}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};