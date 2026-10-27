// Comprehensive University Types based on ACADO structure

export type InstitutionType = 'University' | 'COE' | 'Industry' | 'School';

export interface UniversityDetails {
  id: string;
  // Basic Information
  name: string;
  shortName?: string;
  tagline?: string;
  slug?: string;
  foundedYear: number;
  logo?: string;
  coverImage?: string;
  heroImageAlt?: string;
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

  // Facts & Overview (configurable)
  keyStatistics?: KeyStatistic[];
  atAGlanceFacts?: string[];
  overviewCallout?: string;
  sectionOrder?: string[];

  // Highlights (repeatable cards)
  highlightCards?: HighlightCard[];

  // Campus, Video & Gallery
  video?: UniversityVideo;
  gallery?: GalleryImage[];

  // International Partners
  internationalPartners?: InternationalPartner[];

  // Admissions & Support
  admissionCards?: AdmissionCard[];
  applicationRequirements?: string;
  admissionContact?: AdmissionContact;
  faqs?: UniversityFaq[];

  
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
  description?: string;
  specializations: string[];
  facilities?: string[];
}

// Configurable key statistic shown in Facts & Overview
export interface KeyStatistic {
  id: string;
  label: string;
  value: string;
  unit?: string;
  context?: string; // supporting context / period, e.g. "2025 intake"
}

// Repeatable highlight card ("What makes us stand out")
export interface HighlightCard {
  id: string;
  title: string;
  description: string;
  detailedContent?: string; // optional expanded / modal content
  image?: string;
  order: number;
}

// University video block
export interface UniversityVideo {
  title?: string;
  url?: string;
  poster?: string;
  caption?: string;
}

// Photo gallery entry
export interface GalleryImage {
  id: string;
  image: string;
  alt?: string;
  caption?: string;
  order: number;
}

// International partner entry
export interface InternationalPartner {
  id: string;
  name: string;
  type?: string; // category, e.g. "Alliance", "Exchange Partner"
  description?: string;
  logo?: string;
}

// Admissions information card
export interface AdmissionCard {
  id: string;
  title: string;
  description: string;
  detailedContent?: string;
  icon?: string;
}

// Admissions contact details
export interface AdmissionContact {
  email?: string;
  phone?: string;
}

// Structured FAQ entry
export interface UniversityFaq {
  id: string;
  question: string;
  answer: string;
  order: number;
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