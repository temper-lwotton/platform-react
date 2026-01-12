# Bookmark/Unbookmark Article

Save or remove an article from bookmarks.

## Endpoints

```
POST /api/articles/{id}/bookmark
DELETE /api/articles/{id}/bookmark
```

## Description

Allows authenticated users to bookmark articles for later reading. Bookmarked articles appear in the user's saved items.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Article ID |

## Bookmark Article

### Request

```
POST /api/articles/{id}/bookmark
```

No request body required.

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "articleId": "article_123",
    "bookmarked": true,
    "bookmarkCount": 343,
    "bookmarkedAt": "2024-01-21T16:00:00Z"
  }
}
```

## Remove Bookmark

### Request

```
DELETE /api/articles/{id}/bookmark
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "articleId": "article_123",
    "bookmarked": false,
    "bookmarkCount": 342
  }
}
```

## Error Responses

### Article Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "ARTICLE_NOT_FOUND",
    "message": "Article 'article_invalid' does not exist"
  }
}
```

### Already Bookmarked (400)

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_BOOKMARKED",
    "message": "You have already bookmarked this article"
  }
}
```

### Not Bookmarked (400)

```json
{
  "success": false,
  "error": {
    "code": "NOT_BOOKMARKED",
    "message": "This article is not in your bookmarks"
  }
}
```

## Example Requests

### Bookmark

```bash
curl -X POST "https://api.example.com/api/articles/article_123/bookmark" \
  -H "Authorization: Bearer <token>"
```

### Remove Bookmark

```bash
curl -X DELETE "https://api.example.com/api/articles/article_123/bookmark" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Bookmarks are private to the user
- Bookmark count is public
- Access bookmarks via `/api/users/{userId}/bookmarks`

