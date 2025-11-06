// Utility to enrich existing universities in localStorage with demo detail fields
// This does NOT overwrite existing user data; it only fills in missing fields so the view page has rich content.

export function enrichUniversitiesWithDemoDetails() {
  try {
    const key = 'acado_universities';
    const raw = localStorage.getItem(key);
    if (!raw) return;

    const universities = JSON.parse(raw);
    if (!Array.isArray(universities)) return;

    const now = new Date();

    const withDefaults = universities.map((u: any) => {
      const about = u.about || {};
      const facts = u.factsAndFigures || {};
      const community = u.community || {};

      const next = {
        ...u,
        about: {
          ...about,
          description:
            about.description ||
            'Our institution is committed to excellence in education, research, and community engagement. We foster innovation and real-world impact.',
          mission:
            about.mission ||
            'Empower learners to solve global challenges through interdisciplinary education and research.',
          values: about.values && about.values.length > 0 ? about.values : ['Excellence', 'Innovation', 'Integrity'],
          highlights:
            about.highlights && about.highlights.length > 0
              ? about.highlights
              : ['Strong industry partnerships', 'Global alumni network', 'Modern campus facilities'],
        },
        whyThisUniversity:
          u.whyThisUniversity ||
          'Choose us for our industry-aligned curriculum, international exposure, and supportive learning environment.',
        admission:
          u.admission ||
          'Admission is based on academic performance, entrance assessments, and interviews where applicable. Rolling deadlines may apply.',
        placements:
          u.placements ||
          'We maintain outstanding placement records with leading companies across sectors, supported by a dedicated career services team.',
        faq:
          u.faq ||
          'Q: Do you offer scholarships?\nA: Yes, merit- and need-based scholarships are available.\n\nQ: Is on-campus housing available?\nA: Yes, subject to availability.',
        testimonials:
          Array.isArray(u.testimonials) && u.testimonials.length > 0
            ? u.testimonials
            : ['“An exceptional learning experience with practical exposure and strong mentorship.”'],
        brochureUrl: u.brochureUrl || '',
        fieldsOfEducation: Array.isArray(u.fieldsOfEducation) ? u.fieldsOfEducation : [],
        factsAndFigures: {
          totalStudents: facts.totalStudents ?? 5000,
          internationalStudents: facts.internationalStudents ?? 400,
          staffMembers: facts.staffMembers ?? 600,
          alumniCount: facts.alumniCount ?? 30000,
          internationalPartnerships: facts.internationalPartnerships ?? 120,
          partnerCountries: facts.partnerCountries ?? 40,
          graduateEmployability: facts.graduateEmployability ?? 85,
          annualGraduates: facts.annualGraduates ?? 1200,
          researchBudget: facts.researchBudget ?? 10,
        },
        community: {
          description:
            community.description ||
            'A vibrant community of learners, educators, researchers, and industry partners.',
          studentCount: community.studentCount ?? 5000,
          facultyCount: community.facultyCount ?? 600,
          alumniInCountries: community.alumniInCountries ?? 90,
          activeProjects: community.activeProjects ?? 200,
        },
        updatedAt: now,
      };

      return next;
    });

    localStorage.setItem(key, JSON.stringify(withDefaults));
  } catch (e) {
    // Fail silently to avoid breaking UX
    console.error('Failed to enrich universities', e);
  }
}
