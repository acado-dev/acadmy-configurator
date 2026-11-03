export type CustomFieldType = 'text' | 'textarea' | 'richtext' | 'image' | 'video' | 'file' | 'repeatable' | 'datetime' | 'select';
export type CustomPage = 'student' | 'city';
export interface CustomField { id: string; label: string; type: CustomFieldType; required: boolean; options?: string[] }
export interface CustomSection { id: string; name: string; description: string; page: CustomPage; active: boolean; order: number; fields: CustomField[] }
export interface CustomCard { id: string; title: string; description: string; image: string }
export interface CustomFile { name: string; url: string }
export type CustomValues = Record<string, Record<string, unknown>>;

export const FIELD_TYPES: [CustomFieldType, string][] = [
  ['text', 'Single-line text'], ['textarea', 'Multi-line text'], ['richtext', 'Rich text'], ['image', 'Image upload'],
  ['video', 'Video URL'], ['file', 'File upload'], ['repeatable', 'Repeatable cards'], ['datetime', 'Date and time'], ['select', 'Dropdown / select'],
];
export const PAGE_LABEL: Record<CustomPage, string> = { student: 'Student Life', city: 'City Life' };
const KEY = 'acado_custom_sections';
const uid = () => (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
export const newField = (type: CustomFieldType = 'text'): CustomField => ({ id: uid(), label: '', type, required: false, ...(type === 'select' ? { options: [] } : {}) });
export const newCard = (): CustomCard => ({ id: uid(), title: '', description: '', image: '' });
export const customTabId = (id: string) => `custom-${id}`;

export function sampleCustomSections(): CustomSection[] {
  return [
    { id: 'alumni-stories', name: 'Alumni Stories', description: 'Short stories from graduates about life after studying here.', page: 'student', active: true, order: 1, fields: [
      { id: 'intro', label: 'Introduction', type: 'textarea', required: true },
      { id: 'stories', label: 'Stories', type: 'repeatable', required: false },
      { id: 'video', label: 'Featured video URL', type: 'video', required: false },
    ] },
    { id: 'local-events', name: 'Local Events', description: 'Annual city festivals and events students can join.', page: 'city', active: true, order: 1, fields: [
      { id: 'headline', label: 'Headline', type: 'text', required: true },
      { id: 'season', label: 'Best season to visit', type: 'select', required: false, options: ['Spring', 'Summer', 'Autumn', 'Winter'] },
      { id: 'next', label: 'Next big event', type: 'datetime', required: false },
      { id: 'details', label: 'Details', type: 'richtext', required: false },
    ] },
  ];
}
export function readCustomSections(): CustomSection[] {
  if (typeof localStorage === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) { const seed = sampleCustomSections(); localStorage.setItem(KEY, JSON.stringify(seed)); return seed; }
  try { return JSON.parse(raw); } catch { return []; }
}
export function saveCustomSections(list: CustomSection[]) { localStorage.setItem(KEY, JSON.stringify(list)); }
export function sectionsForPage(list: CustomSection[], page: CustomPage, activeOnly = true) {
  return list.filter(s => s.page === page && (!activeOnly || s.active)).sort((a, b) => a.order - b.order);
}
/** Custom sections a university has enabled and that are still active. */
export function enabledCustom(list: CustomSection[], page: CustomPage, enabled: string[] = []) {
  return sectionsForPage(list, page).filter(s => enabled.includes(s.id));
}
export function isEmptyValue(field: CustomField, value: unknown) {
  if (field.type === 'repeatable') return !Array.isArray(value) || value.length === 0;
  if (field.type === 'file') return !(value as CustomFile | undefined)?.url;
  if (field.type === 'richtext') return !String(value ?? '').replace(/<[^>]*>/g, '').trim();
  return !String(value ?? '').trim();
}
export function validateCustomSections(list: CustomSection[], page: CustomPage, enabled: string[] = [], values: CustomValues = {}) {
  const errors: string[] = [];
  for (const s of enabledCustom(list, page, enabled)) for (const f of s.fields) if (f.required && isEmptyValue(f, values[s.id]?.[f.id])) errors.push(`${s.name}: ${f.label || 'field'} is required.`);
  return errors;
}
export function validateSectionDefinition(s: CustomSection) {
  const errors: string[] = [];
  if (!s.name.trim()) errors.push('Enter a section name.');
  if (!s.fields.length) errors.push('Add at least one field.');
  s.fields.forEach((f, i) => { if (!f.label.trim()) errors.push(`Field ${i + 1} needs a label.`); if (f.type === 'select' && !(f.options || []).filter(o => o.trim()).length) errors.push(`${f.label || `Field ${i + 1}`}: add at least one option.`); });
  return errors;
}
export function moveItem<T>(list: T[], from: number, to: number) { const next = [...list]; const [item] = next.splice(from, 1); next.splice(to, 0, item); return next; }
