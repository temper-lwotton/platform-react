# **Endpoint: `GET /api/cms/posts/{slug}/published`**

### **Summary**

Retrieves a published post by its slug. Public-facing endpoint for rendering content.

---

## **Authentication**

* **Required:** No (for public posts)
* **Scope:** Public access for published content

## **Permissions**

* Public posts accessible without authentication
* Private space posts require space membership

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slug` | string | Yes | Post slug |

### **Query Parameters**

*None*

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | No | `Bearer <token>` (for private content) |

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
    "title": "Getting Started Guide",
    "slug": "getting-started-guide",
    "postType": {
      "id": 1,
      "name": "article",
      "singularLabel": "Article"
    },
    "author": {
      "id": 123,
      "name": "John Doe"
    },
    "featuredImage": "https://cdn.example.com/images/hero.jpg",
    "contentHtml": "<h1>Getting Started</h1><p>Welcome to our guide...</p>",
    "excerpt": "A comprehensive guide to getting started with our platform.",
    "publishedAt": "2024-06-15T10:00:00Z",
    "terms": [
      {
        "id": 10,
        "name": "Tutorial",
        "slug": "tutorial"
      }
    ]
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Private content, no token |
| 403 | `ACCESS_DENIED` | Not a space member |
| 404 | `POST_NOT_FOUND` | Post not found or not published |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/cms/posts/{id}](./get.md) - Get by ID (admin view)
* [GET /api/cms/posts](./list.md) - List posts

## **Frontend Notes**

* Use `postsAPI.getPublished(slug)` from `@/services/cms/api/posts`
* Returns rendered HTML content, not JSON editor state
* Cache aggressively for public content
* 404 for draft or unpublished posts
