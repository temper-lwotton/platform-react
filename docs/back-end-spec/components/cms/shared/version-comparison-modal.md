# Component: VersionComparisonModal

## Description
Modal dialog for side-by-side comparison of two content versions. Displays title, excerpt, content, and featured image from each version with author and timestamp information.

## Location
`src/components/cms/shared/VersionComparisonModal.tsx`

## Props Interface

```typescript
interface VersionComparisonModalProps {
  postId: number;
  v1: number;
  v2: number;
  onClose: () => void;
}
```

## Data Requirements

### PostVersion Type
```typescript
// From version hooks
interface PostVersion {
  id: number;
  versionNumber: number;
  title: string;
  excerpt?: string;
  contentHtml: string;
  featuredImage?: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
}
```

## Internal State
No internal state - data comes from useVersion hooks.

## Dependencies

### Hooks
- `useVersion` - Fetch individual version data (called twice for v1 and v2)

### Icons
- `lucide-react` - X, Clock, User

### Libraries
- `date-fns` - formatDistanceToNow

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `onClose` | Overlay click, X button | Closes the modal |

## Styling
- **CSS Module**: `VersionComparisonModal.module.scss`

## Usage Example

```tsx
import { VersionComparisonModal } from '@/components/cms/shared/VersionComparisonModal';

{comparisonVersions && (
  <VersionComparisonModal
    postId={postId}
    v1={comparisonVersions.v1}
    v2={comparisonVersions.v2}
    onClose={() => setComparisonVersions(null)}
  />
)}
```

## Features
- Modal overlay with click-to-close
- Side-by-side version panels
- Version number headers
- Author and timestamp display
- Content sections: Title, Excerpt, Content, Featured Image
- HTML content rendering
- Loading state
- Responsive layout

## Modal Sections

### Header
- "Compare Versions" title
- Close button (X icon)

### Comparison Content
Side-by-side layout with divider:

#### Version Panel (each side)
- **Version Header**:
  - Version number (e.g., "Version 3")
  - Author name with User icon
  - Relative timestamp with Clock icon

- **Content Sections**:
  - Title section
  - Excerpt section (if available)
  - Content section (rendered HTML)
  - Featured Image section (if available)

### Loading State
- "Loading versions..." message while fetching

## Query Configuration

```typescript
// Fetch both versions simultaneously
const { data: version1Data, isLoading: isLoading1 } = useVersion(postId, v1);
const { data: version2Data, isLoading: isLoading2 } = useVersion(postId, v2);
```

## Related Components
- Parent: `PostEditor`, `PageEditor`
- See also: `VersionHistoryPanel`
