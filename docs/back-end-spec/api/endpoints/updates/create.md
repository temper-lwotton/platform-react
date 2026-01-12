# **Endpoint: `POST /api/updates`**

### **Summary**

Creates a new status update with optional media and context.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User must be a member of the specified space

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

```json
{
  "text": "Analyzing traffic data from our electric bus pilot program",
  "emoji": "📊",
  "template": "analyzing",
  "spaceId": "23",
  "projectId": "proj_1",
  "media": [
    {
      "type": "image",
      "url": "https://cdn.example.com/temp/upload123.jpg",
      "caption": "Traffic flow heatmap"
    }
  ],
  "tags": ["electric-vehicles", "data-analysis"],
  "link": "https://example.com/report",
  "visibility": "all-spaces",
  "sharedWithSpaces": []
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `text` | Required, max 280 characters |
| `emoji` | Optional, single emoji |
| `template` | Optional, valid template ID |
| `spaceId` | Required, valid space ID |
| `projectId` | Optional, valid project ID |
| `media` | Optional, max 4 items |
| `visibility` | Required, valid visibility value |

---

## **Response**

### **Success Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "new-update-1",
    "userId": "5",
    "text": "Analyzing traffic data from our electric bus pilot program",
    "emoji": "📊",
    "template": "analyzing",
    "space": {
      "id": "23",
      "title": "Electric Vehicles"
    },
    "author": {
      "id": "5",
      "fullName": "Luke Wotton"
    },
    "type": "status-update",
    "createdAt": "2024-06-20T16:00:00Z",
    "updatedAt": "2024-06-20T16:00:00Z",
    "expiresAt": "2024-06-27T16:00:00Z",
    "likesCount": 0,
    "commentsCount": 0,
    "visibility": "all-spaces"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `TEXT_TOO_LONG` | Exceeds 280 characters |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_SPACE_MEMBER` | Not a member of space |
| 404 | `SPACE_NOT_FOUND` | Space does not exist |
| 422 | `VALIDATION_ERROR` | Invalid input data |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| User status updated | Becomes user's current status |
| `update.created` event | Emitted for tracking |
| Notifications | Space members may be notified |

## **Idempotency**

* **Idempotent:** No
* **Retry-safe:** No (creates duplicates)

---

## **Related Endpoints**

* [GET /api/updates](./list.md) - View in feed
* [DELETE /api/updates/{id}](./delete.md) - Delete update

## **Frontend Notes**

* Use quick templates from `QUICK_TEMPLATES`
* Show emoji picker with `COMMON_EMOJIS`
* Validate character count client-side
* Upload media separately, then include URLs
