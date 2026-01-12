# **Endpoint: `POST /api/media/generate-alt-text`**

### **Summary**

Generates alt text suggestions for an image. Can be used with existing media items or external image URLs.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User must be authenticated
* If using `imageId`, user must have access to that media

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
| `Content-Type` | Yes | `application/json` |

### **Request Body**

Provide either `imageId` or `imageUrl`:

```json
{
  "imageId": 456,
  "count": 3
}
```

Or:

```json
{
  "imageUrl": "https://example.com/photo.jpg",
  "count": 5
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `imageId` | Valid media ID (mutually exclusive with imageUrl) |
| `imageUrl` | Valid URL (mutually exclusive with imageId) |
| `count` | Optional, 1-10 suggestions (default: 3) |

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "suggestions": [
      "A group of professionals gathered in a modern office space",
      "Team members collaborating around a conference table",
      "Business meeting with diverse colleagues discussing ideas"
    ]
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `MISSING_IMAGE` | Neither imageId nor imageUrl provided |
| 400 | `INVALID_URL` | imageUrl is not a valid URL |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | No access to specified imageId |
| 404 | `MEDIA_NOT_FOUND` | imageId does not exist |
| 500 | `GENERATION_FAILED` | AI service error |

---

## **Side Effects**

*None* - does not modify the media item

## **Idempotency**

* **Idempotent:** No (may produce different suggestions)
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [PATCH /api/media/{id}](./update.md) - Apply chosen alt text
* [POST /api/media/{id}/analyze](./analyze.md) - Full analysis

## **Frontend Notes**

* Use `generateAltText(request)` from `@/lib/media-api`
* Can be used for images not yet uploaded
* Present suggestions as selectable options
* Allow users to edit selected suggestion
