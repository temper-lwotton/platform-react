# Add Comment

Add a comment to an article.

## Endpoint

```
POST /api/articles/{id}/comments
```

## Description

Adds a new comment to an article. Can be a top-level comment or a reply to an existing comment.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Article ID |

## Request Body

### Top-level Comment

```json
{
  "content": "This is a great introduction to machine learning. Thanks for sharing!"
}
```

### Reply to Comment

```json
{
  "content": "I agree! The examples were particularly helpful.",
  "parentId": "comment_1"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | Comment text (max 5000 chars) |
| `parentId` | string | No | Parent comment ID for replies |

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "comment_100",
    "articleId": "article_123",
    "parentId": null,
    "author": {
      "id": "user_5",
      "name": "Luke Wotton",
      "avatar": "https://cdn.example.com/avatars/luke.jpg"
    },
    "content": "This is a great introduction to machine learning. Thanks for sharing!",
    "likeCount": 0,
    "hasLiked": false,
    "isAuthorResponse": false,
    "createdAt": "2024-01-21T17:00:00Z",
    "updatedAt": "2024-01-21T17:00:00Z",
    "replies": []
  }
}
```

### Reply Response

```json
{
  "success": true,
  "data": {
    "id": "comment_101",
    "articleId": "article_123",
    "parentId": "comment_1",
    "author": {
      "id": "user_5",
      "name": "Luke Wotton",
      "avatar": "https://cdn.example.com/avatars/luke.jpg"
    },
    "content": "I agree! The examples were particularly helpful.",
    "likeCount": 0,
    "hasLiked": false,
    "isAuthorResponse": false,
    "createdAt": "2024-01-21T17:05:00Z",
    "updatedAt": "2024-01-21T17:05:00Z",
    "replies": []
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

#### Parent Comment Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "COMMENT_NOT_FOUND",
    "message": "Parent comment does not exist"
  }
}
```

#### Content Required (400)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Comment content is required"
  }
}
```

#### Comments Disabled (403)

```json
{
  "success": false,
  "error": {
    "code": "COMMENTS_DISABLED",
    "message": "Comments are disabled for this article"
  }
}
```

## Side Effects

- Article `commentCount` incremented
- Article author notified of new comment
- Parent comment author notified of reply

## Example Request

```bash
curl -X POST "https://api.example.com/api/articles/article_123/comments" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a great introduction to machine learning!"
  }'
```

## Notes

- Comments support basic markdown formatting
- Replies limited to one level deep
- Rate limited to 30 comments per minute
- Mentions (@username) trigger notifications

