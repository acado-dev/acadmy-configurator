import type { UniversityDetails } from '@/types/university';

export function resolveUniversityProfileId(admin: { universityId?: string } | null): string | null {
  return admin?.universityId?.trim() || null;
}

export function updateUniversityProfiles(profiles: UniversityDetails[], profile: UniversityDetails): UniversityDetails[] {
  return profiles.some(item => item.id === profile.id)
    ? profiles.map(item => item.id === profile.id ? profile : item)
    : [...profiles, profile];
}

export function emptyUniversityProfile(id: string, name = ''): UniversityDetails {
  return {
    id, name, foundedYear: 0, institutionType: 'University',
    location: { city: '', country: '', campuses: [] },
    about: { description: '', mission: '', values: [], highlights: [] },
    factsAndFigures: { totalStudents: 0, internationalStudents: 0, staffMembers: 0, alumniCount: 0, internationalPartnerships: 0, partnerCountries: 0, graduateEmployability: 0, annualGraduates: 0 },
    community: { description: '', studentCount: 0, facultyCount: 0, alumniInCountries: 0, activeProjects: 0 },
    fieldsOfEducation: [], socialResponsibility: { description: '', commitments: [], initiatives: [] },
    testimonials: [], createdAt: new Date(), updatedAt: new Date(), isActive: true, isVerified: false,
  };
}