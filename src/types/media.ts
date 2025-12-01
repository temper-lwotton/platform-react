export type MediaOrientation = 'portrait' | 'landscape' | 'square';
export type MediaType = 'image' | 'video';
export type AspectRatio = '1:1' | '4:3' | '16:9' | '9:16' | '3:4';

export interface AIDetectedTag {
  id: string;
  label: string;
  confidence: number; // 0-1
  category: 'object' | 'person' | 'emotion' | 'scene' | 'color' | 'text';
}

export interface AIAnalysis {
  tags: AIDetectedTag[];
  peopleCount: number;
  dominantColors: string[];
  suggestedAltTexts: string[];
  faces?: {
    x: number;
    y: number;
    width: number;
    height: number;
    emotion?: string;
  }[];
}

export interface SmartCrop {
  id: string;
  aspectRatio: AspectRatio;
  x: number;
  y: number;
  width: number;
  height: number;
  useGenerativeFill: boolean;
}

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  filename: string;
  seoFilename?: string; // SEO-optimized filename
  type: MediaType;
  orientation: MediaOrientation;
  width: number;
  height: number;
  size: number; // bytes
  uploadedAt: Date;
  uploadedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  altText?: string;
  aiAnalysis: AIAnalysis;
  smartCrops: SmartCrop[];
  tags: string[]; // user-added tags
}

export interface MediaLibraryFilters {
  search: string;
  type?: MediaType;
  orientation?: MediaOrientation;
  aiTags: string[];
  peopleCount?: {
    min: number;
    max: number;
  };
  emotions: string[];
  colors: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}
