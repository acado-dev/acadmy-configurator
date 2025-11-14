export type ScholarshipType = "merit" | "need_based" | "partial" | "full" | "fellowship" | "travel_grant";
export type ScholarshipStatus = "draft" | "active" | "inactive" | "completed" | "cancelled";
export type StudyLevel = "undergraduate" | "postgraduate" | "phd" | "short_course" | "any";
export type ApplicationMode = "online" | "offline";
export type StageType = "screening" | "assessment" | "interview" | "assignment";
export type ApplicantStatus = "applied" | "shortlisted" | "interviewed" | "selected" | "rejected";
export type UserRole = "super_admin" | "scholarship_manager" | "reviewer" | "editor" | "viewer";

export interface ScholarshipFormField {
  id: string;
  fieldType: "text" | "textarea" | "email" | "phone" | "file" | "url" | "dropdown";
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[]; // for dropdown
}

export interface ScholarshipStage {
  id: string;
  type: StageType;
  title: string;
  description?: string;
  order: number;
  deadline?: string;
  weightage: number; // percentage
  autoScore: boolean;
  reviewers: string[]; // user IDs
  passScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Applicant {
  id: string;
  scholarshipId: string;
  userId: string;
  userName: string;
  userEmail: string;
  data: Record<string, any>; // form data
  attachments: {
    fieldId: string;
    fileName: string;
    fileUrl: string;
  }[];
  status: ApplicantStatus;
  score?: number;
  compositeScore?: number;
  stageScores?: Record<string, number>; // stageId -> score
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Scholarship {
  id: string;
  
  // Basic Details
  categoryTags: string[];
  title: string;
  providerId: string;
  providerName: string;
  type: ScholarshipType;
  amount: number;
  currency: string;
  numberOfAwards: number;
  duration: string; // e.g., "12 months", "1 year", "one-time"
  studyLevel: StudyLevel;
  fieldsOfStudy: string[];
  
  // Dates
  applicationDeadline: string;
  startDate?: string; // award date
  endDate?: string;
  
  // Mode & Media
  mode: ApplicationMode;
  bannerUrl?: string;
  thumbnailUrl?: string;
  
  // Description
  shortDescription: string;
  description: string;
  
  // Application Form
  formFields: ScholarshipFormField[];
  applicationTemplateUrl?: string; // PDF template
  
  // Selection Stages
  stages: ScholarshipStage[];
  
  // Evaluation
  evaluationRules?: {
    passScore: number;
    tieBreakRules?: string;
    seatAllocationLogic?: string;
  };
  
  // Status & Visibility
  status: ScholarshipStatus;
  visibility: "public" | "organization" | "private";
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  
  // Analytics (mock)
  views?: number;
  applications?: number;
  shortlisted?: number;
  awarded?: number;
}
