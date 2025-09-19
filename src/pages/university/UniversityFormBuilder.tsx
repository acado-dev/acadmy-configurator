import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  Save,
  Eye,
  Trash2,
  GripVertical,
  Settings,
  ChevronRight,
  FileText
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { masterFields, masterCategories } from '@/data/masterFields';
import { ApplicationField, ConfiguredField, ApplicationForm } from '@/types/application';

const UniversityFormBuilder = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [selectedFields, setSelectedFields] = useState<ConfiguredField[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editingField, setEditingField] = useState<ConfiguredField | null>(null);

  useEffect(() => {
    if (formId && formId !== 'new') {
      // Load existing form data
      setFormName('MBA Application Form');
      setFormDescription('Application form for Master of Business Administration program');
      // Load fields from saved form
    }
  }, [formId]);

  const handleAddField = (field: ApplicationField) => {
    const configuredField: ConfiguredField = {
      ...field,
      isVisible: true,
      isRequired: field.required
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
    setEditingField(null);
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

    // Save form logic here
    toast({
      title: "Form saved",
      description: "Application form has been saved successfully",
    });
    navigate('/university/forms');
  };

  // Get all available fields from masterFields
  const availableFields = masterFields.map(field => ({
    ...field,
    categoryName: masterCategories.find(c => c.id === field.categoryId)?.name || 'Other'
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {formId === 'new' ? 'Create Application Form' : 'Edit Application Form'}
            </h1>
            <p className="text-muted-foreground">Build custom application forms for your courses</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Preview'}
            </Button>
            <Button onClick={handleSaveForm}>
              <Save className="h-4 w-4 mr-2" />
              Save Form
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Builder */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
                <CardDescription>Basic information about your application form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="formName">Form Name</Label>
                  <Input
                    id="formName"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., MBA Application Form"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formDescription">Description</Label>
                  <Textarea
                    id="formDescription"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief description of the form"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Fields</CardTitle>
                <CardDescription>Add and configure fields for your application form</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="selected" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="selected">Selected Fields ({selectedFields.length})</TabsTrigger>
                    <TabsTrigger value="available">Available Fields</TabsTrigger>
                  </TabsList>

                  <TabsContent value="selected" className="space-y-4">
                    {selectedFields.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No fields added yet</p>
                        <p className="text-sm">Switch to "Available Fields" tab to add fields</p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-2">
                          {selectedFields.map((field) => (
                            <div
                              key={field.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                <div>
                                  <p className="font-medium">{field.label}</p>
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
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditingField(field)}
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
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
                      </ScrollArea>
                    )}
                  </TabsContent>

                  <TabsContent value="available" className="space-y-4">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {masterCategories.map((category) => {
                          const categoryFields = availableFields.filter(f => f.categoryId === category.id);
                          if (categoryFields.length === 0) return null;
                          
                          return (
                            <div key={category.id} className="space-y-2">
                              <h4 className="font-medium text-sm text-muted-foreground">
                                {category.name}
                              </h4>
                              <div className="grid grid-cols-1 gap-2">
                                {categoryFields.map((field) => (
                                  <div
                                    key={field.id}
                                    className="flex items-center justify-between p-2 border rounded hover:bg-muted/50"
                                  >
                                    <div>
                                      <p className="text-sm font-medium">{field.label}</p>
                                      <Badge variant="outline" className="text-xs mt-1">
                                        {field.type}
                                      </Badge>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleAddField(field)}
                                      disabled={selectedFields.some(f => f.id === field.id)}
                                    >
                                    {selectedFields.some(f => f.id === field.id) ? (
                                      'Added'
                                    ) : (
                                      <>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add
                                      </>
                                    )}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Form Preview</CardTitle>
                  <CardDescription>See how your form will look to applicants</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{formName || 'Untitled Form'}</h3>
                        {formDescription && (
                          <p className="text-sm text-muted-foreground mt-1">{formDescription}</p>
                        )}
                      </div>
                      <div className="space-y-6">
                        {masterCategories.map((category) => {
                          const categoryFields = selectedFields.filter(f => f.categoryId === category.id);
                          if (categoryFields.length === 0) return null;
                          
                          return (
                            <div key={category.id}>
                              <h4 className="font-medium mb-3">{category.name}</h4>
                              <div className="space-y-3">
                                {categoryFields.map((field) => (
                                  <div key={field.id}>
                                    <Label>{field.customLabel || field.label}</Label>
                                    {field.type === 'text' && (
                                      <Input placeholder={field.placeholder} disabled />
                                    )}
                                    {field.type === 'textarea' && (
                                      <Textarea placeholder={field.placeholder} disabled />
                                    )}
                                    {field.type === 'select' && (
                                      <Select disabled>
                                        <SelectTrigger>
                                          <SelectValue placeholder={field.placeholder || 'Select...'} />
                                        </SelectTrigger>
                                      </Select>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityFormBuilder;