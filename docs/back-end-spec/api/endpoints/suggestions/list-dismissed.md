# **Endpoint: `GET /api/suggestions/dismissed`**

### **Summary**

Retrieves a list of suggestions the user has previously dismissed.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User can only view their own dismissed suggestions

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `limit` | number | No | Max items (default: 20) |
| `cursor` | string | No | Pagination cursor |

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
  "data": [
    {
      "id": "dismiss_456",
      "suggestion": {
        "id": "sug_100",
        "type": "space",
        "title": "Web3 Developers",
        "description": "Community for Web3 and blockchain developers",
        "url": "/spaces/89",
        "entityId": "space_89",
        "entityType": "space"
      },
      "dismissedAt": "2024-01-18T14:30:00Z",
      "reason": "not_interested"
    },
    {
      "id": "dismiss_457",
      "suggestion": {
        "id": "sug_95",
        "type": "user",
        "title": "John Smith",
        "description": "Blockchain Developer",
        "url": "/users/234",
        "entityId": "user_234",
        "entityType": "user"
      },
      "dismissedAt": "2024-01-17T10:15:00Z",
      "reason": "already_know"
    },
    {
      "id": "dismiss_458",
      "suggestion": {
        "id": "sug_88",
        "type": "event",
        "title": "Crypto Conference 2024",
        "description": "Annual cryptocurrency conference",
        "url": "/events/156",
        "entityId": "event_156",
        "entityType": "event"
      },
      "dismissedAt": "2024-01-16T09:00:00Z",
      "reason": "not_relevant"
    }
  ],
  "meta": {
    "nextCursor": "eyJpZCI6ImRpc21pc3NfNDU4In0",
    "hasMore": false
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

## **Pagination**

* Cursor-based using `cursor` parameter
* Ordered by dismissal date descending (most recent first)

---

## **Related Endpoints**

* [POST /api/suggestions/{id}/dismiss](./dismiss.md) - Dismiss suggestion
* [DELETE /api/suggestions/{id}/dismiss](./restore.md) - Restore dismissed

## **Frontend Notes**

* Provide UI in settings to manage dismissed suggestions
* Allow users to restore suggestions from this list
* Show dismissal reason if available
* Consider grouping by type for easier management
