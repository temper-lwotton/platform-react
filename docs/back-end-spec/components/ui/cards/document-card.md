# **Component Specification: DocumentCard**

## **1. Component Name**

**`DocumentCard`**

## **2. Description**

A card component for displaying documents with status, visibility, collaborators, and engagement stats. Supports grid and list view layouts with proper status and visibility indicators.

* Displays document metadata in scannable card format
* Shows status badges with colour coding (published/draft/archived)
* Supports two layout modes (grid and list)

## **3. Location**

```
src/components/ui/DocumentCard/DocumentCard.tsx
```

## **4. Component Type**

* UI

## **5. Props Interface**

```ts
interface DocumentCardProps {
  document: Document;
  viewType?: 'grid' | 'list';
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `document` | `Document` | Yes | - | Document data object |
| `viewType` | `'grid' \| 'list'` | No | `'grid'` | Card layout style |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `document` object

```ts
// From @/lib/documents
interface Document {
  id: number | string;
  title: string;
  excerpt?: string;
  status: 'published' | 'draft' | 'archived';
  visibility: 'public' | 'members' | 'private';
  updatedAt: string;
  wordCount: number;
  authorName?: string;
  authorPhoto?: string;
  collaborators?: Array<{
    id: string;
    name: string;
    photo?: string;
  }>;
  tags?: string[];
  stats?: {
    views?: number;
    edits?: number;
    comments?: number;
  };
}
```

### **Derived Values**

| Value | Derivation |
| ----- | ---------- |
| `statusVariant` | Maps status to badge variant (success/warning/default) |
| `visibilityIcon` | Maps visibility to icon (globe/users/lock) |
| `formattedDate` | Relative time from `updatedAt` (Xm/Xh/Xd ago or date) |
| `authorInitials` | First char of author name for avatar fallback |

## **8. Internal State**

None - stateless component.

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| `viewType === 'grid'` | Vertical card layout | Default |
| `viewType === 'list'` | Horizontal card layout | `.listView` class applied |
| `status === 'published'` | Green "success" badge | |
| `status === 'draft'` | Orange "warning" badge | |
| `status === 'archived'` | Grey "default" badge | |
| `visibility === 'public'` | Globe icon | |
| `visibility === 'members'` | Users icon | |
| `visibility === 'private'` | Lock icon | |
| `document.excerpt` exists | Excerpt paragraph shown | |
| `collaborators.length > 0` | Collaborator avatars (max 3) | Shows +N overflow |
| `collaborators.length > 3` | Overflow count badge | Shows +N remaining |
| `tags.length > 0` | Tag badges (max 3) | |

## **10. Dependencies**

### **Child Components**

* `Avatar` - Author and collaborator avatars (from primitives)
* `Badge` - Status and tags (from primitives)
* `Icon` - Visibility and stats icons

### **External Libraries**

* `next/link` - Card navigation

## **11. Events & Callbacks**

None - card is a link component, navigation handled by Next.js Link.

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `DocumentCard.module.scss`

### **Visual States**

* **Default (grid)**: Vertical stacked layout
* **List view**: Horizontal layout with `.listView` modifier
* **Hover**: Card hover effect

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.card` | Base card container (link wrapper) |
| `.listView` | Horizontal layout modifier |
| `.header` | Status badge, visibility, title, excerpt |
| `.headerTop` | Badge and visibility row |
| `.title` | Document title (h3) |
| `.excerpt` | Preview text |
| `.meta` | Author and collaborators row |
| `.author` | Avatar and author info |
| `.collaborators` | Collaborator avatars container |
| `.collaboratorAvatars` | Avatar stack |
| `.collaboratorCount` | Overflow count |
| `.tags` | Tag badges container |
| `.footer` | Stats row |
| `.stat` | Individual stat (icon + value) |

## **13. Accessibility Requirements**

* **Card is link**: Entire card is clickable via `<Link>` wrapper
* **Avatar alt text**: Author and collaborator names as alt text
* **Visibility icons**: Paired with visual status badge (not colour-only)

### **Improvements Needed**

* Add `aria-label` to card link describing document title and status
* Consider making stats more accessible (currently icon + number only)

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Missing `authorName` | Falls back to "Unknown" |
| Missing `authorPhoto` | Shows initial from name (or "U") |
| Missing `stats` | Defaults to 0 for all counts |
| Empty tags array | Tags section not rendered |
| Empty collaborators | Collaborators section not rendered |

**Not handled by this component:**
* Invalid document data structure

## **15. Performance & Lifecycle Notes**

* **Stateless**: No internal state, pure render
* **No side effects**: No data fetching or subscriptions
* **Efficient**: Only renders provided data

## **16. Usage Examples**

```tsx
import { DocumentCard } from '@/components/ui/DocumentCard';

// Grid view (default)
<DocumentCard document={doc} />

// List view
<DocumentCard document={doc} viewType="list" />

// In a grid/list
{documents.map((doc) => (
  <DocumentCard
    key={doc.id}
    document={doc}
    viewType={viewMode}
  />
))}
```

## **17. Features Summary**

* Status badge with colour coding:
  * Published (success/green)
  * Draft (warning/orange)
  * Archived (default/grey)
* Visibility icon:
  * Public (globe)
  * Members (users)
  * Private (lock)
* Title and optional excerpt
* Author info with avatar
* Relative update time
* Collaborator avatars (up to 3) with overflow count
* Tags display (up to 3)
* Stats footer:
  * Views count
  * Edits count
  * Comments count
  * Word count
* Full card clickable link to `/documents/{id}`
* Grid/List view support

## **18. Testing Considerations**

### **Unit Tests**

* Renders status badge with correct variant
* Renders correct visibility icon
* Shows excerpt when provided
* Limits collaborators to 3 with overflow
* Limits tags to 3
* Displays all stats with fallback to 0
* Formats date correctly (relative time)
* Links to correct document URL

### **Mocking Required**

* None - pure prop-driven component

### **Edge Cases**

* Very long title/excerpt (CSS truncation)
* Many collaborators (overflow count)
* No stats object
* All optional fields missing

## **19. Out of Scope / Non-Goals**

* **Edit functionality** - handled by document page
* **Delete/archive actions** - handled elsewhere
* **Real-time updates** - static display
* **Drag and drop** - not implemented

## **20. Related Components & System Context**

### **Sibling Components**

* `DiscussionCard` - similar card pattern
* `UpdateCard` - similar card pattern
* `LearningCard` - similar card pattern

### **Child Components**

* `Avatar` (primitives)
* `Badge` (primitives)
* `Icon`

### **Typical Usage Locations**

* Document listings
* My content page
* Search results

## **21. Open Questions / Notes**

* Consider adding document type icon
* May want preview on hover

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Grid view, published | Full document data | Default state |
| `ListView` | List layout | `viewType="list"` | Horizontal layout |
| `Draft` | Draft status | `status: 'draft'` | Warning badge |
| `Archived` | Archived status | `status: 'archived'` | Default badge |
| `Private` | Private visibility | `visibility: 'private'` | Lock icon |
| `WithCollaborators` | Many collaborators | 5+ collaborators | Shows overflow |
| `Minimal` | Minimal data | Only required fields | Graceful fallbacks |

### **Controls (Args) Required**

* `viewType` - select (grid/list)
* `document.status` - select
* `document.visibility` - select

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify link is accessible
* Verify icon meanings are clear

### **Interaction Tests**

* Click card → verify navigation to document page
