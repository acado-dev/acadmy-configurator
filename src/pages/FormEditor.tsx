import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Link, Settings2, Plus, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ApplicationField, ConfiguredField, FieldCategory } from '@/types/application';
import { FormFieldEditor } from '@/components/forms/FormFieldEditor';
import { FormMappingDialog } from '@/components/forms/FormMappingDialog';
import { CategoryRenameDialog } from '@/components/forms/CategoryRenameDialog';
import { FormPreview } from '@/components/forms/FormPreview';
import { useFormsData } from '@/hooks/useFormsData';
import { useMasterFieldsManagement } from '@/hooks/useMasterFieldsManagement';
import { CriteriaAgent } from '@/components/criteria/CriteriaAgent';
import { useApplicationProcess } from '@/hooks/useApplicationProcess';
import { useToast } from '@/hooks/use-toast';
import {
  User, GraduationCap, Briefcase, Lightbulb, Award,
  FileText as FileTextIcon, PenTool, Users, DollarSign, Settings,
  Folder, Globe, Heart, Star, Shield
} from 'lucide-react';

const FormEditor = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { forms, universities, courses, createForm, updateForm, getFormById } = useFormsData();
  const { categories: masterCategories, fields: masterFields } = useMasterFieldsManagement();
  
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [selectedFields, setSelectedFields] = useState<ConfiguredField[]>([]);
  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editingField, setEditingField] = useState<ConfiguredField | null>(null);
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedUniversityId, setSelectedUniversityId] = useState('');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [customCategoryNames, setCustomCategoryNames] = useState<Record<string, { name: string; subcategories?: Record<string, string> }>>({});

  const iconMap: Record<string, React.ComponentType<any>> = {
    User,
    GraduationCap,
    Briefcase,
    Lightbulb,
    Award,
    FileText: FileTextIcon,
    PenTool,
    Users,
    DollarSign,
    Settings
  };

  // Load existing form if editing
  useEffect(() => {
    if (formId && formId !== 'new') {
      const existingForm = getFormById(formId);
      if (existingForm) {
        setFormName(existingForm.name);
        setFormDescription(existingForm.description);
        setSelectedFields(existingForm.fields);
        setSelectedUniversityId(existingForm.universityId);
        setSelectedCourseIds(existingForm.courseIds);
        setCustomCategoryNames(existingForm.customCategoryNames || {});
      }
    }
  }, [formId, getFormById]);

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
    const formData = {
      name: formName,
      description: formDescription,
      universityId: selectedUniversityId,
      courseIds: selectedCourseIds,
      categories: masterCategories,
      fields: selectedFields,
      customCategoryNames,
      isActive: true,
    };

    if (formId && formId !== 'new') {
      updateForm(formId, formData);
    } else {
      createForm({
        ...formData,
        id: '',
        isLaunched: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    navigate('/forms');
  };

  const handleSaveMapping = (universityId: string, courseIds: string[]) => {
    setSelectedUniversityId(universityId);
    setSelectedCourseIds(courseIds);
  };

  const getCategoryFields = (categoryId: string) => {
    return masterFields.filter(f => f.categoryId === categoryId);
  };

  // Get categories that have fields in the form
  const usedCategories = Array.from(new Set(selectedFields.map(f => f.categoryId)))
    .map(catId => masterCategories.find(c => c.id === catId))
    .filter(Boolean) as FieldCategory[];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/forms')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {formId && formId !== 'new' ? 'Edit Form' : 'Create New Form'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure application form fields and settings
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setIsPreviewOpen(true)}>
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setIsMappingDialogOpen(true)}>
            <Link className="w-4 h-4" />
            Map to Courses
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setIsCategoryDialogOpen(true)}
                >
                  <Settings2 className="w-4 h-4" />
                  Category Names
                </Button>
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
                  <FormFieldEditor
                    key={field.id}
                    field={field}
                    editingField={editingField}
                    onUpdate={handleUpdateField}
                    onRemove={handleRemoveField}
                    onEdit={setEditingField}
                  />
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
                    const displayName = customCategoryNames[catId]?.name || category.name;
                    return (
                      <Badge key={catId} variant="secondary" className="gap-1">
                        <Icon className="w-3 h-3" />
                        {displayName}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              {selectedUniversityId && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Mapped To</p>
                  <p className="text-sm font-medium">
                    {universities.find(u => u.id === selectedUniversityId)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedCourseIds.length} course(s) selected
                  </p>
                </div>
              )}
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
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isAdded ? 'bg-muted opacity-50' : 'hover:bg-accent/50 cursor-pointer'
                    }`}
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

      {/* Form Mapping Dialog */}
      <FormMappingDialog
        isOpen={isMappingDialogOpen}
        onClose={() => setIsMappingDialogOpen(false)}
        universities={universities}
        courses={courses}
        selectedUniversityId={selectedUniversityId}
        selectedCourseIds={selectedCourseIds}
        onSave={handleSaveMapping}
      />

      {/* Category Rename Dialog */}
      <CategoryRenameDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        categories={usedCategories}
        customNames={customCategoryNames}
        onSave={setCustomCategoryNames}
      />

      {/* Form Preview */}
      <FormPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        form={{
          id: formId || '',
          name: formName,
          description: formDescription,
          universityId: selectedUniversityId,
          courseIds: selectedCourseIds,
          categories: masterCategories,
          fields: selectedFields,
          customCategoryNames,
          isLaunched: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
        }}
        university={universities.find(u => u.id === selectedUniversityId)}
        courses={courses.filter(c => selectedCourseIds.includes(c.id))}
      />
    </div>
  );
};

export default FormEditor;