# **Endpoint: `GET /api/cms/posts`**

### **Summary**

Lists posts with optional filtering, pagination, and sorting.

---

## **Authentication**

* **Required:** Yes
* **Scope:** CMS users with read access

## **Permissions**

* Users see posts in their accessible spaces
* Admins and Editors see all posts
* Authors see their own posts

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `postType` | string | No | Filter by post type slug |
| `space` | number | No | Filter by space ID |
| `author` | number | No | Filter by author ID |
| `status` | string | No | `published`, `draft`, `has_changes`, `archived` |
| `search` | string | No | Search in title |
| `archived` | boolean | No | Include archived posts |
| `orderBy` | string | No | Sort field (default: `updatedAt`) |
| `order` | string | No | `ASC` or `DESC` (default: `DESC`) |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20) |

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
      "title": "Getting Started Guide",
      "slug": "getting-started-guide",
      "postType": {
        "id": 1,
        "name": "article",
        "singularLabel": "Article"
      },
      "author": {
        "id": 123,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "space": 5,
      "featuredImage": "https://cdn.example.com/images/hero.jpg",
      "isPublished": true,
      "isDraft": false,
      "hasUnpublishedChanges": false,
      "publishedAt": "2024-06-15T10:00:00Z",
      "lastModifiedAt": "2024-06-20T14:30:00Z",
      "createdAt": "2024-06-10T09:00:00Z"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | Insufficient permissions |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

## **Pagination**

* Page-based pagination
* Returns `meta` with total, page, limit, pages

---

## **Related Endpoints**

* [GET /api/cms/posts/{id}](./get.md) - Get single post
* [POST /api/cms/posts](./create.md) - Create post

## **Frontend Notes**

* Use `postsAPI.list(params)` from `@/services/cms/api/posts`
* Cache responses for list views
* Refresh on post create/update/delete
