export interface EmailTemplate {
  id: string;
  templateName: string;
  emailSubject: string;
  description: string;
  mailBody: string;
  status: 'Active' | 'Inactive';
  purpose: EmailPurpose;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type EmailPurpose = 
  | 'Event Registration'
  | 'Course Reminder'
  | 'Payment Confirmation'
  | 'Generic Campaign'
  | 'Scholarship Notification'
  | 'Application Update'
  | 'Welcome Email'
  | 'Password Reset'
  | 'Course Completion'
  | 'Certificate Issued';

export interface BulkEmailJob {
  id: string;
  purpose: string;
  templateId: string;
  templateName: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'Processing' | 'Completed' | 'Failed' | 'Queued';
  totalRecords: number;
  successCount: number;
  failureCount: number;
  csvFileName: string;
  csvData: CSVRow[];
  results?: EmailSendResult[];
}

export interface CSVRow {
  email: string;
  name: string;
  mobile_number: string;
}

export interface EmailSendResult extends CSVRow {
  status: 'Success' | 'Failed';
  errorMessage?: string;
}
