# Component: MediaSettings

## Description
Settings form for media upload configuration including file limits, allowed types, AI features (auto-analysis, alt text generation), image optimization, and custom image sizes.

## Location
`src/components/cms/settings/MediaSettings.tsx`

## Props Interface
None - self-contained form component.

## Data Requirements

### MediaSettingsType
```typescript
// From @/services/cms/types/settings
interface MediaSettings {
  maxUploadSize: number;
  allowedFileTypes: string[];
  enableAIAnalysis: boolean;
  autoGenerateAltText: boolean;
  autoOptimizeImages: boolean;
  defaultImageQuality: number;
  imageSizes: ImageSize[];
}

interface ImageSize {
  name: string;
  width: number;
  height: number;
  crop: boolean;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `formData` | `Partial<MediaSettingsType>` | Form field values |
| `hasChanges` | `boolean` | Dirty state tracking |

## Dependencies

### Hooks
- `useMediaSettings` - Fetch current settings
- `useUpdateMediaSettings` - Save mutation

### Icons
- `lucide-react` - Save, Loader2, Plus, Trash2

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleChange` | Field change | Update formData |
| `handleFileTypeToggle` | Checkbox toggle | Toggle file type in array |
| `handleImageSizeChange` | Size field change | Update image size at index |
| `handleAddImageSize` | Add button | Add new image size |
| `handleRemoveImageSize` | Remove button | Delete image size at index |
| `handleSubmit` | Form submit | Save settings |

## Styling
- **CSS Module**: `SettingsForm.module.scss`
- **Layout**: Sectioned form with dynamic list

## Usage Example

```tsx
import { MediaSettings } from '@/components/cms/settings';

<MediaSettings />
```

## Form Sections

### Upload Settings
- **Maximum Upload Size**: Number input (1-100 MB)
- **Allowed File Types**: Checkbox group (JPEG, PNG, GIF, WebP, SVG)

### AI Features
- **Enable AI Analysis**: Checkbox - Auto-analyze images for tags/objects
- **Auto-Generate Alt Text**: Checkbox - Generate accessibility alt text

### Image Optimization
- **Auto-Optimize Images**: Checkbox - Compress on upload
- **Default Image Quality**: Range slider (1-100%)

### Image Sizes
- Dynamic list with:
  - Size name (text)
  - Width (number)
  - Height (number)
  - Crop (checkbox)
  - Remove button
- Add Image Size button

## Features
- Loading state with spinner
- Checkbox groups for file types
- Slider for quality with live value display
- Dynamic image sizes list (add/remove)
- Save button disabled until changes
- Success message after save

## Related Components
- Parent: `SettingsLayout`
- See also: `MediaUpload`, `AltTextGenerator`
