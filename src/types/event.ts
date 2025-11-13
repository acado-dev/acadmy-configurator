export type EventMode = "online" | "offline" | "hybrid";
export type EventStatus = "draft" | "active" | "completed" | "cancelled";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type SubscriptionType = "free" | "paid";
export type StageType = "assessment" | "submission" | "video" | "notes" | "live_session";
export type StageStatus = "draft" | "ready";
export type EligibilityType = "everyone" | "students" | "professionals" | "custom";
export type RegistrationApproval = "auto" | "manual";

export interface EventStage {
  id: string;
  type: StageType;
  title: string;
  description?: string;
  order: number;
  status: StageStatus;
  resourceId?: string; // Link to assessment/assignment/etc
  duration?: number; // in minutes
  points?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  // Basic Details
  logo?: string;
  title: string;
  categoryTags: string[];
  conductedBy: string;
  functionalDomain: string;
  jobRole: string;
  skills: string[];
  difficultyLevel: DifficultyLevel;
  subscriptionType: SubscriptionType;
  isPopular: boolean;
  
  // Description Blocks
  description: string;
  whatsInItForYou?: string;
  instructions?: string;
  faq?: string;
  
  // Schedule & Mode
  registrationStartDate: string;
  registrationEndDate: string;
  eventDate: string;
  eventTime: string;
  mode: EventMode;
  venue?: string;
  
  // Other Details
  expertId?: string;
  expertName?: string;
  additionalInfo?: string;
  
  // Eligibility
  eligibility: {
    type: EligibilityType;
    colleges?: string[];
    organizations?: string[];
    genderRestriction?: "all" | "male" | "female" | "other";
  };
  
  // Registration Settings
  registrationSettings: {
    approval: RegistrationApproval;
    maxSeats?: number;
    enableWaitlist: boolean;
    cutoffLogic?: string;
    eventFee?: number;
  };
  
  // Stages
  stages: EventStage[];
  
  // Status & Metadata
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  createdBy: string;
  
  // Analytics (mock)
  registrations?: number;
  views?: number;
  completions?: number;
}
