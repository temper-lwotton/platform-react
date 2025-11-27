# User Mentions System

A comprehensive, reusable user mention system for React/Next.js applications with TypeScript support.

## Features

- ✨ **Auto-completion dropdown** when typing `@`
- ⌨️ **Keyboard navigation** (Arrow keys, Enter, Escape)
- 🔍 **Real-time filtering** as you type
- 🎨 **Fully styled** with dark mode support
- 📱 **Responsive design** for mobile and desktop
- 🎯 **TypeScript support** with full type safety
- 🔧 **Utility functions** for parsing and processing mentions
- ♿ **Accessible** with proper ARIA attributes

## Components

### 1. MentionTextarea (Main Component)

The primary component that provides a textarea with mention functionality.

```tsx
import { MentionTextarea } from '@/components/ui/MentionTextarea';
import { MentionUser } from '@/hooks/useMentions';

const users: MentionUser[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

function CommentForm() {
  const [content, setContent] = useState('');

  return (
    <MentionTextarea
      users={users}
      value={content}
      onChange={(e) => setContent(e.target.value)}
      onMention={(user) => console.log('Mentioned:', user)}
      placeholder="Type @ to mention someone..."
      rows={4}
    />
  );
}
```

### 2. useMentions Hook

Custom hook that handles all mention logic. Can be used to build custom implementations.

```tsx
import { useMentions, MentionUser } from '@/hooks/useMentions';

function CustomMentionInput({ users }: { users: MentionUser[] }) {
  const {
    mentionState,
    handleInputChange,
    handleKeyDown,
    selectUser,
    setTextareaRef,
  } = useMentions({ users });

  // Use the hook's methods in your custom component
}
```

### 3. MentionDropdown

The dropdown component that displays user suggestions. Automatically used by MentionTextarea.

## Utility Functions

Located in `/src/lib/mentions.ts`:

### Extract Mentions

```tsx
import { extractMentions } from '@/lib/mentions';

const text = 'Hey @John Doe, can you help @Jane Smith?';
const mentions = extractMentions(text);
// Returns: ['John Doe', 'Jane Smith']
```

### Get Mentioned User IDs

```tsx
import { getMentionedUserIds } from '@/lib/mentions';

const text = 'Hey @John Doe, can you help?';
const userIds = getMentionedUserIds(text, users);
// Returns: ['1'] (array of user IDs)
```

### Get Mentioned Users

```tsx
import { getMentionedUsers } from '@/lib/mentions';

const mentionedUsers = getMentionedUsers(text, users);
// Returns: [{ id: '1', name: 'John Doe', email: 'john@example.com' }]
```

### Highlight Mentions in HTML

```tsx
import { highlightMentions } from '@/lib/mentions';

const highlighted = highlightMentions('Hey @John Doe');
// Returns: 'Hey <span class="mention-highlight">@John Doe</span>'
```

### Convert to Markdown Format

```tsx
import { mentionsToMarkdown } from '@/lib/mentions';

const markdown = mentionsToMarkdown('Hey @John Doe', users);
// Returns: 'Hey [@John Doe](user:1)'
```

### Parse Markdown Back to Mentions

```tsx
import { markdownToMentions } from '@/lib/mentions';

const plain = markdownToMentions('Hey [@John Doe](user:1)');
// Returns: 'Hey @John Doe'
```

## Usage Examples

### Basic Comment Form

```tsx
'use client';

import { useState } from 'react';
import { MentionTextarea } from '@/components/ui/MentionTextarea';
import { getMentionedUserIds } from '@/lib/mentions';

export function CommentForm({ users, onSubmit }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mentionedUserIds = getMentionedUserIds(content, users);

    await onSubmit({
      content,
      mentionedUserIds, // Send to backend for notifications
    });

    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <MentionTextarea
        users={users}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={4}
      />
      <button type="submit">Post Comment</button>
    </form>
  );
}
```

### Discussion Post Form

