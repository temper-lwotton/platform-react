# **Endpoint: `GET /api/updates`**

### **Summary**

Retrieves a feed of status updates with optional filtering by space, user, or tags.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Users see updates based on visibility settings
* Space members see `all-spaces` and `selected-spaces` updates

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `spaceId` | string | No | Filter by space |
| `userId` | string | No | Filter by author |
| `tag` | string | No | Filter by tag name |
| `limit` | number | No | Max results (default: 20) |
| `before` | string | No | Cursor for pagination (ISO date) |

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
      "id": "1",
      "userId": "5",
      "text": "Analyzing traffic data from our electric bus pilot program",
      "emoji": "📊",
      "template": "analyzing",
      "media": [
        {
          "id": "media-1",
          "type": "image",
          "url": "https://cdn.example.com/updates/1/image1.jpg",
          "thumbnail": "https://cdn.example.com/updates/1/image1-thumb.jpg",
          "caption": "Traffic flow heatmap from last week"
        }
      ],
      "space": {
        "id": "23",
        "title": "Electric Vehicles"
      },
      "project": {
        "id": "proj_1",
        "name": "City Transit Electrification"
      },
      "author": {
        "id": "5",
        "fullName": "Luke Wotton",
        "jobTitle": "Transport Innovation Lead",
        "photo": "https://cdn.example.com/avatars/5.jpg"
      },
      "type": "status-update",
      "createdAt": "2024-06-20T14:30:00Z",
      "updatedAt": "2024-06-20T14:30:00Z",
      "likesCount": 3,
      "commentsCount": 1,
      "visibility": "all-spaces",
      "tags": [
        { "id": 1, "name": "electric-vehicles" },
        { "id": 2, "name": "data-analysis" }
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

* Cursor-based using `before` parameter
* Pass last update's `createdAt` for next page

---

## **Related Endpoints**

* [GET /api/updates/{id}](./get.md) - Get single update
* [POST /api/updates](./create.md) - Create update

## **Frontend Notes**

* Use mock data from `@/lib/status-updates` for now
* Sort by `createdAt` descending (newest first)
* Implement infinite scroll with cursor pagination
