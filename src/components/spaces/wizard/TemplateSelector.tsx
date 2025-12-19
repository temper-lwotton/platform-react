'use client';

import { useState } from 'react';
import {
  Briefcase,
  Users,
  GraduationCap,
  PartyPopper,
  Network,
  Palette,
  Wrench,
  Sparkles,
  MessageSquare,
  FileText,
  Calendar,
  FolderKanban,
  LifeBuoy,
  Home,
} from 'lucide-react';
import { SpaceData } from '../SpaceCreationWizard';
import styles from './TemplateSelector.module.scss';

interface TemplateSelectorProps {
  spaceData: SpaceData;
  setSpaceData: (data: SpaceData) => void;
  useAIDefaults: boolean;
}

interface SpaceTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  channels: { id: string; name: string; description: string; icon: string }[];
  tags: string[];
  recommendedPrivacy: 'public' | 'private' | 'unlisted';
  recommendedJoinSetting: 'open' | 'request' | 'invite';
  useCases: string[];
}

const templates: SpaceTemplate[] = [
  {
    id: 'team-workspace',
    name: 'Team Workspace',
    description: 'For teams collaborating on projects with tasks, docs, and discussions',
    icon: <Briefcase />,
    color: '#667eea',
    channels: [
      { id: 'general', name: 'General', description: 'Team announcements and updates', icon: '📢' },
      { id: 'projects', name: 'Projects', description: 'Project discussions and planning', icon: '📁' },
      { id: 'random', name: 'Random', description: 'Casual conversations', icon: '💬' },
      { id: 'resources', name: 'Resources', description: 'Shared documents and files', icon: '📚' },
      { id: 'help', name: 'Help', description: 'Questions and support', icon: '❓' },
    ],
    tags: ['team', 'workspace', 'collaboration'],
    recommendedPrivacy: 'private',
    recommendedJoinSetting: 'request',
    useCases: ['Work teams', 'Remote teams', 'Project collaboration'],
  },
  {
    id: 'community-hub',
    name: 'Community Hub',
    description: 'Build an engaged community with discussions, events, and resources',
    icon: <Users />,
    color: '#10b981',
    channels: [
      { id: 'welcome', name: 'Welcome', description: 'New member introductions', icon: '👋' },
      { id: 'discussions', name: 'Discussions', description: 'General community chat', icon: '💬' },
      { id: 'events', name: 'Events', description: 'Upcoming community events', icon: '🎉' },
      { id: 'showcase', name: 'Showcase', description: 'Share your work', icon: '✨' },
      { id: 'feedback', name: 'Feedback', description: 'Suggestions and ideas', icon: '💡' },
    ],
    tags: ['community', 'social', 'networking'],
    recommendedPrivacy: 'public',
    recommendedJoinSetting: 'open',
    useCases: ['Brand communities', 'Interest groups', 'Fan clubs'],
  },
  {
    id: 'learning-hub',
    name: 'Learning Hub',
    description: 'Educational space for courses, Q&A, and knowledge sharing',
    icon: <GraduationCap />,
    color: '#f59e0b',
    channels: [
      { id: 'announcements', name: 'Announcements', description: 'Course updates', icon: '📢' },
      { id: 'lessons', name: 'Lessons', description: 'Course content and materials', icon: '📖' },
      { id: 'qa', name: 'Q&A', description: 'Ask questions and get help', icon: '❓' },
      { id: 'assignments', name: 'Assignments', description: 'Submit and discuss work', icon: '📝' },
      { id: 'resources', name: 'Resources', description: 'Extra learning materials', icon: '📚' },
    ],
    tags: ['education', 'learning', 'courses'],
    recommendedPrivacy: 'private',
    recommendedJoinSetting: 'invite',
    useCases: ['Online courses', 'Study groups', 'Training programs'],
  },
  {
    id: 'event-space',
    name: 'Event Space',
    description: 'Temporary space for conferences, meetups, and special events',
    icon: <PartyPopper />,
    color: '#ec4899',
    channels: [
      { id: 'info', name: 'Event Info', description: 'Details and schedule', icon: 'ℹ️' },
      { id: 'lobby', name: 'Lobby', description: 'Meet and greet', icon: '🚪' },
      { id: 'sessions', name: 'Sessions', description: 'Live session discussions', icon: '🎤' },
      { id: 'networking', name: 'Networking', description: 'Connect with attendees', icon: '🤝' },
      { id: 'qa', name: 'Q&A', description: 'Speaker questions', icon: '❓' },
    ],
    tags: ['event', 'conference', 'meetup'],
    recommendedPrivacy: 'unlisted',
    recommendedJoinSetting: 'request',
    useCases: ['Conferences', 'Webinars', 'Workshops'],
  },
  {
    id: 'professional-network',
    name: 'Professional Network',
    description: 'Industry groups, alumni networks, and professional communities',
    icon: <Network />,
    color: '#3b82f6',
    channels: [
      { id: 'intros', name: 'Introductions', description: 'Member introductions', icon: '👋' },
      { id: 'jobs', name: 'Jobs', description: 'Career opportunities', icon: '💼' },
      { id: 'industry', name: 'Industry News', description: 'Latest updates', icon: '📰' },
      { id: 'mentorship', name: 'Mentorship', description: 'Connect and learn', icon: '🎓' },
      { id: 'events', name: 'Events', description: 'Networking events', icon: '📅' },
    ],
    tags: ['professional', 'networking', 'career'],
    recommendedPrivacy: 'private',
    recommendedJoinSetting: 'request',
    useCases: ['Alumni groups', 'Industry associations', 'Professional orgs'],
  },
  {
    id: 'creator-fanclub',
    name: 'Creator Fan Club',
    description: 'Exclusive community for creators, influencers, and their supporters',
    icon: <Palette />,
    color: '#8b5cf6',
    channels: [
      { id: 'welcome', name: 'Welcome', description: 'Say hello!', icon: '👋' },
      { id: 'exclusive', name: 'Exclusive Content', description: 'Members-only posts', icon: '⭐' },
      { id: 'chat', name: 'Chat', description: 'Community discussions', icon: '💬' },
      { id: 'feedback', name: 'Feedback', description: 'Share your thoughts', icon: '💭' },
      { id: 'polls', name: 'Polls', description: 'Vote and decide', icon: '📊' },
    ],
    tags: ['creator', 'fans', 'community'],
    recommendedPrivacy: 'private',
    recommendedJoinSetting: 'invite',
    useCases: ['YouTubers', 'Podcasters', 'Content creators'],
  },
  {
    id: 'support-community',
    name: 'Support Community',
    description: 'Customer support and help center for your products or services',
    icon: <LifeBuoy />,
    color: '#06b6d4',
    channels: [
      { id: 'help', name: 'Help Desk', description: 'Get support', icon: '🆘' },
      { id: 'faqs', name: 'FAQs', description: 'Common questions', icon: '❓' },
      { id: 'guides', name: 'Guides', description: 'How-to articles', icon: '📖' },
      { id: 'feedback', name: 'Feedback', description: 'Product suggestions', icon: '💡' },
      { id: 'announcements', name: 'Announcements', description: 'Product updates', icon: '📢' },
    ],
    tags: ['support', 'help', 'customer'],
    recommendedPrivacy: 'public',
    recommendedJoinSetting: 'open',
    useCases: ['Customer support', 'Product communities', 'Help centers'],
  },
  {
    id: 'custom',
    name: 'Custom Space',
    description: 'Start from scratch and build exactly what you need',
    icon: <Wrench />,
    color: '#64748b',
    channels: [
      { id: 'general', name: 'General', description: 'Main discussion channel', icon: '💬' },
    ],
    tags: [],
    recommendedPrivacy: 'private',
    recommendedJoinSetting: 'request',
    useCases: ['Custom use case'],
  },
];

