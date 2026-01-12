# **Endpoint: `POST /api/media/upload`**

### **Summary**

Uploads an image file with optional metadata. Automatically runs AI analysis.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User must be authenticated
* If `spaceId` provided, user must be a member of that space

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

*None*

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <token>` |

*Note: Do NOT manually set Content-Type for multipart*

### **Request Body (Multipart Form Data)**

```
Content-Type: multipart/form-data

file: [binary image data]
spaceId: 5
title: Team Photo
description: Annual team gathering
altText: Team members standing together
userTags[]: team
userTags[]: 2024
autoRename: true
customFilename: annual-team-photo-2024
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `file` | Required, image type, max 10MB |
| `spaceId` | Optional, valid space ID |
| `title` | Optional, max 200 characters |
| `description` | Optional, max 1000 characters |
| `altText` | Optional, max 500 characters |
| `userTags` | Optional, array of strings |
| `autoRename` | Optional, boolean (default: true) |
| `customFilename` | Optional, overrides autoRename |

---

## **Response**

### **Success Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 456,
    "filename": "upload-12345.jpg",
    "seoFilename": "annual-team-photo-2024.jpg",
    "url": "https://cdn.example.com/media/456.jpg",
    "thumbnailUrl": "https://cdn.example.com/media/456-thumb.jpg",
    "size": 2048576,
    "width": 1920,
    "height": 1080,
    "type": "image/jpeg",
    "orientation": "landscape",
    "altText": "Team members standing together",
    "title": "Team Photo",
    "description": "Annual team gathering",
    "userTags": ["team", "2024"],
    "aiAnalysis": {
      "tags": [
        { "id": "t1", "label": "people", "confidence": 0.98, "category": "object" },
        { "id": "t2", "label": "office", "confidence": 0.85, "category": "scene" }
      ],
      "suggestedAltTexts": [
        "Group of professionals in an office setting",
        "Team of colleagues gathered together"
      ],
      "dominantColors": ["#2C3E50", "#ECF0F1", "#3498DB"],
      "peopleCount": 12,
      "moderationFlags": {
        "isAdult": false,
        "isViolent": false,
        "confidence": 0.99
      }
    },
    "uploadedAt": "2024-06-20T14:30:00Z",
    "uploadedBy": {
      "id": 123,
      "name": "John Doe",
      "avatar": "https://cdn.example.com/avatars/123.jpg"
    },
    "space": {
      "id": 5,
      "name": "Company Updates",
      "slug": "company-updates"
    }
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_FILE_TYPE` | Not an image file |
| 400 | `FILE_TOO_LARGE` | Exceeds 10MB limit |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_SPACE_MEMBER` | Not a member of specified space |
| 422 | `VALIDATION_ERROR` | Invalid metadata |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| File stored | Image saved to CDN |
| Thumbnail generated | Resized version created |
| AI analysis runs | Async analysis triggered |
| `media.uploaded` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** No (creates new item each time)
* **Retry-safe:** No (duplicate uploads)

---

## **Related Endpoints**

* [GET /api/media/{id}](./get.md) - View uploaded media
* [PATCH /api/media/{id}](./update.md) - Update metadata

## **Frontend Notes**

* Use `uploadMedia()` helper from `@/lib/media-api`
* Do NOT set Content-Type header manually
* Show upload progress for large files
* Display AI analysis results after upload completes
