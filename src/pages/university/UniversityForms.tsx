import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormsList } from '@/components/forms/FormsList';
import { useFormsData } from '@/hooks/useFormsData';
import { ApplicationForm } from '@/types/application';

const UniversityForms = () => {
  const navigate = useNavigate();
  const { forms, universities, courses, deleteForm, updateForm } = useFormsData();
  
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
    </div>
  );
};

export default UniversityForms;