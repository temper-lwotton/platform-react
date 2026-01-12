# Component: PublishPanel

## Description
Sidebar panel for managing post publication status, URL slug configuration, and publish/unpublish actions. Displays current publication status with appropriate icons and provides action buttons for saving drafts and publishing content.

## Location
`src/components/cms/shared/PublishPanel.tsx`

## Props Interface

```typescript
interface PostType {
  id: number;
  singularLabel: string;
}

interface PublishPanelProps {
  post?: Post;
  slug: string;
  onSlugChange: (slug: string) => void;
  selectedPostType: number | null;
  onPostTypeChange: (typeId: number) => void;
  postTypes?: PostType[];
  isEditMode: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}
```

## Data Requirements

### Post Type
```typescript
// From @/types/cms
interface Post {
  id: number;
  title: string;
  slug: string;
  isPublished: boolean;
  publishedAt: string | null;
  hasUnpublishedChanges: boolean;
  // ... other post fields
}
```

## Internal State
No internal state - fully controlled component.

## Dependencies

### Hooks
- `useUnpublishPost` - Mutation for unpublishing a post

### Icons
- `lucide-react` - Save, Eye, Globe, Clock, CheckCircle, XCircle

### Libraries
- `date-fns` - format

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `onSlugChange` | Slug input change | Updates URL slug |
| `onPostTypeChange` | Post type select | Changes post type (new posts only) |
| `onSaveDraft` | Save Draft button | Triggers draft save |
| `onPublish` | Publish button | Triggers publish action |
| `handleUnpublish` | Unpublish button | Unpublishes the post with confirmation |

## Styling
- **CSS Module**: `PublishPanel.module.scss`

## Usage Example

```tsx
import { PublishPanel } from '@/components/cms/shared/PublishPanel';

<PublishPanel
  post={currentPost}
  slug={slug}
  onSlugChange={setSlug}
  selectedPostType={selectedPostType}
  onPostTypeChange={setSelectedPostType}
  postTypes={postTypes}
  isEditMode={true}
  onSaveDraft={handleSaveDraft}
  onPublish={handlePublish}
  isDirty={isDirty}
  isSaving={isSaving}
  lastSaved={lastSaved}
/>
```

## Features
- Post type selector (only for new posts)
- Publication status display with icons (Published/Draft)
- "Unpublished changes" indicator
- URL slug input with live preview
- Generated URL preview with Globe icon
- Last saved timestamp display
- Save Draft button (disabled when not dirty or saving)
- Preview button (published posts only)
- Publish/Publish Changes button
- Unpublish button with confirmation dialog (published posts only)
- Conditional button text based on publish state

## Panel Sections

### Post Type Selector (New Posts Only)
- Dropdown to select post type
- Only shown when `isEditMode` is false

### Status Display
- Shows "Published" with CheckCircle icon and publish date
- Shows "Draft" with Clock icon when not published
- Shows "Unpublished changes" notice when applicable

### Slug Configuration
- Text input for URL slug
- Live URL preview showing full post URL

### Action Buttons
- Save Draft - saves without publishing
- Preview - opens preview (published only)
- Publish/Publish Changes - publishes content
- Unpublish - removes from public view (published only)

## Related Components
- Parent: `PostEditor`, `PageEditor`
- See also: `VersionHistoryPanel`
