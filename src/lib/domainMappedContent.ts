import { getMappings, mappedContent, readArray, CONTENT_SOURCES } from './domainStorage';

export const mappedContentTabs = ['Courses', 'Events', 'Podcasts', 'Blogs', 'Newsletter', 'Other'] as const;
export type MappedContentTab = typeof mappedContentTabs[number];
export interface DomainContentRow {
  id: string;
  name: string;
  description: string;
  subdomainId: string;
  createdAt: string;
  status: string;
  universityId: string;
  tab: MappedContentTab;
  sample?: boolean;
  url?: string;
  contentType: string;
}
const tabForType = (type: string): MappedContentTab => {
  if (type === 'course' || type === 'university-course') return 'Courses';
  if (type === 'event') return 'Events';
  return 'Other';
};

// Reference-only records never enter content stores, newsletter audiences or mapping deletion rules.
export function domainContentSamples(domainId: string, scope?: string): DomainContentRow[] {
  if (domainId !== 'dom-technology' || (scope !== undefined && scope !== 'u-jamk')) return [];
  const examples: [MappedContentTab, string, string, string, string][] = [
    ['Courses', 'Applied Artificial Intelligence', 'Practical machine learning, responsible AI and industry projects.', 'sub-ai', 'Published'],
    ['Courses', 'Full-stack Software Development', 'Build web applications with modern development practices.', 'sub-software', 'Draft'],
    ['Events', 'AI Innovation Workshop', 'Explore intelligent solutions through a hands-on university workshop.', 'sub-ai', 'Published'],
    ['Events', 'Software Careers Meetup', 'Meet industry professionals and discover software career pathways.', 'sub-software', 'Upcoming'],
    ['Podcasts', 'Inside Responsible AI', 'A conversation about ethics, research and real-world AI applications.', 'sub-ai', 'Published'],
    ['Podcasts', 'Building Better Software', 'Engineering teams share practical lessons from product development.', 'sub-software', 'Draft'],
    ['Blogs', 'Your First Machine Learning Project', 'A guide to preparing data and evaluating your first model.', 'sub-ai', 'Published'],
    ['Blogs', 'Studying Software Engineering Abroad', 'Explore international study opportunities and industry projects.', 'sub-software', 'Published'],
    ['Newsletter', 'Technology Study Updates', 'Programme news, upcoming workshops and technology student stories.', 'sub-ai', 'Draft'],
    ['Newsletter', 'Software Community Digest', 'University software projects, community highlights and upcoming events.', 'sub-software', 'Draft'],
  ];
  return examples.map(([tab, name, description, subdomainId, status], index) => ({
    id: `domain-reference-${index}`, name, description, subdomainId, status, tab,
    universityId: 'u-jamk', createdAt: `2026-11-${String(index + 1).padStart(2, '0')}T09:00:00Z`, sample: true, contentType: 'reference',
  }));
}

export function getDomainContentRows(domainId: string, scope?: string): DomainContentRow[] {
  const actual = getMappings().filter(m => m.domainId === domainId && (scope === undefined || m.universityId === scope)).map(m => {
    const source = CONTENT_SOURCES.find(s => s.type === m.contentType);
    const record = source ? readArray<{ id: string; description?: string; shortDescription?: string; createdAt?: string; createdDate?: string; status?: string; isActive?: boolean }>(source.key).find(r => r.id === m.contentId) : undefined;
    const content = mappedContent(m);
    return {
      id: `${m.contentType}-${m.contentId}`, name: content.title,
      description: record?.description || record?.shortDescription || '—', subdomainId: m.subdomainId,
      createdAt: record?.createdAt || record?.createdDate || '',
      status: record?.status || (record?.isActive === undefined ? '—' : record.isActive ? 'Active' : 'Inactive'),
      universityId: m.universityId, tab: tabForType(m.contentType), url: content.url, contentType: m.contentType,
    } satisfies DomainContentRow;
  });
  return [...actual, ...domainContentSamples(domainId, scope)];
}