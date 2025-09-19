// University Admin Types

export interface UniversityAdmin {
  id: string;
  universityId: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  module: 'courses' | 'forms' | 'applications' | 'settings';
  actions: ('view' | 'create' | 'edit' | 'delete')[];
}

export interface MatchingCriteria {
  id: string;
  courseId: string;
  formId: string;
  criteria: CriteriaRule[];
  weightings: Record<string, number>;
  minimumScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CriteriaRule {
  id: string;
  fieldId: string;
  fieldName: string;
  type: 'required' | 'preferred' | 'weighted';
  weight: number;
  conditions: MatchCondition[];
}

export interface MatchCondition {
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  value: any;
  score: number;
}

export interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  formId: string;
  submittedData: Record<string, any>;
  matchScore: number;
  matchDetails: MatchDetail[];
  status: ApplicationStatus;
  nextSteps: NextStep[];
  documents: ApplicationDocument[];
  communications: Communication[];
  submittedAt: Date;
  updatedAt: Date;
}

export type ApplicationStatus = 
  | 'submitted'
  | 'under_review'
  | 'document_requested'
  | 'interview_scheduled'
  | 'shortlisted'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface MatchDetail {
  fieldName: string;
  fieldValue: any;
  criteriaType: string;
  matched: boolean;
  score: number;
  maxScore: number;
  notes?: string;
}

export interface NextStep {
  id: string;
  type: 'document_request' | 'clarification' | 'interview' | 'notification';
  title: string;
  description: string;
  dueDate?: Date;
  status: 'pending' | 'completed' | 'overdue';
  assignedTo?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  requestedAt?: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewNotes?: string;
}

export interface Communication {
  id: string;
  type: 'email' | 'message' | 'notification';
  subject: string;
  content: string;
  sender: 'university' | 'applicant';
  sentAt: Date;
  readAt?: Date;
  attachments?: string[];
}

export interface AcceptanceLetter {
  id: string;
  applicationId: string;
  templateId: string;
  content: string;
  issuedDate: Date;
  validUntil?: Date;
  conditions?: string[];
  digitalSignature?: string;
  downloadUrl?: string;
}