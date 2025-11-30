# Media Library API Integration - Complete

## ✅ Integration Status

The frontend is now **fully integrated** with the backend media API at `http://localhost:8080/api/media`.

---

## 🎯 What's Been Implemented

### 1. **Media API Client** (`src/lib/media-api.ts`)

Complete TypeScript client for all media endpoints:

- ✅ `uploadMedia()` - Upload images with AI analysis
- ✅ `getMediaList()` - Fetch media with filtering
- ✅ `getMediaItem()` - Get single media item
- ✅ `updateMediaItem()` - Update metadata (alt text, tags, etc.)
- ✅ `reanalyzeImage()` - Re-run AI analysis
- ✅ `generateAltText()` - Generate alt text suggestions
- ✅ `deleteMediaItem()` - Delete media
- ✅ `archiveMediaItem()` - Archive media
- ✅ `unarchiveMediaItem()` - Unarchive media

**Authentication:** Automatically includes JWT token from `localStorage` using existing `getToken()` pattern.

### 2. **MediaUpload Component** (`src/components/ui/MediaUpload/`)

**Now uses real API:**
- ✅ Calls `uploadMedia()` instead of mock simulation
- ✅ Displays real AI analysis results (tags, colors, people count)
- ✅ Shows actual upload progress
- ✅ Handles real errors from backend
- ✅ Supports optional `spaceId` prop

**Usage:**
```typescript
<MediaUpload
  spaceId={123}  // Optional: associate uploads with a space
  onUploadComplete={(files) => {
    console.log('Uploaded:', files);
  }}
/>
```

### 3. **UploadProgress Component** (`src/components/ui/MediaUpload/UploadProgress.tsx`)

**Now displays real AI data:**
- ✅ Shows actual AI-detected tags with confidence scores
- ✅ Displays real dominant colors from backend
- ✅ Shows actual people count from AI analysis
- ✅ Handles all API response fields

---

## 🚀 How to Use

### Basic Upload

```typescript
import { uploadMedia } from '@/lib/media-api';

// Simple upload
const mediaItem = await uploadMedia(file);

// Upload with metadata
const mediaItem = await uploadMedia(file, {
  spaceId: 123,
  title: 'My Image',
  description: 'A beautiful sunset',
  altText: 'Custom alt text',
  userTags: ['nature', 'sunset'],
});
```

### Fetch Media List

```typescript
import { getMediaList } from '@/lib/media-api';

// Get all media
const media = await getMediaList();

// Filter by space
const spaceMedia = await getMediaList({ spaceId: 123 });

// Search and filter
const filtered = await getMediaList({
  search: 'sunset',
  orientation: 'landscape',
  tags: ['nature', 'outdoor'],
  sortOrder: 'desc',
});
```

### Update Metadata

```typescript
import { updateMediaItem } from '@/lib/media-api';

await updateMediaItem(456, {
  altText: 'Updated description',
  title: 'New Title',
  userTags: ['beach', 'summer'],
});
```

### Generate Alt Text

```typescript
import { generateAltText } from '@/lib/media-api';

// For existing media item
const suggestions = await generateAltText({ imageId: 456, count: 5 });

// For external URL
const suggestions = await generateAltText({
  imageUrl: 'https://example.com/image.jpg',
  count: 3,
});
```

---

## 📦 API Response Structure

All API responses match this structure:

```typescript
{
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### MediaItem Structure

```typescript
{
  id: number;
  filename: string;
  url: string;
  thumbnailUrl: string | null;
  size: number;
  width: number | null;
  height: number | null;
  type: string;
  orientation: 'portrait' | 'landscape' | 'square' | null;
  altText: string | null;
  title: string | null;
  description: string | null;
  userTags: string[];
  aiAnalysis: {
    tags: [
      {
        id: string;
        label: string;
        confidence: number;  // 0-1
        category: 'object' | 'person' | 'emotion' | 'scene' | 'color' | 'text';
      }
    ];
    suggestedAltTexts: string[];
    dominantColors: string[];  // Hex colors
    peopleCount: number;
    faces: [
      {
        x: number;  // 0-1 normalized
        y: number;
        width: number;
        height: number;
        emotion?: string;
      }
    ];
    moderationFlags: {
      isAdult: boolean;
      isViolent: boolean;
      confidence: number;
    };
  };
  uploadedAt: string;  // ISO 8601
  uploadedBy: {
    id: number;
    name: string;
    avatar: string | null;
  };
  space: {
    id: number;
    name: string;
    slug: string;
  } | null;
}
```

---

## 🔧 Configuration

### Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

This is already configured and working!

### Authentication

Uses existing JWT token from `localStorage`:
- Token key: `jwt_token`
- Automatically included via `getToken()` from `src/lib/auth.ts`
- All API calls include `Authorization: Bearer <token>` header

---

## 🎨 Current Media Library Page

The media library page (`src/app/(protected)/media-library/page.tsx`) now has **full integration**:

✅ Uses MediaUpload component with real API integration
✅ Shows upload dialog with "Done" button
✅ **Fetches real media items from the API** (no more mock data!)
✅ **Automatically refreshes gallery after uploads**
✅ **Updates alt text via API** when using the generator
✅ **Loading states** while fetching media
✅ **Error states** with retry functionality
✅ **Empty states** with helpful messaging

### How It Works:

```typescript
// On page load
useEffect(() => {
  loadMediaItems();  // Fetches from API
}, []);

// After upload
const handleUploadComplete = async (files: UploadFile[]) => {
  await loadMediaItems();  // Refreshes the gallery
};

