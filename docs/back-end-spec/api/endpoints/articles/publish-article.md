# Publish Article

Publish a draft article.

## Endpoint

```
POST /api/articles/{id}/publish
```

## Description

Changes article status from draft to published, making it visible to authorized users. Sets the `publishedAt` timestamp.

## Authentication

**Required.** Must be article author, editor, or administrator.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Article ID |

## Request Body

No request body required.

```json
{}
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "article_200",
    "slug": "getting-started-with-python",
    "type": "text",
    "status": "published",
    "title": "Getting Started with Python",
    "author": {
      "id": "user_5",
      "name": "Luke Wotton"
    },
    "publishedAt": "2024-01-21T15:00:00Z",
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T15:00:00Z"
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

#### Already Published (400)

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_PUBLISHED",
    "message": "Article is already published"
  }
}
```

#### Not Author (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_AUTHOR",
    "message": "You do not have permission to publish this article"
  }
}
```

#### Content Required (400)

```json
{
  "success": false,
  "error": {
    "code": "CONTENT_REQUIRED",
    "message": "Article must have content before publishing"
  }
}
```

## Side Effects

- Article indexed for search
- Space members notified (for space articles)
- View count tracking begins

## Example Request

```bash
curl -X POST "https://api.example.com/api/articles/article_200/publish" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Notes

- `publishedAt` set to current timestamp
- Article must have title and content
- Video articles must have video content
- Cannot publish archived articles (unarchive first)

