# Get Article Comments

Retrieve comments on an article.

## Endpoint

```
GET /api/articles/{id}/comments
```

## Description

Returns a paginated list of comments on an article. Comments are threaded with replies nested under parent comments.

## Authentication

Optional for public articles. Required for members-only or space articles.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Article ID |

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Max comments to return |
| `offset` | number | 0 | Skip comments |
| `sortBy` | string | date | Sort: date, likes |
| `sortOrder` | string | desc | Sort order: asc, desc |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "comment_1",
      "articleId": "article_123",
      "parentId": null,
      "author": {
        "id": "user_50",
        "name": "Michael Brown",
        "avatar": "https://cdn.example.com/avatars/michael.jpg"
      },
      "content": "Great article! This really helped me understand the basics of ML.",
      "likeCount": 12,
      "hasLiked": false,
      "isAuthorResponse": false,
      "createdAt": "2024-01-16T10:00:00Z",
      "updatedAt": "2024-01-16T10:00:00Z",
      "replies": [
        {
          "id": "comment_2",
          "articleId": "article_123",
          "parentId": "comment_1",
          "author": {
            "id": "user_100",
            "name": "Dr. Sarah Chen",
            "avatar": "https://cdn.example.com/avatars/sarah.jpg"
          },
          "content": "Thank you! Glad it was helpful. Feel free to ask if you have any questions.",
          "likeCount": 5,
          "hasLiked": true,
          "isAuthorResponse": true,
          "createdAt": "2024-01-16T11:00:00Z",
          "updatedAt": "2024-01-16T11:00:00Z",
          "replies": []
        }
      ]
    },
    {
      "id": "comment_3",
      "articleId": "article_123",
      "parentId": null,
      "author": {
        "id": "user_51",
        "name": "Emily Wong",
        "avatar": "https://cdn.example.com/avatars/emily.jpg"
      },
      "content": "Could you elaborate on the section about neural networks?",
      "likeCount": 3,
      "hasLiked": false,
      "isAuthorResponse": false,
      "createdAt": "2024-01-17T09:00:00Z",
      "updatedAt": "2024-01-17T09:00:00Z",
      "replies": []
    }
  ],
  "meta": {
    "total": 28,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

### Error Responses

#### Article Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "ARTICLE_NOT_FOUND",
    "message": "Article 'article_invalid' does not exist"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Comment ID |
| `parentId` | string | Parent comment ID (null for top-level) |
| `author` | object | Comment author info |
| `content` | string | Comment text |
| `likeCount` | number | Number of likes |
| `hasLiked` | boolean | Current user has liked |
| `isAuthorResponse` | boolean | Comment from article author |
| `replies` | array | Nested reply comments |

## Example Request

```bash
curl -X GET "https://api.example.com/api/articles/article_123/comments?limit=20" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Top-level comments returned with nested replies
- `hasLiked` only available for authenticated users
- `isAuthorResponse` highlights article author's comments
- Deleted comments show as "[deleted]" if they have replies

