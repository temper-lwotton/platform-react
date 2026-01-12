# **Endpoint: `DELETE /api/media/{id}`**

### **Summary**

Permanently deletes a media item and its associated files.

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

**Status:** `204 No Content`

*No response body*

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_OWNER` | Not uploader or space admin |
| 404 | `MEDIA_NOT_FOUND` | Media does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Files deleted | Original and thumbnail removed from CDN |
| References broken | Any content using this media will have broken links |
| `media.deleted` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** Yes (subsequent calls return 404)
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [POST /api/media/{id}/archive](./archive.md) - Soft-delete alternative
* [GET /api/media](./list.md) - List media

## **Frontend Notes**

* Use `deleteMediaItem(id)` from `@/lib/media-api`
* Requires confirmation dialog
* Consider using archive instead for reversible deletion
* Check for usage before deleting
