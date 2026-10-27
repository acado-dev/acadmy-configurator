export interface CourseQuickFact {
  id: string;
  label: string;
  value: string;
}

export interface CourseBenefit {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface CourseSkill {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface CourseCareerPath {
  id: string;
  role: string;
  description: string;
  salaryContext?: string;
  image?: string;
}

export interface CourseTestimonial {
  id: string;
  kind: 'student' | 'faculty';
  name: string;
  title: string;
  quote: string;
  portrait?: string;
}

export interface CourseInfoSection {
  id: string;
  title: string;
  content: string;
}

export interface Course {
  id: string;
  name: string;
  shortName: string;
  courseCode?: string;
  thumbnail?: string;
  bannerImage?: string;
  videoUrl?: string;
  description: string;
  keywords?: string;
  courseCategoryId: string;
  courseLevelId: string;
  courseTypeId: string;
  organizationId: string;
  startDate?: string;
  endDate?: string;
  learningOutcomeIds?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Extended course detail configuration (all optional, additive)
  slug?: string;
  city?: string;
  country?: string;
  language?: string;
  studyMode?: string;
  duration?: string;
  credits?: string;
  intakePeriod?: string;
  applicationOpenDate?: string;
  applicationDeadline?: string;
  applicationStatus?: 'open' | 'closing-soon' | 'closed';
  tuitionFee?: string;
  tuitionCurrency?: string;
  scholarshipAvailable?: boolean;
  heroAltText?: string;
  summary?: string;
  descriptionBlocks?: string[];
  highlightCallout?: string;
  quickFacts?: CourseQuickFact[];
  benefits?: CourseBenefit[];
  programmeGuideUrl?: string;
  programmeGuideName?: string;
  outcomeBullets?: string[];
  skills?: CourseSkill[];
  careerPaths?: CourseCareerPath[];
  testimonials?: CourseTestimonial[];
  infoSections?: CourseInfoSection[];
}
