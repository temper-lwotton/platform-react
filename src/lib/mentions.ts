import { MentionUser } from '@/hooks/useMentions';

/**
 * Extract mentions from text
 * Matches @username patterns
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
  const matches = text.matchAll(mentionRegex);
  return Array.from(matches, match => match[1]);
}

/**
 * Find mentioned user IDs from text based on available users
 */
export function getMentionedUserIds(text: string, users: MentionUser[]): string[] {
  const mentionedNames = extractMentions(text);
  const userIds: string[] = [];

  mentionedNames.forEach(name => {
    const user = users.find(
      u => u.name.toLowerCase() === name.toLowerCase()
    );
    if (user && !userIds.includes(user.id)) {
      userIds.push(user.id);
    }
  });

  return userIds;
}

/**
 * Highlight mentions in text with HTML
 * Useful for displaying formatted mentions
 */
export function highlightMentions(text: string): string {
  const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
  return text.replace(
    mentionRegex,
    '<span class="mention-highlight">@$1</span>'
  );
}

/**
 * Convert mentions to markdown-style links
 * Format: @username becomes [@username](user-id)
 */
export function mentionsToMarkdown(text: string, users: MentionUser[]): string {
  const mentionRegex = /@(\w+(?:\s+\w+)*)/g;

  return text.replace(mentionRegex, (match, name) => {
    const user = users.find(
      u => u.name.toLowerCase() === name.toLowerCase()
    );
    if (user) {
      return `[@${name}](user:${user.id})`;
    }
    return match;
  });
}

/**
 * Parse markdown-style mention links back to plain @mentions
 * Format: [@username](user-id) becomes @username
 */
export function markdownToMentions(text: string): string {
  const markdownMentionRegex = /\[@([^\]]+)\]\(user:([^)]+)\)/g;
  return text.replace(markdownMentionRegex, '@$1');
}

/**
 * Validate if text contains valid mentions
 */
export function hasValidMentions(text: string, users: MentionUser[]): boolean {
  const mentionedNames = extractMentions(text);
  if (mentionedNames.length === 0) return true;

  return mentionedNames.some(name =>
    users.some(u => u.name.toLowerCase() === name.toLowerCase())
  );
}

/**
 * Get unique mentioned users from text
 */
export function getMentionedUsers(text: string, users: MentionUser[]): MentionUser[] {
  const mentionedNames = extractMentions(text);
  const mentionedUsers: MentionUser[] = [];

  mentionedNames.forEach(name => {
    const user = users.find(
      u => u.name.toLowerCase() === name.toLowerCase()
    );
    if (user && !mentionedUsers.find(mu => mu.id === user.id)) {
      mentionedUsers.push(user);
    }
  });

  return mentionedUsers;
}
