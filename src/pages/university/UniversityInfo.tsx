import UniversityDetails from '@/pages/UniversityDetails';
import { resolveUniversityProfileId } from '@/lib/universityProfile';

const UniversityInfo = () => {
  let admin: { universityId?: string; universityName?: string; name?: string } | null = null;
  try {
    admin = JSON.parse(localStorage.getItem('universityAdmin') || 'null');
  } catch {
    // The editor displays an account-linking message for an invalid session.
  }
  const profileId = resolveUniversityProfileId(admin);
  return <UniversityDetails universityAdmin profileId={profileId ?? undefined} initialName={admin?.universityName || ''} />;
};

export default UniversityInfo;