// When saving alt text
const handleSaveAltText = async (mediaId: string, altText: string) => {
  await updateMediaItem(Number(mediaId), { altText });  // Updates via API
  // Updates local state for immediate feedback
};
```

---

## 🔍 Error Handling

All API functions throw errors that can be caught:

```typescript
try {
  const mediaItem = await uploadMedia(file);
  console.log('Success!', mediaItem);
} catch (error) {
  if (error instanceof Error) {
    console.error('Upload failed:', error.message);
    // Show user-friendly error message
  }
}
```

Common error codes from backend:
- `UNAUTHORIZED` - User not authenticated
- `INVALID_FILE_TYPE` - Wrong file format
- `FILE_TOO_LARGE` - File exceeds 10MB
- `UPLOAD_FAILED` - Upload error
- `AI_ANALYSIS_FAILED` - AI processing error

---

## 🧪 Testing the Integration

### 1. Test Upload

1. Navigate to `/media-library`
2. Click "Upload Media" button
3. Drag & drop an image or click "Browse Files"
4. Watch the upload progress
5. Verify AI analysis results appear

### 2. Test with Backend Running

Ensure backend is running at `http://localhost:8080`:

```bash
# Backend should be running
curl http://localhost:8080/api/media
```

### 3. Check Browser Console

Look for:
- ✅ Successful API calls to `http://localhost:8080/api/media/upload`
- ✅ Auth token being sent in headers
- ✅ AI analysis data in response

### 4. Check Network Tab

Verify:
- Request URL: `http://localhost:8080/api/media/upload`
- Request Headers: `Authorization: Bearer <token>`
- Response: `{ success: true, data: { ... } }`

---

## 📝 Completed Enhancements

### ✅ 1. Replace Mock Data in Gallery

The gallery now fetches real media items from the API on page load.

### ✅ 2. Add Refresh After Upload

The gallery automatically refreshes after uploads complete, showing newly uploaded items.

### ✅ 3. Update Alt Text via API

Alt text changes are saved to the backend and reflected in the gallery.

### 📝 Future Enhancements (Optional)

These features can be added later as needed:

#### 1. Connect Client-Side Filters to API

Currently filters work client-side. For better performance with large libraries, connect them to API:

```typescript
const loadMediaItems = async () => {
  const items = await getMediaList({
    search: searchQuery,
    orientation: selectedOrientation !== 'all' ? selectedOrientation : undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });
  setMediaItems(items.map(convertAPIMediaItem));
};
```

#### 2. Add Edit/Delete Actions

Implement full CRUD operations via MediaCard actions:

```typescript
// Delete item
const handleDelete = async (mediaId: number) => {
  await deleteMediaItem(mediaId);
  await loadMediaItems();  // Refresh
};

// Update metadata
const handleUpdate = async (mediaId: number, updates: MediaUpdateRequest) => {
  await updateMediaItem(mediaId, updates);
  await loadMediaItems();  // Refresh
};
```

#### 3. Add Pagination

For large media libraries, implement pagination:

```typescript
const loadMediaItems = async (page: number = 1, limit: number = 50) => {
  const items = await getMediaList({
    page,
    limit,
    sortOrder: 'desc',
  });
  setMediaItems(items.map(convertAPIMediaItem));
};
```

---

## 🐛 Troubleshooting

### Upload fails with "UNAUTHORIZED"

**Solution:** Ensure user is logged in and JWT token exists in localStorage:
```javascript
localStorage.getItem('jwt_token')
```

### Upload fails with "CORS error"

**Solution:** Backend needs to allow frontend origin in CORS configuration.

### "Network Error" or connection refused

**Solution:** Verify backend is running at `http://localhost:8080`:
```bash
curl http://localhost:8080/api/media
```

### AI analysis returns null

**Solution:** Check backend logs - OpenAI API key might be missing or invalid.

---

## 📚 Related Files

**Frontend:**
- `src/lib/media-api.ts` - API client (NEW)
- `src/components/ui/MediaUpload/MediaUpload.tsx` - Upload component (UPDATED)
- `src/components/ui/MediaUpload/UploadProgress.tsx` - Progress display (UPDATED)
- `src/app/(protected)/media-library/page.tsx` - Media library page
- `src/lib/auth.ts` - Authentication utilities (EXISTING)

**Backend Specification:**
- `BACKEND_API_SPEC.md` - Complete backend requirements
- Backend endpoint: `http://localhost:8080/api/media/*`

---

## ✨ Summary

The media library is now **fully integrated** with your backend API!

**What works:**
- ✅ Real image uploads to `http://localhost:8080/api/media/upload`
- ✅ **Gallery displays real media from the API**
- ✅ **Automatic refresh after uploads**
- ✅ **Alt text updates saved to backend**
- ✅ AI analysis from OpenAI (tags, colors, people detection)
- ✅ JWT authentication automatically included
- ✅ Error handling and progress tracking
- ✅ Loading states and error states with retry
- ✅ Full TypeScript type safety
- ✅ Drag & drop + file browser upload

**Ready to use:**
- Upload images and see real AI analysis
- View your entire media library from the backend
- Filter by orientation, tags, colors, and people count
- Update alt text and see changes persist
- View AI-detected tags with confidence scores
- See dominant colors extracted from images
- Get people count detection
- All data stored in your backend database

**Test it now:**
1. Start your backend: `http://localhost:8080`
2. Navigate to `/media-library`
3. Upload an image
4. Watch it appear in the gallery automatically!
5. Try the filters, alt text generator, and smart crop features

---

**Last Updated:** 2025-01-30
**Status:** ✅ **Complete Integration - Gallery, Upload, and Updates All Connected**
