import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormsList } from '@/components/forms/FormsList';
import { useFormsData } from '@/hooks/useFormsData';

const Forms = () => {
  const navigate = useNavigate();
  const { forms, deleteForm } = useFormsData();

  const handleCreateNew = () => {
    navigate('/forms/new');
  };

  const handleEdit = (formId: string) => {
    navigate(`/forms/${formId}`);
  };

  const handleDelete = (formId: string) => {
    deleteForm(formId);
  };

  return (
    <FormsList
      forms={forms}
      onCreateNew={handleCreateNew}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default Forms;