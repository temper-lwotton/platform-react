import { Event, formatEventDateRange } from '@/lib/events';
import { Discussion } from '@/lib/discussions';

interface BroadcastTemplate {
  name: string;
  subject: string;
  preheader: string;
  emailContent: {
    blocks: Array<{
      id: string;
      type: 'heading' | 'text' | 'image' | 'button' | 'divider' | 'spacer';
      content: any;
    }>;
  };
}

/**
 * Generate a broadcast template for promoting an event
 */
export function generateEventBroadcast(event: Event): BroadcastTemplate {
  const dateRange = formatEventDateRange(event.eventStart, event.eventEnd);
  const location = event.isOnline ? 'Online Event' : event.location || 'Location TBA';

  // Extract plain text from HTML content
  const getTextPreview = (html: string, maxLength: number = 300): string => {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const description = event.htmlContent
    ? getTextPreview(event.htmlContent)
    : 'Join us for this exciting event!';

  const blocks = [
    {
      id: '1',
      type: 'heading' as const,
      content: { text: event.title, level: 'h1' },
    },
    {
      id: '2',
      type: 'text' as const,
      content: {
        text: `We're excited to invite you to ${event.title}!`,
      },
    },
  ];

  // Add event image if available
  if (event.photo) {
    blocks.push({
      id: '3',
      type: 'image' as const,
      content: {
        url: event.photo,
        alt: event.title,
        width: '100%',
      },
    });
  }

  // Add event details
  blocks.push(
    {
      id: '4',
      type: 'heading' as const,
      content: { text: 'Event Details', level: 'h2' },
    },
    {
      id: '5',
      type: 'text' as const,
      content: {
        text: description,
      },
    },
    {
      id: '6',
      type: 'spacer' as const,
      content: { height: 20 },
    },
    {
      id: '7',
      type: 'text' as const,
      content: {
        text: `📅 ${dateRange}\n📍 ${location}`,
      },
    },
    {
      id: '8',
      type: 'spacer' as const,
      content: { height: 30 },
    }
  );

  // Add event link button if available
  if (event.link) {
    blocks.push({
      id: '9',
      type: 'button' as const,
      content: {
        text: 'View Event Details',
        url: event.link,
        align: 'center',
      },
    });
  }

  return {
    name: `Event Promotion: ${event.title}`,
    subject: `Don't miss: ${event.title}`,
    preheader: `${dateRange} - ${location}`,
    emailContent: { blocks },
  };
}

/**
 * Generate a broadcast template for promoting a discussion
 */
export function generateDiscussionBroadcast(discussion: Discussion, spaceId: string): BroadcastTemplate {
  const authorName = discussion.author?.profile?.fullName
    || `${discussion.author?.profile?.firstName || ''} ${discussion.author?.profile?.lastName || ''}`.trim()
    || 'A community member';

  const excerpt = discussion.excerpt
    ? (discussion.excerpt.length > 300 ? `${discussion.excerpt.slice(0, 300)}...` : discussion.excerpt)
    : 'Join the conversation and share your thoughts!';

  const spaceName = typeof discussion.space === 'object'
    ? discussion.space?.title
    : 'our community';

  const blocks = [
    {
      id: '1',
      type: 'heading' as const,
      content: { text: discussion.title, level: 'h1' },
    },
    {
      id: '2',
      type: 'text' as const,
      content: {
        text: `${authorName} started an interesting discussion in ${spaceName}. Join the conversation!`,
      },
    },
    {
      id: '3',
      type: 'spacer' as const,
      content: { height: 20 },
    },
    {
      id: '4',
      type: 'heading' as const,
      content: { text: 'Discussion Preview', level: 'h2' },
    },
    {
      id: '5',
      type: 'text' as const,
      content: {
        text: excerpt,
      },
    },
    {
      id: '6',
      type: 'spacer' as const,
      content: { height: 30 },
    },
    {
      id: '7',
      type: 'button' as const,
      content: {
        text: 'Join the Discussion',
        url: `${typeof window !== 'undefined' ? window.location.origin : ''}/spaces/${spaceId}/discussions/${discussion.id}`,
        align: 'center',
      },
    },
    {
      id: '8',
      type: 'spacer' as const,
      content: { height: 20 },
    },
    {
      id: '9',
      type: 'divider' as const,
      content: { color: '#e5e7eb', thickness: 1 },
    },
    {
      id: '10',
      type: 'text' as const,
      content: {
        text: `💬 ${discussion.commentsCount ?? 0} comments · ❤️ ${discussion.likesCount ?? 0} likes`,
      },
    },
  ];

  return {
    name: `Discussion Highlight: ${discussion.title}`,
    subject: `Trending discussion: ${discussion.title}`,
    preheader: excerpt.slice(0, 100),
    emailContent: { blocks },
  };
}