```tsx
export function DiscussionForm({ spaceId }) {
  const [content, setContent] = useState('');

  // Fetch space members
  const { data: members } = useQuery({
    queryKey: ['space-members', spaceId],
    queryFn: () => fetchSpaceMembers(spaceId),
  });

  const users = members?.map(m => ({
    id: m.userId,
    name: m.profile.fullName || m.email,
    email: m.email,
    avatar: m.profile.photo,
  })) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mentionedUserIds = getMentionedUserIds(content, users);

    await createDiscussion({
      spaceId,
      content,
      mentionedUserIds,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <MentionTextarea
        users={users}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start a discussion... Type @ to mention members"
        rows={6}
      />
      <button type="submit">Create Discussion</button>
    </form>
  );
}
```

### With Imperative Handle (Advanced)

```tsx
import { useRef } from 'react';
import { MentionTextarea, MentionTextareaHandle } from '@/components/ui/MentionTextarea';

export function AdvancedForm() {
  const textareaRef = useRef<MentionTextareaHandle>(null);

  const handleClear = () => {
    textareaRef.current?.setValue('');
    textareaRef.current?.focus();
  };

  const handleInsertTemplate = () => {
    const currentValue = textareaRef.current?.getValue() || '';
    textareaRef.current?.setValue(currentValue + '\n\nBest regards,\nYour name');
  };

  return (
    <>
      <MentionTextarea
        ref={textareaRef}
        users={users}
        placeholder="Type here..."
      />
      <button onClick={handleClear}>Clear</button>
      <button onClick={handleInsertTemplate}>Insert Template</button>
    </>
  );
}
```

## Backend Integration

### Sending Mentions to Backend

```tsx
async function createComment(data: {
  content: string;
  discussionId: string;
  users: MentionUser[];
}) {
  const mentionedUserIds = getMentionedUserIds(data.content, data.users);

  await fetch('/api/comments', {
    method: 'POST',
    body: JSON.stringify({
      content: data.content,
      discussionId: data.discussionId,
      mentionedUserIds, // Backend can send notifications to these users
    }),
  });
}
```

### Storing Mentions in Database

You can store mentions in two ways:

1. **Store mentioned user IDs separately** (recommended):
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID NOT NULL,
  discussion_id UUID NOT NULL
);

CREATE TABLE comment_mentions (
  comment_id UUID REFERENCES comments(id),
  mentioned_user_id UUID REFERENCES users(id),
  PRIMARY KEY (comment_id, mentioned_user_id)
);
```

2. **Store as markdown** in content:
```tsx
// Before saving
const markdownContent = mentionsToMarkdown(content, users);
// Save: "Hey [@John Doe](user:123)"

// When displaying
const plainContent = markdownToMentions(markdownContent);
// Display: "Hey @John Doe"
```

## Keyboard Shortcuts

When mention dropdown is open:
- `↑` / `↓` - Navigate through suggestions
- `Enter` or `Tab` - Select highlighted user
- `Esc` - Close dropdown
- Continue typing - Filter suggestions

## Styling

The mention system is fully styled with CSS classes. All styles are in `/src/app/globals.css`.

Key classes:
- `.mention-textarea` - The textarea input
- `.mention-dropdown` - The dropdown container
- `.mention-dropdown-item` - Individual user items
- `.mention-highlight` - Styled mentions in display text

### Customizing Styles

Override CSS variables or classes:

```css
.mention-dropdown {
  /* Your custom styles */
  max-height: 400px;
}

.mention-dropdown-item--selected {
  background: your-custom-color;
}
```

## TypeScript Types

```tsx
// User type for mentions
interface MentionUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

// Textarea handle for imperative API
interface MentionTextareaHandle {
  focus: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
}
```

## Performance Considerations

- User list is filtered on every keystroke - limit to 10 suggestions
- Dropdown uses `position: fixed` for proper positioning
- Keyboard navigation uses refs to avoid re-renders
- Debounce API calls if fetching users dynamically

## Accessibility

- Proper ARIA attributes for dropdown
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires ES6+ support

## Future Enhancements

Potential improvements:
- [ ] Group mentions (e.g., @everyone, @admins)
- [ ] Rich text editor integration
- [ ] Multiple trigger characters (# for tags, etc.)
- [ ] Async user loading/search
- [ ] Mention analytics
- [ ] Custom mention rendering

## License

Part of the Spaces AI platform.
