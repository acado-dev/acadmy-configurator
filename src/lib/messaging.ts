import {
  CommunicationChannel,
  InboxMessage,
  InboxScope,
  MessageLogEntry,
  TriggerContext,
} from '@/types/communication';
import {
  getEffectiveTemplate,
  renderTemplate,
  stripHtml,
} from './communicationTemplates';
import { getTriggerLabel } from './communicationTriggers';

const LOG_KEY = 'communicationMessageLog';
const INBOX_KEY = 'communicationInbox';

const uid = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/* ---------------- message log ---------------- */

export const getMessageLog = (): MessageLogEntry[] => {
  const stored = localStorage.getItem(LOG_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveMessageLog = (entries: MessageLogEntry[]) =>
  localStorage.setItem(LOG_KEY, JSON.stringify(entries));

export const clearMessageLog = () => saveMessageLog([]);

/* ---------------- inbox ---------------- */

export const getInboxMessages = (): InboxMessage[] => {
  const stored = localStorage.getItem(INBOX_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveInbox = (messages: InboxMessage[]) =>
  localStorage.setItem(INBOX_KEY, JSON.stringify(messages));

export const getMessagesForScope = (scope: InboxScope, email?: string) =>
  getInboxMessages()
    .filter((m) =>
      scope === 'student'
        ? m.toScope === 'student' && (!email || m.toEmail === email)
        : m.toScope === scope || m.fromScope === scope
    )
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

export const getThread = (threadId: string) =>
  getInboxMessages()
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));

export const markMessageRead = (id: string, read = true) => {
  const messages = getInboxMessages().map((m) => (m.id === id ? { ...m, read } : m));
  saveInbox(messages);
  return messages;
};

export const markThreadRead = (threadId: string) => {
  const messages = getInboxMessages().map((m) =>
    m.threadId === threadId ? { ...m, read: true } : m
  );
  saveInbox(messages);
  return messages;
};

export const setMessageArchived = (id: string, archived: boolean) => {
  const messages = getInboxMessages().map((m) =>
    m.id === id ? { ...m, archived } : m
  );
  saveInbox(messages);
  return messages;
};

export const deleteMessage = (id: string) => {
  const messages = getInboxMessages().filter((m) => m.id !== id);
  saveInbox(messages);
  return messages;
};

export interface SendMessageInput {
  threadId?: string;
  fromName: string;
  fromScope: InboxScope | 'system';
  toName: string;
  toEmail: string;
  toScope: InboxScope;
  subject: string;
  body: string;
  triggerKey?: string;
  groupLabel?: string;
  groupType?: string;
  groupRecipientNames?: string[];
  groupSendId?: string;
  templateName?: string;
  audience?: InboxMessage['audience'];
  groupMessageId?: string;
}

export const sendInboxMessage = (input: SendMessageInput): InboxMessage => {
  const message: InboxMessage = {
    id: uid('msg'),
    threadId: input.threadId || uid('thr'),
    fromName: input.fromName,
    fromScope: input.fromScope,
    toName: input.toName,
    groupLabel: input.groupLabel,
    groupType: input.groupType,
    groupRecipientNames: input.groupRecipientNames,
    groupSendId: input.groupSendId,
    toEmail: input.toEmail,
    toScope: input.toScope,
    subject: input.subject,
    body: input.body,
    triggerKey: input.triggerKey,
    templateName: input.templateName,
    audience: input.audience,
    groupMessageId: input.groupMessageId,
    read: false,
    archived: false,
    createdAt: new Date().toISOString(),
  };
  saveInbox([...getInboxMessages(), message]);
  return message;
};

/* ---------------- trigger dispatch ---------------- */

export interface TriggerResult {
  channels: CommunicationChannel[];
  templateName?: string;
}

/**
 * Fires a communication trigger: renders the effective template for every
 * enabled channel, records it in the message log and, when the inbox channel
 * is on, drops a real message into the recipient's platform inbox.
 */
export const triggerCommunication = (
  triggerKey: string,
  context: TriggerContext = {},
  options: { scope?: 'platform' | 'university'; senderName?: string } = {}
): TriggerResult => {
  const template = getEffectiveTemplate(triggerKey, options.scope ?? 'university');
  if (!template) return { channels: [] };

  const recipientName = context.name ?? 'Candidate';
  const recipientEmail = context.email ?? 'candidate@example.com';
  const log = getMessageLog();
  const fired: CommunicationChannel[] = [];

  (['email', 'sms', 'whatsapp', 'inbox'] as CommunicationChannel[]).forEach((channel) => {
    const content = template.channels[channel];
    if (!content?.enabled || !content.body) return;
    const subject = renderTemplate(content.subject ?? template.name, context);
    const body = renderTemplate(content.body, context);
    fired.push(channel);
    log.unshift({
      id: uid('log'),
      templateId: template.id,
      templateName: template.name,
      triggerKey,
      channel,
      recipientName,
      recipientEmail,
      recipientMobile: context.mobile_number,
      subject,
      body,
      status: 'Sent',
      sentAt: new Date().toISOString(),
    });

    if (channel === 'inbox') {
      sendInboxMessage({
        fromName: options.senderName ?? context.university ?? 'ACADO',
        fromScope: 'system',
        toName: recipientName,
        toEmail: recipientEmail,
        toScope: 'student',
        subject,
        body,
        triggerKey,
        templateName: template.name,
      });
    }
  });

  saveMessageLog(log.slice(0, 500));
  return { channels: fired, templateName: template.name };
};

export const triggerSummary = (result: TriggerResult) =>
  result.channels.length
    ? `Sent via ${result.channels.join(', ')}`
    : 'No active template for this trigger';

/* ---------------- seeding ---------------- */

export const seedMessagingIfEmpty = () => {
  if (localStorage.getItem(INBOX_KEY)) return;
  saveInbox([]);
  const seedTriggers: Array<[string, TriggerContext]> = [
    ['user_registration', { name: 'Jane Smith', email: 'jane.smith@example.com' }],
    [
      'application_submitted',
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        course: 'MSc Artificial Intelligence',
        application_id: 'APP-002',
      },
    ],
    [
      'document_requested',
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        document_name: 'English Proficiency Score',
        application_id: 'APP-002',
        deadline: '30 Oct 2026',
      },
    ],
    [
      'interview_scheduled',
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        course: 'MSc Artificial Intelligence',
        interview_datetime: '28 Oct 2026, 3:30 PM',
      },
    ],
  ];
  seedTriggers.forEach(([key, ctx]) => triggerCommunication(key, ctx));
};

export const getUnreadCount = (scope: InboxScope, email?: string) =>
  getMessagesForScope(scope, email).filter((m) => !m.read && !m.archived).length;

export const inboxPreview = (body: string) => stripHtml(body).slice(0, 120);

export const triggerLabel = getTriggerLabel;
