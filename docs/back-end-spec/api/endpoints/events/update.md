# **Endpoint: `PATCH /api/events/{id}`**

### **Summary**

Updates an existing event. Only the author or space admin can update.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Event author or space admin

## **Permissions**

* Event author can update their own events
* Space admins can update any event in their space

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | number | Yes | Event ID |

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
  "title": "Updated Event Title",
  "startDateTime": "2024-07-16T10:00:00Z",
  "endDateTime": "2024-07-16T18:00:00Z",
  "location": "New Venue"
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `title` | Max 200 characters |
| `startDateTime` | ISO 8601 format |
| `endDateTime` | ISO 8601, must be after start |
| `htmlContent` | Non-empty if provided |
| `location` | Required if event is in-person |
| `link` | Valid URL if provided |

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Event Title",
    "eventStart": "2024-07-16T10:00:00Z",
    "eventEnd": "2024-07-16T18:00:00Z",
    "location": "New Venue"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_DATE_RANGE` | End date before start date |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_AUTHOR` | Not author and not space admin |
| 404 | `EVENT_NOT_FOUND` | Event does not exist |
| 422 | `VALIDATION_ERROR` | Invalid input data |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `event.updated` event | Emitted for tracking |
| Notifications | May notify attendees of changes |

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/events/{id}](./get.md) - Get event
* [DELETE /api/events/{id}](./delete.md) - Delete event

## **Frontend Notes**

* Only send changed fields
* Cannot change space after creation
* Photo updates require separate upload (future)
