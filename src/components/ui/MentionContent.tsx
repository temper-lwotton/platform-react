'use client';

import * as React from 'react';
import Link from 'next/link';
import { MentionUser } from '@/hooks/useMentions';

interface MentionContentProps {
  content: string;
  users: MentionUser[];
  className?: string;
}

/**
 * Renders text content with clickable mention links
 * Converts @Username mentions to links to user profiles
 */
export function MentionContent({ content, users, className }: MentionContentProps) {
  // Parse content and create elements with clickable mentions
  const renderContent = () => {
    // Regex to match @mentions
    const mentionRegex = /@([\w\s]+?)(?=\s|$|[.,!?;:])/g;
    const parts: (string | React.JSX.Element)[] = [];
    let lastIndex = 0

    let match;
    let keyCounter = 0;

    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionText = match[1].trim();
      const mentionStart = match.index;

      // Add text before mention
      if (mentionStart > lastIndex) {
        parts.push(content.substring(lastIndex, mentionStart));
      }

      // Find the mentioned user
      const mentionedUser = users.find(
        (u) => u.name.toLowerCase() === mentionText.toLowerCase()
      );

      if (mentionedUser) {
        // Render as clickable link to user profile
        parts.push(
          <Link
            key={`mention-${keyCounter++}`}
            href={`/users/${mentionedUser.id}`}
            className="mention-link"
            onClick={(e) => e.stopPropagation()}
            title={`View ${mentionedUser.name}'s profile`}
          >
            @{mentionedUser.name}
          </Link>
        );
      } else {
        // No user found, render as plain text
        parts.push(`@${mentionText}`);
      }

      lastIndex = mentionStart + match[0].length;
    }

    // Add remaining text after last mention
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <div className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {renderContent()}
    </div>
  );
}
