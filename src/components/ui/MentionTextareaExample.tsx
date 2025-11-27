'use client';

import { useState } from 'react';
import { MentionTextarea, MentionTextareaHandle } from './MentionTextarea';
import { MentionUser } from '@/hooks/useMentions';
import { getMentionedUserIds } from '@/lib/mentions';

// Example usage component
export function MentionTextareaExample() {
  const [content, setContent] = useState('');

  // Example users - in real app, fetch from API or context
  const users: MentionUser[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: undefined,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: undefined,
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      avatar: undefined,
    },
    {
      id: '4',
      name: 'Alice Williams',
      email: 'alice@example.com',
      avatar: undefined,
    },
    {
      id: '5',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      avatar: undefined,
    },
  ];

  const handleMention = (user: MentionUser) => {
    console.log('User mentioned:', user);
    // You can track mentions, send notifications, etc.
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Extract mentioned user IDs
    const mentionedUserIds = getMentionedUserIds(content, users);
    console.log('Mentioned user IDs:', mentionedUserIds);

    // Submit content with mentions
    console.log('Submitting content:', content);

    // Example API call:
    // await createComment({
    //   content,
    //   mentionedUserIds,
    // });
  };

  return (
    <div className="mention-example">
      <h3>Comment with Mentions</h3>
      <p>Type @ to mention users</p>

      <form onSubmit={handleSubmit}>
        <MentionTextarea
          users={users}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onMention={handleMention}
          placeholder="Write a comment... Type @ to mention someone"
          rows={4}
        />

        <button type="submit" className="btn btn-primary">
          Post Comment
        </button>
      </form>

      {content && (
        <div className="mention-preview">
          <h4>Preview:</h4>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
}
