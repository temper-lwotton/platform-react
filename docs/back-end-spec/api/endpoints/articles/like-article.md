# Like/Unlike Article

Add or remove a like from an article.

## Endpoints

```
POST /api/articles/{id}/like
DELETE /api/articles/{id}/like
```

## Description

Allows authenticated users to like or unlike an article. Likes contribute to article engagement metrics.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Article ID |

## Like Article

### Request

```
POST /api/articles/{id}/like
```

No request body required.

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "articleId": "article_123",
    "liked": true,
    "likeCount": 188
  }
}
```

## Unlike Article

### Request

```
DELETE /api/articles/{id}/like
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "articleId": "article_123",
    "liked": false,
    "likeCount": 187
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

### Already Liked (400)

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_LIKED",
    "message": "You have already liked this article"
  }
}
```

### Not Liked (400)

```json
{
  "success": false,
  "error": {
    "code": "NOT_LIKED",
    "message": "You have not liked this article"
  }
}
```

## Example Requests

### Like

```bash
curl -X POST "https://api.example.com/api/articles/article_123/like" \
  -H "Authorization: Bearer <token>"
```

### Unlike

```bash
curl -X DELETE "https://api.example.com/api/articles/article_123/like" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Users can only like an article once
- Like count returned for immediate UI update
- Author notified of new likes

