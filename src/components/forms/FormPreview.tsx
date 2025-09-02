import React from 'react';
import { X, Calendar, FileText, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { ApplicationForm, ConfiguredField, University, Course } from '@/types/application';
import { masterCategories } from '@/data/masterFields';
import { format } from 'date-fns';

interface FormPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  form: ApplicationForm;
  university?: University;
  courses?: Course[];
}

export const FormPreview: React.FC<FormPreviewProps> = ({
  isOpen,
  onClose,
  form,
  university,
  courses = [],
}) => {
  // Group fields by category
  const fieldsByCategory = form.fields.reduce((acc, field) => {
    if (!field.isVisible) return acc;
    
    const categoryId = field.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(field);
    return acc;
  }, {} as Record<string, ConfiguredField[]>);

  const renderField = (field: ConfiguredField) => {
    const label = field.customLabel || field.label;
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {label}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              disabled
            />
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {label}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              disabled
            />
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {label}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              rows={4}
              disabled
            />
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'select':
      case 'country':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {label}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select disabled>
              <SelectTrigger id={field.id}>
                <SelectValue placeholder={field.placeholder || `Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {label}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="space-y-2 p-3 border rounded-lg bg-muted/10">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox id={`${field.id}-${option.value}`} disabled />
                  <Label
                    htmlFor={`${field.id}-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox id={field.id} disabled />
            <Label htmlFor={field.id} className="font-normal">
              {label}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {label}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RadioGroup disabled>
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {label}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="file"
              disabled
            />
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="overflow-y-auto">
          {/* Header with University Branding */}
          <div className="bg-gradient-to-r from-primary to-primary-hover text-white p-8">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                {university?.logo ? (
                  <img 
                    src={university.logo} 
                    alt={university.name}
                    className="w-20 h-20 rounded-lg bg-white p-2 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-white/20 flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold mb-1">{university?.name || 'University Name'}</h2>
                  <h3 className="text-xl opacity-90">{form.name}</h3>
                  {form.description && (
                    <p className="text-sm opacity-80 mt-2">{form.description}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Course Information */}
            {courses.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm opacity-80 mb-2">Available for:</p>
                <div className="flex flex-wrap gap-2">
                  {courses.map(course => (
                    <Badge key={course.id} variant="secondary" className="bg-white/20 text-white border-white/30">
                      {course.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Dates */}
            {(form.startDate || form.endDate) && (
              <div className="mt-4 flex gap-6 text-sm">
                {form.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Opens: {format(new Date(form.startDate), 'MMM dd, yyyy')}</span>
                  </div>
                )}
                {form.endDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Closes: {format(new Date(form.endDate), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="space-y-8">
              {Object.entries(fieldsByCategory).map(([categoryId, fields]) => {
                const category = masterCategories.find(c => c.id === categoryId);
                if (!category) return null;

                const categoryName = form.customCategoryNames?.[categoryId]?.name || category.name;

                return (
                  <Card key={categoryId} className="p-6">
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        {categoryName}
                      </h4>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {fields.map(renderField)}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-8 p-6 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-destructive">*</span> Required fields
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This is a preview of how the form will appear to applicants
                  </p>
                </div>
                <Button disabled className="gap-2">
                  Submit Application
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};