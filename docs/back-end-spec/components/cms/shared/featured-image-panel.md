# Component: FeaturedImagePanel

## Description
Featured image selection panel with media picker integration and preview variations. Allows users to select, change, or remove the featured image for content items.

## Location
`src/components/cms/shared/FeaturedImagePanel.tsx`

## Props Interface

```typescript
interface FeaturedImagePanelProps {
  imageUrl: string;
  onChange: (url: string) => void;
  postTitle?: string;
}
```

## Data Requirements

### MediaItem Type
```typescript
// From @/lib/media-api
interface MediaItem {
  id: number;
  url: string;
  filename: string;
  mimeType: string;
  // ... other media fields
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `showPicker` | `boolean` | Controls MediaPicker modal visibility |

## Dependencies

### Components
- `MediaPicker` - Modal for selecting media from library
- `FeaturedImagePreview` - Preview variations across card types

### Libraries
- `@radix-ui/react-separator` - Visual separator

### Icons
- `lucide-react` - Image, X

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleSelect` | Media selection | Sets image URL from selected media |
| `handleRemove` | Remove button click | Clears image URL |
| `setShowPicker` | Upload area/Change click | Opens/closes MediaPicker |

## Styling
- **CSS Module**: `FeaturedImagePanel.module.scss`

## Usage Example

```tsx
import { FeaturedImagePanel } from '@/components/cms/shared/FeaturedImagePanel';

<FeaturedImagePanel
  imageUrl={featuredImage}
  onChange={setFeaturedImage}
  postTitle="My Post Title"
/>
```

## Features
- Upload/select area when no image
- Image preview with change/remove options
- Integration with MediaPicker modal
- Preview variations component (when image selected)
- Supports both single and multiple selection (uses first item)

## Panel Sections

### No Image State
- Clickable upload area with Image icon
- "Select from Media Library" text
- Opens MediaPicker on click

### With Image State
- Image preview thumbnail
- "Change" button to select different image
- "X" button to remove image
- Separator before preview variations
- FeaturedImagePreview component showing card variations

### MediaPicker Integration
```typescript
<MediaPicker
  onSelect={handleSelect}
  onClose={() => setShowPicker(false)}
  mode="single"
  allowUpload={true}
/>
```

## Related Components
- Parent: `PostEditor`, `PageEditor`
- Child: `FeaturedImagePreview`, `MediaPicker`
- See also: `MediaLibrary`
