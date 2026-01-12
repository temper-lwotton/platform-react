# Update Reading Progress

Save user's reading progress on an article.

## Endpoint

```
POST /api/articles/{id}/progress
```

## Description

Saves the user's reading progress for an article. Enables "continue reading" functionality and completion tracking.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Article ID |

## Request Body

```json
{
  "progress": 75,
  "scrollPosition": 2450
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `progress` | number | Yes | Percentage read (0-100) |
| `scrollPosition` | number | No | Scroll position in pixels |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "articleId": "article_123",
    "progress": 75,
    "scrollPosition": 2450,
    "lastReadAt": "2024-01-21T16:30:00Z",
    "isComplete": false
  }
}
```

### Completed Article Response

When progress reaches 100%:

```json
{
  "success": true,
  "data": {
    "articleId": "article_123",
    "progress": 100,
    "scrollPosition": 5200,
    "lastReadAt": "2024-01-21T16:45:00Z",
    "isComplete": true,
    "completedAt": "2024-01-21T16:45:00Z"
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

#### Invalid Progress (400)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Progress must be between 0 and 100"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/articles/article_123/progress" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "progress": 75,
    "scrollPosition": 2450
  }'
```

## Notes

- Progress is debounced on client (recommended: 5-10 seconds)
- Scroll position used to restore reading position
- Completion tracked when progress reaches 100%
- Rate limited to prevent excessive updates

