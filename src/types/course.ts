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
}
