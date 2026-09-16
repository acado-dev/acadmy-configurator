import { TriggerDefinition, TriggerCategory } from '@/types/communication';

const COMMON = ['name', 'email', 'mobile_number'];

export const TRIGGER_CATEGORY_LABELS: Record<TriggerCategory, string> = {
  account: 'Account & Access',
  events: 'Events',
  applications: 'Applications & Enrollment',
};

export const COMMUNICATION_TRIGGERS: TriggerDefinition[] = [
  // Account
  {
    key: 'user_registration',
    label: 'New User Registration (Welcome)',
    category: 'account',
    description: 'Sent right after a learner creates an account.',
    variables: [...COMMON, 'university'],
  },
  {
    key: 'account_verification',
    label: 'Account Verification',
    category: 'account',
    description: 'Asks the learner to verify their email address.',
    variables: [...COMMON, 'verification_link'],
  },
  {
    key: 'forgot_password',
    label: 'Forgot Password',
    category: 'account',
    description: 'Password reset link requested by the user.',
    variables: [...COMMON, 'reset_link'],
  },
  {
    key: 'password_changed',
    label: 'Password Changed',
    category: 'account',
    description: 'Confirmation that the account password was updated.',
    variables: COMMON,
  },
  // Events
  {
    key: 'event_published',
    label: 'New Event Published',
    category: 'events',
    description: 'A new event goes live on the platform.',
    variables: [...COMMON, 'event_name', 'event_date', 'university'],
  },
  {
    key: 'event_schedule_set',
    label: 'Event Schedule Published',
    category: 'events',
    description: 'The schedule / agenda for an event is available.',
    variables: [...COMMON, 'event_name', 'event_date'],
  },
  {
    key: 'event_updated',
    label: 'Event Updated',
    category: 'events',
    description: 'Date, venue or details of an event changed.',
    variables: [...COMMON, 'event_name', 'event_date'],
  },
  {
    key: 'event_reminder',
    label: 'Event Reminder',
    category: 'events',
    description: 'Reminder shortly before the event starts.',
    variables: [...COMMON, 'event_name', 'event_date', 'meeting_link'],
  },
  {
    key: 'event_registration_confirmed',
    label: 'Event Registration Confirmed',
    category: 'events',
    description: 'Confirms a learner registered for an event.',
    variables: [...COMMON, 'event_name', 'event_date'],
  },
  {
    key: 'event_activity_open',
    label: 'Event Activity / Stage Open',
    category: 'events',
    description: 'An activity or stage in the event is now open to attempt.',
    variables: [...COMMON, 'event_name', 'deadline'],
  },
  // Applications
  {
    key: 'application_submitted',
    label: 'Application Submitted',
    category: 'applications',
    description: 'Acknowledges a submitted application.',
    variables: [...COMMON, 'course', 'university', 'application_id'],
  },
  {
    key: 'application_shortlisted',
    label: 'Application Shortlisted',
    category: 'applications',
    description: 'The candidate has been shortlisted.',
    variables: [...COMMON, 'course', 'university', 'application_id'],
  },
  {
    key: 'document_requested',
    label: 'Document Requested',
    category: 'applications',
    description: 'A document is required from the candidate.',
    variables: [...COMMON, 'document_name', 'application_id', 'deadline'],
  },
  {
    key: 'document_accepted',
    label: 'Document Received / Accepted',
    category: 'applications',
    description: 'A requested document has been accepted.',
    variables: [...COMMON, 'document_name', 'application_id'],
  },
  {
    key: 'assessment_invite',
    label: 'Assessment Invite',
    category: 'applications',
    description: 'Invites the candidate to attempt an assessment.',
    variables: [...COMMON, 'course', 'deadline', 'meeting_link'],
  },
  {
    key: 'assignment_invite',
    label: 'Assignment Invite',
    category: 'applications',
    description: 'Shares an assignment with the candidate.',
    variables: [...COMMON, 'course', 'deadline'],
  },
  {
    key: 'interview_scheduled',
    label: 'Interview Scheduled',
    category: 'applications',
    description: 'Interview slot confirmed with joining details.',
    variables: [...COMMON, 'course', 'interview_datetime', 'meeting_link'],
  },
  {
    key: 'interview_rescheduled',
    label: 'Interview Rescheduled',
    category: 'applications',
    description: 'The interview slot has moved.',
    variables: [...COMMON, 'course', 'interview_datetime', 'meeting_link'],
  },
  {
    key: 'application_on_hold',
    label: 'Application On Hold',
    category: 'applications',
    description: 'The application is kept on hold for now.',
    variables: [...COMMON, 'course', 'application_id'],
  },
  {
    key: 'acceptance_letter',
    label: 'Offer / Acceptance Letter',
    category: 'applications',
    description: 'Offer of admission with the acceptance letter.',
    variables: [...COMMON, 'course', 'university', 'application_id', 'deadline'],
  },
  {
    key: 'application_rejected',
    label: 'Application Rejected',
    category: 'applications',
    description: 'The application was not taken forward.',
    variables: [...COMMON, 'course', 'university'],
  },
  {
    key: 'enrollment_confirmed',
    label: 'Enrollment Confirmed',
    category: 'applications',
    description: 'The candidate has completed enrollment.',
    variables: [...COMMON, 'course', 'university'],
  },
];

export const getTrigger = (key: string) =>
  COMMUNICATION_TRIGGERS.find((t) => t.key === key);

export const getTriggerLabel = (key: string) => getTrigger(key)?.label ?? key;

export const ALL_VARIABLES = [
  'name',
  'email',
  'mobile_number',
  'course',
  'university',
  'event_name',
  'event_date',
  'interview_datetime',
  'meeting_link',
  'document_name',
  'application_id',
  'deadline',
  'verification_link',
  'reset_link',
];

export const SAMPLE_CONTEXT: Record<string, string> = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  mobile_number: '+91 98765 43210',
  course: 'MSc Artificial Intelligence',
  university: 'ACADO Institute of Technology',
  event_name: 'Global Admissions Open Day',
  event_date: '24 Oct 2026, 10:00 AM',
  interview_datetime: '28 Oct 2026, 3:30 PM',
  meeting_link: 'https://meet.acado.ai/interview/8823',
  document_name: 'English Proficiency Score',
  application_id: 'APP-002',
  deadline: '30 Oct 2026',
  verification_link: 'https://acado.ai/verify/abc123',
  reset_link: 'https://acado.ai/reset/xyz789',
};
