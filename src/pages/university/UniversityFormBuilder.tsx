import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Settings, 
  MapPin, 
  Calendar, 
  Save,
  ArrowLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { 
  ApplicationField, 
  ConfiguredField, 
  ApplicationForm, 
  FieldCategory 
} from '@/types/application';
import { toast } from '@/components/ui/use-toast';
import { FormPreview } from '@/components/forms/FormPreview';
import { FormMappingDialog } from '@/components/forms/FormMappingDialog';
import { CategoryRenameDialog } from '@/components/forms/CategoryRenameDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMasterFieldsManagement } from '@/hooks/useMasterFieldsManagement';
import { useFormsData } from '@/hooks/useFormsData';

const UniversityFormBuilder = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { categories, fields } = useMasterFieldsManagement();
  const { forms, courses, createForm, updateForm, getFormById } = useFormsData();
  
  // Filter courses for the current university (mock)
  const universityId = 'harvard';
  const universityCourses = courses.filter(c => c.universityId === universityId);
  
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [selectedFields, setSelectedFields] = useState<ConfiguredField[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<FieldCategory[]>([]);
  const [customCategoryNames, setCustomCategoryNames] = useState<Record<string, { name: string; subcategories?: Record<string, string> }>>({});
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedCategoryForRename, setSelectedCategoryForRename] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  useEffect(() => {
    if (formId && formId !== 'new') {
      const existingForm = getFormById(formId);
      if (existingForm) {
        setFormName(existingForm.name);
        setFormDescription(existingForm.description);
        setSelectedFields(existingForm.fields);
        setSelectedCategories(existingForm.categories);
        setCustomCategoryNames(existingForm.customCategoryNames || {});
        setSelectedCourseIds(existingForm.courseIds);
      }
    }
  }, [formId, getFormById]);

  const handleAddField = (field: ApplicationField) => {
    const configuredField: ConfiguredField = {
      ...field,
      isVisible: true,
      isRequired: field.required
    };
    setSelectedFields([...selectedFields, configuredField]);
    
    // Add category if not already present
    const category = categories.find(c => c.id === field.categoryId);
    if (category && !selectedCategories.find(c => c.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleRemoveField = (fieldId: string) => {
    setSelectedFields(selectedFields.filter(f => f.id !== fieldId));
    
    // Remove category if no more fields from it
    const remainingFields = selectedFields.filter(f => f.id !== fieldId);
    const categoriesInUse = new Set(remainingFields.map(f => f.categoryId));
    setSelectedCategories(selectedCategories.filter(c => categoriesInUse.has(c.id)));
  };

  const handleUpdateField = (fieldId: string, updates: Partial<ConfiguredField>) => {
    setSelectedFields(selectedFields.map(f => 
      f.id === fieldId ? { ...f, ...updates } : f
    ));
  };

  const handleSaveForm = () => {
    if (!formName) {
      toast({
        title: "Error",
        description: "Please provide a form name",
        variant: "destructive"
      });
      return;
    }

    const formData: ApplicationForm = {
      id: formId || '',
      name: formName,
      description: formDescription,
      universityId: universityId,
      courseIds: selectedCourseIds,
      categories: selectedCategories,
      fields: selectedFields,
      customCategoryNames,
      isLaunched: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    if (formId && formId !== 'new') {
      updateForm(formId, formData);
      toast({
        title: "Form updated",
        description: "Application form has been updated successfully",
      });
    } else {
      createForm(formData);
      toast({
        title: "Form created",
        description: "Application form has been created successfully",
      });
    }
    
    navigate('/university/forms');
  };

  const handleSaveMapping = (universityId: string, courseIds: string[]) => {
    setSelectedCourseIds(courseIds);
    setShowMappingDialog(false);
    toast({
      title: "Success",
      description: "Form mapping updated successfully"
    });
  };

  const handleRenameCategory = (categoryId: string) => {
    setSelectedCategoryForRename(categoryId);
    setShowRenameDialog(true);
  };

  const handleSaveRename = (categoryId: string, newName: string, subcategoryRenames?: Record<string, string>) => {
    setCustomCategoryNames({
      ...customCategoryNames,
      [categoryId]: {
        name: newName,
        subcategories: subcategoryRenames
      }
    });
    setShowRenameDialog(false);
  };

  const filteredFields = fields.filter(field => {
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || field.categoryId === selectedCategoryFilter;
    const notSelected = !selectedFields.some(f => f.id === field.id);
    return matchesSearch && matchesCategory && notSelected;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/university/forms')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {formId && formId !== 'new' ? 'Edit Form' : 'Create New Form'}
              </h1>
              <p className="text-muted-foreground">Build custom application forms for your courses</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowMappingDialog(true)}>
              <MapPin className="h-4 w-4 mr-2" />
              Map to Courses ({selectedCourseIds.length})
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSaveForm}>
              <Save className="h-4 w-4 mr-2" />
              Save Form
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Form Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Form Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="formName">Form Name *</Label>
                  <Input
                    id="formName"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., MBA Application Form"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="formDescription">Description</Label>
                  <Textarea
                    id="formDescription"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief description of the form"
                    rows={3}
                    className="mt-1"
                  />
                </div>
                {selectedCourseIds.length > 0 && (
                  <div>
                    <Label>Mapped Courses</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCourseIds.map(courseId => {
                        const course = universityCourses.find(c => c.id === courseId);
                        return course ? (
                          <Badge key={courseId} variant="secondary">
                            {course.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Form Builder */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Form Fields</h3>
                <Button onClick={() => setShowFieldDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fields
                </Button>
              </div>

              {selectedCategories.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No fields added yet</p>
                  <p className="text-sm mb-4">Add fields to start building your form</p>
                  <Button onClick={() => setShowFieldDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Fields
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedCategories.map((category) => {
                    const categoryFields = selectedFields.filter(f => f.categoryId === category.id);
                    const displayName = customCategoryNames[category.id]?.name || category.name;
                    
                    return (
                      <div key={category.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{displayName}</h4>
                            <Badge variant="outline" className="text-xs">
                              {categoryFields.length} fields
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRenameCategory(category.id)}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Rename
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {categoryFields.map((field) => (
                            <div
                              key={field.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                <div>
                                  <p className="font-medium">{field.customLabel || field.label}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {field.type}
                                    </Badge>
                                    {field.isRequired && (
                                      <Badge variant="secondary" className="text-xs">
                                        Required
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={field.isVisible}
                                  onCheckedChange={(checked) => 
                                    handleUpdateField(field.id, { isVisible: checked as boolean })
                                  }
                                />
                                <Label className="text-sm">Visible</Label>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleRemoveField(field.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Form Summary</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Total Fields</Label>
                  <p className="text-2xl font-bold">{selectedFields.length}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Required Fields</Label>
                  <p className="text-2xl font-bold">
                    {selectedFields.filter(f => f.isRequired).length}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Categories</Label>
                  <p className="text-2xl font-bold">{selectedCategories.length}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Mapped Courses</Label>
                  <p className="text-2xl font-bold">{selectedCourseIds.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowFieldDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add More Fields
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowMappingDialog(true)}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Map to Courses
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowPreview(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Form
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Fields Dialog */}
      <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Add Fields to Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {categories.map(category => {
                  const categoryFields = filteredFields.filter(f => f.categoryId === category.id);
                  if (categoryFields.length === 0) return null;
                  
                  return (
                    <div key={category.id}>
                      <h4 className="font-medium mb-2">{category.name}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categoryFields.map(field => (
                          <div
                            key={field.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                            onClick={() => {
                              handleAddField(field);
                              setSearchTerm('');
                            }}
                          >
                            <div>
                              <p className="font-medium text-sm">{field.label}</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {field.type}
                              </Badge>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mapping Dialog */}
      <FormMappingDialog
        isOpen={showMappingDialog}
        onClose={() => setShowMappingDialog(false)}
        universities={[{ id: universityId, name: 'Harvard University', country: 'USA', createdAt: new Date() }]}
        courses={universityCourses}
        selectedUniversityId={universityId}
        selectedCourseIds={selectedCourseIds}
        onSave={handleSaveMapping}
      />

      {/* Rename Category Dialog */}
      {selectedCategoryForRename && (
        <CategoryRenameDialog
          isOpen={showRenameDialog}
          onClose={() => setShowRenameDialog(false)}
          categories={categories}
          customNames={customCategoryNames}
          onSave={(customNames) => {
            setCustomCategoryNames(customNames);
            setShowRenameDialog(false);
          }}
        />
      )}

      {/* Preview Dialog */}
      <FormPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        form={{
          id: formId || 'preview',
          name: formName,
          description: formDescription,
          universityId: universityId,
          courseIds: selectedCourseIds,
          categories: selectedCategories,
          fields: selectedFields,
          customCategoryNames,
          isLaunched: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        }}
      />
    </div>
  );
};

export default UniversityFormBuilder;