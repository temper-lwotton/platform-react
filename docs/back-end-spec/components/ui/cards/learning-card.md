# **Component Specification: LearningCard**

## **1. Component Name**

**`LearningCard`**

## **2. Description**

A card component for displaying educational content items (articles and videos). Shows a featured image with content type indicator, category, tags, author info, and a navigation arrow.

* Displays learning content in an engaging card format
* Differentiates between articles and videos visually
* Shows read time for articles, duration for videos

## **3. Location**

```
src/components/ui/LearningCard/LearningCard.tsx
```

## **4. Component Type**

* UI

## **5. Props Interface**

```ts
interface LearningCardProps {
  content: LearningContent;
}

interface LearningContent {
  id: string;
  type: 'article' | 'video';
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  duration?: string;      // For videos
  readTime?: string;      // For articles
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  tags: string[];
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `content` | `LearningContent` | Yes | - | Learning content data object |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `content` object

### **Derived Values**

| Value | Derivation |
| ----- | ---------- |
| `contentUrl` | `/learn/${content.id}` |
| `formattedDate` | Relative time from `publishedAt` via `formatDate()` |
| `authorInitials` | First character of author name (uppercase) |

## **8. Internal State**

None - stateless component.

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| `content.type === 'article'` | fileText icon + read time | |
| `content.type === 'video'` | video icon + duration + play button overlay | |
| `content.tags.length > 0` | Tag spans (max 3) | |
| `content.author.avatar` exists | Author avatar image | |
| `content.author.avatar` missing | Author initial fallback | |

## **10. Dependencies**

### **Child Components**

* `Avatar` - Author avatar (from primitives)
* `Icon` - Type indicator, play button, arrow icons

### **External Libraries**

* `next/link` - Card navigation

## **11. Events & Callbacks**

None - card is a link component, navigation handled by Next.js Link.

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `LearningCard.module.scss`

### **Visual States**

* **Default**: Card with image and content
* **Video type**: Play button overlay on image
* **Hover**: Card hover effect

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.card` | Base card container (link wrapper) |
| `.imageContainer` | Featured image container |
| `.image` | Featured image |
| `.typeBadge` | Content type indicator (icon + time) |
| `.playButton` | Video play button overlay |
| `.content` | Text content area |
| `.category` | Category label |
| `.title` | Content title (h3) |
| `.excerpt` | Preview text |
| `.tags` | Tag container |
| `.tag` | Individual tag span |
| `.footer` | Author info and arrow |
| `.author` | Avatar and author details |
| `.authorInfo` | Name and date |
| `.authorName` | Author name text |
| `.date` | Published date |
| `.arrow` | Navigation arrow |

## **13. Accessibility Requirements**

* **Card is link**: Entire card navigates to content
* **Image alt text**: Uses content title
* **Author avatar**: Has alt text with author name

### **Improvements Needed**

* Add `aria-label` to card describing content type and title
* Play button should have accessible label for screen readers

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Missing `author.avatar` | Shows initial fallback |
| Empty tags array | Tags section still renders (empty) |

**Not handled by this component:**
* Invalid image URLs
* Missing required fields

## **15. Performance & Lifecycle Notes**

* **Stateless**: No internal state, pure render
* **No side effects**: No data fetching or subscriptions
* **Efficient**: Only renders provided data

## **16. Usage Examples**

```tsx
import { LearningCard } from '@/components/ui/LearningCard';

// Article card
<LearningCard
  content={{
    id: '1',
    type: 'article',
    title: 'Getting Started with React',
    excerpt: 'Learn the fundamentals of React development...',
    imageUrl: '/images/react-guide.jpg',
    category: 'Development',
    readTime: '5 min read',
    author: { name: 'Jane Doe', avatar: '/avatars/jane.jpg' },
    publishedAt: '2024-01-15',
    tags: ['React', 'JavaScript', 'Tutorial'],
  }}
/>

// Video card
<LearningCard
  content={{
    id: '2',
    type: 'video',
    title: 'Advanced TypeScript Patterns',
    excerpt: 'Deep dive into advanced TypeScript...',
    imageUrl: '/images/ts-video.jpg',
    category: 'TypeScript',
    duration: '15:30',
    author: { name: 'John Smith' },
    publishedAt: '2024-01-10',
    tags: ['TypeScript', 'Advanced'],
  }}
/>
```

## **17. Features Summary**

* Featured image with aspect ratio
* Content type badge:
  * Article: fileText icon + read time
  * Video: video icon + duration
* Play button overlay for videos
* Category label
* Title and excerpt
* Tags display (up to 3)
* Author avatar and name
* Relative date display
* Navigation arrow indicator
* Full card clickable link to `/learn/{id}`

## **18. Testing Considerations**

### **Unit Tests**

* Renders article type with fileText icon and readTime
* Renders video type with video icon, duration, and play button
* Displays correct number of tags (max 3)
* Shows author avatar or fallback
* Formats date correctly
* Links to correct content URL

### **Mocking Required**

* None - pure prop-driven component

### **Edge Cases**

* Very long title/excerpt
* Missing optional fields (avatar, readTime, duration)
* Many tags

## **19. Out of Scope / Non-Goals**

* **Video playback** - handled on content page
* **Progress tracking** - not shown on card
* **Bookmarking** - not implemented
* **Content editing** - handled elsewhere

## **20. Related Components & System Context**

### **Sibling Components**

* `DocumentCard` - similar card pattern
* `DiscussionCard` - similar card pattern

### **Child Components**

* `Avatar` (primitives)
* `Icon`

### **Typical Usage Locations**

* Learn page
* Homepage recommendations
* Search results

## **21. Open Questions / Notes**

* Consider adding progress indicator for partially viewed content
* May want bookmark functionality
* Could show view count

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Article` | Article content | `type: 'article'` | Read time display |
| `Video` | Video content | `type: 'video'` | Duration + play button |
| `WithAvatar` | Has author avatar | Avatar provided | Shows image |
| `NoAvatar` | No author avatar | Avatar undefined | Shows fallback |
| `ManyTags` | Multiple tags | 5+ tags | Verify max 3 shown |

### **Controls (Args) Required**

* `content.type` - select (article/video)
* `content.category` - text input
* `content.readTime` / `content.duration` - text input

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify image alt text
* Verify link accessibility

### **Interaction Tests**

* Click card → verify navigation to content page
