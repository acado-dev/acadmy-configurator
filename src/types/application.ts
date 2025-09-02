// Application form types for ACADO study abroad portal

export type FieldType = 
  | 'text' 
  | 'email' 
  | 'tel' 
  | 'number' 
  | 'date' 
  | 'select' 
  | 'multiselect' 
  | 'textarea' 
  | 'checkbox' 
  | 'radio' 
  | 'file'
  | 'country'
  | 'url';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max';
  value?: any;
  message: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ApplicationField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  description?: string;
  categoryId: string;
  subcategoryId?: string;
  order: number;
  isCustom?: boolean;
}

export interface FieldSubcategory {
  id: string;
  name: string;
  categoryId: string;
  order: number;
}

export interface FieldCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  subcategories?: FieldSubcategory[];
}

export interface ConfiguredField extends ApplicationField {
  customLabel?: string;
  isVisible: boolean;
  isRequired: boolean;
}

export interface ApplicationForm {
  id: string;
  name: string;
  description: string;
  universityId: string;
  courseIds: string[];
  categories: FieldCategory[];
  fields: ConfiguredField[];
  customCategoryNames?: Record<string, { name: string; subcategories?: Record<string, string> }>;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface University {
  id: string;
  name: string;
  country: string;
  logo?: string;
  website?: string;
  description?: string;
  createdAt: Date;
}

export interface Course {
  id: string;
  universityId: string;
  name: string;
  type: 'degree' | 'exchange' | 'pathway' | 'diploma' | 'certification';
  duration: string;
  description?: string;
  requirements?: string;
  applicationFormId?: string;
  isActive: boolean;
}