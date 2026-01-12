# **Endpoint: `PATCH /api/media/{id}`**

### **Summary**

Updates metadata for a media item. Partial updates supported.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Media owner or space admin

## **Permissions**

* User must be the uploader, OR
* User must be admin of the media's space

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
| `Content-Type` | Yes | `application/json` |

### **Request Body**

Partial update - only include fields to change:

```json
{
  "altText": "Updated alt text description",
  "title": "New Title",
  "description": "Updated description",
  "userTags": ["updated", "tags"]
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `altText` | Max 500 characters |
| `title` | Max 200 characters |
| `description` | Max 1000 characters |
| `userTags` | Array of strings, max 20 tags |

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 456,
    "filename": "team-photo.jpg",
    "url": "https://cdn.example.com/media/456.jpg",
    "thumbnailUrl": "https://cdn.example.com/media/456-thumb.jpg",
    "altText": "Updated alt text description",
    "title": "New Title",
    "description": "Updated description",
    "userTags": ["updated", "tags"],
    "uploadedAt": "2024-06-20T14:30:00Z",
    "uploadedBy": {
      "id": 123,
      "name": "John Doe",
      "avatar": null
    }
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_OWNER` | Not uploader or space admin |
| 404 | `MEDIA_NOT_FOUND` | Media does not exist |
| 422 | `VALIDATION_ERROR` | Invalid input data |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `media.updated` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/media/{id}](./get.md) - Get media
* [DELETE /api/media/{id}](./delete.md) - Delete media

## **Frontend Notes**

* Use `updateMediaItem(id, updates)` from `@/lib/media-api`
* Only send changed fields
* Consider debouncing rapid updates
