import {
  ChannelContent,
  CommunicationChannel,
  CommunicationTemplate,
} from '@/types/communication';
import { COMMUNICATION_TRIGGERS, SAMPLE_CONTEXT } from './communicationTriggers';

const STORAGE_KEY = 'communicationTemplates';

export const CHANNEL_LABELS: Record<CommunicationChannel, string> = {
  email: 'Email',
  sms: 'SMS',
  whatsapp: 'WhatsApp',
  inbox: 'Inbox',
};

export const CHANNELS: CommunicationChannel[] = ['email', 'sms', 'whatsapp', 'inbox'];

export const emptyChannels = (): Record<CommunicationChannel, ChannelContent> => ({
  email: { enabled: true, subject: '', body: '' },
  sms: { enabled: false, body: '' },
  whatsapp: { enabled: false, body: '', header: '', footer: '' },
  inbox: { enabled: true, subject: '', body: '' },
});

const DEFAULT_COPY: Record<string, { subject: string; body: string; sms: string }> = {
  user_registration: {
    subject: 'Welcome to ACADO, {{name}}!',
    body: '<p>Hi {{name}},</p><p>Welcome to ACADO. Your account is ready — you can now explore courses, apply to programmes and track every application in one place.</p><p>Happy learning!</p>',
    sms: 'Hi {{name}}, welcome to ACADO! Your account is ready. Sign in to explore courses and apply.',
  },
  account_verification: {
    subject: 'Verify your ACADO account',
    body: '<p>Hi {{name}},</p><p>Please verify your email address to activate your ACADO account: <a href="{{verification_link}}">Verify my account</a></p><p>This link is valid for 24 hours.</p>',
    sms: 'ACADO: verify your account using this link {{verification_link}} (valid 24h).',
  },
  forgot_password: {
    subject: 'Reset your ACADO password',
    body: '<p>Hi {{name}},</p><p>We received a request to reset your password. <a href="{{reset_link}}">Set a new password</a></p><p>If you did not request this, you can safely ignore this message.</p>',
    sms: 'ACADO: reset your password here {{reset_link}}. Ignore if you did not request it.',
  },
  password_changed: {
    subject: 'Your ACADO password was changed',
    body: '<p>Hi {{name}},</p><p>Your password was updated successfully. If this was not you, please contact support immediately.</p>',
    sms: 'ACADO: your password was changed. Contact support if this was not you.',
  },
  event_published: {
    subject: 'New event: {{event_name}}',
    body: '<p>Hi {{name}},</p><p>{{university}} has announced <strong>{{event_name}}</strong> on {{event_date}}. Register now to secure your spot.</p>',
    sms: 'New ACADO event: {{event_name}} on {{event_date}}. Register now.',
  },
  event_schedule_set: {
    subject: 'Schedule for {{event_name}} is live',
    body: '<p>Hi {{name}},</p><p>The agenda for <strong>{{event_name}}</strong> ({{event_date}}) is now available. Please review the sessions and plan your day.</p>',
    sms: 'Schedule for {{event_name}} on {{event_date}} is now available on ACADO.',
  },
  event_updated: {
    subject: 'Update to {{event_name}}',
    body: '<p>Hi {{name}},</p><p>Details for <strong>{{event_name}}</strong> have changed. The event is now scheduled for {{event_date}}. Please check the event page for the latest information.</p>',
    sms: 'Update: {{event_name}} is now on {{event_date}}. Check ACADO for details.',
  },
  event_reminder: {
    subject: 'Reminder: {{event_name}} starts soon',
    body: '<p>Hi {{name}},</p><p>This is a reminder that <strong>{{event_name}}</strong> begins on {{event_date}}. Join here: <a href="{{meeting_link}}">{{meeting_link}}</a></p>',
    sms: 'Reminder: {{event_name}} starts {{event_date}}. Join: {{meeting_link}}',
  },
  event_registration_confirmed: {
    subject: 'You are registered for {{event_name}}',
    body: '<p>Hi {{name}},</p><p>Your registration for <strong>{{event_name}}</strong> on {{event_date}} is confirmed. We look forward to seeing you there.</p>',
    sms: 'Registration confirmed for {{event_name}} on {{event_date}}.',
  },
  event_activity_open: {
    subject: '{{event_name}}: a new activity is open',
    body: '<p>Hi {{name}},</p><p>A new activity in <strong>{{event_name}}</strong> is now open for submission. Please complete it before {{deadline}}.</p>',
    sms: '{{event_name}}: new activity open. Submit before {{deadline}}.',
  },
  application_submitted: {
    subject: 'Application received — {{course}}',
    body: '<p>Hi {{name}},</p><p>We have received your application ({{application_id}}) for <strong>{{course}}</strong> at {{university}}. Our team will review it and keep you updated.</p>',
    sms: 'ACADO: application {{application_id}} for {{course}} received. We will keep you updated.',
  },
  application_shortlisted: {
    subject: 'Great news — you have been shortlisted for {{course}}',
    body: '<p>Hi {{name}},</p><p>Congratulations! Your application {{application_id}} for <strong>{{course}}</strong> at {{university}} has been shortlisted. Watch this space for the next steps.</p>',
    sms: 'Congratulations {{name}}! You are shortlisted for {{course}}. Next steps to follow.',
  },
  document_requested: {
    subject: 'Document required: {{document_name}}',
    body: '<p>Hi {{name}},</p><p>To continue with application {{application_id}}, please upload <strong>{{document_name}}</strong> by {{deadline}}. You can upload it from your ACADO inbox or application page.</p>',
    sms: 'ACADO: please upload {{document_name}} for {{application_id}} by {{deadline}}.',
  },
  document_accepted: {
    subject: '{{document_name}} accepted',
    body: '<p>Hi {{name}},</p><p>Thank you — <strong>{{document_name}}</strong> for application {{application_id}} has been reviewed and accepted.</p>',
    sms: 'ACADO: {{document_name}} accepted for {{application_id}}. Thank you.',
  },
  assessment_invite: {
    subject: 'Your assessment for {{course}}',
    body: '<p>Hi {{name}},</p><p>You have been invited to complete the assessment for <strong>{{course}}</strong>. Please finish it before {{deadline}}.</p>',
    sms: 'ACADO: complete your {{course}} assessment before {{deadline}}.',
  },
  assignment_invite: {
    subject: 'Assignment for {{course}}',
    body: '<p>Hi {{name}},</p><p>An assignment has been shared with you as part of your application for <strong>{{course}}</strong>. Submission deadline: {{deadline}}.</p>',
    sms: 'ACADO: assignment shared for {{course}}. Submit by {{deadline}}.',
  },
  interview_scheduled: {
    subject: 'Interview scheduled — {{course}}',
    body: '<p>Hi {{name}},</p><p>Your interview for <strong>{{course}}</strong> is scheduled for {{interview_datetime}}. Join using this link: <a href="{{meeting_link}}">{{meeting_link}}</a></p>',
    sms: 'Interview for {{course}} on {{interview_datetime}}. Join: {{meeting_link}}',
  },
  interview_rescheduled: {
    subject: 'Your interview has been rescheduled',
    body: '<p>Hi {{name}},</p><p>Your interview for <strong>{{course}}</strong> has moved to {{interview_datetime}}. New joining link: <a href="{{meeting_link}}">{{meeting_link}}</a></p>',
    sms: 'Interview for {{course}} moved to {{interview_datetime}}. Link: {{meeting_link}}',
  },
  application_on_hold: {
    subject: 'Update on your application {{application_id}}',
    body: '<p>Hi {{name}},</p><p>Your application for <strong>{{course}}</strong> is currently on hold while we complete our review. We will get back to you shortly.</p>',
    sms: 'ACADO: application {{application_id}} for {{course}} is on hold. We will update you soon.',
  },
  acceptance_letter: {
    subject: 'Congratulations! Offer of admission for {{course}}',
    body: '<p>Hi {{name}},</p><p>We are delighted to offer you a place in <strong>{{course}}</strong> at {{university}}. Your acceptance letter is available in your ACADO account. Please confirm your seat by {{deadline}}.</p>',
    sms: 'Congratulations! You are offered admission to {{course}}. Confirm by {{deadline}}.',
  },
  application_rejected: {
    subject: 'Update on your application for {{course}}',
    body: '<p>Hi {{name}},</p><p>Thank you for applying to <strong>{{course}}</strong> at {{university}}. After careful review we are unable to take your application forward this time. We wish you the very best.</p>',
    sms: 'ACADO: your application for {{course}} was not taken forward. Thank you for applying.',
  },
  enrollment_confirmed: {
    subject: 'Welcome aboard — enrollment confirmed',
    body: '<p>Hi {{name}},</p><p>Your enrollment in <strong>{{course}}</strong> at {{university}} is confirmed. Your student workspace is ready with the next steps.</p>',
    sms: 'Enrollment confirmed for {{course}} at {{university}}. Welcome aboard!',
  },
};

