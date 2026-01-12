# **Endpoint: `POST /api/media/{id}/unarchive`**

### **Summary**

Restores an archived media item, making it visible again.

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
    "filename": "team-photo.jpg",
    "url": "https://cdn.example.com/media/456.jpg",
    "archived": false,
    "archivedAt": null
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_OWNER` | Not uploader or space admin |
| 404 | `MEDIA_NOT_FOUND` | Media does not exist |
| 409 | `NOT_ARCHIVED` | Media is not currently archived |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Visible in lists | Appears in standard queries again |
| `media.unarchived` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [POST /api/media/{id}/archive](./archive.md) - Archive again
* [GET /api/media](./list.md) - View in lists

## **Frontend Notes**

* Use `unarchiveMediaItem(id)` from `@/lib/media-api`
* Typically accessed from an "Archived" or "Trash" view
* Confirm restoration with user
