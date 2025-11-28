export interface WallCategory {
  id: string;
  name: string;
  language: string;
  tagline?: string;
  description?: string;
  defaultImage?: string;
  coverImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