export function TemplateSelector({
  spaceData,
  setSpaceData,
  useAIDefaults,
}: TemplateSelectorProps) {
  const [aiInput, setAiInput] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<SpaceTemplate | null>(null);
  const [showAIInput, setShowAIInput] = useState(false);

  const handleTemplateSelect = (template: SpaceTemplate) => {
    setSpaceData({
      ...spaceData,
      templateId: template.id,
      channels: template.channels,
      tags: template.tags,
      visibility: template.recommendedPrivacy,
      joinSetting: template.recommendedJoinSetting,
      colorPalette: [template.color, '#764ba2'],
    });
  };

  const handleAISuggest = () => {
    // Simple AI suggestion based on keywords
    const input = aiInput.toLowerCase();

    if (input.includes('team') || input.includes('work') || input.includes('project')) {
      setAiSuggestion(templates[0]); // Team Workspace
    } else if (input.includes('community') || input.includes('fans') || input.includes('brand')) {
      setAiSuggestion(templates[1]); // Community Hub
    } else if (input.includes('learn') || input.includes('course') || input.includes('education')) {
      setAiSuggestion(templates[2]); // Learning Hub
    } else if (input.includes('event') || input.includes('conference') || input.includes('meetup')) {
      setAiSuggestion(templates[3]); // Event Space
    } else if (input.includes('professional') || input.includes('network') || input.includes('career')) {
      setAiSuggestion(templates[4]); // Professional Network
    } else if (input.includes('creator') || input.includes('fan') || input.includes('exclusive')) {
      setAiSuggestion(templates[5]); // Creator Fan Club
    } else if (input.includes('support') || input.includes('help') || input.includes('customer')) {
      setAiSuggestion(templates[6]); // Support Community
    } else {
      setAiSuggestion(templates[7]); // Custom
    }
  };

  return (
    <div className={styles.templateSelector}>
      <div className={styles.header}>
        <h2>Choose Your Starting Point</h2>
        <p>Select a template that matches your space's purpose, or let AI help you decide</p>
      </div>

      {/* AI Input Section */}
      <div className={styles.aiSection}>
        <button
          onClick={() => setShowAIInput(!showAIInput)}
          className={styles.aiToggle}
        >
          <Sparkles />
          {showAIInput ? 'Hide AI Assistant' : 'Let AI Suggest a Template'}
        </button>

        {showAIInput && (
          <div className={styles.aiInput}>
            <div className={styles.aiInputHeader}>
              <Sparkles />
              <h3>Describe your space</h3>
            </div>
            <p>Tell me what you're building and I'll suggest the best template</p>
            <textarea
              placeholder="e.g., A space for my design team to collaborate on client projects..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              rows={3}
            />
            <button onClick={handleAISuggest} disabled={!aiInput}>
              Get AI Suggestion
            </button>

            {aiSuggestion && (
              <div className={styles.aiSuggestionResult}>
                <div className={styles.suggestionHeader}>
                  <Sparkles />
                  <strong>AI Recommendation</strong>
                </div>
                <p>
                  Based on your description, I recommend the <strong>{aiSuggestion.name}</strong>{' '}
                  template because it's designed for {aiSuggestion.description.toLowerCase()}
                </p>
                <button
                  onClick={() => handleTemplateSelect(aiSuggestion)}
                  className={styles.useAISuggestion}
                >
                  Use This Template
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Template Grid */}
      <div className={styles.templatesGrid}>
        {templates.map((template) => (
          <div
            key={template.id}
            className={`${styles.templateCard} ${
              spaceData.templateId === template.id ? styles.selected : ''
            }`}
            onClick={() => handleTemplateSelect(template)}
            style={{ '--template-color': template.color } as React.CSSProperties}
          >
            <div className={styles.templateIcon} style={{ color: template.color }}>
              {template.icon}
            </div>

            <h3>{template.name}</h3>
            <p className={styles.templateDescription}>{template.description}</p>

            <div className={styles.templateMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Channels</span>
                <span className={styles.metaValue}>{template.channels.length}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Privacy</span>
                <span className={styles.metaValue}>
                  {template.recommendedPrivacy.charAt(0).toUpperCase() +
                    template.recommendedPrivacy.slice(1)}
                </span>
              </div>
            </div>

            <div className={styles.useCases}>
              <span className={styles.useCasesLabel}>Best for:</span>
              {template.useCases.map((useCase, index) => (
                <span key={index} className={styles.useCase}>
                  {useCase}
                </span>
              ))}
            </div>

            {spaceData.templateId === template.id && (
              <div className={styles.selectedBadge}>
                <Sparkles />
                Selected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
