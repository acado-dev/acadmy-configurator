import { z } from 'zod';

export const contactSchema = z.object({
  firstName: z.string().trim().min(1).max(100), lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255).transform(value => value.toLowerCase()),
  phone: z.string().trim().min(7).max(25).regex(/^\+?[\d\s()-]+$/),
  userType: z.enum(['Student / Individual', 'University representative']),
  university: z.string().trim().max(200).default(''), query: z.string().trim().min(1).max(5000),
}).superRefine((value, ctx) => {
  if (value.userType === 'University representative' && !value.university) ctx.addIssue({ code: 'custom', path: ['university'], message: 'University name is required' });
});
export type ContactQuery = z.infer<typeof contactSchema> & {
  id: string; submittedAt: string; status: 'New' | 'Contacted' | 'Resolved'; notes: string; sample?: boolean;
};
export const subscriberSchema = z.object({
  email: z.string().trim().email().max(255).transform(value => value.toLowerCase()),
  name: z.string().trim().max(200).default(''),
  consent: z.literal(true, { errorMap: () => ({ message: 'Explicit subscription consent is required' }) }),
  source: z.string().trim().min(1).max(500),
});
export type Subscriber = {
  id: string; name: string; email: string; status: 'Subscribed' | 'Unsubscribed';
  consentAt: string | null; consentSource: string; updatedAt: string; sample?: boolean;
};
export const newsletterSchema = z.object({ title: z.string().trim().min(1).max(200), subject: z.string().trim().min(1).max(200).regex(/^[^\r\n]*$/), body: z.string().min(1).max(50000) });
export type Newsletter = z.infer<typeof newsletterSchema> & { id: string; status: 'Draft' | 'Ready'; createdAt: string; updatedAt: string };
const keys = { queries: 'acado_contact_queries', subscribers: 'acado_newsletter_subscribers', newsletters: 'acado_newsletters' };
function read<T>(key: string, initial: T[]): T[] {
  const raw = localStorage.getItem(key);
  if (raw === null) { localStorage.setItem(key, JSON.stringify(initial)); return initial; }
  try { const data = JSON.parse(raw); return Array.isArray(data) ? data : []; } catch { return []; }
}
function write<T>(key: string, values: T[]) { localStorage.setItem(key, JSON.stringify(values)); }
const sampleQueries: ContactQuery[] = [
  { id: 'contact-demo-1', firstName: 'Aisha', lastName: 'Sharma', email: 'aisha@example.com', phone: '+91 9000000001', userType: 'Student / Individual', university: '', query: 'I would like to know more about the application deadlines and scholarship options for international courses.', submittedAt: '2026-10-18T09:30:00Z', status: 'New', notes: '', sample: true },
  { id: 'contact-demo-2', firstName: 'Daniel', lastName: 'Thomas', email: 'daniel@example.com', phone: '+91 9000000002', userType: 'University representative', university: 'Example University', query: 'Our university would like to discuss joining ACADO and publishing our programmes.', submittedAt: '2026-10-17T11:15:00Z', status: 'Contacted', notes: 'Partnership discussion requested.', sample: true },
];
const sampleSubscribers: Subscriber[] = [
  { id: 'subscriber-demo-1', name: 'Aisha Sharma', email: 'aisha@example.com', status: 'Subscribed', consentAt: '2026-10-15T10:00:00Z', consentSource: 'Sample consent record — not a real subscription', updatedAt: '2026-10-15T10:00:00Z', sample: true },
  { id: 'subscriber-demo-2', name: 'Daniel Thomas', email: 'daniel@example.com', status: 'Unsubscribed', consentAt: '2026-10-14T10:00:00Z', consentSource: 'Sample consent record — not a real subscription', updatedAt: '2026-10-17T10:00:00Z', sample: true },
];
export const getContactQueries = () => read(keys.queries, sampleQueries);
export const getSubscribers = () => read(keys.subscribers, sampleSubscribers);
export const getNewsletters = () => read<Newsletter>(keys.newsletters, []);
export function submitContactQuery(input: unknown): ContactQuery {
  const query: ContactQuery = { ...contactSchema.parse(input), id: crypto.randomUUID(), submittedAt: new Date().toISOString(), status: 'New', notes: '' };
  write(keys.queries, [query, ...getContactQueries()]); return query;
}
export function updateContactQuery(id: string, status: ContactQuery['status'], notes: string) {
  const validStatus = z.enum(['New', 'Contacted', 'Resolved']).parse(status);
  const validNotes = z.string().max(5000).parse(notes);
  write(keys.queries, getContactQueries().map(query => query.id === id ? { ...query, status: validStatus, notes: validNotes } : query));
}
export function recordSubscription(input: unknown, existingId?: string): Subscriber {
  const value = subscriberSchema.parse(input);
  const current = getSubscribers();
  const duplicate = current.find(s => s.email === value.email && s.id !== existingId);
  if (duplicate) throw new Error('This email already has a subscriber record. Open that record to manage its subscription.');
  const existing = existingId ? current.find(s => s.id === existingId) : undefined;
  if (existingId && !existing) throw new Error('Subscriber not found');
  if (existing?.sample) throw new Error('Sample subscriptions cannot be activated for delivery');
  const now = new Date().toISOString();
  const subscriber: Subscriber = { id: existingId || crypto.randomUUID(), email: value.email, name: value.name, status: 'Subscribed', consentAt: now, consentSource: value.source, updatedAt: now };
  write(keys.subscribers, existing ? current.map(s => s.id === existingId ? subscriber : s) : [subscriber, ...current]); return subscriber;
}
export function unsubscribe(id: string) { write(keys.subscribers, getSubscribers().map(s => s.id === id ? { ...s, status: 'Unsubscribed' as const, updatedAt: new Date().toISOString() } : s)); }
export function deleteSubscriber(id: string) { write(keys.subscribers, getSubscribers().filter(s => s.id !== id)); }
export function updateSubscriberName(id: string, name: string) { const validName = z.string().trim().max(200).parse(name); write(keys.subscribers, getSubscribers().map(s => s.id === id ? { ...s, name: validName } : s)); }
export const eligibleSubscribers = (subscribers: Subscriber[]) => subscribers.filter(s => s.status === 'Subscribed' && Boolean(s.consentAt) && Boolean(s.consentSource.trim()) && !s.sample && z.string().email().safeParse(s.email).success);
export function saveNewsletter(input: unknown, id?: string, status: Newsletter['status'] = 'Draft'): Newsletter {
  const value = newsletterSchema.parse(input);
  if (!value.body.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()) throw new Error('Please enter newsletter content');
  const list = getNewsletters(); const existing = list.find(n => n.id === id); const now = new Date().toISOString();
  const newsletter: Newsletter = { ...value, id: id || crypto.randomUUID(), status: z.enum(['Draft', 'Ready']).parse(status), createdAt: existing?.createdAt || now, updatedAt: now };
  write(keys.newsletters, existing ? list.map(n => n.id === id ? newsletter : n) : [newsletter, ...list]); return newsletter;
}
export function deleteNewsletter(id: string) { write(keys.newsletters, getNewsletters().filter(n => n.id !== id)); }
export const maskContactEmail = (email: string) => { const [name, domain] = email.split('@'); return `${name.slice(0, 2)}***@${domain}`; };
export const maskContactPhone = (phone: string) => `•••• ${phone.slice(-4)}`;
export function exportSubscribers(subscribers: Subscriber[]) {
  const escape = (value: string) => `"${value.replace(/^[=+@-]/, "'$&").replace(/"/g, '""')}"`;
  const content = ['Name,Email,Status,Consent Date,Consent Source', ...subscribers.map(s => [s.name, s.email, s.status, s.consentAt || '', s.consentSource].map(escape).join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a'); link.href = url; link.download = 'newsletter-subscribers.csv'; link.click(); URL.revokeObjectURL(url);
}