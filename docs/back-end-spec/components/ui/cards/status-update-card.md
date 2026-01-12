# **Component Specification: StatusUpdateCard**

## **1. Component Name**

**`StatusUpdateCard`**

## **2. Description**

A social media-style card for displaying status updates/posts from users. Shows author info, text content with emoji, media attachments (images, videos, links), tags, and engagement actions. Includes admin moderation menu with pin, broadcast, and delete options.

* Displays status updates in a social feed format
* Supports rich media attachments (images, videos, links)
* Provides admin moderation capabilities

## **3. Location**

```
src/components/ui/StatusUpdateCard/StatusUpdateCard.tsx
```

## **4. Component Type**

* Feature

## **5. Props Interface**

```ts
interface StatusUpdateCardProps {
  statusUpdate: StatusUpdate;
  isAdmin?: boolean;
  isPinned?: boolean;
  currentSpaceId?: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `statusUpdate` | `StatusUpdate` | Yes | - | Status update data object |
| `isAdmin` | `boolean` | No | `false` | Show admin actions menu |
| `isPinned` | `boolean` | No | `false` | Display pinned indicator |
| `currentSpaceId` | `string` | No | - | Current space context for pin actions |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `statusUpdate` object
* **Utility**: `formatTimeAgo()` from `@/lib/status-updates`

```ts
// From @/lib/status-updates
interface StatusUpdate {
  id: number | string;
  text: string;
  emoji?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  author: {
    id: string | number;
    fullName: string;
    photo?: string;
    jobTitle?: string;
  };
  space: {
    id: string | number;
    title: string;
  };
  project?: {
    name: string;
  };
  tags?: Array<{
    id: string;
    name: string;
  }>;
  media?: Array<{
    id: string;
    type: 'image' | 'video' | 'link';
    url: string;
    caption?: string;
    thumbnail?: string;
    title?: string;
    description?: string;
    favicon?: string;
  }>;
}
```

## **8. Internal State**

| State Variable | Type | Purpose |
| -------------- | ---- | ------- |
| `menuOpen` | `boolean` | Admin menu popover visibility |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| `isPinned === true` | Pin indicator + `.pinned` styling | |
| `isAdmin === true` | Admin menu trigger button | |
| `isPinned && isAdmin` | "Unpin" option in menu | |
| `!isPinned && isAdmin` | "Pin" option in menu | |
| `statusUpdate.emoji` exists | Emoji prefix before text | |
| `media` contains images | Image grid/single image | With optional caption |
| `media` contains videos | Video player with controls | With optional caption |
| `media` contains links | Link preview card | Thumbnail, title, description, favicon |
| `media.length === 1` | Single media layout | |
| `media.length > 1` | Grid layout | |
| `statusUpdate.project` exists | Project name with folder icon | |
| `tags.length > 0` | Tag badges with # prefix | |
| `likesCount > 0` | Like count shown | |
| `commentsCount > 0` | Comment count shown | |

## **10. Dependencies**

### **Child Components**

* `Avatar` - Author avatar (from primitives)
* `Badge` - Tag badges (from primitives)
* `Icon` - Various icons

### **Utilities / Hooks**

* `formatTimeAgo` - Relative time formatting

### **External Libraries**

* `next/link` - Navigation
* `@radix-ui/react-popover` - Admin menu

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
| ---------------- | ------- | ----------- |
| `handlePinPost` | Click "Pin to this space" | Logs action, closes menu |
| `handleUnpinPost` | Click "Unpin from this space" | Logs action, closes menu |
| `handleBroadcastPost` | Click "Broadcast to spaces" | Logs action, closes menu |
| `handleFeaturePost` | Click "Feature in digest" | Logs action, closes menu |
| `handleMarkSpam` | Click "Mark as spam" | Logs action, closes menu |
| `handleDeletePost` | Click "Delete post" | Confirms, logs action, closes menu |

**Note**: All admin actions currently log to console - API integration pending.

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS + global classes for menu
* **File(s)**:
  * `StatusUpdateCard.module.scss`
  * Global: `status-update-menu-*` classes

### **Visual States**

* **Default**: Standard card
* **Pinned**: `.pinned` modifier with indicator
* **Menu open**: Popover visible

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.card` | Base card container |
| `.pinned` | Pinned state modifier |
| `.pinIndicator` | Pin icon + "Pinned" text |
| `.header` | Author link and actions |
| `.authorLink` | Avatar and author info link |
| `.authorInfo` | Name and job title |
| `.authorName` | Author name text |
| `.authorTitle` | Job title |
| `.headerActions` | Time and admin menu |
| `.meta` | Timestamp |
| `.content` | Main content area |
| `.text` | Emoji + text content |
| `.emoji` | Emoji prefix |
| `.media` | Media container |
| `.mediaSingle` | Single media layout |
| `.mediaGrid` | Multi-media grid |
| `.mediaItem` | Individual media wrapper |
| `.mediaImage` | Image container |
| `.mediaVideo` | Video container |
| `.mediaLinkCard` | Link preview card |
| `.context` | Space and project links |
| `.spaceLink` | Space link |
| `.project` | Project indicator |
| `.tags` | Tag badges container |
| `.actions` | Engagement buttons |
| `.action` | Individual action button |

