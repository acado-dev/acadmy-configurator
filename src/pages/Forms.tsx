import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormsList } from '@/components/forms/FormsList';
import { useFormsData } from '@/hooks/useFormsData';
import { ApplicationForm } from '@/types/application';

const Forms = () => {
  const navigate = useNavigate();
  const { forms, universities, courses, deleteForm, updateForm } = useFormsData();

  const handleCreateNew = () => {
    navigate('/forms/new');
  };

  const handleEdit = (formId: string) => {
    navigate(`/forms/${formId}`);
  };

  const handleDelete = (formId: string) => {
    deleteForm(formId);
  };

  const handleUpdateForm = (formId: string, updates: Partial<ApplicationForm>) => {
    updateForm(formId, updates);
  };

  return (
    <FormsList
      forms={forms}
      universities={universities}
      courses={courses}
      onCreateNew={handleCreateNew}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onUpdateForm={handleUpdateForm}
    />
  );
};

export default Forms;