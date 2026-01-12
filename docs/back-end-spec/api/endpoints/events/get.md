# **Endpoint: `GET /api/events/{id}`**

### **Summary**

Retrieves a single event with full details.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user (respects space access)

## **Permissions**

* Public space events: Any authenticated user
* Private space events: Space members only

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
    "id": 1,
    "createdAt": "2024-06-01T10:00:00Z",
    "title": "AI in Transport Summit",
    "slug": "ai-transport-summit",
    "htmlContent": "<p>Join us for a comprehensive exploration of AI applications in the transport sector...</p>",
    "jsonContent": { "root": { "children": [...] } },
    "eventStart": "2024-07-15T09:00:00Z",
    "eventEnd": "2024-07-15T17:00:00Z",
    "isOnline": false,
    "location": "London Conference Centre, 123 Main St",
    "link": "https://example.com/register",
    "photo": "https://cdn.example.com/events/1.jpg",
    "space": {
      "id": 5,
      "name": "AI & Machine Learning",
      "slug": "ai-ml",
      "description": "A space for AI enthusiasts",
      "privacy": "public",
      "memberCount": 150
    },
    "author": {
      "id": 123,
      "name": "John Doe",
      "username": "johndoe",
      "avatar": "https://cdn.example.com/photos/123.jpg"
    },
    "tags": [
      { "id": 1, "name": "Conference", "slug": "conference" },
      { "id": 5, "name": "AI", "slug": "ai" }
    ]
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | Not a member of private space |
| 404 | `EVENT_NOT_FOUND` | Event does not exist |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/events/{id}/attendees](./get-attendees.md) - Get attendees
* [POST /api/events/{id}/rsvp](./rsvp.md) - RSVP to event

## **Frontend Notes**

* Use `htmlContent` for rendering, `jsonContent` for editor
* Check `isOnline` to show appropriate location/link UI
* Calculate event status (upcoming/ongoing/past) client-side
