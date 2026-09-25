export type OpportunityType = 'Job' | 'Internship';
export type WorkMode = 'On-site' | 'Hybrid' | 'Remote';
export type OpportunityStatus = 'Draft' | 'Open' | 'Closed';
export type ApplicationStatus = 'Applied' | 'Under Review' | 'In Process' | 'Hired' | 'Rejected';
export type ShortlistStatus = 'Pending' | 'Shortlisted' | 'Not Shortlisted';

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  companyId: string;
  companyName: string;
  description: string;
  location: string;
  workMode: WorkMode;
  eligibility: string;
  skills: string[];
  startDate: string;
  endDate: string;
  duration?: string;
  stipendOrSalary?: string;
  openings?: number;
  status: OpportunityStatus;
  createdBy: string; // 'super_admin' | 'university_admin'
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  fileName: string;
  fileType: string;
  dataUrl?: string;
  uploadedAt: string;
}

export interface ShortlistEvent {
  status: ShortlistStatus;
  by: string;
  at: string;
}

export interface JobApplication {
  id: string;
  opportunityId: string;
  companyId: string;
  userId: string;
  applicantName: string;
  email: string;
  phone?: string;
  appliedAt: string;
  resume: Resume;
  applicationStatus: ApplicationStatus;
  shortlistStatus: ShortlistStatus;
  shortlistHistory: ShortlistEvent[];
  stage?: string; // reserved for future recruitment stages
}

export interface Company { id: string; name: string; city?: string }

const OPP_KEY = 'jobOpportunities';
const APP_KEY = 'jobApplications';

export const SKILL_OPTIONS = [
  'JavaScript', 'React', 'TypeScript', 'Python', 'Java', 'SQL', 'Data Analysis', 'Machine Learning',
  'UI/UX Design', 'Figma', 'Communication', 'Marketing', 'Sales', 'Accounting', 'Excel',
  'Project Management', 'Cloud (AWS/Azure)', 'Content Writing', 'Customer Support', 'Leadership',
];

const SAMPLE_COMPANIES: Company[] = [
  { id: 'ind-techsphere', name: 'TechSphere Solutions', city: 'Bengaluru' },
  { id: 'ind-greenleaf', name: 'GreenLeaf Industries', city: 'Pune' },
  { id: 'ind-finedge', name: 'FinEdge Capital', city: 'Mumbai' },
];

export function getIndustryCompanies(): Company[] {
  let stored: any[] = [];
  try { stored = JSON.parse(localStorage.getItem('universities') || '[]'); } catch { /* ignore */ }
  const fromOrgs: Company[] = stored
    .filter((u) => (u.institutionType || u.type) === 'Industry')
    .map((u) => ({ id: String(u.id), name: u.name, city: u.location?.city || u.city }));
  const ids = new Set(fromOrgs.map((c) => c.id));
  return [...fromOrgs, ...SAMPLE_COMPANIES.filter((c) => !ids.has(c.id))];
}

