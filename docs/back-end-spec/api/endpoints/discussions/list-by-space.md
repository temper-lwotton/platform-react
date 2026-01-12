# **Endpoint: `GET /api/spaces/{spaceId}/discussions`**

### **Summary**

Retrieves discussions belonging to a specific space.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user (public spaces) or members (private spaces)

## **Permissions**

* Public spaces: Any authenticated user
* Private spaces: Members only

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `spaceId` | string | Yes | Space ID |

### **Query Parameters**

*None currently - returns all discussions*

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
      "createdAt": "2024-06-15T10:30:00Z",
      "title": "Best practices for remote collaboration",
      "excerpt": "Exploring effective strategies for distributed teams...",
      "author": {
        "id": "123",
        "profile": {
          "fullName": "John Doe",
          "photo": "https://cdn.example.com/photos/123.jpg"
        }
      },
      "space": {
        "id": "5",
        "title": "Operations Excellence"
      },
      "likesCount": 15,
      "commentsCount": 8,
      "isPinned": true,
      "isLiked": false,
      "isFollowing": false
    }
  ]
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | Not a member of private space |
| 404 | `SPACE_NOT_FOUND` | Space ID does not exist |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/discussion](./list.md) - All discussions
* [GET /api/spaces/{id}](../spaces/get.md) - Space details

## **Frontend Notes**

* Used on `/spaces/[id]/discussions` page
* Pinned discussions (`isPinned: true`) should be shown first
* Order by most recent after pinned items
