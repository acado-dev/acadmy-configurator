import type { ReactNode } from 'react';
import type { CommunityRole } from '@/lib/communities';
import { prototypeUniversity, readCommunityPrototype } from '@/lib/communityPrototype';
export type CommunityIdentity = { id: string; name: string; roles: CommunityRole[] };
export default function CommunityAccess({ children, learner = false, organization = false }: { children: (identity: CommunityIdentity) => ReactNode; learner?: boolean; organization?: boolean }) {
  const university = prototypeUniversity();
  const data = readCommunityPrototype();
  const candidate = data.candidates.find(c => c.university_id === university.id);
  const id = learner ? candidate?.user_id ?? 'prototype-learner' : organization ? `prototype-admin-${university.id}` : 'prototype-super-admin';
  const role: CommunityRole = { id: `prototype-role-${id}`, user_id: id, role: learner ? 'learner' : organization ? 'organization_admin' : 'super_admin', university_id: organization || learner ? university.id : null };
  return <>{children({ id, name: learner ? candidate?.display_name ?? 'Aisha Khan' : 'ACADO Admin', roles: [role] })}</>;
}
