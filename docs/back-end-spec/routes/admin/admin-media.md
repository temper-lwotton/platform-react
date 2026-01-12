# **Route Specification: Admin Media**

## **1. Route Path**

**`/admin/media`**

## **2. Description**

AI-powered media library management page for uploading, organizing, and managing media assets with smart tagging, alt text generation, and intelligent cropping capabilities.

* Drag-and-drop upload
* AI auto-tagging
* Smart cropping
* Advanced filtering

## **3. Source File**

```
src/app/(protected)/admin/media/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying media library
* Handling file uploads
* Managing media metadata
* Providing AI-powered tools

### **This route does not:**

* Configure media settings (see /settings/media)
* Edit content using media
* Handle content publishing

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `string` | No | Filter by media type |
| `search` | `string` | No | Search query |

* **Default behaviour:** Show all media
* **Validation:** Invalid params use defaults

## **7. Layout & Structure**

### **Layout Overview**

* Header with upload button
* Sidebar with filters
* Main content with media grid

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title, upload button |
| Filter Sidebar | Advanced filters |
| Media Grid | Media items |
| Dialogs | Edit, crop, alt text |

## **8. Components Used**

### **UI Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `MediaCard` | `@/components/ui/MediaCard` | Individual media item display |
| `AltTextGenerator` | `@/components/ui/AltTextGenerator` | AI alt text generation dialog |
| `SmartCropEditor` | `@/components/ui/SmartCropEditor` | AI-powered cropping dialog |
| `MediaUpload` | `@/components/ui/MediaUpload` | Drag-and-drop upload interface |

### **Primitive Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Button` | `@/components/ui/primitives/Button` | Action buttons |
| `Input` | `@/components/ui/primitives/Input` | Search input |
| `Dialog` | `@/components/ui/primitives/Dialog` | Modal dialogs |

## **9. Data Flow Overview**

1. Verify admin authentication
2. Fetch media items with filters
3. Display media grid
4. User uploads → AI processing → add to grid
5. User selects item → open dialog → update

## **10. Data Fetching**

### **API Functions**

| Function | Import Path | Purpose |
|----------|-------------|---------|
| `getMediaList` | `@/lib/media-api` | Fetch all media items |
| `updateMediaItem` | `@/lib/media-api` | Update media metadata |
| `deleteMediaItem` | `@/lib/media-api` | Delete media item |

## **11. State Management**

### **Local State (useState)**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `mediaItems` | `MediaItem[]` | All loaded media items |
| `loading` | `boolean` | Loading state |
| `searchQuery` | `string` | Search filter text |
| `selectedType` | `MediaType \| 'all'` | Media type filter |
| `selectedTags` | `string[]` | Selected AI tags filter |
| `altTextMedia` | `MediaItem \| null` | Media for alt text dialog |
| `smartCropMedia` | `MediaItem \| null` | Media for crop dialog |
| `showUploadDialog` | `boolean` | Upload dialog visibility |

### **Computed/Memoized Values (useMemo)**

| Variable | Purpose |
|----------|---------|
| `allAITags` | Unique AI-detected tags from all media |
| `allColors` | Unique dominant colors from all media |
| `filteredMedia` | Media items matching current filters |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Spinner with message |
| Data loaded | Media grid |
| Empty | "No media yet" with upload button |
| Uploading | Upload progress dialog |
| Upload complete | AI processing → add to grid |
| Filtering | Grid updates to show matches |

## **13. User Actions**

### **Upload Actions**

| Action | Trigger | Description |
|--------|---------|-------------|
| Open upload dialog | Click "Upload Media" | Opens MediaUpload component |
| Upload files | Drag & drop or select | Upload with AI processing |
| Complete upload | Files processed | Refresh library, close dialog |

### **Filter Actions**

| Action | Trigger | Description |
|--------|---------|-------------|
| Search | Type in search | Filter by filename, tags, alt text |
| Filter by type | Select type radio | Show only images/videos |
| Toggle AI tag | Click tag button | Add/remove tag filter |
| Clear filters | Click "Clear" button | Reset all filters |

### **Media Item Actions**

| Action | Trigger | Description |
|--------|---------|-------------|
| Edit media | Click edit on card | Open edit dialog |
| Generate alt text | Click alt text action | Open AI alt text generator |
| Smart crop | Click crop action | Open AI crop editor |
| Delete media | Click delete action | Open confirmation dialog |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Upload | Complete upload | Upload API | Add to grid |
| Update | Save edit | Update API | Update item |
| Delete | Confirm delete | Delete API | Remove from grid |

## **14. Infinite Scroll / Pagination**

* **Type:** Grid with pagination or infinite scroll
* **Page size:** Varies by viewport
* **Controls:** Load more or pagination

## **15. Error & Empty States**

* **Loading:** Spinner with "Loading media..."
* **Error:** Error message with retry button
* **Empty:** "No media yet" with upload prompt
* **Delete failure:** Alert message
* **Update failure:** Alert message

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** useMemo for filters and computed values
* **Parallel vs sequential fetching:** Single media query
* **Known constraints:**
  * Large files take time to upload/process
  * AI processing adds latency

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through grid and controls
* **Focus management:** Focus trap in dialogs
* **Screen reader expectations:** Alt text announced for images
* **Landmark roles:** Main media area

## **18. Storybook & Testing Strategy**

### **Storybook**

* MediaCard variants
* Upload dialog
* AI tool dialogs
* Filter states

### **Testing**

* **Unit test focus:** Filter logic, state management
* **Integration test focus:** Upload and AI processing
* **E2E test focus:** Complete media management

## **19. Non-Goals / Out of Scope**

* Media settings configuration
* Content editing
* Publishing

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/content` | Content overview |
| `/admin/settings/media` | Media settings |

## **21. Open Questions / Notes**

* Consider adding bulk operations
* May need folder organization
* Consider adding media usage tracking

### **AI Features**

- **Auto-tagging**: AI analyzes uploaded images for content tags
- **Face detection**: Counts people in images
- **Color extraction**: Identifies dominant colors
- **Alt text generation**: AI-suggested accessibility descriptions
- **Smart cropping**: AI-powered aspect ratio cropping with generative fill option

### **MediaItem Type Structure**

```typescript
interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  filename: string;
  type: MediaType;
  orientation: MediaOrientation;
  width: number;
  height: number;
  size: number;
  uploadedAt: Date;
  uploadedBy: { id: string; name: string; avatar?: string };
  altText?: string;
  aiAnalysis: {
    tags: Array<{ label: string }>;
    peopleCount: number;
    dominantColors: string[];
    suggestedAltTexts: string[];
  };
}
```
