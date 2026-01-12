/**
 * Settings API Service
 * Mock implementation using localStorage (replace with actual API calls later)
 */

import type {
  CMSSettings,
  GeneralSettings,
  MediaSettings,
  ReadingSettings,
  WritingSettings,
  DiscussionSettings,
  PermalinkSettings,
  ThemeSettings,
  UpdateSettingsRequest,
} from '../types/settings';

const STORAGE_KEY = 'cms_settings';

// Default settings
const defaultSettings: CMSSettings = {
  general: {
    siteName: 'My CMS Site',
    siteDescription: 'Just another CMS site',
    siteUrl: 'http://localhost:3000',
    adminEmail: 'admin@example.com',
    timezone: 'America/New_York',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    language: 'en',
    weekStartsOn: 0,
  },
  media: {
    maxUploadSize: 10,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    enableAIAnalysis: true,
    autoGenerateAltText: true,
    autoOptimizeImages: true,
    imageSizes: [
      { name: 'thumbnail', width: 150, height: 150, crop: true },
      { name: 'medium', width: 300, height: 300, crop: false },
      { name: 'large', width: 1024, height: 1024, crop: false },
      { name: 'full', width: 2048, height: 2048, crop: false },
    ],
    defaultImageQuality: 85,
  },
  reading: {
    postsPerPage: 10,
    feedPostsPerPage: 10,
    feedShowSummary: true,
    searchEngineVisibility: true,
    defaultPostFormat: 'standard',
  },
  writing: {
    defaultPostStatus: 'draft',
    defaultCommentStatus: 'open',
    enableAutosave: true,
    autosaveInterval: 60,
    enableRevisions: true,
    maxRevisions: 10,
    defaultCategory: null,
    enableEmoji: true,
    enableMarkdown: false,
  },
  discussion: {
    enableComments: true,
    requireNameEmail: true,
    requireRegistration: false,
    autoCloseComments: false,
    autoCloseCommentsDays: 30,
    enableThreadedComments: true,
    threadedCommentsDepth: 5,
    pageComments: false,
    commentsPerPage: 50,
    commentOrder: 'asc',
    emailOnComment: true,
    emailOnModeration: true,
    moderationRequired: false,
    moderationHoldKeywords: [],
    disallowedKeywords: [],
  },
  permalinks: {
    structure: 'post-name',
    categoryBase: 'category',
    tagBase: 'tag',
  },
  theme: {
    platformTheme: 'innovation-spectrum',
    defaultColorMode: 'light',
    allowUserOverride: true,
    primaryColor: '#8b5cf6', // Vibrant purple
    infoColor: '#3b82f6', // Electric blue
    ctaColor: '#f97316', // Coral orange
    accentColor: '#C0F23C', // Lime green
  },
};

/**
 * Get settings from localStorage or return defaults
 */
function getStoredSettings(): CMSSettings {
  if (typeof window === 'undefined') return defaultSettings;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: CMSSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

/**
 * Get all CMS settings
 */
export async function getSettings(): Promise<{ data: CMSSettings; success: boolean }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const settings = getStoredSettings();
  return {
    data: settings,
    success: true,
  };
}

/**
 * Get specific settings category
 */
export async function getSettingsCategory<K extends keyof CMSSettings>(
  category: K
): Promise<{ data: CMSSettings[K]; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 100));

  const settings = getStoredSettings();
  return {
    data: settings[category],
    success: true,
  };
}

/**
 * Update general settings
 */
export async function updateGeneralSettings(
  updates: Partial<GeneralSettings>
): Promise<{ data: GeneralSettings; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const settings = getStoredSettings();
  const updatedGeneral = { ...settings.general, ...updates };
  const newSettings = { ...settings, general: updatedGeneral };

  saveSettings(newSettings);

  return {
    data: updatedGeneral,
    success: true,
  };
}

/**
 * Update media settings
 */
export async function updateMediaSettings(
  updates: Partial<MediaSettings>
): Promise<{ data: MediaSettings; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const settings = getStoredSettings();
  const updatedMedia = { ...settings.media, ...updates };
  const newSettings = { ...settings, media: updatedMedia };

  saveSettings(newSettings);

  return {
    data: updatedMedia,
    success: true,
  };
}

/**
 * Update reading settings
 */
export async function updateReadingSettings(
  updates: Partial<ReadingSettings>
): Promise<{ data: ReadingSettings; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const settings = getStoredSettings();
  const updatedReading = { ...settings.reading, ...updates };
  const newSettings = { ...settings, reading: updatedReading };

  saveSettings(newSettings);

  return {
    data: updatedReading,
    success: true,
  };
}

/**
 * Update writing settings
 */
export async function updateWritingSettings(
  updates: Partial<WritingSettings>
): Promise<{ data: WritingSettings; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const settings = getStoredSettings();
  const updatedWriting = { ...settings.writing, ...updates };
  const newSettings = { ...settings, writing: updatedWriting };

  saveSettings(newSettings);

  return {
    data: updatedWriting,
    success: true,
  };
}

/**
 * Update discussion settings
 */
export async function updateDiscussionSettings(
  updates: Partial<DiscussionSettings>
): Promise<{ data: DiscussionSettings; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const settings = getStoredSettings();
  const updatedDiscussion = { ...settings.discussion, ...updates };
  const newSettings = { ...settings, discussion: updatedDiscussion };

  saveSettings(newSettings);

  return {
    data: updatedDiscussion,
    success: true,
  };
}

/**
 * Update permalink settings
 */
export async function updatePermalinkSettings(
  updates: Partial<PermalinkSettings>
): Promise<{ data: PermalinkSettings; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const settings = getStoredSettings();
  const updatedPermalinks = { ...settings.permalinks, ...updates };
  const newSettings = { ...settings, permalinks: updatedPermalinks };

  saveSettings(newSettings);

  return {
    data: updatedPermalinks,
    success: true,
  };
}

/**
 * Update theme settings
 */
export async function updateThemeSettings(
  updates: Partial<ThemeSettings>
): Promise<{ data: ThemeSettings; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const settings = getStoredSettings();
  const updatedTheme = { ...settings.theme, ...updates };
  const newSettings = { ...settings, theme: updatedTheme };

  saveSettings(newSettings);

  // Emit custom event to notify ThemeContext of changes
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('platform-theme-change', { detail: updatedTheme }));
  }

  return {
    data: updatedTheme,
    success: true,
  };
}

/**
 * Reset settings to defaults
 */
export async function resetSettings(): Promise<{ data: CMSSettings; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  saveSettings(defaultSettings);

  return {
    data: defaultSettings,
    success: true,
  };
}
