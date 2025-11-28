export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'link';
  url: string;
  thumbnail?: string;
  caption?: string;
  // For link previews
  title?: string;
  description?: string;
  favicon?: string;
}

export interface StatusUpdate {
  id: string;
  userId: string;

  // Content
  text: string;                 // Max 280 chars
  emoji?: string;               // Single emoji
  template?: 'research' | 'building' | 'analyzing' | 'collaborating' | 'presenting' | 'custom';

  // Media attachments
  media?: MediaAttachment[];

  // Context
  space: {
    id: string;
    title: string;
  };

  project?: {
    id: string;
    name: string;
  };

  tags?: Array<{ id: number; name: string }>;
  link?: string;

  // Author info
  author: {
    id: string;
    fullName: string;
    jobTitle?: string;
    photo?: string;
  };

  // Metadata
  type: 'status-update';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;           // Auto-archive after 7 days

  // Engagement
  likesCount: number;
  commentsCount: number;

  // Privacy
  visibility: 'all-spaces' | 'selected-spaces' | 'profile-only';
  sharedWithSpaces?: string[];
}

export interface UserStatus {
  statusUpdateId?: string;      // References latest StatusUpdate
  text: string;
  emoji?: string;
  updatedAt: string;
  visibility: 'public' | 'spaces' | 'private';
}

export interface QuickTemplate {
  id: string;
  emoji: string;
  label: string;
  placeholder: string;
}

export const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    id: 'research',
    emoji: '🔬',
    label: 'Research & Analysis',
    placeholder: 'What are you researching?'
  },
  {
    id: 'building',
    emoji: '🚀',
    label: 'Building/Launching',
    placeholder: 'What are you building?'
  },
  {
    id: 'analyzing',
    emoji: '📊',
    label: 'Data Analysis',
    placeholder: 'What data are you analyzing?'
  },
  {
    id: 'collaborating',
    emoji: '🤝',
    label: 'Seeking Collaboration',
    placeholder: 'What do you need help with?'
  },
  {
    id: 'presenting',
    emoji: '💡',
    label: 'Presenting/Sharing',
    placeholder: 'What are you presenting?'
  },
  {
    id: 'writing',
    emoji: '📝',
    label: 'Writing/Documentation',
    placeholder: 'What are you documenting?'
  },
];

export const COMMON_EMOJIS = [
  '🚌', '🚗', '🚆', '🚲', '⚡', '🔋', '🌱', '📊',
  '🔬', '💡', '🏗️', '📝', '🤝', '🚀', '📈', '🎯',
  '🔧', '💻', '📱', '🌍', '♻️', '🔋', '⚙️', '🎓'
];

// Mock data for development
export const mockStatusUpdates: StatusUpdate[] = [
  {
    id: '1',
    userId: '5',
    text: 'Analyzing traffic data from our electric bus pilot program',
    emoji: '📊',
    template: 'analyzing',
    media: [
      {
        id: 'media-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop',
        caption: 'Traffic flow heatmap from last week'
      },
      {
        id: 'media-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        caption: 'Energy consumption dashboard'
      }
    ],
    space: {
      id: '23',
      title: 'Electric Vehicles'
    },
    project: {
      id: 'proj_1',
      name: 'City Transit Electrification'
    },
    author: {
      id: '5',
      fullName: 'Luke Wotton',
      jobTitle: 'Transport Innovation Lead',
      photo: '/avatars/luke.jpg'
    },
    type: 'status-update',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likesCount: 3,
    commentsCount: 1,
    visibility: 'all-spaces',
    tags: [
      { id: 1, name: 'electric-vehicles' },
      { id: 2, name: 'data-analysis' }
    ]
  },
  {
    id: '2',
    userId: '12',
    text: 'Preparing presentation for sustainable transport conference next week',
    emoji: '💡',
    template: 'presenting',
    media: [
      {
        id: 'media-3',
        type: 'link',
        url: 'https://www.sustainabletransport.org/conference2024',
        title: 'Global Sustainable Transport Conference 2024',
        description: 'Join us for the premier event on sustainable mobility solutions',
        favicon: 'https://www.sustainabletransport.org/favicon.ico',
        thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'
      }
    ],
    space: {
      id: '28',
      title: 'Sustainable Transport'
    },
    author: {
      id: '12',
      fullName: 'Sarah Chen',
      jobTitle: 'Sustainability Consultant',
      photo: '/avatars/sarah.jpg'
    },
    type: 'status-update',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likesCount: 8,
    commentsCount: 3,
    visibility: 'all-spaces'
  },
  {
    id: '3',
    userId: '8',
    text: 'Testing new battery management system for our fleet. First results are promising!',
    emoji: '🔋',
    template: 'building',
    media: [
      {
        id: 'media-4',
        type: 'video',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop',
        caption: 'Battery system test run'
      }
    ],
    space: {
      id: '23',
      title: 'Electric Vehicles'
    },
    author: {
      id: '8',
      fullName: 'James Miller',
      jobTitle: 'Fleet Manager',
      photo: '/avatars/james.jpg'
    },
    type: 'status-update',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likesCount: 5,
    commentsCount: 2,
    visibility: 'all-spaces'
  }
];

// Helper function to get user's current status
export function getCurrentUserStatus(): UserStatus | null {
  // In real implementation, this would fetch from API
  // For now, return mock data for current user (Luke Wotton, user ID 5)
  const latestUpdate = mockStatusUpdates.find(u => u.userId === '5');

  if (!latestUpdate) return null;

  return {
    statusUpdateId: latestUpdate.id,
    text: latestUpdate.text,
    emoji: latestUpdate.emoji,
    updatedAt: latestUpdate.updatedAt,
    visibility: 'public'
  };
}

// Helper function to get status updates by space
export function getStatusUpdatesBySpace(spaceId: string): StatusUpdate[] {
  return mockStatusUpdates.filter(update => update.space.id === spaceId);
}

// Helper function to format time ago
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
