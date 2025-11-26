export interface Assessment {
  id: string;
  title: string;
  courseName: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  score?: number;
  maxScore: number;
  attempts: number;
  deadline: string;
  completedAt?: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseName: string;
  status: 'Not Submitted' | 'Submitted' | 'Graded';
  dueDate: string;
  submittedAt?: string;
  grade?: string;
  score?: number;
  maxScore: number;
  attachments?: string[];
}

export interface LoginHistory {
  id: string;
  timestamp: string;
  deviceType: string;
  location: string;
  ipAddress: string;
  status: 'Success' | 'Failed';
}

export interface FailedLogin {
  id: string;
  timestamp: string;
  method: string;
  reason: string;
  ipAddress: string;
  deviceType: string;
}

export interface ProgramEnrollment {
  id: string;
  programName: string;
  enrolledAt: string;
  status: 'Active' | 'Completed' | 'Expired';
  progress: number;
  certificateId?: string;
}

export interface LearningProgress {
  totalEnrolled: number;
  totalCompleted: number;
  certificatesEarned: number;
  activeEnrollments: number;
  expiredEnrollments: number;
}

export interface UserDetail {
  enrollmentNumber?: string;
  department?: string;
  abcId?: string;
  aadhaarNumber?: string;
  fatherName?: string;
  fatherOccupation?: string;
  fatherContact?: string;
  fatherEmail?: string;
  motherName?: string;
  motherOccupation?: string;
  motherContact?: string;
  motherEmail?: string;
  guardianName?: string;
  guardianOccupation?: string;
  guardianContact?: string;
  guardianEmail?: string;
  expertise?: string;
}
