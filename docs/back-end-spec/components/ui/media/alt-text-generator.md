# **Component Specification: AltTextGenerator**

## **1. Component Name**

**`AltTextGenerator`**

## **2. Description**

A dialog for generating and selecting alt text for images using AI suggestions.

* Displays AI-generated alt text options from media analysis
* Allows custom text entry as alternative
* Shows image preview with current alt text
* Provides regenerate option for new suggestions
* Used for improving image accessibility

## **3. Location**

```
src/components/ui/AltTextGenerator/AltTextGenerator.tsx
```

## **4. Component Type**

**Feature** – Manages selection state and dialog interactions.

## **5. Props Interface**

```typescript
interface AltTextGeneratorProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (mediaId: string, altText: string) => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `media` | `MediaItem \| null` | Yes | - | Media item to generate alt text for |
| `isOpen` | `boolean` | Yes | - | Dialog visibility |
| `onClose` | `() => void` | Yes | - | Close dialog callback |
| `onSave` | `(mediaId, altText) => void` | Yes | - | Save alt text callback |

## **7. Data Requirements**

### **MediaItem Type**

```typescript
// From @/types/media
interface MediaItem {
  id: string;
  filename: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  altText?: string;
  aiAnalysis: {
    suggestedAltTexts: string[];
  };
}
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `selectedOption` | `string` | `''` | Selected AI option or 'custom' |
| `customText` | `string` | `''` | Custom alt text input |
| `isGenerating` | `boolean` | `false` | Regeneration in progress |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `isOpen === false` | Nothing | Dialog hidden |
| `media === null` | Nothing or empty state | No media selected |
| `suggestedAltTexts.length > 0` | Radio options | AI suggestions shown |
| `selectedOption === 'custom'` | Textarea enabled | Custom entry active |
| `isGenerating === true` | Regenerate button loading | Fetching new options |
| `media.altText` exists | Current alt text shown | Reference display |
| No selection or custom text | Save button disabled | Validation enforced |

## **10. Dependencies**

### **Child Components**

* `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
* `Button` – Actions
* `Textarea` – Custom text input
* `RadioGroup` – Option selection
* `Icon` – Regenerate icon

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleRegenerate` | Click regenerate | Generate new AI options |
| `handleSave` | Click save | Save selected or custom alt text |
| `handleClose` | Close dialog | Reset state and close |
| `handleOptionChange` | Select radio option | Update selected option |
| `handleCustomChange` | Type in textarea | Update custom text |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `AltTextGenerator.module.scss`

### **CSS Classes**

* `.preview` – Image preview section
* `.previewImage` – Thumbnail display
* `.metadata` – Filename and dimensions
* `.optionsSection` – AI options area
* `.customSection` – Custom text input area
* `.currentAlt` – Existing alt text display

### **Layout**

* Preview with metadata
* AI-generated options (radio group)
* Custom text textarea
* Current alt text (if exists)

## **13. Accessibility Requirements**

* **Keyboard**: All options keyboard navigable
* **ARIA**: Radio group properly labeled
* **Focus**: Focus trapped in dialog
* **Screen Reader**: Options and current text announced

### **Improvements Needed**

* Add `aria-describedby` linking to image preview
* Announce when regeneration completes
* Add character count for custom text

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| No AI suggestions | Show only custom option | Custom input available |
| Regenerate fails | Error toast | Keep existing options |
| Media null | Dialog not rendered | Graceful handling |
| Save fails | Error toast | Dialog stays open |

## **15. Performance & Lifecycle Notes**

* **State Reset**: Resets on dialog close
* **Regeneration**: Simulated delay (TODO: real API)
* **Initialization**: Populates from media on open

## **16. Usage Examples**

### **Basic Usage**

```tsx
import AltTextGenerator from '@/components/ui/AltTextGenerator';

<AltTextGenerator
  media={selectedMedia}
  isOpen={isAltTextOpen}
  onClose={() => setAltTextOpen(false)}
  onSave={handleSaveAltText}
/>
```

### **With Handler**

```tsx
const handleSaveAltText = async (mediaId: string, altText: string) => {
  await updateMediaAltText(mediaId, altText);
  setAltTextOpen(false);
  refreshMedia();
};

<AltTextGenerator
  media={mediaItem}
  isOpen={showAltDialog}
  onClose={() => setShowAltDialog(false)}
  onSave={handleSaveAltText}
/>
```

## **17. Features Summary**

### **Image Preview**

* Thumbnail display
* Filename
* Dimensions (width × height)

### **AI-Generated Options**

* Radio group with suggestions from `aiAnalysis.suggestedAltTexts`
* Regenerate button with loading state

### **Custom Entry**

* Textarea for custom alt text
* Radio option to switch to custom mode

### **Reference**

* Current alt text display (if exists)

### **Actions**

* Cancel button
* Save button (disabled until selection)

## **18. Testing Considerations**

### **Unit Tests**

* Renders AI suggestions as radio options
* Custom text enables textarea
* Save disabled without selection
* Save passes correct alt text
* Regenerate shows loading state
* Close resets state

### **Mocking**

* MediaItem with various AI suggestions
* Regenerate API (if implemented)

### **Edge Cases**

* No AI suggestions
* Single suggestion
* Many suggestions
* Very long suggestion text
* Empty current alt text
* Long current alt text

## **19. Out of Scope / Non-Goals**

* **Image editing**: No crop/filter before alt text
* **Batch alt text**: One image at a time
* **Auto-save**: Requires explicit save action
* **Alt text validation**: No quality checking

## **20. Related Components & System Context**

### **Used With**

* `MediaCard` – Triggers alt text dialog

### **Used By**

* Admin media page

### **Related**

* `SmartCropEditor` – Another media editing dialog

## **21. Open Questions / Notes**

* Consider character limit recommendations
* May want alt text quality scoring
* Could add alt text templates

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Multiple AI options | 3+ suggestions | Base state |
| `SingleOption` | One AI option | 1 suggestion | Minimal options |
| `NoOptions` | No AI suggestions | Empty array | Custom only |
| `WithCurrentAlt` | Existing alt text | `altText` present | Reference shown |
| `CustomSelected` | Custom mode active | `selectedOption: 'custom'` | Textarea enabled |
| `Generating` | Regenerating | `isGenerating: true` | Loading state |

### **Controls (Args) Required**

* `isOpen` (boolean) – controllable
* `media` (object) – controllable

### **Mocking Requirements**

* **MediaItem objects**: Various suggestion counts
* **Actions**: Log onSave, onClose

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify radio group accessible
* Check focus management
* Verify dialog keyboard navigation

### **Interaction Tests**

* Select AI option
* Switch to custom
* Enter custom text
* Click regenerate
* Save selection
* Cancel dialog
