# Component: MediaPicker

## Description
Modal dialog for selecting media items from the library or uploading new files. Supports single and multiple selection modes with search and pagination.

## Location
`src/components/cms/media/MediaPicker.tsx`

## Props Interface

```typescript
interface MediaPickerProps {
  onSelect: (media: MediaItem | MediaItem[]) => void;
  onClose: () => void;
  mode?: 'single' | 'multiple';
  allowUpload?: boolean;
}
```

## Data Requirements

### Media Item Type
```typescript
interface MediaItem {
  id: number;
  filename: string;
  seoFilename?: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  uploadedAt: string;
  mimeType: string;
  fileSize: number;
}
```

### Media Response Type
```typescript
interface MediaItemsResponse {
  data: {
    items: MediaItem[];
    total: number;
  };
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `search` | `string` | Search query |
| `selectedIds` | `number[]` | Selected item IDs (multiple mode) |
| `page` | `number` | Current page |

## Dependencies

### Hooks
- `useMediaItems` - Fetch media library
- `useUploadMedia` - Upload mutation

### Icons
- `lucide-react` - X, Search, Upload, Image

### Libraries
- `date-fns` - formatDistanceToNow

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleSelect` | Item click | Selects item (single) or toggles (multiple) |
| `handleConfirmMultiple` | Confirm button | Returns selected items |
| `handleUpload` | File input change | Uploads new file |
| `onClose` | Overlay/close click | Closes modal |

## Styling
- **CSS Module**: `MediaPicker.module.scss`

## Features
- Modal overlay (click to close)
- Search with autofocus
- Optional upload button
- Grid layout with thumbnails
- Single/multiple selection modes
- Pagination (20 items per page)
- Selected state indicators
- File info display (name, time ago)

## UI Sections

### Header
- Image icon
- "Select Media" title
- Close button (X)

### Toolbar
- Search input
- Upload button (if allowed)

### Content Area
- Loading state
- Empty state (with/without search)
- Media grid

### Media Item
- Thumbnail image
- Selection checkbox (multiple mode)
- Filename
- Upload time

### Footer (with pagination)
- Previous/Next buttons
- Page info
- Confirm button (multiple mode)

## Query Configuration
```typescript
useMediaItems({
  search: search || undefined,
  limit: 20,
  page,
});
```

## Usage Example

```tsx
<MediaPicker
  onSelect={(media) => setFeaturedImage(media)}
  onClose={() => setShowPicker(false)}
  mode="single"
  allowUpload={true}
/>
```

## Related Components
- Used by: `FeaturedImagePanel`, `PostEditor`, `PageEditor`
