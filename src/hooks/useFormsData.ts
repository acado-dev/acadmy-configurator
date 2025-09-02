import { useState, useEffect } from 'react';
import { ApplicationForm, University, Course } from '@/types/application';

// Mock data for demonstration
const mockUniversities: University[] = [
  {
    id: '1',
    name: 'Harvard University',
    country: 'USA',
    website: 'https://harvard.edu',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Oxford University',
    country: 'UK',
    website: 'https://ox.ac.uk',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'MIT',
    country: 'USA',
    website: 'https://mit.edu',
    createdAt: new Date(),
  },
];

const mockCourses: Course[] = [
  {
    id: '1',
    universityId: '1',
    name: 'Computer Science',
    type: 'degree',
    duration: '4 years',
    isActive: true,
  },
  {
    id: '2',
    universityId: '1',
    name: 'Business Administration',
    type: 'degree',
    duration: '2 years',
    isActive: true,
  },
  {
    id: '3',
    universityId: '2',
    name: 'Philosophy',
    type: 'degree',
    duration: '3 years',
    isActive: true,
  },
  {
    id: '4',
    universityId: '2',
    name: 'Study Abroad Program',
    type: 'exchange',
    duration: '1 semester',
    isActive: true,
  },
  {
    id: '5',
    universityId: '3',
    name: 'Data Science',
    type: 'certification',
    duration: '6 months',
    isActive: true,
  },
];

export const useFormsData = () => {
  const [forms, setForms] = useState<ApplicationForm[]>([]);
  const [universities] = useState<University[]>(mockUniversities);
  const [courses] = useState<Course[]>(mockCourses);

  // Load forms from localStorage
  useEffect(() => {
    const savedForms = localStorage.getItem('acado_forms');
    if (savedForms) {
      setForms(JSON.parse(savedForms));
    }
  }, []);

  // Save forms to localStorage
  const saveForms = (updatedForms: ApplicationForm[]) => {
    setForms(updatedForms);
    localStorage.setItem('acado_forms', JSON.stringify(updatedForms));
  };

  const createForm = (form: ApplicationForm) => {
    const newForm = {
      ...form,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    saveForms([...forms, newForm]);
    return newForm.id;
  };

  const updateForm = (formId: string, updates: Partial<ApplicationForm>) => {
    const updatedForms = forms.map(form =>
      form.id === formId
        ? { ...form, ...updates, updatedAt: new Date() }
        : form
    );
    saveForms(updatedForms);
  };

  const deleteForm = (formId: string) => {
    saveForms(forms.filter(form => form.id !== formId));
  };

  const getFormById = (formId: string) => {
    return forms.find(form => form.id === formId);
  };

  return {
    forms,
    universities,
    courses,
    createForm,
    updateForm,
    deleteForm,
    getFormById,
  };
};