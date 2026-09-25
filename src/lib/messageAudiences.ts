import { getUniversityOptions } from './communicationTemplates';
import { getEvents, getEventResponses } from './eventStorage';

export interface Recipient {
  name: string;
  email: string;
  scope: 'student' | 'university';
}

export interface AudienceGroup {
  id: string;
  type: string;
  name: string;
  label: string;
  description: string;
  recipients: Recipient[];
}

const read = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
};

interface StoredUser {
  name?: string;
  email?: string;
  userType?: string;
  status?: string;
  organization?: string;
}

const dedupe = (recipients: Recipient[]) => {
  const map = new Map<string, Recipient>();
  recipients
    .filter((r) => r.email)
    .forEach((r) => {
      if (!map.has(r.email.toLowerCase())) map.set(r.email.toLowerCase(), r);
    });
  return [...map.values()];
};

const allPlatformUsers = (): StoredUser[] => [
  ...read<StoredUser>('masterAdminUsers'),
  ...read<StoredUser>('universityUsers'),
];

const asRecipients = (users: StoredUser[]): Recipient[] =>
  dedupe(
    users.map((u) => ({
      name: u.name ?? u.email ?? 'Learner',
      email: u.email ?? '',
      scope: 'student' as const,
    }))
  );

/** Every audience the sender can pick from, resolved from the current data. */
export const getAudienceGroups = (): AudienceGroup[] => {
  const users = allPlatformUsers();
  const learners = users.filter((u) => (u.userType ?? 'Learner') === 'Learner');
  const facultyStaff = users.filter(
    (u) => u.userType === 'Faculty' || u.userType === 'Staff'
  );
  const universities = getUniversityOptions();
  const candidates = read<{ name?: string; email?: string }>('talentPoolCandidates');

  const groups: AudienceGroup[] = [
    {
      id: 'all_platform_users',
      type: 'Platform users',
      name: 'All platform users',
      label: 'All platform users',
      description: 'Every learner, faculty and staff member on the platform',
      recipients: asRecipients(users),
    },
    {
      id: 'all_learners',
      type: 'Learners',
      name: 'All learners / students',
      label: 'All learners / students',
      description: 'Everyone registered as a learner',
      recipients: asRecipients(learners),
    },
    {
      id: 'faculty_staff',
      type: 'Platform users',
      name: 'Faculty & staff',
      label: 'Faculty & staff',
      description: 'Teaching and administrative users',
      recipients: asRecipients(facultyStaff),
    },
    {
      id: 'all_universities',
      type: 'Universities',
      name: 'All universities',
      label: 'All universities',
      description: 'Admissions contact of every university',
      recipients: dedupe(
        universities.map((u) => ({
          name: u.name,
          email: u.email,
          scope: 'university' as const,
        }))
      ),
    },
    {
      id: 'community_members',
      type: 'Community members',
      name: 'ACADO community',
      label: 'Community members',
      description: 'Candidates in the talent pool and community',
      recipients: dedupe(
        candidates.map((c) => ({
          name: c.name ?? 'Candidate',
          email: c.email ?? '',
          scope: 'student' as const,
        }))
      ),
    },
  ];

  // One audience per university (its own learners)
  universities.forEach((u) => {
    const members = learners.filter((l) => l.organization === u.name);
    if (!members.length) return;
    groups.push({
      id: `university:${u.id}`,
      type: 'University learners',
      name: u.name,
      label: `${u.name} — learners`,
      description: 'Learners belonging to this university',
      recipients: asRecipients(members),
    });
  });

  // One audience per event (learners who took part)
  getEvents().forEach((event) => {
    const participants = getEventResponses(event.id).map((r) => ({
      name: r.learnerName,
      email: r.learnerEmail,
      scope: 'student' as const,
    }));
    if (!participants.length) return;
    groups.push({
      id: `event:${event.id}`,
      type: 'Event participants',
      name: event.title,
      label: `Event — ${event.title}`,
      description: 'Learners who registered or participated in this event',
      recipients: dedupe(participants),
    });
  });

  return groups.filter((g) => g.recipients.length > 0);
};

export const getAudienceGroup = (id: string) =>
  getAudienceGroups().find((g) => g.id === id);
