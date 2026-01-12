# **Component Specification: UploadProgress**

## **1. Component Name**

**`UploadProgress`**

## **2. Description**

A card component displaying individual file upload progress with preview and AI analysis results.

* Shows image preview with processing overlay
* Displays upload progress bar and status
* Renders AI analysis results when complete (tags, people count, colors)
* Provides remove button for queue management
* Used within MediaUpload component

## **3. Location**

```
src/components/ui/MediaUpload/UploadProgress.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component receiving all data via props.

## **5. Props Interface**

```typescript
interface UploadProgressProps {
  uploadFile: UploadFile;
  onRemove: () => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `uploadFile` | `UploadFile` | Yes | - | File upload data and status |
| `onRemove` | `() => void` | Yes | - | Remove file callback |

## **7. Data Requirements**

### **UploadFile Type**

```typescript
interface UploadFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'processing' | 'analyzing' | 'complete' | 'error';
  progress: number;
  error?: string;
  mediaItem?: {
    seoFilename?: string;
    aiAnalysis?: {
      tags: Array<{ id: string; label: string }>;
      peopleCount: number;
      dominantColors: string[];
    };
  };
}
```

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `status === 'pending'` | Clock icon, "Pending..." | Queued state |
| `status === 'uploading'` | Spinner, progress bar, percentage | Active upload |
| `status === 'processing'` | Spinner, "Processing image..." | Server processing |
| `status === 'analyzing'` | Spinner, "Analyzing with AI..." | AI analysis |
| `status === 'complete'` | Check icon, AI results | Success state |
| `status === 'error'` | Alert icon, error message | Failure state |
| `mediaItem.seoFilename` exists | Shows SEO filename | Renamed file |
| `aiAnalysis` present | Tags, people count, colors | AI results visible |
| Processing states | Remove button hidden | Prevent interruption |

## **10. Dependencies**

### **Child Components**

* `Icon` – Status and action icons
* `Badge` – AI tags display
* `Button` – Remove button

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onRemove` | Click remove button | Removes file from queue |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `UploadProgress.module.scss`

### **CSS Classes**

* `.card` – Main card container
* `.preview` – Image preview area
* `.previewOverlay` – Processing state overlay
* `.info` – File info section
* `.progressBar` – Upload progress indicator
* `.aiAnalysis` – AI results section
* `.tagList` – Tags container
* `.colorSwatch` – Dominant color display

### **Visual States**

* **Pending**: Muted appearance
* **Uploading**: Progress bar visible
* **Processing/Analyzing**: Overlay with spinner
* **Complete**: Full info with AI results
* **Error**: Red styling, error message

## **13. Accessibility Requirements**

* **ARIA**: Progress bar should use `role="progressbar"` with `aria-valuenow`
* **Screen Reader**: Status changes should be announced
* **Keyboard**: Remove button focusable

### **Improvements Needed**

* Add `aria-label` to remove button
* Add `aria-live` for status changes
* Announce AI analysis completion

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Preview fails to load | Show placeholder | Generic file icon |
| Missing AI analysis | Skip AI section | Just show status |
| Error status | Display error message | Error styling applied |

## **15. Performance & Lifecycle Notes**

* **Preview Images**: Uses object URL from parent
* **Re-renders**: Only on uploadFile prop changes
* **Memory**: Preview cleanup handled by parent

## **16. Usage Examples**

### **Basic Usage**

```tsx
import UploadProgress from './UploadProgress';

<UploadProgress
  uploadFile={file}
  onRemove={() => removeFile(file.id)}
/>
```

### **In Upload List**

```tsx
{uploadFiles.map((file) => (
  <UploadProgress
    key={file.id}
    uploadFile={file}
    onRemove={() => handleRemove(file.id)}
  />
))}
```

## **17. Features Summary**

### **Preview Section**

* Image thumbnail
* Processing overlay during upload

### **File Info**

* Filename display (SEO filename when complete)
* Original filename reference (when renamed)
* File metadata (size, type)

### **Status Display**

* Status icon (clock, spinner, check, alert)
* Status label text
* Progress bar with percentage

### **AI Analysis Results** (when complete)

* Tag badges (up to 5)
* People count detected
* Dominant color swatches

### **Actions**

* Remove button (hidden during processing)

## **18. Testing Considerations**

### **Unit Tests**

* Renders correct status icon
* Shows progress bar during upload
* Displays AI analysis when complete
* Shows error message on error
* Remove button calls callback
* Remove hidden during processing

### **Mocking**

* UploadFile objects with various states

### **Edge Cases**

* Very long filenames
* No AI analysis data
* Zero progress
* 100% progress
* Multiple tags
* No dominant colors

## **19. Out of Scope / Non-Goals**

* **Retry functionality**: Parent handles retry
* **Cancel upload**: Parent handles cancellation
* **Edit preview**: No editing capabilities
* **Expand preview**: No lightbox view

## **20. Related Components & System Context**

### **Parent Component**

* `MediaUpload` – Provides file data and handlers

### **Child Components**

* `Icon` – Status icons
* `Badge` – Tag display
* `Button` – Remove action

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Pending` | Queued file | `status: 'pending'` | Initial state |
| `Uploading` | Active upload | `status: 'uploading', progress: 45` | Progress shown |
| `Processing` | Server processing | `status: 'processing'` | Overlay visible |
| `Analyzing` | AI analysis | `status: 'analyzing'` | Analysis in progress |
| `Complete` | Upload done | `status: 'complete'` with AI data | Full results |
| `Error` | Upload failed | `status: 'error'`, error message | Error styling |
| `WithSeoFilename` | Renamed file | SEO filename present | Both names shown |
| `NoAiAnalysis` | Complete, no AI | Complete without AI data | Minimal results |

### **Controls (Args) Required**

* `status` (select) – All status options
* `progress` (number) – 0-100 range
* `error` (string) – Error message

### **Mocking Requirements**

* **UploadFile objects**: Various states and data combinations

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify progress bar accessible
* Check status announcements
* Verify remove button accessible

### **Interaction Tests**

* Click remove button
* Verify remove hidden during processing
