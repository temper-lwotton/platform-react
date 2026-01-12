# **Endpoint: `GET /api/updates/{id}`**

### **Summary**

Retrieves a single status update by ID.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user with access

## **Permissions**

* User must have visibility access to the update
* Author always has access

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Update ID |

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
        "caption": "Traffic flow heatmap"
      }
    ],
    "space": {
      "id": "23",
      "title": "Electric Vehicles"
    },
    "author": {
      "id": "5",
      "fullName": "Luke Wotton",
      "jobTitle": "Transport Innovation Lead"
    },
    "type": "status-update",
    "createdAt": "2024-06-20T14:30:00Z",
    "updatedAt": "2024-06-20T14:30:00Z",
    "likesCount": 3,
    "commentsCount": 1,
    "visibility": "all-spaces"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | No visibility access |
| 404 | `UPDATE_NOT_FOUND` | Update does not exist |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/updates](./list.md) - List updates
* [DELETE /api/updates/{id}](./delete.md) - Delete update

## **Frontend Notes**

* Use for deep linking to specific updates
* Useful for notification click-through
