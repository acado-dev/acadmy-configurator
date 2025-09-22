import { useState, useEffect } from 'react';
import { ApplicationForm, University, Course } from '@/types/application';

// Mock data for demonstration
const mockUniversities: University[] = [
  {
    id: 'harvard',
    name: 'Harvard University',
    country: 'USA',
    website: 'https://harvard.edu',
    createdAt: new Date(),
  },
  {
    id: 'oxford',
    name: 'Oxford University',
    country: 'UK',
    website: 'https://ox.ac.uk',
    createdAt: new Date(),
  },
  {
    id: 'mit',
    name: 'MIT',
    country: 'USA',
    website: 'https://mit.edu',
    createdAt: new Date(),
  },
];

const mockCourses: Course[] = [
  {
    id: 'mba',
    universityId: 'harvard',
    name: 'MBA in International Business',
    type: 'degree',
    duration: '2 years',
    description: 'Full-time MBA program with focus on international business',
    requirements: 'Bachelor\'s degree with 3+ years work experience',
    isActive: true,
  },
  {
    id: 'mscs',
    universityId: 'harvard',
    name: 'MS in Computer Science',
    type: 'degree',
    duration: '18 months',
    description: 'Advanced program in computer science and artificial intelligence',
    requirements: 'Bachelor\'s in CS or related field',
    isActive: true,
  },
  {
    id: 'exchange-eng',
    universityId: 'harvard',
    name: 'Engineering Exchange Program',
    type: 'exchange',
    duration: '1 semester',
    description: 'International exchange program for engineering students',
    requirements: 'Currently enrolled in engineering program',
    isActive: true,
  },
  {
    id: 'pathway-business',
    universityId: 'harvard',
    name: 'Business Pathway Program',
    type: 'pathway',
    duration: '6 months',
    description: 'Preparatory program for business studies',
    requirements: 'High school diploma or equivalent',
    isActive: true,
  },
  {
    id: 'data-science',
    universityId: 'mit',
    name: 'Data Science Certificate',
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