# **Component Specification: MediaCard**

## **1. Component Name**

**`MediaCard`**

## **2. Description**

A media library card displaying image thumbnails with AI-generated metadata including tags, colours, and people count. Provides hover actions for editing, alt text generation, smart cropping, and deletion.

* Displays media thumbnails with rich AI metadata
* Provides quick actions on hover
* Supports selection for bulk operations

## **3. Location**

```
src/components/ui/MediaCard/MediaCard.tsx
```

## **4. Component Type**

* Feature

## **5. Props Interface**

```ts
interface MediaCardProps {
  media: MediaItem;
  onEdit: (media: MediaItem) => void;
  onGenerateAltText: (media: MediaItem) => void;
  onSmartCrop: (media: MediaItem) => void;
  onDelete?: (media: MediaItem) => void;
  onSelect?: (media: MediaItem) => void;
  isSelected?: boolean;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `media` | `MediaItem` | Yes | - | Media item data |
| `onEdit` | `(media: MediaItem) => void` | Yes | - | Edit action handler |
| `onGenerateAltText` | `(media: MediaItem) => void` | Yes | - | AI alt text handler |
| `onSmartCrop` | `(media: MediaItem) => void` | Yes | - | Smart crop handler |
| `onDelete` | `(media: MediaItem) => void` | No | - | Delete handler |
| `onSelect` | `(media: MediaItem) => void` | No | - | Selection handler |
| `isSelected` | `boolean` | No | `false` | Selection state |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `media` object

```ts
// From @/types/media
interface MediaItem {
  id: string;
  filename: string;
  seoFilename?: string;
  thumbnailUrl: string;
  altText?: string;
  orientation: 'portrait' | 'landscape' | 'square';
  width: number;
  height: number;
  size: number;
  uploadedAt: Date;
  uploadedBy: {
    name: string;
    avatar?: string;
  };
  aiAnalysis: {
    tags: Array<{ id: string; label: string; confidence: number }>;
    dominantColors: string[];
    peopleCount: number;
  };
}
```

### **Derived Values**

| Value | Derivation |
| ----- | ---------- |
| `topTags` | Top 3 tags sorted by confidence |
| `formattedFileSize` | Bytes converted to B/KB/MB |
| `formattedDate` | Date formatted as "Mon DD, YYYY" |
| `displayFilename` | `seoFilename` or `filename` |

## **8. Internal State**

| State Variable | Type | Purpose |
| -------------- | ---- | ------- |
| `showActions` | `boolean` | Hover actions visibility |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| Hover on card | Action buttons visible | Edit, alt text, crop, delete |
| `isSelected === true` | Selected styling + visible checkbox | `.selected` class |
| `onSelect` provided | Selection checkbox visible | Even when not hovered if selected |
| `onDelete` provided | Delete button in actions | Optional action |
| `!media.altText` | Warning icon next to filename | Alert for missing alt |
| `aiAnalysis.peopleCount > 0` | People count badge | Shows count |
| `aiAnalysis.dominantColors` | Colour swatches (max 5) | |

## **10. Dependencies**

### **Child Components**

* `Badge` - Orientation, people count, tags (from primitives)
* `Icon` - Action icons, warning
* `Avatar` - Uploader avatar (from primitives)

### **External Libraries**

* None

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
| ---------------- | ------- | ----------- |
| `onEdit` | Click edit button | Opens edit dialog |
| `onGenerateAltText` | Click wand button | Triggers AI alt text generation |
| `onSmartCrop` | Click crop button | Opens smart crop editor |
| `onDelete` | Click delete button | Triggers delete (with confirmation) |
| `onSelect` | Click checkbox | Toggles selection state |
| `onMouseEnter` | Mouse enters card | Shows action buttons |
| `onMouseLeave` | Mouse leaves card | Hides action buttons |

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `MediaCard.module.scss`

### **Visual States**

* **Default**: Card with thumbnail
* **Hover**: Action buttons overlay
* **Selected**: Highlighted border/background

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.card` | Base card container |
| `.selected` | Selected state modifier |
| `.imageContainer` | Thumbnail container |
| `.image` | Thumbnail image |
| `.topBadges` | Orientation and people badges |
| `.selectButton` | Selection checkbox |
| `.visible` | Visible checkbox modifier |
| `.actions` | Hover action buttons container |
| `.actionButton` | Individual action button |
| `.deleteButton` | Delete button (danger style) |
| `.info` | Media info section |
| `.header` | Filename and warning |
| `.filename` | Display filename |
| `.warningIcon` | Missing alt text warning |
| `.tags` | AI tags container |
| `.colors` | Colour swatches container |
| `.colorSwatch` | Individual colour swatch |
| `.footer` | User and meta info |
| `.user` | Uploader avatar and name |
| `.meta` | Dimensions, size, date |

