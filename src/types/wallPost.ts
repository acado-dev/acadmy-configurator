export interface WallPost {
  id: string;
  description: string;
  media?: string;
  mediaType?: 'image' | 'video';
  createdAt: Date;
  updatedAt: Date;
}
