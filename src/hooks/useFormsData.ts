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

// Mock forms data
const generateMockForms = (): ApplicationForm[] => [
  {
    id: 'form-1',
    name: 'MBA Application Form 2024',
    description: 'Application form for MBA International Business program',
    universityId: 'harvard',
    courseIds: ['mba'],
    categories: [],
    fields: [],
    isLaunched: true,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'form-2',
    name: 'Computer Science Masters Application',
    description: 'Application form for MS in Computer Science program',
    universityId: 'harvard',
    courseIds: ['mscs'],
    categories: [],
    fields: [],
    isLaunched: true,
    isActive: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: 'form-3',
    name: 'Engineering Exchange Application',
    description: 'Application form for Engineering Exchange Program',
    universityId: 'harvard',
    courseIds: ['exchange-eng'],
    categories: [],
    fields: [],
    isLaunched: true,
    isActive: true,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: 'form-4',
    name: 'MIT Data Science Certificate Application',
    description: 'Application form for Data Science Certificate program',
    universityId: 'mit',
    courseIds: ['data-science'],
    categories: [],
    fields: [],
    isLaunched: true,
    isActive: true,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
  },
];

export const useFormsData = () => {
  const [forms, setForms] = useState<ApplicationForm[]>([]);
  const [universities] = useState<University[]>(mockUniversities);
  const [courses] = useState<Course[]>(mockCourses);

  // Load forms from localStorage
  useEffect(() => {
    const savedForms = localStorage.getItem('acado_forms');
    const dataVersion = localStorage.getItem('acado_forms_version');
    
    // Force reload with new mock data if version changed
    if (savedForms && dataVersion === '2') {
      setForms(JSON.parse(savedForms));
    } else {
      // Initialize with mock data
      const mockForms = generateMockForms();
      setForms(mockForms);
      localStorage.setItem('acado_forms', JSON.stringify(mockForms));
      localStorage.setItem('acado_forms_version', '2');
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