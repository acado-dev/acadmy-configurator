export interface LifeEntry {
  id: string; title: string; description: string; category: string; image: string; alt: string;
  caption: string; time: string; location: string; hours: string; destination: string; visible: boolean;
  value: string; unit: string; context: string;
}
export type LifeCollection = 'statistics' | 'moments' | 'communities' | 'facilities' | 'support' | 'gallery' | 'faqs';
export interface StudentLifeContent {
  title: string; introduction: string; hero: string; heroAlt: string; focalPoint: string;
  dayTitle: string; dayDescription: string; video: string; poster: string; videoCaption: string;
  statistics: LifeEntry[]; moments: LifeEntry[]; communities: LifeEntry[]; facilities: LifeEntry[];
  support: LifeEntry[]; gallery: LifeEntry[]; faqs: LifeEntry[];
  /** Sections the university has removed; their content is kept for re-adding. */
  hiddenSections?: string[];
}
export interface StudentLifeRecord { universityId: string; draft: StudentLifeContent; published: StudentLifeContent | null; savedAt: string; publishedAt: string | null }
export function newLifeEntry(values: Partial<LifeEntry> = {}): LifeEntry {
  return { id: crypto.randomUUID(), title: '', description: '', category: '', image: '', alt: '', caption: '', time: '', location: '', hours: '', destination: '', visible: true, value: '', unit: '', context: '', ...values };
}
export function moveLifeEntry<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length) return items;
  const next = [...items]; const [item] = next.splice(from, 1); next.splice(to, 0, item); return next;
}
export function validateStudentLife(content: StudentLifeContent): string[] {
  const errors: string[] = [];
  if (!content.title.trim()) errors.push('Enter a page title.');
  if (content.hero && !content.heroAlt.trim()) errors.push('Add alt text for the hero image.');
  for (const key of ['statistics', 'moments', 'communities', 'facilities', 'support', 'gallery', 'faqs'] as const) {
    content[key].filter(item => item.visible).forEach((item, index) => {
      if (key !== 'gallery' && !item.title.trim()) errors.push(`${key}: entry ${index + 1} needs a ${key === 'faqs' ? 'question' : 'title'}.`);
      if (key === 'gallery' && !item.image) errors.push(`Gallery image ${index + 1} needs an image.`);
      if (key === 'faqs' && !item.description.trim()) errors.push(`FAQ ${index + 1} needs an answer.`);
      if (key === 'statistics' && !item.value.trim()) errors.push(`Statistic ${index + 1} needs a value.`);
    });
  }
  return [...new Set(errors)];
}
export function publishStudentLife(record: StudentLifeRecord, draft: StudentLifeContent): StudentLifeRecord {
  const errors = validateStudentLife(draft); if (errors.length) throw new Error(errors.join('\n'));
  const now = new Date().toISOString(); return { ...record, draft: structuredClone(draft), published: structuredClone(draft), savedAt: now, publishedAt: now };
}
export function publishedStudentLife(record: StudentLifeRecord | undefined, universityId: string, active: boolean): StudentLifeContent | null {
  return active && record?.universityId === universityId ? record.published : null;
}