/** Triggers whose wording is fixed by the platform and cannot be changed by a university. */
const MANDATORY_TRIGGERS = [
  'user_registration',
  'account_verification',
  'forgot_password',
  'password_changed',
];

const buildDefaultTemplate = (triggerKey: string, index: number): CommunicationTemplate => {
  const trigger = COMMUNICATION_TRIGGERS.find((t) => t.key === triggerKey)!;
  const copy = DEFAULT_COPY[triggerKey];
  const now = new Date().toISOString();
  return {
    id: `tpl-${triggerKey}`,
    name: trigger.label,
    description: trigger.description,
    triggerKey,
    status: 'Active',
    owner: 'platform',
    locked: MANDATORY_TRIGGERS.includes(triggerKey),
    assignedTo: { mode: 'all', universityIds: [] },
    channels: {
      email: { enabled: true, subject: copy.subject, body: copy.body },
      sms: { enabled: trigger.category !== 'events', body: copy.sms },
      whatsapp: {
        enabled: trigger.category === 'applications',
        body: copy.sms,
        header: 'ACADO',
        footer: 'Reply STOP to opt out',
      },
      inbox: {
        enabled: true,
        subject: copy.subject,
        body: copy.body,
      },
    },
    createdAt: new Date(Date.now() - (COMMUNICATION_TRIGGERS.length - index) * 86400000).toISOString(),
    updatedAt: now,
    createdBy: 'admin@acado.ai',
  };
};