## **13. Accessibility Requirements**

* **Select button**: Has `aria-label="Select image"`
* **Action buttons**: Have `title` attributes for tooltips
* **Image alt text**: Uses `altText` or "Untitled image" fallback

### **Improvements Needed**

* Action buttons should have `aria-label` in addition to `title`
* Selected state should be announced to screen readers

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Missing `altText` | Shows warning icon, uses "Untitled image" |
| Missing `seoFilename` | Falls back to `filename` |
| Empty tags | Tags section renders empty |
| Empty colours | Colours section renders empty |

**Not handled by this component:**
* Image load errors
* API failures from action callbacks

## **15. Performance & Lifecycle Notes**

* **Mouse events**: Show/hide actions on hover
* **Re-renders**: On `isSelected` or `showActions` change
* **No cleanup required** - no listeners registered

## **16. Usage Examples**

```tsx
import MediaCard from '@/components/ui/MediaCard';

<MediaCard
  media={mediaItem}
  onEdit={(media) => setEditMedia(media)}
  onGenerateAltText={(media) => generateAlt(media)}
  onSmartCrop={(media) => openCropEditor(media)}
  onDelete={(media) => handleDelete(media)}
  onSelect={(media) => toggleSelection(media)}
  isSelected={selectedIds.includes(mediaItem.id)}
/>

// Without selection
<MediaCard
  media={mediaItem}
  onEdit={handleEdit}
  onGenerateAltText={handleAltText}
  onSmartCrop={handleCrop}
/>
```

## **17. Features Summary**

* Thumbnail preview with hover overlay
* Orientation badge (portrait/landscape/square)
* People count badge (from AI analysis)
* Selection checkbox (optional)
* Hover action buttons:
  * Generate alt text (AI wand)
  * Smart crop
  * Edit details
  * Delete (optional)
* Filename display with alt text warning icon
* Top 3 AI-detected tags
* Dominant colour swatches (up to 5)
* Uploader avatar and name
* Dimensions, file size, upload date

## **18. Testing Considerations**

### **Unit Tests**

* Renders thumbnail with correct alt text
* Shows orientation badge
* Shows people count when > 0
* Action buttons visible on hover
* Selection toggle works
* Warning icon shown when alt text missing
* Top 3 tags displayed (sorted by confidence)
* Colour swatches rendered (max 5)
* File size formatted correctly

### **Mocking Required**

* Action callbacks - mock functions
* `MediaItem` - mock data

### **Edge Cases**

* Very long filename
* No AI tags
* No colours
* No alt text
* Large people count

## **19. Out of Scope / Non-Goals**

* **Image editing inline** - handled by separate editors
* **Drag and drop** - not implemented
* **Bulk actions** - parent component responsibility
* **Image preview modal** - separate component

## **20. Related Components & System Context**

### **Sibling Components**

* Other card components

### **Child Components**

* `Badge` (primitives)
* `Icon`
* `Avatar` (primitives)

### **Used With**

* `AltTextGenerator` - AI alt text modal
* `SmartCropEditor` - Crop editor modal

### **Typical Usage Locations**

* Media library page
* Image picker dialogs

## **21. Open Questions / Notes**

* Consider keyboard navigation for action buttons
* May want image preview on click
* Could add copy URL action

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Standard media | Full media data | Default state |
| `Selected` | Selected state | `isSelected: true` | Highlight + checkbox |
| `NoAltText` | Missing alt | `altText: undefined` | Warning icon |
| `WithPeople` | People detected | `peopleCount: 3` | People badge |
| `Hover` | Actions visible | Simulate hover | Action buttons |
| `NoDelete` | No delete action | `onDelete` undefined | No delete button |

### **Controls (Args) Required**

* `isSelected` - boolean toggle
* `media.orientation` - select
* `media.altText` - text input

### **Mocking Requirements**

* Action callbacks with action logging

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify button labels
* Verify image alt text

### **Interaction Tests**

* Hover → verify actions appear
* Click select → verify callback
* Click edit → verify callback
