export interface PortfolioSection {
  id: string;
  type: 'about' | 'experience' | 'education' | 'projects' | 'certifications' | 'publications' | 'volunteering' | 'skills' | 'languages';
  data: any;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  publicationDate: string;
  authors: string[];
  link: string;
  description: string;
}

export interface Volunteering {
  id: string;
  role: string;
  organization: string;
  cause: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'professional' | 'native';
}

export interface Portfolio {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  about: string;
  profileImage: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  publications: Publication[];
  volunteering: Volunteering[];
  skills: Skill[];
  languages: Language[];
  resumes: Resume[];
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  name: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}