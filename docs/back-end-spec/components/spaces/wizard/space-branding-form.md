# Component: SpaceBrandingForm

## Description
Branding configuration step for the space creation wizard. Allows setting space name, tagline, description, URL handle, icon, color palette, and cover image with AI-powered content generation.

## Location
`src/components/spaces/wizard/SpaceBrandingForm.tsx`

## Props Interface

```typescript
interface SpaceBrandingFormProps {
  spaceData: SpaceData;
  setSpaceData: (data: SpaceData) => void;
  useAIDefaults: boolean;
}
```

## Data Requirements

### Color Palette Type
```typescript
interface ColorPalette {
  name: string;
  colors: string[]; // [primary, secondary]
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `generatingDescription` | `boolean` | Description generation loading |
| `generatingTagline` | `boolean` | Tagline generation loading |

## Dependencies

### Icons
- `lucide-react` - Sparkles, Upload, Image, Palette, Wand2, RefreshCw

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `generateDescription` | AI button | Generates description from templates |
| `generateTagline` | AI button | Generates tagline from templates |
| `handleColorPaletteSelect` | Palette click | Sets color palette |
| Name change | Input change | Auto-generates handle |

## Styling
- **CSS Module**: `SpaceBrandingForm.module.scss`

## Features
- Space name with character limit (60)
- Tagline with AI generation (100 chars)
- Description with AI generation (500 chars)
- Auto-generated URL handle from name
- Icon picker with emojis
- Custom icon upload
- 6 pre-defined color palettes
- Cover image upload or URL
- Live preview panel

## Color Palettes

| Name | Colors |
|------|--------|
| Purple Dream | #667eea, #764ba2 |
| Ocean Blue | #2563eb, #06b6d4 |
| Forest Green | #10b981, #059669 |
| Sunset Orange | #f59e0b, #ef4444 |
| Pink Blossom | #ec4899, #8b5cf6 |
| Midnight | #1e293b, #475569 |

## Icon Emojis
`['🚀', '💡', '🎯', '⭐', '🔥', '💎', '🌟', '✨', '🎨', '🏆', '💪', '🌈']`

## Auto-Handle Generation
```typescript
useEffect(() => {
  if (spaceData.name && !spaceData.handle) {
    const handle = spaceData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 30);
    setSpaceData({ ...spaceData, handle });
  }
}, [spaceData.name]);
```

## AI Description Templates
```javascript
const templates = [
  `Welcome to ${spaceData.name}! This is a dynamic space...`,
  `${spaceData.name} is your hub for collaboration...`,
  `Join ${spaceData.name} - a thriving community...`,
];
```

## UI Sections

### Left Column - Text Content
- Space Name input (required, 60 chars)
- Tagline input with AI generate (100 chars)
- Description textarea with AI generate (500 chars)
- Space URL input with prefix

### Right Column - Visual Identity
- Space Icon selector
  - Current icon preview with gradient
  - Emoji quick select grid
  - Upload custom button
- Color Palette selector
  - 6 gradient palette buttons
  - Selected state indicator
- Cover Image
  - Preview with remove option
  - Upload button
  - URL paste input

### Live Preview
- Full preview card with all branding elements
- Cover image (if set)
- Icon with gradient background
- Name, subtitle, description
- URL preview

### AI Tip
- Engagement improvement tip

## Related Components
- Parent: `SpaceCreationWizard`
- Previous: `TemplateSelector`
- Next: `SpacePrivacySettings`