const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function sampleResume(name: string): Resume {
  const text = `RESUME\n\n${name}\n\nSummary: Motivated candidate with strong academic record.\nSkills: Communication, Teamwork, Problem Solving\nEducation: B.Tech / B.Com (2024)\nExperience: 6-month internship`;
  return {
    fileName: `${name.replace(/\s+/g, '_')}_Resume.txt`,
    fileType: 'text/plain',
    dataUrl: `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
    uploadedAt: new Date().toISOString(),
  };
}

function seed() {
  if (localStorage.getItem(OPP_KEY)) return;
  const now = new Date();
  const d = (n: number) => new Date(now.getTime() + n * 86400000).toISOString().slice(0, 10);
  const opps: Opportunity[] = [
    { id: 'opp-1', title: 'Frontend Developer', type: 'Job', companyId: 'ind-techsphere', companyName: 'TechSphere Solutions', description: 'Build modern web interfaces with React.', location: 'Bengaluru', workMode: 'Hybrid', eligibility: '1-3 years experience, B.Tech', skills: ['React', 'TypeScript', 'JavaScript'], startDate: d(-10), endDate: d(20), stipendOrSalary: '₹8-12 LPA', openings: 3, status: 'Open', createdBy: 'super_admin', createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'opp-2', title: 'Data Analyst Intern', type: 'Internship', companyId: 'ind-finedge', companyName: 'FinEdge Capital', description: 'Support the analytics team with dashboards and reports.', location: 'Mumbai', workMode: 'On-site', eligibility: 'Final-year students', skills: ['SQL', 'Excel', 'Data Analysis'], startDate: d(-5), endDate: d(15), duration: '6 months', stipendOrSalary: '₹20,000 / month', openings: 5, status: 'Open', createdBy: 'super_admin', createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'opp-3', title: 'Marketing Associate', type: 'Job', companyId: 'ind-greenleaf', companyName: 'GreenLeaf Industries', description: 'Plan and run campaigns for sustainable products.', location: 'Pune', workMode: 'Remote', eligibility: 'Any graduate, 0-2 years', skills: ['Marketing', 'Content Writing'], startDate: d(-30), endDate: d(-2), openings: 2, status: 'Closed', createdBy: 'super_admin', createdAt: now.toISOString(), updatedAt: now.toISOString() },
  ];
  const people = [
    ['Jane Smith', 'jane.smith@example.com', '+91 98765 43210', 'opp-1'],
    ['Rahul Verma', 'rahul.verma@example.com', '+91 91234 56789', 'opp-1'],
    ['Aisha Khan', 'aisha.khan@example.com', '+91 99887 66554', 'opp-1'],
    ['Priya Nair', 'priya.nair@example.com', '+91 90000 11122', 'opp-2'],
    ['Arjun Mehta', 'arjun.mehta@example.com', '+91 93333 44455', 'opp-2'],
    ['Sneha Rao', 'sneha.rao@example.com', '+91 97777 88899', 'opp-3'],
  ];
  const apps: JobApplication[] = people.map(([name, email, phone, oppId], i) => {
    const opp = opps.find((o) => o.id === oppId)!;
    return {
      id: `japp-${i + 1}`, opportunityId: oppId, companyId: opp.companyId, userId: `user-${email}`,
      applicantName: name, email, phone, appliedAt: new Date(now.getTime() - (i + 1) * 86400000).toISOString(),
      resume: sampleResume(name), applicationStatus: 'Applied', shortlistStatus: 'Pending', shortlistHistory: [],
    };
  });
  localStorage.setItem(OPP_KEY, JSON.stringify(opps));
  localStorage.setItem(APP_KEY, JSON.stringify(apps));
}

export function getOpportunities(): Opportunity[] {
  seed();
  try { return JSON.parse(localStorage.getItem(OPP_KEY) || '[]'); } catch { return []; }
}
export function getOpportunity(id: string) { return getOpportunities().find((o) => o.id === id); }

export function saveOpportunity(input: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Opportunity {
  const list = getOpportunities();
  const now = new Date().toISOString();
  if (input.id) {
    const idx = list.findIndex((o) => o.id === input.id);
    const updated = { ...list[idx], ...input, updatedAt: now } as Opportunity;
    list[idx] = updated;
    localStorage.setItem(OPP_KEY, JSON.stringify(list));
    return updated;
  }
  const created: Opportunity = { ...(input as any), id: uid('opp'), createdAt: now, updatedAt: now };
  localStorage.setItem(OPP_KEY, JSON.stringify([created, ...list]));
  return created;
}

export function deleteOpportunity(id: string) {
  localStorage.setItem(OPP_KEY, JSON.stringify(getOpportunities().filter((o) => o.id !== id)));
  localStorage.setItem(APP_KEY, JSON.stringify(getAllJobApplications().filter((a) => a.opportunityId !== id)));
}

export function getAllJobApplications(): JobApplication[] {
  seed();
  try { return JSON.parse(localStorage.getItem(APP_KEY) || '[]'); } catch { return []; }
}
export function getApplicationsForOpportunity(oppId: string) {
  return getAllJobApplications().filter((a) => a.opportunityId === oppId);
}

export function setShortlistStatus(appId: string, status: ShortlistStatus, by: string) {
  const list = getAllJobApplications().map((a) => {
    if (a.id !== appId) return a;
    return {
      ...a,
      shortlistStatus: status,
      applicationStatus: (status === 'Shortlisted' ? 'In Process' : 'Under Review') as ApplicationStatus,
      shortlistHistory: [...(a.shortlistHistory || []), { status, by, at: new Date().toISOString() }],
    };
  });
  localStorage.setItem(APP_KEY, JSON.stringify(list));
}

export function opportunityPublicUrl(id: string) {
  return `${window.location.origin}/opportunities/${id}`;
}
