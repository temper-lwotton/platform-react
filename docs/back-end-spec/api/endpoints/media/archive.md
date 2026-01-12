# **Endpoint: `POST /api/media/{id}/archive`**

### **Summary**

Archives a media item (soft-delete). The item is hidden but can be restored.

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
    "archived": true,
    "archivedAt": "2024-06-25T10:00:00Z"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_OWNER` | Not uploader or space admin |
| 404 | `MEDIA_NOT_FOUND` | Media does not exist |
| 409 | `ALREADY_ARCHIVED` | Media is already archived |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Hidden from lists | Won't appear in standard queries |
| Files retained | Original files kept on CDN |
| `media.archived` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [POST /api/media/{id}/unarchive](./unarchive.md) - Restore
* [DELETE /api/media/{id}](./delete.md) - Permanent delete

## **Frontend Notes**

* Use `archiveMediaItem(id)` from `@/lib/media-api`
* Preferred over delete for reversibility
* Show "Undo" option after archiving
