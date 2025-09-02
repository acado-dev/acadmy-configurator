import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { FieldCategory } from '@/types/application';

interface CategoryRenameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FieldCategory[];
  customNames: Record<string, { name: string; subcategories?: Record<string, string> }>;
  onSave: (customNames: Record<string, { name: string; subcategories?: Record<string, string> }>) => void;
}

export const CategoryRenameDialog: React.FC<CategoryRenameDialogProps> = ({
  isOpen,
  onClose,
  categories,
  customNames,
  onSave,
}) => {
  const [localCustomNames, setLocalCustomNames] = useState(customNames);
  const [useCustomNames, setUseCustomNames] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocalCustomNames(customNames);
    const customFlags: Record<string, boolean> = {};
    Object.keys(customNames).forEach(catId => {
      customFlags[catId] = true;
    });
    setUseCustomNames(customFlags);
  }, [customNames]);

  const handleCategoryNameChange = (categoryId: string, name: string) => {
    setLocalCustomNames(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        name,
      }
    }));
  };

  const handleSubcategoryNameChange = (categoryId: string, subcategoryId: string, name: string) => {
    setLocalCustomNames(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        subcategories: {
          ...prev[categoryId]?.subcategories,
          [subcategoryId]: name,
        }
      }
    }));
  };

  const handleToggleCustomName = (categoryId: string, checked: boolean) => {
    setUseCustomNames(prev => ({ ...prev, [categoryId]: checked }));
    if (!checked) {
      const newCustomNames = { ...localCustomNames };
      delete newCustomNames[categoryId];
      setLocalCustomNames(newCustomNames);
    } else {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        setLocalCustomNames(prev => ({
          ...prev,
          [categoryId]: {
            name: category.name,
            subcategories: {},
          }
        }));
      }
    }
  };

  const handleSave = () => {
    onSave(localCustomNames);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Category & Subcategory Names</DialogTitle>
          <DialogDescription>
            Customize how categories and subcategories appear in your form
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {categories.map((category) => (
            <div key={category.id} className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">{category.name}</Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`use-custom-${category.id}`} className="text-sm">
                    Custom Name
                  </Label>
                  <Switch
                    id={`use-custom-${category.id}`}
                    checked={useCustomNames[category.id] || false}
                    onCheckedChange={(checked) => handleToggleCustomName(category.id, checked)}
                  />
                </div>
              </div>

              {useCustomNames[category.id] && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`cat-${category.id}`} className="text-sm">
                      Category Display Name
                    </Label>
                    <Input
                      id={`cat-${category.id}`}
                      value={localCustomNames[category.id]?.name || category.name}
                      onChange={(e) => handleCategoryNameChange(category.id, e.target.value)}
                      className="mt-1"
                      placeholder={category.name}
                    />
                  </div>

                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="ml-4 space-y-2">
                      <Label className="text-sm text-muted-foreground">Subcategories</Label>
                      {category.subcategories.map((subcat) => (
                        <div key={subcat.id}>
                          <Label htmlFor={`subcat-${subcat.id}`} className="text-xs">
                            {subcat.name}
                          </Label>
                          <Input
                            id={`subcat-${subcat.id}`}
                            value={localCustomNames[category.id]?.subcategories?.[subcat.id] || subcat.name}
                            onChange={(e) => handleSubcategoryNameChange(category.id, subcat.id, e.target.value)}
                            className="mt-1 h-8"
                            placeholder={subcat.name}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};