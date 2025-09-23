import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormsList } from '@/components/forms/FormsList';
import { useFormsData } from '@/hooks/useFormsData';
import { ApplicationForm } from '@/types/application';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle } from 'lucide-react';
import { useMatchingCriteria } from '@/hooks/useMatchingCriteria';

const UniversityForms = () => {
  const navigate = useNavigate();
  const { forms, universities, courses, deleteForm, updateForm } = useFormsData();
  const { getCriteriaByCoursId } = useMatchingCriteria();
  
  // Filter forms for the current university (in real app, this would use actual university ID)
  const universityId = 'harvard'; // Mock university ID
  const universityForms = forms.filter(form => form.universityId === universityId);
  const universityCourses = courses.filter(course => course.universityId === universityId);

  const handleCreateNew = () => {
    navigate('/university/forms/new');
  };

  const handleEdit = (formId: string) => {
    navigate(`/university/forms/${formId}`);
  };

  const handleDelete = (formId: string) => {
    deleteForm(formId);
  };

  const handleUpdateForm = (formId: string, updates: Partial<ApplicationForm>) => {
    updateForm(formId, updates);
  };

  const handleSetupMatchingCriteria = (courseId: string) => {
    navigate(`matching-criteria/${courseId}`);
  };

  return (
    <div>
      <FormsList
        forms={universityForms}
        universities={universities.filter(u => u.id === universityId)}
        courses={universityCourses}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateForm={handleUpdateForm}
      />
      {universityCourses.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg bg-secondary/10">
          <h3 className="text-lg font-semibold mb-3">Matching Criteria</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure evaluation rules for applicant assessment based on form fields and additional criteria.
          </p>
          <div className="space-y-2">
            {universityCourses.map(course => {
              const hasCriteria = getCriteriaByCoursId(course.id);
              return (
                <div key={course.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/20">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{course.name}</span>
                    {hasCriteria && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Configured
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={hasCriteria ? "secondary" : "outline"}
                    onClick={() => handleSetupMatchingCriteria(course.id)}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    {hasCriteria ? 'Edit Criteria' : 'Setup Criteria'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityForms;