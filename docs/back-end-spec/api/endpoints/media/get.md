# **Endpoint: `GET /api/media/{id}`**

### **Summary**

Retrieves a single media item with full details and AI analysis.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user with access

## **Permissions**

* User must have access to the media's space (if space-scoped)
* Uploader always has access to their own media

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | number | Yes | Media item ID |

### **Query Parameters**

*None*

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <token>` |

### **Request Body**

*None*

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 456,
    "filename": "upload-12345.jpg",
    "seoFilename": "team-photo-2024.jpg",
    "url": "https://cdn.example.com/media/456.jpg",
    "thumbnailUrl": "https://cdn.example.com/media/456-thumb.jpg",
    "size": 2048576,
    "width": 1920,
    "height": 1080,
    "type": "image/jpeg",
    "orientation": "landscape",
    "altText": "Team members at annual gathering",
    "title": "Team Photo 2024",
    "description": "Annual company gathering in the main office",
    "userTags": ["team", "2024", "company"],
    "aiAnalysis": {
      "tags": [
        { "id": "t1", "label": "people", "confidence": 0.98, "category": "object" },
        { "id": "t2", "label": "office", "confidence": 0.85, "category": "scene" },
        { "id": "t3", "label": "happy", "confidence": 0.72, "category": "emotion" }
      ],
      "suggestedAltTexts": [
        "Group of professionals standing together in an office",
        "Team of colleagues smiling at the camera"
      ],
      "dominantColors": ["#2C3E50", "#ECF0F1", "#3498DB"],
      "peopleCount": 12,
      "faces": [
        { "x": 100, "y": 50, "width": 80, "height": 80, "emotion": "happy" }
      ],
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
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | No access to media's space |
| 404 | `MEDIA_NOT_FOUND` | Media does not exist |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/media](./list.md) - List media
* [PATCH /api/media/{id}](./update.md) - Update metadata
* [POST /api/media/{id}/analyze](./analyze.md) - Re-analyze

## **Frontend Notes**

* Use `getMediaItem(id)` from `@/lib/media-api`
* Full AI analysis included for detail views
* Check `moderationFlags` before displaying
