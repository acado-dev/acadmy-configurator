// Candidate profile types for Talent Pool Management

export type ApplicationStage = 
  | 'Lead' 
  | 'Counseling Done' 
  | 'Documents Submitted' 
  | 'Applied' 
  | 'Offer Received' 
  | 'Visa Stage' 
  | 'Enrolled';

export type ProgramLevel = 'UG' | 'PG' | 'Diploma' | 'Certification';

export type EligibilityStatus = 'Eligible' | 'Needs Improvement' | 'Not Eligible';

export type FundingCategory = 'Self-funded' | 'Loan Required' | 'Scholarship Seeking';

export interface AcademicRecord {
  level: string; // e.g., '10th', '12th', 'Bachelor', 'Master'
  institution: string;
  board?: string;
  percentage?: number;
  cgpa?: number;
  yearOfCompletion: string;
  stream?: string;
}

export interface ExamScore {
  examType: 'IELTS' | 'TOEFL' | 'Duolingo' | 'SAT' | 'GRE' | 'GMAT' | 'PTE';
  score: string;
  band?: number; // For IELTS
  date: string;
  expiryDate?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description?: string;
}

export interface FinancialInfo {
  budget: number;
  currency: string;
  sponsors?: string;
  bankStatementAvailable: boolean;
}

export interface UploadedDocument {
  id: string;
  type: 'CV' | 'SOP' | 'LOR' | 'Transcript' | 'Certificate' | 'Passport' | 'Bank Statement' | 'Other';
  name: string;
  url: string;
  uploadedAt: string;
}

export interface CommunicationLog {
  id: string;
  type: 'email' | 'call' | 'note' | 'status_change';
  subject?: string;
  content: string;
  timestamp: string;
  counselorName?: string;
}

export interface ProgramRecommendation {
  id: string;
  programName: string;
  university: string;
  country: string;
  tuitionFee: number;
  duration: string;
  matchScore: number; // 0-100
  admissionDifficulty: 'Easy' | 'Medium' | 'Hard';
  scholarshipAvailable: boolean;
  matchReasons: string[];
  requiredImprovements?: string[];
}

export interface CandidateProfile {
  id: string;
  
  // Basic Information
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  passportNumber?: string;
  currentLocation: string;
  profilePhoto?: string;
  
  // Preferences
  intendedProgram: string;
  programLevel: ProgramLevel;
  preferredCountries: string[];
  interests: string[];
  careerAspirations?: string;
  
  // Academic Information
  academicRecords: AcademicRecord[];
  examScores: ExamScore[];
  
  // Professional Information
  workExperience?: WorkExperience[];
  skills?: string[];
  
  // Financial Information
  financialInfo: FinancialInfo;
  
  // Documents
  documents: UploadedDocument[];
  
  // Statement of Purpose
  sop?: string;
  
  // Status & Tracking
  applicationStage: ApplicationStage;
  eligibilityStatus: EligibilityStatus;
  isVerified: boolean;
  isShortlisted: boolean;
  scholarshipEligible: boolean;
  
  // Program Matching
  recommendedPrograms?: ProgramRecommendation[];
  assignedPrograms?: string[];
  
  // Communication
  assignedCounselor?: string;
  communicationLogs: CommunicationLog[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastActive?: string;
  notes?: string;
}

export interface TalentPoolStats {
  totalCandidates: number;
  verifiedProfiles: number;
  shortlistedForPrograms: number;
  applicantsInProgress: number;
  acceptedOfferReceived: number;
  scholarshipEligible: number;
}