## **13. Accessibility Requirements**

* **Admin menu trigger**: Has `aria-label="Post options"`
* **Author link**: Links to user profile
* **Media links**: External links have `rel="noopener noreferrer"`
* **Video**: Has `controls` attribute

### **Improvements Needed**

* Action buttons (like, comment, bookmark) need accessible labels
* Consider `aria-live` for admin action confirmations
* Delete confirmation should use accessible dialog

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Missing `author.photo` | Shows initial fallback |
| Missing `author.jobTitle` | Job title not rendered |
| Empty media array | Media section not rendered |
| Empty tags array | Tags section not rendered |
| Missing `project` | Project section not rendered |
| Delete confirmation cancelled | Action aborted |

**Not handled by this component:**
* API integration for admin actions
* Media load errors
* Invalid URL in link preview

## **15. Performance & Lifecycle Notes**

* **Minimal state**: Only `menuOpen` state
* **Re-renders**: On menu open/close
* **No cleanup required** - no listeners registered

## **16. Usage Examples**

```tsx
import { StatusUpdateCard } from '@/components/ui/StatusUpdateCard';

// Basic usage
<StatusUpdateCard statusUpdate={update} />

// Admin view with pinned status
<StatusUpdateCard
  statusUpdate={update}
  isAdmin={true}
  isPinned={true}
  currentSpaceId="space-123"
/>

// In a feed
{updates.map((update) => (
  <StatusUpdateCard
    key={update.id}
    statusUpdate={update}
    isAdmin={userIsAdmin}
  />
))}
```

## **17. Features Summary**

* Author info with avatar, name, and job title
* Relative timestamp (via `formatTimeAgo`)
* Emoji prefix for status text
* Media attachments:
  * Single image with caption
  * Video with poster and controls
  * Link preview card (thumbnail, title, description, favicon)
  * Grid layout for multiple media
* Space and project context links
* Hashtag badges
* Engagement actions (like, comment, bookmark)
* Admin menu (when `isAdmin=true`):
  * Pin/Unpin from space
  * Broadcast to other spaces
  * Feature in digest
  * Mark as spam
  * Delete post
* Pinned indicator badge

## **18. Testing Considerations**

### **Unit Tests**

* Renders author info correctly
* Shows pinned indicator when `isPinned`
* Displays emoji prefix when provided
* Renders different media types correctly
* Shows admin menu when `isAdmin`
* Pin/Unpin option changes based on `isPinned`
* Delete shows confirmation dialog

### **Mocking Required**

* `formatTimeAgo` - mock or use real
* `window.confirm` - for delete confirmation
* `console.log` - to verify action handlers

### **Edge Cases**

* Very long text content
* Many media attachments
* Many tags
* Missing optional fields

## **19. Out of Scope / Non-Goals**

* **API integration** - admin actions are console.log stubs
* **Like/comment functionality** - buttons exist but no action
* **Bookmark persistence** - not implemented
* **Comment section** - not shown on card
* **Edit post** - not implemented

## **20. Related Components & System Context**

### **Sibling Components**

* `DiscussionCard` - similar pattern
* `UpdateCard` - similar pattern
* `EventCard` - similar pattern

### **Child Components**

* `Avatar` (primitives)
* `Badge` (primitives)
* `Icon`

### **Typical Usage Locations**

* Feed page
* Space pages
* User profile activity

## **21. Open Questions / Notes**

* Admin action API integration needed
* Like/comment/bookmark functionality not implemented
* Consider adding inline comment preview
* May want to add share functionality

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Basic update | Minimal props | Default state |
| `Pinned` | Pinned post | `isPinned: true` | Pin indicator |
| `AdminView` | Admin user | `isAdmin: true` | Admin menu |
| `WithEmoji` | Has emoji | Emoji provided | Emoji prefix |
| `WithImage` | Image attachment | Single image | Image display |
| `WithVideo` | Video attachment | Video media | Video player |
| `WithLink` | Link preview | Link media | Link card |
| `WithTags` | Has tags | Tags array | Tag badges |
| `MultiMedia` | Multiple media | Several media items | Grid layout |

### **Controls (Args) Required**

* `isAdmin` - boolean toggle
* `isPinned` - boolean toggle
* `currentSpaceId` - text input

### **Mocking Requirements**

* `formatTimeAgo` - mock or use real
* Admin action handlers - action logging

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify admin menu accessibility
* Verify media alt text

### **Interaction Tests**

* Admin menu open/close
* Pin/Unpin toggles
* Delete confirmation flow
