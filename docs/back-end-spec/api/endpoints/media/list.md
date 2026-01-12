# **Endpoint: `GET /api/media`**

### **Summary**

Retrieves a list of media items with optional filtering and search.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Returns media from spaces user has access to
* May include user's own uploads across all spaces

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `spaceId` | number | No | Filter by space |
| `userId` | number | No | Filter by uploader |
| `type` | string | No | Filter by type (`image`) |
| `orientation` | string | No | `portrait`, `landscape`, `square` |
| `tags[]` | string[] | No | Filter by user tags |
| `search` | string | No | Search in title, description, tags |
| `sortOrder` | string | No | `asc` or `desc` (default: `desc`) |

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
    "items": [
      {
        "id": 456,
        "filename": "team-photo.jpg",
        "url": "https://cdn.example.com/media/456.jpg",
        "thumbnailUrl": "https://cdn.example.com/media/456-thumb.jpg",
        "size": 2048576,
        "width": 1920,
        "height": 1080,
        "type": "image/jpeg",
        "orientation": "landscape",
        "altText": "Team members at annual gathering",
        "title": "Team Photo 2024",
        "userTags": ["team", "2024"],
        "uploadedAt": "2024-06-20T14:30:00Z",
        "uploadedBy": {
          "id": 123,
          "name": "John Doe",
          "avatar": null
        }
      }
    ],
    "total": 150
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | Space access required |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

## **Pagination**

* Returns `total` count for pagination UI
* Default sort: newest first

---

## **Related Endpoints**

* [GET /api/media/{id}](./get.md) - Get full details
* [POST /api/media/upload](./upload.md) - Upload new

## **Frontend Notes**

* Use `getMediaList()` from `@/lib/media-api`
* Pass multiple tags as `tags[]=a&tags[]=b`
* Consider lazy loading for large galleries
