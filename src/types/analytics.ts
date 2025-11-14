export interface SummaryCard {
  label: string;
  value: number | string;
  delta?: number;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface TimeSeriesData {
  date: string;
  activeUsers: number;
  newSignups: number;
}

export interface CourseCompletionData {
  courseName: string;
  completionRate: number;
  enrolled: number;
  completed: number;
}

export interface ContentEngagementData {
  type: string;
  value: number;
  color: string;
}

export interface TopContent {
  id: string;
  title: string;
  type: string;
  views: number;
  completions: number;
}

export interface EventScholarshipSummary {
  id: string;
  title: string;
  type: string;
  date: string;
  registrations: number;
  capacity: number;
}

export interface LearningFunnelData {
  stage: string;
  count: number;
  percentage: number;
}

export interface GeographyData {
  region: string;
  users: number;
}

export interface ReelEngagement {
  id: string;
  title: string;
  plays: number;
  likes: number;
  comments: number;
}

export interface AlertItem {
  id: string;
  type: 'warning' | 'info' | 'error';
  message: string;
  timestamp: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'course' | 'content' | 'event' | 'scholarship' | 'user' | 'engagement';
  fields: string[];
}

export interface ReportFilter {
  dateRange: { start: string; end: string };
  organization?: string;
  courseId?: string;
  eventId?: string;
  scholarshipId?: string;
  status?: string;
  language?: string;
}

export interface InterestedUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  organization: string;
  educationQualification: string;
  interestedCategories: string[];
  dateOfInterest: string;
}

export interface EducationLevelSummary {
  level: string;
  count: number;
  icon: string;
}
