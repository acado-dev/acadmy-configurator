import React, { useState } from 'react';
import { Plus, Edit, Trash2, Link, Calendar, Clock, FileText, Rocket, Power } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ApplicationForm, University, Course } from '@/types/application';
import { FormMappingDialog } from './FormMappingDialog';
import { FormLaunchDialog } from './FormLaunchDialog';
import { format } from 'date-fns';

interface FormsListProps {
  forms: ApplicationForm[];
  universities: University[];
  courses: Course[];
  onCreateNew: () => void;
  onEdit: (formId: string) => void;
  onDelete: (formId: string) => void;
  onUpdateForm: (formId: string, updates: Partial<ApplicationForm>) => void;
}

export const FormsList: React.FC<FormsListProps> = ({
  forms,
  universities,
  courses,
  onCreateNew,
  onEdit,
  onDelete,
  onUpdateForm,
}) => {
  const [deleteFormId, setDeleteFormId] = useState<string | null>(null);
  const [mappingFormId, setMappingFormId] = useState<string | null>(null);
  const [launchFormId, setLaunchFormId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteFormId) {
      onDelete(deleteFormId);
      setDeleteFormId(null);
    }
  };

  const handleSaveMapping = (formId: string, universityId: string, courseIds: string[]) => {
    onUpdateForm(formId, { universityId, courseIds });
    setMappingFormId(null);
  };

  const handleLaunch = (formId: string, startDate?: Date, endDate?: Date) => {
    onUpdateForm(formId, { 
      isLaunched: true,
      startDate,
      endDate,
    });
    setLaunchFormId(null);
  };

  const toggleFormStatus = (formId: string, isLaunched: boolean) => {
    onUpdateForm(formId, { isLaunched: !isLaunched });
  };

  const getFormStatus = (form: ApplicationForm) => {
    if (!form.isLaunched) return { label: 'Draft', variant: 'secondary' as const };
    
    const now = new Date();
    if (form.startDate && now < new Date(form.startDate)) {
      return { label: 'Scheduled', variant: 'default' as const };
    }
    if (form.endDate && now > new Date(form.endDate)) {
      return { label: 'Closed', variant: 'secondary' as const };
    }
    return { label: 'Live', variant: 'default' as const };
  };

  const getUniversityName = (universityId: string) => {
    return universities.find(u => u.id === universityId)?.name || 'Not assigned';
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Application Forms</h1>
            <p className="text-muted-foreground mt-1">
              Manage and configure application forms for universities
            </p>
          </div>
          <Button variant="gradient" className="gap-2" onClick={onCreateNew}>
            <Plus className="w-4 h-4" />
            Create New Form
          </Button>
        </div>

        {/* Forms Grid */}
        {forms.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No forms created yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first application form to get started
            </p>
            <Button variant="outline" onClick={onCreateNew}>
              Create Your First Form
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => {
              const status = getFormStatus(form);
              const mappingForm = mappingFormId === form.id ? form : null;
              const launchForm = launchFormId === form.id ? form : null;
              
              return (
                <Card key={form.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">{form.name}</h3>
                    <Badge variant={status.variant}>
                      {status.label}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {form.description || "No description provided"}
                  </p>

                  <div className="space-y-3 mb-4">
                    {/* University & Courses */}
                    <div className="p-3 bg-accent/10 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Link className="w-4 h-4 text-primary" />
                        <span>University & Courses</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium">{getUniversityName(form.universityId)}</p>
                        <p className="text-xs mt-1">
                          {form.courseIds.length === 0 
                            ? "No courses linked" 
                            : `${form.courseIds.length} course${form.courseIds.length > 1 ? 's' : ''} linked`}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setMappingFormId(form.id)}
                      >
                        <Link className="w-4 h-4 mr-2" />
                        {form.universityId ? 'Update' : 'Attach'} University/Courses
                      </Button>
                    </div>

                    {/* Launch Settings */}
                    <div className="space-y-2">
                      {form.startDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Starts: {format(new Date(form.startDate), 'MMM dd, yyyy HH:mm')}</span>
                        </div>
                      )}
                      {form.endDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>Ends: {format(new Date(form.endDate), 'MMM dd, yyyy HH:mm')}</span>
                        </div>
                      )}
                      {!form.startDate && !form.endDate && !form.isLaunched && (
                        <p className="text-xs text-muted-foreground">No schedule set</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>{form.fields.length} fields</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {new Date(form.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Launch/Deactivate Button */}
                    <div className="flex gap-2">
                      {!form.isLaunched ? (
                        <Button
                          variant="gradient"
                          size="sm"
                          className="flex-1"
                          onClick={() => setLaunchFormId(form.id)}
                        >
                          <Rocket className="w-4 h-4 mr-1" />
                          Launch Form
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => toggleFormStatus(form.id, form.isLaunched)}
                        >
                          <Power className="w-4 h-4 mr-1" />
                          Deactivate
                        </Button>
                      )}
                      {form.isLaunched && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLaunchFormId(form.id)}
                        >
                          <Clock className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Edit/Delete Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onEdit(form.id)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => setDeleteFormId(form.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteFormId} onOpenChange={() => setDeleteFormId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the form
              and remove its association with any courses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Form Mapping Dialog */}
      {mappingFormId && (
        <FormMappingDialog
          isOpen={!!mappingFormId}
          onClose={() => setMappingFormId(null)}
          universities={universities}
          courses={courses}
          selectedUniversityId={forms.find(f => f.id === mappingFormId)?.universityId || ''}
          selectedCourseIds={forms.find(f => f.id === mappingFormId)?.courseIds || []}
          onSave={(universityId, courseIds) => handleSaveMapping(mappingFormId, universityId, courseIds)}
        />
      )}

      {/* Launch Dialog */}
      {launchFormId && (
        <FormLaunchDialog
          isOpen={!!launchFormId}
          onClose={() => setLaunchFormId(null)}
          formName={forms.find(f => f.id === launchFormId)?.name || ''}
          startDate={forms.find(f => f.id === launchFormId)?.startDate}
          endDate={forms.find(f => f.id === launchFormId)?.endDate}
          onLaunch={(startDate, endDate) => handleLaunch(launchFormId, startDate, endDate)}
        />
      )}
    </>
  );
};