# **Component Specification: MediaUpload**

## **1. Component Name**

**`MediaUpload`**

## **2. Description**

A comprehensive drag-and-drop file upload component with SEO filename options and batch upload support.

* Provides drag-and-drop zone with visual feedback
* Supports SEO filename modes (auto-generate, custom, or original)
* Displays upload progress and AI analysis results
* Validates file formats and sizes
* Used for media uploads in admin pages

## **3. Location**

```
src/components/ui/MediaUpload/MediaUpload.tsx
```

## **4. Component Type**

**Feature** – Manages upload queue, file processing, and API interactions.

## **5. Props Interface**

```typescript
interface MediaUploadProps {
  onUploadComplete?: (files: UploadFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
  spaceId?: number;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onUploadComplete` | `(files: UploadFile[]) => void` | No | - | Callback when all uploads complete |
| `maxFiles` | `number` | No | `20` | Maximum number of files |
| `maxFileSize` | `number` | No | `10` | Max file size in MB |
| `acceptedFormats` | `string[]` | No | JPEG, PNG, WebP, GIF | Accepted MIME types |
| `spaceId` | `number` | No | - | Space to associate uploads with |

## **7. Data Requirements**

### **External Data Sources**

* API upload function from `@/lib/media-api`

### **UploadFile Type**

```typescript
interface UploadFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'processing' | 'analyzing' | 'complete' | 'error';
  progress: number;
  error?: string;
  mediaItem?: APIMediaItem;
  renameMode?: 'auto' | 'custom' | 'none';
  customFilename?: string;
}
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `uploadFiles` | `UploadFile[]` | `[]` | List of files being uploaded |
| `isDragging` | `boolean` | `false` | Drag state for drop zone styling |
| `isUploading` | `boolean` | `false` | Global upload in progress flag |
| `renameMode` | `'auto' \| 'custom' \| 'none'` | `'auto'` | SEO filename strategy |
| `customFilename` | `string` | `''` | Custom filename input |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default | Drop zone with browse button | Ready state |
| `isDragging === true` | Drop zone highlighted | Visual drag feedback |
| `uploadFiles.length > 0` | Stats bar + file list | Shows upload progress |
| `isUploading === true` | Disabled inputs, progress shown | Upload in progress |
| File exceeds `maxFileSize` | Error toast | File rejected |
| File count exceeds `maxFiles` | Error toast | Excess files rejected |
| Invalid format | Error toast | File rejected |
| `renameMode === 'custom'` | Custom filename input shown | User enters filename |

## **10. Dependencies**

### **API Functions**

* `uploadMedia(file, options)` – From `@/lib/media-api`

### **Child Components**

* `UploadProgress` – Individual file progress card
* `Button` – Browse and clear buttons
* `Icon` – Upload icons
* `Badge` – Status badges

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleDrop` | Drop files on zone | Validate and queue files |
| `handleFileSelect` | Browse button click | Open file picker |
| `handleBrowseClick` | Click browse | Trigger hidden input |
| `clearAll` | Click clear all | Remove all files from queue |
| `removeFile` | Click remove on file | Remove specific file |
| `onUploadComplete` | All uploads finish | Fire callback with results |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `MediaUpload.module.scss`

### **CSS Classes**

* `.container` – Main wrapper
* `.dropZone` – Drop area container
* `.dropZone--dragging` – Active drag state
* `.seoSettings` – Filename options section
* `.statsBar` – Upload statistics row
* `.fileList` – Progress items container

### **Visual States**

* **Default**: Dashed border drop zone
* **Dragging**: Highlighted border, different background
* **Uploading**: Progress indicators active

## **13. Accessibility Requirements**

* **Keyboard**: Browse button focusable, Enter activates
* **ARIA**: Drop zone should have `aria-label` describing purpose
* **Screen Reader**: Announce upload progress changes

### **Improvements Needed**

* Add `aria-live` region for progress announcements
* Add `role="region"` with `aria-label` to drop zone
* Announce file validation errors

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| File too large | Toast error, file rejected | Other files continue |
| Invalid format | Toast error, file rejected | Other files continue |
| Max files exceeded | Toast warning | Queue limited to max |
| Upload API error | Status set to 'error' | Error shown on file card |
| Network failure | Retry or error state | User can retry |

## **15. Performance & Lifecycle Notes**

* **Preview Generation**: Creates object URLs for thumbnails
* **Cleanup**: Revokes object URLs on unmount
* **Batch Processing**: Uploads files in parallel with limit
* **Progress Tracking**: Updates progress per-file from API

## **16. Usage Examples**

### **Basic Usage**

```tsx
import MediaUpload from '@/components/ui/MediaUpload';

<MediaUpload
  onUploadComplete={(files) => console.log('Uploaded:', files)}
  maxFiles={10}
  maxFileSize={5}
/>
```

### **With Space Association**

```tsx
<MediaUpload
  onUploadComplete={handleUpload}
  spaceId={123}
  acceptedFormats={['image/jpeg', 'image/png']}
/>
```

## **17. Features Summary**

### **SEO Filename Options**

* Auto-generate (AI-powered, recommended)
* Custom filename input
* Keep original (random hash)

### **Drop Zone**

* Drag and drop with visual feedback
* Browse files button
* Format and size validation

### **Upload Management**

* Batch upload support (up to maxFiles)
* Individual file progress tracking
* Remove files from queue
* Clear all button

### **Stats Bar**

* Total file count
* Processing count (with spinner)
* Completed count (success badge)
* Failed count (danger badge)

## **18. Testing Considerations**

### **Unit Tests**

* Drop zone accepts valid files
* Rejects files exceeding size limit
* Rejects invalid formats
* Progress updates correctly
* Clear all removes all files
* Remove file removes single file
* Callback fires on completion

### **Mocking**

* `uploadMedia` API function
* File API for drag events
* URL.createObjectURL

### **Edge Cases**

* Zero files dropped
* Single file
* Exactly maxFiles
* Exceeding maxFiles
* Mixed valid/invalid files
* Upload cancellation

## **19. Out of Scope / Non-Goals**

* **File editing**: No crop/rotate before upload
* **Resume uploads**: No chunked/resumable uploads
* **Cloud picker**: No direct cloud service integration
* **Folder upload**: Single-level files only

## **20. Related Components & System Context**

### **Child Components**

* `UploadProgress` – Progress display per file

### **Used By**

* Admin media page
* Post creation (future)

### **Related**

* `MediaCard` – Displays uploaded media
* `AltTextGenerator` – Post-upload alt text
* `SmartCropEditor` – Post-upload cropping

## **21. Open Questions / Notes**

* Consider chunked uploads for large files
* May want upload queue persistence
* Could add upload presets for different contexts

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Empty drop zone | Default props | Base state |
| `Dragging` | File being dragged | `isDragging: true` | Visual feedback |
| `WithFiles` | Files in queue | Multiple files | Various statuses |
| `Uploading` | Upload in progress | Active uploads | Progress shown |
| `Complete` | All uploads done | Completed files | Success state |
| `WithErrors` | Some uploads failed | Mixed results | Error handling |
| `CustomFilename` | Custom mode | `renameMode: 'custom'` | Input visible |

### **Controls (Args) Required**

* `maxFiles` (number) – controllable
* `maxFileSize` (number) – controllable
* `acceptedFormats` (array) – controllable

### **Mocking Requirements**

* **Upload API**: Simulated progress and responses
* **File objects**: Mock File instances

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify drop zone keyboard accessible
* Check progress announcements
* Verify error messages announced

### **Interaction Tests**

* Drag and drop files
* Click browse and select files
* Remove individual files
* Clear all files
* Switch rename modes
