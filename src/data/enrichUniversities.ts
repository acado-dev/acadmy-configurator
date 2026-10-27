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
        // New configurable sections (demo defaults so screens show how content looks)
        keyStatistics: Array.isArray(u.keyStatistics) && u.keyStatistics.length > 0 ? u.keyStatistics : [
          { id: 'stat-1', label: 'Total Students', value: '8,500', unit: 'students', context: '2025 intake' },
          { id: 'stat-2', label: 'Graduate Employability', value: '85', unit: '%', context: 'Within 6 months of graduation' },
          { id: 'stat-3', label: 'International Partners', value: '120', unit: 'institutions', context: 'Across 40 countries' },
        ],
        atAGlanceFacts: Array.isArray(u.atAGlanceFacts) && u.atAGlanceFacts.length > 0 ? u.atAGlanceFacts : [
          'Multiple campus locations across the region',
          'Programmes taught in English',
          'Strong industry and research partnerships',
        ],
        overviewCallout:
          u.overviewCallout ||
          'Your campus depends on your chosen programme. Check the programme information before making your study plans.',
        sectionOrder: Array.isArray(u.sectionOrder) && u.sectionOrder.length > 0 ? u.sectionOrder : ['overview', 'highlights', 'campus', 'partners', 'admissions'],
        highlightCards: Array.isArray(u.highlightCards) && u.highlightCards.length > 0 ? u.highlightCards : [
          { id: 'hl-1', title: 'Explore your study pathway', description: 'Browse the programmes available and compare subject areas, duration and study format.', detailedContent: 'Our programmes span bachelor, master and doctoral levels with flexible learning options.', image: '', order: 0 },
          { id: 'hl-2', title: 'Discover campus life', description: 'Get to know campus communities, facilities and student support services.', detailedContent: 'From student unions to sports facilities, campus life is designed to help you thrive.', image: '', order: 1 },
          { id: 'hl-3', title: 'An international community', description: 'We collaborate internationally through alliances and exchange networks.', detailedContent: 'Students and staff from over 90 countries study and work together on our campuses.', image: '', order: 2 },
        ],
        video: u.video || { title: 'Life at our university', url: '', poster: '', caption: 'A glimpse of everyday campus life' },
        gallery: Array.isArray(u.gallery) && u.gallery.length > 0 ? u.gallery : [
          { id: 'gal-1', image: '', alt: 'Students on campus', caption: 'Campus life', order: 0 },
          { id: 'gal-2', image: '', alt: 'Students studying together', caption: 'Study spaces', order: 1 },
          { id: 'gal-3', image: '', alt: 'Student event', caption: 'Student events', order: 2 },
        ],
        internationalPartners: Array.isArray(u.internationalPartners) && u.internationalPartners.length > 0 ? u.internationalPartners : [
          { id: 'partner-1', name: 'INGENIUM European University', type: 'Alliance', description: 'We are part of the INGENIUM European University alliance.', logo: '' },
        ],
        admissionCards: Array.isArray(u.admissionCards) && u.admissionCards.length > 0 ? u.admissionCards : [
          { id: 'adm-1', title: 'How to apply', description: 'Step-by-step guidance through the application process.', detailedContent: 'Submit your application online, upload your documents and track your status.', icon: '' },
          { id: 'adm-2', title: 'Entry requirements', description: 'Academic and language requirements for each programme.', detailedContent: 'Requirements vary by programme; check the programme page for details.', icon: '' },
        ],
        applicationRequirements:
          u.applicationRequirements ||
          'Applicants need a relevant prior qualification, proof of English proficiency and the documents listed on the programme page.',
        admissionContact: u.admissionContact || { email: 'admissions@university.edu', phone: '+358 20 000 000' },
        faqs: Array.isArray(u.faqs) && u.faqs.length > 0 ? u.faqs : [
          { id: 'faq-1', question: 'Do you offer scholarships?', answer: 'Yes, merit- and need-based scholarships are available.', order: 0 },
          { id: 'faq-2', question: 'Is on-campus housing available?', answer: 'Yes, subject to availability. Apply early through the housing portal.', order: 1 },
        ],
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
