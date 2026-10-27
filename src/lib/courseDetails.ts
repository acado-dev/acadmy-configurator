import { Course } from '@/types/course';

const INTERESTS_KEY = 'courseInterests';

export interface CourseInterest {
  courseId: string;
  userKey: string;
  createdAt: string;
}

export const readCourseInterests = (): CourseInterest[] => {
  try {
    return JSON.parse(localStorage.getItem(INTERESTS_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeCourseInterests = (interests: CourseInterest[]) => {
  localStorage.setItem(INTERESTS_KEY, JSON.stringify(interests));
};

export const getInterestUserKey = (): string => {
  try {
    const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
    if (auth?.email) return String(auth.email).toLowerCase();
    if (auth?.id) return String(auth.id);
  } catch {
    // ignore
  }
  return 'guest';
};

export const getCourseInterestCount = (courseId: string): number => {
  const interests = readCourseInterests().filter((i) => i.courseId === courseId);
  return new Set(interests.map((i) => i.userKey)).size;
};

export const hasUserMarkedInterest = (courseId: string, userKey: string): boolean =>
  readCourseInterests().some((i) => i.courseId === courseId && i.userKey === userKey);

export const markCourseInterest = (
  courseId: string,
  userKey: string
): { added: boolean; count: number } => {
  const interests = readCourseInterests();
  const exists = interests.some((i) => i.courseId === courseId && i.userKey === userKey);
  if (!exists) {
    interests.push({ courseId, userKey, createdAt: new Date().toISOString() });
    writeCourseInterests(interests);
  }
  return { added: !exists, count: getCourseInterestCount(courseId) };
};

export const unmarkCourseInterest = (
  courseId: string,
  userKey: string
): { removed: boolean; count: number } => {
  const interests = readCourseInterests();
  const next = interests.filter((i) => !(i.courseId === courseId && i.userKey === userKey));
  const removed = next.length !== interests.length;
  if (removed) writeCourseInterests(next);
  return { removed, count: getCourseInterestCount(courseId) };
};

export const newEntryId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Seeds one fully-configured demo course (matching the learner-facing reference
 * design) into the master `courses` store so every screen has rich sample data.
 * Runs once; never overwrites existing detail content.
 */
export const ensureCourseDetailsSeed = () => {
  let courses: Course[] = [];
  try {
    courses = JSON.parse(localStorage.getItem('courses') || '[]');
  } catch {
    return;
  }
  if (courses.some((c) => c.summary)) return; // already seeded / configured

  const categories = JSON.parse(localStorage.getItem('courseCategories') || '[]');
  const levels = JSON.parse(localStorage.getItem('courseLevels') || '[]');
  const types = JSON.parse(localStorage.getItem('courseTypes') || '[]');
  const universities = JSON.parse(localStorage.getItem('universities') || '[]');

  const now = new Date().toISOString();
  const demo: Course = {
    id: 'course-demo-fellowship',
    name: 'Research Fellowship in Business Innovation',
    shortName: 'RF Business Innovation',
    courseCode: 'RF-BI-01',
    description:
      'The Research Fellowship in Business Innovation at Xamk University of Applied Sciences combines academic depth with applied practice. Students work in small cohorts, learn through project-based assignments and complete a supervised placement with a partner organisation before graduating.',
    keywords: 'business, innovation, research, fellowship',
    courseCategoryId: categories[0]?.id || 'cat-business',
    courseLevelId: levels[0]?.id || 'lvl-research',
    courseTypeId: types[0]?.id || 'type-fellowship',
    organizationId: universities[0]?.id || 'u-jamk',
    startDate: '2027-01-15',
    endDate: '2028-06-30',
    learningOutcomeIds: [],
    isActive: true,
    createdAt: now,
    updatedAt: now,
    slug: 'research-fellowship-business-innovation',
    city: 'Mikkeli',
    country: 'Finland',
    language: 'English',
    studyMode: 'Full-time',
    duration: '18 months',
    credits: 'Research',
    intakePeriod: 'January 2027',
    applicationOpenDate: '2026-09-01',
    applicationDeadline: '2027-10-01',
    applicationStatus: 'open',
    tuitionFee: '0',
    tuitionCurrency: 'EUR',
    scholarshipAvailable: true,
    heroAltText: 'Xamk campus building in Mikkeli, Finland',
    summary:
      'A funded fellowship investigating innovation policy and regional business ecosystems with partner companies and municipalities.',
    descriptionBlocks: [
      'The Research Fellowship in Business Innovation at Xamk University of Applied Sciences combines academic depth with applied practice.',
      'Students work in small cohorts, learn through project-based assignments and complete a supervised placement with a partner organisation before graduating.',
    ],
    highlightCallout: 'Fellowships · 18 months · Research — English · Mikkeli, Finland',
    quickFacts: [
      { id: 'qf-1', label: 'Degree', value: 'Fellowships' },
      { id: 'qf-2', label: 'Duration', value: '18 months' },
      { id: 'qf-3', label: 'ECTS Credits', value: 'Research' },
      { id: 'qf-4', label: 'Language', value: 'English' },
    ],
    benefits: [
      {
        id: 'bn-1',
        title: 'Learn',
        description: 'Turn knowledge into a new perspective.',
      },
      {
        id: 'bn-2',
        title: 'Apply',
        description: 'Put your ideas to work.',
      },
      {
        id: 'bn-3',
        title: 'Grow',
        description: 'Make room for your next chapter.',
      },
    ],
    outcomeBullets: [
      'Apply core Business theory to authentic, industry-defined problems.',
      'Design, test and document solutions using current professional tooling.',
      'Work effectively in multicultural, cross-disciplinary project teams.',
      'Communicate findings clearly to technical and non-technical audiences.',
      'Reflect critically on ethics, sustainability and regulatory context.',
    ],
    skills: [
      {
        id: 'sk-1',
        title: 'Applied Research',
        description: 'Frame and run applied research projects with industry partners.',
      },
      {
        id: 'sk-2',
        title: 'Innovation Policy',
        description: 'Analyse regional innovation ecosystems and policy instruments.',
      },
      {
        id: 'sk-3',
        title: 'Stakeholder Communication',
        description: 'Present findings to companies, municipalities and academic audiences.',
      },
    ],
    careerPaths: [
      {
        id: 'cp-1',
        role: 'Business Analyst',
        description: 'Translate research insight into business decisions for growth companies.',
        salaryContext: 'Typical range €42k–€58k in Finland',
      },
      {
        id: 'cp-2',
        role: 'Innovation Consultant',
        description: 'Advise organisations on innovation strategy and funding instruments.',
      },
      {
        id: 'cp-3',
        role: 'Market Research Analyst',
        description: 'Design and run market studies for regional development agencies.',
      },
      {
        id: 'cp-4',
        role: 'Business Development Manager',
        description: 'Lead partner networks and commercialisation of research results.',
      },
    ],
    testimonials: [
      {
        id: 'tm-s1',
        kind: 'student',
        name: 'Vilde Bryn',
        title: "Master's student, Xamk University of Applied Sciences",
        quote:
          'The projects helped me connect what I learned in class with the challenges I want to solve in my career.',
      },
      {
        id: 'tm-s2',
        kind: 'student',
        name: 'Amira Hassan',
        title: "Bachelor's student, Xamk University of Applied Sciences",
        quote: 'My cohort came from six countries, and that changed how I work.',
      },
      {
        id: 'tm-s3',
        kind: 'student',
        name: 'Jonas Lindqvist',
        title: 'Final-year student, Xamk University of Applied Sciences',
        quote: 'The practical placement turned course theory into portfolio work.',
      },
      {
        id: 'tm-f1',
        kind: 'faculty',
        name: 'Dr. Kaarina Virtanen',
        title: 'Programme Director, Xamk University of Applied Sciences',
        quote: 'We teach students to ask better questions, not memorise answers.',
      },
      {
        id: 'tm-f2',
        kind: 'faculty',
        name: 'Dr. Henrik Sørensen',
        title: 'Associate Professor, Xamk University of Applied Sciences',
        quote: 'Small supervision groups make independent work possible.',
      },
      {
        id: 'tm-f3',
        kind: 'faculty',
        name: 'Prof. Marcus Connolly',
        title: 'Senior Lecturer, Xamk University of Applied Sciences',
        quote: 'We review the curriculum with industry partners every year.',
      },
    ],
    infoSections: [
      {
        id: 'is-1',
        title: 'Curriculum',
        content:
          'Innovation theory and research methods in term one; applied research cases with partner companies in term two; supervised placement and thesis in the final term.',
      },
      {
        id: 'is-2',
        title: 'Language of Instruction',
        content: 'All courses, supervision and assessment are delivered in English.',
      },
      {
        id: 'is-3',
        title: 'Eligibility Criteria',
        content:
          "A recognised bachelor's degree in business, economics or a related field, and English proficiency at B2 level or higher.",
      },
      {
        id: 'is-4',
        title: 'Required Documents',
        content:
          'Degree certificate and transcript, CV, motivation letter, and proof of English proficiency.',
      },
      {
        id: 'is-5',
        title: 'Fees & Funding',
        content:
          'No tuition fee. The fellowship includes a monthly research grant for the placement period.',
      },
      {
        id: 'is-6',
        title: 'Scholarships',
        content:
          'Merit-based travel grants and conference funding are available for all fellows.',
      },
      {
        id: 'is-7',
        title: 'Industry Collaborations',
        content:
          'Business Finland – Co-funded research cases with Finnish growth companies.\nRegional SME network – Fellows partner with local companies on applied innovation research.',
      },
      {
        id: 'is-8',
        title: 'International Partners',
        content:
          'Exchange and co-supervision agreements with partner universities across the EU.',
      },
      {
        id: 'is-9',
        title: 'Accommodation',
        content:
          'Student housing is available in Mikkeli within walking distance of the campus.',
      },
      {
        id: 'is-10',
        title: 'Visa Support',
        content:
          'The international office supports residence permit applications and arrival services.',
      },
      {
        id: 'is-11',
        title: 'Frequently Asked Questions',
        content:
          'Can I work during the fellowship? Part-time work is possible alongside the research plan.\nIs the programme fully on-site? Yes, with hybrid supervision during the placement term.',
      },
    ],
  };

  const existing = courses.findIndex((c) => c.id === demo.id);
  if (existing >= 0) {
    courses[existing] = { ...courses[existing], ...demo, id: demo.id };
  } else {
    courses.push(demo);
  }
  localStorage.setItem('courses', JSON.stringify(courses));

  // Seed a couple of interest records so the counter shows sample data
  if (getCourseInterestCount(demo.id) === 0) {
    writeCourseInterests([
      { courseId: demo.id, userKey: 'jane@example.com', createdAt: now },
      { courseId: demo.id, userKey: 'arjun@example.com', createdAt: now },
      { courseId: demo.id, userKey: 'maria@example.com', createdAt: now },
    ]);
  }
};
