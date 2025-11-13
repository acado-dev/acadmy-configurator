export interface Reel {
  id: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number; // in seconds
  captionUrl?: string; // .srt file
  language: string;
  visibility: 'public' | 'organization' | 'private';
  status: 'draft' | 'active' | 'inactive';
  scheduledPublishAt?: Date;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}
