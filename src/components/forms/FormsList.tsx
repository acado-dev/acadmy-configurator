import React, { useState } from 'react';
import { Plus, Edit, Trash2, Link, Calendar, FileText } from 'lucide-react';
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
import { ApplicationForm } from '@/types/application';

interface FormsListProps {
  forms: ApplicationForm[];
  onCreateNew: () => void;
  onEdit: (formId: string) => void;
  onDelete: (formId: string) => void;
}

export const FormsList: React.FC<FormsListProps> = ({
  forms,
  onCreateNew,
  onEdit,
  onDelete,
}) => {
  const [deleteFormId, setDeleteFormId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteFormId) {
      onDelete(deleteFormId);
      setDeleteFormId(null);
    }
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
            {forms.map((form) => (
              <Card key={form.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">{form.name}</h3>
                  <Badge variant={form.isActive ? "default" : "secondary"}>
                    {form.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {form.description || "No description provided"}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>{form.fields.length} fields</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Link className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {form.courseIds.length === 0 
                        ? "Not linked to any course" 
                        : `Linked to ${form.courseIds.length} course${form.courseIds.length > 1 ? 's' : ''}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Updated {new Date(form.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

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
              </Card>
            ))}
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
    </>
  );
};