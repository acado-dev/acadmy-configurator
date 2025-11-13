export type ContentType = 'images' | 'notes' | 'videos';

export interface CommunityCategory {
  id: string;
  name: string;
  color?: string;
  createdAt: Date;
}

export interface CommunityPost {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  categoryId: string;
  thumbnail?: string;
  media?: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  translations?: {
    [language: string]: {
      title: string;
      description: string;
    };
  };
}
