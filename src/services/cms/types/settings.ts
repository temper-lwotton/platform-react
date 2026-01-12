/**
 * Settings Type Definitions
 */

// General site settings
export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  language: string;
  weekStartsOn: 0 | 1 | 6; // Sunday = 0, Monday = 1, Saturday = 6
}

// Media settings
export interface MediaSettings {
  maxUploadSize: number; // in MB
  allowedFileTypes: string[];
  enableAIAnalysis: boolean;
  autoGenerateAltText: boolean;
  autoOptimizeImages: boolean;
  imageSizes: ImageSize[];
  defaultImageQuality: number; // 1-100
}

export interface ImageSize {
  name: string;
  width: number;
  height: number;
  crop: boolean;
}

// Reading settings
export interface ReadingSettings {
  postsPerPage: number;
  feedPostsPerPage: number;
  feedShowSummary: boolean;
  searchEngineVisibility: boolean; // false = discourage search engines
  defaultPostFormat: 'standard' | 'aside' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video';
}

// Writing settings
export interface WritingSettings {
  defaultPostStatus: 'draft' | 'pending' | 'published';
  defaultCommentStatus: 'open' | 'closed';
  enableAutosave: boolean;
  autosaveInterval: number; // in seconds
  enableRevisions: boolean;
  maxRevisions: number; // 0 = unlimited
  defaultCategory: number | null;
  enableEmoji: boolean;
  enableMarkdown: boolean;
}

// Discussion/Comment settings
export interface DiscussionSettings {
  enableComments: boolean;
  requireNameEmail: boolean;
  requireRegistration: boolean;
  autoCloseComments: boolean;
  autoCloseCommentsDays: number;
  enableThreadedComments: boolean;
  threadedCommentsDepth: number;
  pageComments: boolean;
  commentsPerPage: number;
  commentOrder: 'asc' | 'desc';
  emailOnComment: boolean;
  emailOnModeration: boolean;
  moderationRequired: boolean;
  moderationHoldKeywords: string[]; // List of keywords that trigger moderation
  disallowedKeywords: string[]; // List of keywords that auto-reject
}

// Permalink settings
export interface PermalinkSettings {
  structure: 'plain' | 'day-name' | 'month-name' | 'numeric' | 'post-name' | 'custom';
  customStructure?: string;
  categoryBase: string;
  tagBase: string;
}

// Theme settings
export interface ThemeSettings {
  platformTheme: 'innovation-spectrum' | 'deep-focus' | 'bright-studio' | 'coastal-fusion' | 'custom';
  defaultColorMode: 'light' | 'dark' | 'system';
  allowUserOverride: boolean; // Allow users to override platform theme with their preference
  // Innovation Spectrum (default)
  primaryColor: string; // Purple for creativity
  infoColor: string; // Blue for information
  ctaColor: string; // Orange for CTAs
  accentColor: string; // Lime for success/growth
  // Custom theme overrides (only used when platformTheme is 'custom')
  customPrimaryColor?: string;
  customInfoColor?: string;
  customCtaColor?: string;
  customAccentColor?: string;
}

// Combined settings
export interface CMSSettings {
  general: GeneralSettings;
  media: MediaSettings;
  reading: ReadingSettings;
  writing: WritingSettings;
  discussion: DiscussionSettings;
  permalinks: PermalinkSettings;
  theme: ThemeSettings;
}

// API request/response types
export interface UpdateSettingsRequest {
  category: keyof CMSSettings;
  settings: Partial<GeneralSettings | MediaSettings | ReadingSettings | WritingSettings | DiscussionSettings | PermalinkSettings | ThemeSettings>;
}

export interface SettingsResponse {
  success: boolean;
  data?: CMSSettings;
  error?: {
    code: string;
    message: string;
  };
}
