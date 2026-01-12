# Component: FeaturedImagePreview

## Description
Interactive preview component showing how a featured image will appear across different card types and contexts. Features dark mode toggle, text overlay toggle, and detailed aspect ratio information.

## Location
`src/components/cms/shared/FeaturedImagePreview.tsx`

## Props Interface

```typescript
interface FeaturedImagePreviewProps {
  imageUrl: string;
  postTitle?: string;
}
```

## Data Requirements

### Card Preview Configuration
```typescript
type PreviewMode = 'showcase' | 'event' | 'exchange' | 'media' | 'opencall' | 'status';

interface CardPreview {
  id: PreviewMode;
  label: string;
  aspectRatio: string;
  description: string;
  minDimensions: string;
}
```

### Predefined Card Types
```typescript
const CARD_PREVIEWS: CardPreview[] = [
  {
    id: 'showcase',
    label: 'Showcase Card',
    aspectRatio: '16:9',
    description: 'Main content cards on home feed',
    minDimensions: '1200×675px',
  },
  {
    id: 'event',
    label: 'Event Card',
    aspectRatio: 'Fixed 200px',
    description: 'Event listings and calendars',
    minDimensions: '800×200px',
  },
  {
    id: 'exchange',
    label: 'Exchange Card',
    aspectRatio: '2:1',
    description: 'Exchange and marketplace posts',
    minDimensions: '800×400px',
  },
  {
    id: 'media',
    label: 'Media Card',
    aspectRatio: '4:3',
    description: 'Media library thumbnails',
    minDimensions: '800×600px',
  },
  {
    id: 'opencall',
    label: 'Open Call Card',
    aspectRatio: '1:1 Square',
    description: 'Open calls and opportunities',
    minDimensions: '400×400px',
  },
  {
    id: 'status',
    label: 'Status Update',
    aspectRatio: 'Variable',
    description: 'Social feed posts',
    minDimensions: '600×400px',
  },
];
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `selectedMode` | `PreviewMode` | Current card type preview |
| `showDarkMode` | `boolean` | Toggle for dark mode preview |
| `showOverlay` | `boolean` | Toggle for text overlay display |

## Dependencies

### Components
- `Icon` - UI icon component

### Libraries
- `@radix-ui/react-tabs` - Tab navigation
- `@radix-ui/react-switch` - Toggle switches

## Styling
- **CSS Module**: `FeaturedImagePreview.module.scss`

## Usage Example

```tsx
import { FeaturedImagePreview } from '@/components/cms/shared/FeaturedImagePreview';

<FeaturedImagePreview
  imageUrl="https://example.com/image.jpg"
  postTitle="My Blog Post"
/>
```

## Features
- Six card type previews with different aspect ratios
- Dark mode toggle for preview
- Text overlay toggle (title + "Featured" badge)
- Tabbed navigation for card types
- Aspect ratio and dimension information panel
- Image quality tips section
- Empty state when no image provided

## UI Sections

### Header
- "Preview Variations" title
- Description: "See how your image appears across different card types"

### Options Bar
- Dark Mode toggle switch with moon icon
- Text Overlay toggle switch with layers icon

### Card Type Tabs
- Showcase Card (16:9)
- Event Card (Fixed 200px height)
- Exchange Card (2:1)
- Media Card (4:3)
- Open Call Card (1:1 Square)
- Status Update (Variable)

### Preview Area
- Card mockup with selected aspect ratio
- Image with optional text overlay
- Post title display
- "Featured" badge

### Info Panel
- Aspect Ratio
- Use Case description
- Recommended dimensions

### Tips Section
- General tip: "For best results across all card types, use an image of at least 1200×800px"
- Pro Tip: "Keep important content centered for better cropping in square formats"

## Related Components
- Parent: `FeaturedImagePanel`
- See also: Various card components (ShowcaseCard, EventCard, etc.)
