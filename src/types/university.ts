// Comprehensive University Types based on ACADO structure

export type InstitutionType = 'University' | 'COE' | 'Industry' | 'School';

export interface UniversityDetails {
  id: string;
  // Basic Information
  name: string;
  shortName?: string;
  tagline?: string;
  foundedYear: number;
  logo?: string;
  coverImage?: string;
  templateImage?: string;
  brochureUrl?: string;
  website?: string;
  rating?: string;
  rank?: string;
  
  // Organization/Institution specific
  institutionType: InstitutionType;
  parentInstitutionId?: string;
  organizationLevel?: string;
  mobileNo?: string;
  primaryEmail?: string;
  address?: string;
  
  // Location
  location: {
    city: string;
    state?: string;
    country: string;
    campuses: Campus[];
  };
  
  // About Section
  about: {
    description: string;
    mission: string;
    values: string[];
    highlights: string[];
  };
  
  // Facts and Figures
  factsAndFigures: {
    totalStudents: number;
    internationalStudents: number;
    staffMembers: number;
    alumniCount: number;
    internationalPartnerships: number;
    partnerCountries: number;
    graduateEmployability: number; // percentage
    annualGraduates: number;
    researchBudget?: number;
  };
  
  // Community
  community: {
    description: string;
    studentCount: number;
    facultyCount: number;
    alumniInCountries: number;
    activeProjects: number;
  };
  
  // Fields of Education
  fieldsOfEducation: EducationField[];
  
  // Social Responsibility
  socialResponsibility: {
    description: string;
    commitments: string[];
    initiatives: string[];
  };
  
  // Student Testimonials
  testimonials: string[];
  
  // Rankings & Accreditations
  rankings?: Ranking[];
  accreditations?: Accreditation[];
  
  // Admission Information
  admissionInfo?: {
    applicationDeadlines: ApplicationDeadline[];
    requirements: string[];
    process: string[];
    internationalRequirements?: string[];
  };
  
  // Why Choose This University
  whyChooseUs?: {
    reasons: WhyReason[];
  };
  
  // Detailed Information Sections
  whyThisUniversity?: string;
  admission?: string;
  placements?: string;
  faq?: string;
  
  // Meta Information
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isVerified: boolean;
}

export interface Campus {
  id: string;
  name: string;
  location: string;
  specializations: string[];
  facilities?: string[];
}

export interface EducationField {
  id: string;
  name: string;
  description?: string;
  programs: string[];
  degrees: DegreeType[];
}

export interface Ranking {
  id: string;
  organization: string;
  rank: number;
  year: number;
  category?: string;
}

export interface Accreditation {
  id: string;
  name: string;
  organization: string;
  validUntil?: Date;
}

export interface ApplicationDeadline {
  id: string;
  program: string;
  deadline: Date;
  term: 'Fall' | 'Spring' | 'Summer' | 'Winter';
  year: number;
}

export interface WhyReason {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export type DegreeType = 'Bachelor' | 'Master' | 'PhD' | 'Diploma' | 'Certificate' | 'Professional';

// Form section types for managing the add/edit form
export interface UniversityFormSection {
  id: string;
  title: string;
  description?: string;
  icon: string;
  fields: UniversityFormField[];
  order: number;
  isRequired: boolean;
}

export interface UniversityFormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'multiselect' | 'date' | 'url' | 'file' | 'array';
  placeholder?: string;
  required: boolean;
  section: string;
  order: number;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: { value: string; label: string }[];
}