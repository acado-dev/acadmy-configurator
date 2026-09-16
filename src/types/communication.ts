export type CommunicationChannel = 'email' | 'sms' | 'whatsapp' | 'inbox';

export type TriggerCategory = 'account' | 'events' | 'applications';

export interface TriggerDefinition {
  key: string;
  label: string;
  category: TriggerCategory;
  description: string;
  variables: string[];
}

export interface ChannelContent {
  enabled: boolean;
  subject?: string;
  body: string;
  header?: string;
  footer?: string;
}

export type TemplateOwner = 'platform' | 'university';

/** Which universities a platform template is made available to. */
export interface TemplateAssignment {
  mode: 'all' | 'selected';
  universityIds: string[];
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  description: string;
  triggerKey: string;
  status: 'Active' | 'Inactive';
  owner: TemplateOwner;
  /** Set when owner === 'university' and this overrides a platform template */
  basedOnId?: string;
  universityId?: string;
  /** Mandatory / fixed: universities can neither edit nor disable it. */
  locked?: boolean;
  /** Availability of a platform template to universities. */
  assignedTo?: TemplateAssignment;
  channels: Record<CommunicationChannel, ChannelContent>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface MessageLogEntry {
  id: string;
  templateId: string;
  templateName: string;
  triggerKey: string;
  channel: CommunicationChannel;
  recipientName: string;
  recipientEmail: string;
  recipientMobile?: string;
  subject: string;
  body: string;
  status: 'Sent' | 'Failed' | 'Queued';
  sentAt: string;
}

export type InboxScope = 'student' | 'university' | 'admin';

export interface InboxMessage {
  id: string;
  threadId: string;
  fromName: string;
  fromScope: InboxScope | 'system';
  toName: string;
  toEmail: string;
  toScope: InboxScope;
  subject: string;
  body: string;
  triggerKey?: string;
  templateName?: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
}

export interface TriggerContext {
  name?: string;
  email?: string;
  mobile_number?: string;
  course?: string;
  university?: string;
  event_name?: string;
  event_date?: string;
  interview_datetime?: string;
  meeting_link?: string;
  document_name?: string;
  application_id?: string;
  deadline?: string;
  verification_link?: string;
  reset_link?: string;
  [key: string]: string | undefined;
}
