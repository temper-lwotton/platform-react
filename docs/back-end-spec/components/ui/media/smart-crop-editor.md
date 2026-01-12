# **Component Specification: SmartCropEditor**

## **1. Component Name**

**`SmartCropEditor`**

## **2. Description**

A dialog for AI-powered smart cropping of images with aspect ratio selection and generative fill.

* Allows selecting target aspect ratios
* Offers generative fill option to extend images rather than cropping
* Shows crop preview with overlay visualization
* Displays face detection information if available
* Used for creating optimized image variants

## **3. Location**

```
src/components/ui/SmartCropEditor/SmartCropEditor.tsx
```

## **4. Component Type**

**Feature** – Manages crop settings and dialog interactions.

## **5. Props Interface**

```typescript
interface SmartCropEditorProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (mediaId: string, aspectRatio: AspectRatio, useGenerativeFill: boolean) => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `media` | `MediaItem \| null` | Yes | - | Media item to crop |
| `isOpen` | `boolean` | Yes | - | Dialog visibility |
| `onClose` | `() => void` | Yes | - | Close dialog callback |
| `onSave` | `(mediaId, aspectRatio, useGenerativeFill) => void` | Yes | - | Save crop settings callback |

## **7. Data Requirements**

### **Types**

```typescript
// From @/types/media
type AspectRatio = '1:1' | '4:3' | '16:9' | '9:16' | '3:4';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape' | 'square';
  aiAnalysis: {
    faces?: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
  };
}
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `selectedRatio` | `AspectRatio` | `'1:1'` | Selected aspect ratio |
| `useGenerativeFill` | `boolean` | `false` | Enable AI fill for missing areas |
| `isProcessing` | `boolean` | `false` | Processing state |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `isOpen === false` | Nothing | Dialog hidden |
| `media === null` | Nothing or empty state | No media selected |
| Any ratio selected | Preview with crop overlay | Visual feedback |
| `useGenerativeFill === true` | Feature description shown | AI extend mode |
| `useGenerativeFill === false` | Standard crop note | Crop warning |
| `isProcessing === true` | Submit button loading | Processing |
| `aiAnalysis.faces` present | Face count displayed | Detection info |
| Faces in crop area | Subject preserved note | Smart positioning |

## **10. Dependencies**

### **Child Components**

* `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
* `Button` – Actions
* `RadioGroup` – Aspect ratio selection
* `Switch` – Generative fill toggle
* `Icon` – Various icons

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleRatioChange` | Select aspect ratio | Update preview |
| `handleFillToggle` | Toggle generative fill | Switch fill mode |
| `handleSave` | Click create | Initiate smart crop |
| `handleClose` | Close dialog | Reset and close |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `SmartCropEditor.module.scss`

### **CSS Classes**

* `.preview` – Image preview container
* `.previewImage` – Source image
* `.cropOverlay` – Crop area visualization
* `.ratioSelector` – Aspect ratio options
* `.fillSection` – Generative fill toggle area
* `.featureList` – Fill feature descriptions
* `.faceInfo` – Face detection display

### **Layout**

* Original image info
* Aspect ratio selection (horizontal radio)
* Preview with crop overlay
* Generative fill option

## **13. Accessibility Requirements**

* **Keyboard**: All controls keyboard accessible
* **ARIA**: Radio group and switch properly labeled
* **Focus**: Focus trapped in dialog
* **Screen Reader**: Crop dimensions and options announced

### **Improvements Needed**

* Add `aria-describedby` for crop preview
* Announce crop area changes
* Describe generative fill impact

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Media null | Dialog not rendered | Graceful handling |
| Processing fails | Error toast | Dialog stays open |
| Invalid ratio | Default to 1:1 | Safe fallback |
| Image load error | Placeholder shown | Error message |

## **15. Performance & Lifecycle Notes**

* **Preview Calculation**: Recomputes on ratio change
* **State Reset**: Resets on dialog close
* **Processing**: Async server operation

### **Helper Functions**

* `getCropPreviewStyle()` – Calculate crop overlay dimensions

## **16. Usage Examples**

### **Basic Usage**

```tsx
import SmartCropEditor from '@/components/ui/SmartCropEditor';

<SmartCropEditor
  media={selectedMedia}
  isOpen={isCropOpen}
  onClose={() => setCropOpen(false)}
  onSave={handleSmartCrop}
/>
```

### **With Handler**

```tsx
const handleSmartCrop = async (
  mediaId: string,
  aspectRatio: AspectRatio,
  useGenerativeFill: boolean
) => {
  await createSmartCrop(mediaId, aspectRatio, useGenerativeFill);
  setCropOpen(false);
  refreshMedia();
};

<SmartCropEditor
  media={mediaItem}
  isOpen={showCropDialog}
  onClose={() => setShowCropDialog(false)}
  onSave={handleSmartCrop}
/>
```

## **17. Features Summary**

### **Original Image Info**

* Filename
* Dimensions
* Orientation

### **Aspect Ratio Selection** (horizontal radio)

* 1:1 Square
* 4:3 Landscape
* 16:9 Widescreen
* 9:16 Portrait
* 3:4 Tall

### **Preview**

* Source image display
* Crop overlay visualization
* Updates on ratio change

### **Generative Fill Option** (switch toggle)

When enabled:
* AI generates missing areas
* Maintains subject focus
* Extends background naturally
* Preserves image quality

When disabled:
* Standard crop
* Parts may be cut off

### **Face Detection**

* Shows face count if detected
* Smart positioning preserves faces

### **Actions**

* Cancel button
* "Create Smart Crop" button (with loading)

## **18. Testing Considerations**

### **Unit Tests**

* Renders all aspect ratio options
* Preview updates on ratio change
* Generative fill toggle works
* Save passes correct parameters
* Processing state shows loading
* Face count displayed when present

### **Mocking**

* MediaItem with various dimensions
* Face detection data
* Crop API

### **Edge Cases**

* Square image
* Extreme aspect ratios
* No face detection
* Many faces detected
* Very large images
* Very small images

## **19. Out of Scope / Non-Goals**

* **Manual crop area**: Only preset ratios
* **Rotate/flip**: No orientation changes
* **Multiple crops**: One at a time
* **Real-time preview**: No live AI preview
* **Custom ratios**: Preset options only

## **20. Related Components & System Context**

### **Used With**

* `MediaCard` – Triggers crop dialog

### **Used By**

* Admin media page

### **Related**

* `AltTextGenerator` – Another media editing dialog

## **21. Open Questions / Notes**

* Consider custom aspect ratio input
* May want crop quality preview
* Could add batch cropping

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Initial state | Default props | Base state |
| `LandscapeImage` | Landscape source | Landscape media | Wide image |
| `PortraitImage` | Portrait source | Portrait media | Tall image |
| `SquareImage` | Square source | Square media | 1:1 source |
| `WithFaces` | Face detection | Faces in AI analysis | Face info shown |
| `GenerativeFill` | Fill enabled | `useGenerativeFill: true` | Feature list shown |
| `Processing` | Creating crop | `isProcessing: true` | Loading state |

### **Controls (Args) Required**

* `isOpen` (boolean) – controllable
* `media` (object) – controllable
* `selectedRatio` (select) – aspect ratios
* `useGenerativeFill` (boolean) – controllable

### **Mocking Requirements**

* **MediaItem objects**: Various dimensions and orientations
* **Face detection**: Sample face coordinates
* **Actions**: Log onSave, onClose

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify radio group accessible
* Check switch accessibility
* Verify dialog keyboard navigation

### **Interaction Tests**

* Select each aspect ratio
* Toggle generative fill
* Create smart crop
* Cancel dialog
