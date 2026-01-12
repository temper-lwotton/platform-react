# **Endpoint: `POST /api/events`**

### **Summary**

Creates a new event. Supports both JSON and multipart/form-data for photo uploads.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Space members

## **Permissions**

* User must be a member of the target space
* Author is auto-populated from JWT token

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
| `Content-Type` | Conditional | `application/json` OR omit for multipart |

### **Request Body (JSON)**

```json
{
  "title": "AI in Transport Summit",
  "space": 5,
  "startDateTime": "2024-07-15T09:00:00Z",
  "endDateTime": "2024-07-15T17:00:00Z",
  "htmlContent": "<p>Join us for a comprehensive exploration...</p>",
  "jsonContent": { "root": { "children": [] } },
  "isOnline": false,
  "location": "London Conference Centre",
  "link": "https://example.com/register",
  "tagIds": [1, 5]
}
```

### **Request Body (Multipart for Photo)**

```
Content-Type: multipart/form-data

title: AI in Transport Summit
space: 5
startDateTime: 2024-07-15T09:00:00Z
endDateTime: 2024-07-15T17:00:00Z
htmlContent: <p>Join us...</p>
jsonContent: {"root":{"children":[]}}
isOnline: false
location: London Conference Centre
tagIds[]: 1
tagIds[]: 5
photo: [binary file data]
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `title` | Required, max 200 characters |
| `space` | Required, valid space ID |
| `startDateTime` | Required, ISO 8601 format |
| `endDateTime` | Required, ISO 8601, must be after start |
| `htmlContent` | Required, non-empty |
| `isOnline` | Required, boolean |
| `location` | Required if `isOnline: false` |
| `link` | Optional, valid URL |
| `tagIds` | Optional, array of valid tag IDs |
| `photo` | Optional, image file (max 10MB) |

---

## **Response**

### **Success Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 42,
    "createdAt": "2024-06-20T14:30:00Z",
    "title": "AI in Transport Summit",
    "slug": "ai-transport-summit",
    "eventStart": "2024-07-15T09:00:00Z",
    "eventEnd": "2024-07-15T17:00:00Z",
    "isOnline": false,
    "location": "London Conference Centre",
    "photo": "https://cdn.example.com/events/42.jpg",
    "space": { "id": 5, "name": "AI & Machine Learning" },
    "author": { "id": 123, "name": "John Doe" },
    "tags": [
      { "id": 1, "name": "Conference" }
    ]
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_DATE_RANGE` | End date before start date |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_SPACE_MEMBER` | User not a member of space |
| 404 | `SPACE_NOT_FOUND` | Space does not exist |
| 422 | `VALIDATION_ERROR` | Invalid input data |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `event.created` event | Emitted for tracking |
| Notifications | Sent to space members |

## **Idempotency**

* **Idempotent:** No
* **Retry-safe:** No (creates duplicate)

---

## **Related Endpoints**

* [GET /api/events/{id}](./get.md) - View created event
* [PATCH /api/events/{id}](./update.md) - Update event

## **Frontend Notes**

* Use `createEventWithPhoto()` helper for multipart uploads
* Do NOT manually set Content-Type for multipart
* All IDs are numeric
* Author auto-populated - do not include in payload
