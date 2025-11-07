export interface LearningOutcome {
  id: string;
  name: string;
  shortName: string;
  code?: string;
  parentId: string | null;
  description?: string;
  keywords?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