export const seedTemplatesIfEmpty = (): CommunicationTemplate[] => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return JSON.parse(existing);
  const seeded = COMMUNICATION_TRIGGERS.map((t, i) => buildDefaultTemplate(t.key, i));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
};

export const getTemplates = (): CommunicationTemplate[] => seedTemplatesIfEmpty();

export const saveTemplates = (templates: CommunicationTemplate[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
};

export const getTemplateById = (id: string) =>
  getTemplates().find((t) => t.id === id);

export const upsertTemplate = (template: CommunicationTemplate) => {
  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === template.id);
  if (index >= 0) {
    templates[index] = { ...template, updatedAt: new Date().toISOString() };
  } else {
    templates.push(template);
  }
  saveTemplates(templates);
  return templates;
};

export const deleteTemplate = (id: string) => {
  const templates = getTemplates().filter((t) => t.id !== id);
  saveTemplates(templates);
  return templates;
};

export const duplicateTemplate = (id: string) => {
  const source = getTemplateById(id);
  if (!source) return getTemplates();
  const copy: CommunicationTemplate = {
    ...source,
    id: `tpl-${Date.now()}`,
    name: `${source.name} (Copy)`,
    owner: source.owner,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return upsertTemplate(copy);
};

export const UNIVERSITY_ID = 'acado-university';

/* ---------------- assignment & lock ---------------- */

export interface UniversityOption {
  id: string;
  name: string;
  email: string;
}

const slug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const getUniversityOptions = (): UniversityOption[] => {
  let stored: any[] = [];
  try {
    stored = JSON.parse(localStorage.getItem('universities') || '[]');
  } catch {
    stored = [];
  }
  const options = stored
    .filter((u) => u && (u.name || u.universityName))
    .map((u, i) => {
      const name = u.name ?? u.universityName;
      return {
        id: String(u.id ?? `univ-${i}`),
        name,
        email: u.email ?? u.contactEmail ?? `admissions@${slug(name)}.edu`,
      };
    });
  if (!options.some((o) => o.id === UNIVERSITY_ID)) {
    options.unshift({
      id: UNIVERSITY_ID,
      name: 'ACADO Institute of Technology',
      email: 'admissions@acado.ai',
    });
  }
  return options;
};

export const templateAssignment = (t: CommunicationTemplate) =>
  t.assignedTo ?? { mode: 'all' as const, universityIds: [] };

export const isAssignedToUniversity = (
  t: CommunicationTemplate,
  universityId: string = UNIVERSITY_ID
) => {
  const assignment = templateAssignment(t);
  return assignment.mode === 'all' || assignment.universityIds.includes(universityId);
};

export const setTemplateAssignment = (
  id: string,
  assignedTo: CommunicationTemplate['assignedTo']
) => {
  const template = getTemplateById(id);
  if (!template) return getTemplates();
  return upsertTemplate({ ...template, assignedTo });
};

export const setTemplateLocked = (id: string, locked: boolean) => {
  const template = getTemplateById(id);
  if (!template) return getTemplates();
  const templates = upsertTemplate({ ...template, locked });
  if (!locked) return templates;
  // A fixed template cannot keep university overrides.
  const cleaned = templates.filter(
    (t) => !(t.owner === 'university' && t.basedOnId === id)
  );
  saveTemplates(cleaned);
  return cleaned;
};

/** Templates a university may see and use: assigned to it and not fixed by the platform. */
export const getTemplatesForUniversity = (universityId: string = UNIVERSITY_ID) =>
  getTemplates().filter((t) => {
    if (t.owner === 'university') return !t.universityId || t.universityId === universityId;
    return !t.locked && isAssignedToUniversity(t, universityId);
  });

/** Creates a university-owned editable copy of a platform template. */
export const customizeForUniversity = (platformId: string) => {
  const source = getTemplateById(platformId);
  if (!source) return undefined;
  const existing = getTemplates().find(
    (t) => t.owner === 'university' && t.basedOnId === platformId
  );
  if (existing) return existing;
  const copy: CommunicationTemplate = {
    ...source,
    id: `tpl-univ-${source.triggerKey}-${Date.now()}`,
    owner: 'university',
    basedOnId: platformId,
    universityId: UNIVERSITY_ID,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'university@acado.ai',
  };
  upsertTemplate(copy);
  return copy;
};

export const revertToPlatformDefault = (universityTemplateId: string) =>
  deleteTemplate(universityTemplateId);

/** Effective template for a trigger: university override wins over platform default. */
export const getEffectiveTemplate = (
  triggerKey: string,
  scope: 'platform' | 'university' = 'university'
) => {
  const templates = getTemplates().filter(
    (t) => t.triggerKey === triggerKey && t.status === 'Active'
  );
  if (scope === 'university') {
    const override = templates.find((t) => t.owner === 'university');
    if (override) return override;
  }
  return templates.find((t) => t.owner === 'platform');
};

export const renderTemplate = (
  content: string,
  context: Record<string, string | undefined> = {}
) =>
  content.replace(/\{\{\s*([\w_]+)\s*\}\}/g, (_match, key: string) => {
    const value = context[key] ?? SAMPLE_CONTEXT[key];
    return value ?? `{{${key}}}`;
  });

export const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
