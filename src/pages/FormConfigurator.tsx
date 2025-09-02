import React, { useState } from 'react';
import { Plus, Save, Eye, Copy, Trash2, GripVertical, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { masterCategories, masterFields } from '@/data/masterFields';
import { ApplicationField, ConfiguredField, FieldCategory } from '@/types/application';
import {
  User, GraduationCap, Briefcase, Lightbulb, Award,
  FileText, PenTool, Users, DollarSign, Settings
} from 'lucide-react';

const FormConfigurator = () => {
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [selectedFields, setSelectedFields] = useState<ConfiguredField[]>([]);
  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editingField, setEditingField] = useState<ConfiguredField | null>(null);

  const iconMap: Record<string, React.ComponentType<any>> = {
    User,
    GraduationCap,
    Briefcase,
    Lightbulb,
    Award,
    FileText,
    PenTool,
    Users,
    DollarSign,
    Settings
  };

  const handleAddField = (field: ApplicationField) => {
    const configuredField: ConfiguredField = {
      ...field,
      isVisible: true,
      isRequired: field.required,
      customLabel: field.label,
    };
    setSelectedFields([...selectedFields, configuredField]);
  };

  const handleRemoveField = (fieldId: string) => {
    setSelectedFields(selectedFields.filter(f => f.id !== fieldId));
  };

  const handleUpdateField = (fieldId: string, updates: Partial<ConfiguredField>) => {
    setSelectedFields(selectedFields.map(f => 
      f.id === fieldId ? { ...f, ...updates } : f
    ));
  };

  const handleSaveForm = () => {
    console.log('Saving form:', {
      name: formName,
      description: formDescription,
      fields: selectedFields,
    });
    // Here you would typically save to backend
  };

  const getCategoryFields = (categoryId: string) => {
    return masterFields.filter(f => f.categoryId === categoryId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Form Configurator</h1>
          <p className="text-muted-foreground mt-1">
            Create and customize application forms for universities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button variant="gradient" className="gap-2" onClick={handleSaveForm}>
            <Save className="w-4 h-4" />
            Save Form
          </Button>
        </div>
      </div>

      {/* Form Details */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Form Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="form-name">Form Name</Label>
            <Input
              id="form-name"
              placeholder="e.g., Graduate Program Application"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="form-description">Description</Label>
            <Input
              id="form-description"
              placeholder="Brief description of the form"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Form Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Fields */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Form Fields</h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setIsAddFieldDialogOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Field
              </Button>
            </div>

            {selectedFields.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No fields added yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setIsAddFieldDialogOpen(true)}
                >
                  Add your first field
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedFields.map((field) => (
                  <div
                    key={field.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="w-5 h-5 text-muted-foreground mt-1 cursor-move" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {editingField?.id === field.id ? (
                            <Input
                              value={field.customLabel || field.label}
                              onChange={(e) => handleUpdateField(field.id, { customLabel: e.target.value })}
                              className="h-7 text-sm font-medium"
                            />
                          ) : (
                            <p className="font-medium">{field.customLabel || field.label}</p>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {field.type}
                          </Badge>
                          {field.isRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          Field name: {field.name}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`visible-${field.id}`}
                              checked={field.isVisible}
                              onCheckedChange={(checked) => handleUpdateField(field.id, { isVisible: checked })}
                            />
                            <Label htmlFor={`visible-${field.id}`} className="text-sm">
                              Visible
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`required-${field.id}`}
                              checked={field.isRequired}
                              onCheckedChange={(checked) => handleUpdateField(field.id, { isRequired: checked })}
                            />
                            <Label htmlFor={`required-${field.id}`} className="text-sm">
                              Required
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {editingField?.id === field.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditingField(null)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                handleUpdateField(field.id, { customLabel: field.label });
                                setEditingField(null);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditingField(field)}
                            >
                              <PenTool className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleRemoveField(field.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Form Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Form Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Fields</p>
                <p className="text-2xl font-bold">{selectedFields.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Required Fields</p>
                <p className="text-2xl font-bold">
                  {selectedFields.filter(f => f.isRequired).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Categories Used</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(selectedFields.map(f => f.categoryId))).map(catId => {
                    const category = masterCategories.find(c => c.id === catId);
                    if (!category) return null;
                    const Icon = iconMap[category.icon] || FileText;
                    return (
                      <Badge key={catId} variant="secondary" className="gap-1">
                        <Icon className="w-3 h-3" />
                        {category.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 mt-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                <Copy className="w-4 h-4" />
                Duplicate Form
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                <FileText className="w-4 h-4" />
                Import from Template
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Field Dialog */}
      <Dialog open={isAddFieldDialogOpen} onOpenChange={setIsAddFieldDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Fields to Form</DialogTitle>
            <DialogDescription>
              Select fields from the master database to add to your form
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </Button>
              {masterCategories.map((category) => {
                const Icon = iconMap[category.icon] || FileText;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon className="w-3 h-3" />
                    {category.name}
                  </Button>
                );
              })}
            </div>

            {/* Fields List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(selectedCategory ? getCategoryFields(selectedCategory) : masterFields).map((field) => {
                const isAdded = selectedFields.some(f => f.id === field.id);
                return (
                  <div
                    key={field.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      isAdded ? "bg-muted opacity-50" : "hover:bg-accent/50 cursor-pointer"
                    )}
                    onClick={() => !isAdded && handleAddField(field)}
                  >
                    <div>
                      <p className="font-medium text-sm">{field.label}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {field.type}
                        </Badge>
                        {field.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    {isAdded ? (
                      <Badge variant="secondary">Added</Badge>
                    ) : (
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFieldDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default FormConfigurator;