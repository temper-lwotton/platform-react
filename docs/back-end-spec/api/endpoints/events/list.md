# **Endpoint: `GET /api/events`**

### **Summary**

Retrieves a paginated list of events with optional filtering by space, tags, date range, and search.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Returns events from spaces the user has access to
* Private space events only visible to members

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `search` | string | No | - | Full-text search on title, description |
| `space` | number | No | - | Filter by space ID |
| `tags[]` | number[] | No | - | Filter by tag IDs |
| `matchAllTags` | boolean | No | `false` | AND vs OR for tags |
| `sort` | string | No | `asc` | Sort by date: `asc` or `desc` |
| `startDate` | string | No | - | Filter events starting after (ISO 8601) |
| `endDate` | string | No | - | Filter events ending before (ISO 8601) |
| `limit` | integer | No | 20 | Results per page |
| `offset` | integer | No | 0 | Skip first N results |

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
      "id": 1,
      "createdAt": "2024-06-01T10:00:00Z",
      "title": "AI in Transport Summit",
      "slug": "ai-transport-summit",
      "htmlContent": "<p>Join us for a day of...</p>",
      "eventStart": "2024-07-15T09:00:00Z",
      "eventEnd": "2024-07-15T17:00:00Z",
      "isOnline": false,
      "location": "London Conference Centre",
      "link": "https://example.com/register",
      "photo": "https://cdn.example.com/events/1.jpg",
      "space": {
        "id": 5,
        "name": "AI & Machine Learning",
        "slug": "ai-ml"
      },
      "author": {
        "id": 123,
        "name": "John Doe",
        "avatar": "https://cdn.example.com/photos/123.jpg"
      },
      "tags": [
        { "id": 1, "name": "Conference", "slug": "conference" }
      ]
    }
  ]
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

* **Strategy:** Offset-based
* **Parameters:** `offset`, `limit`
* **Default limit:** 20

---

## **Related Endpoints**

* [GET /api/events/{id}](./get.md) - Get single event
* [POST /api/events](./create.md) - Create event

## **Frontend Notes**

* Default sort is ascending (earliest first)
* Use `startDate` filter to show only upcoming events
* Combine with calendar view for date-based browsing
