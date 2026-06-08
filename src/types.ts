export interface Memory {
  id: string;
  chapterId: string;
  date: string; // e.g. "JUIN 2024"
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  tilt: 'left' | 'right';
  isCustom?: boolean;
}

export interface LoveNote {
  id: string;
  text: string;
  icon?: string;
  sealText?: string;
  badge?: string;
  tilt: 'left' | 'right' | 'none';
  floatClass: 'note-float' | 'note-float-delayed' | 'note-float-more';
  isCustom?: boolean;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  tilt: 'left' | 'right' | 'none';
  comments?: { author: string; text: string; date: string }[];
  isCustom?: boolean;
  videoUrl?: string; // High-performance support for hover-to-play videos
}

export interface VideoItem {
  id: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  videoUrl?: string; // simulator handles placeholder video click nicely
  imageAlt: string;
}

export interface Chapter {
  id: string;
  num: string;
  title: string;
  description: string;
  icon: string;
}
