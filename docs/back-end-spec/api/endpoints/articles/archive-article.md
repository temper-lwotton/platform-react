# Archive Article

Archive a published article.

## Endpoint

```
POST /api/articles/{id}/archive
```

## Description

Archives a published article, removing it from listings but keeping it accessible via direct link. Useful for outdated content that shouldn't be deleted.

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
    "status": "archived",
    "title": "Getting Started with Python",
    "author": {
      "id": "user_5",
      "name": "Luke Wotton"
    },
    "publishedAt": "2024-01-21T15:00:00Z",
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-22T10:00:00Z"
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

#### Cannot Archive Draft (400)

```json
{
  "success": false,
  "error": {
    "code": "CANNOT_ARCHIVE_DRAFT",
    "message": "Cannot archive an unpublished article"
  }
}
```

#### Not Author (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_AUTHOR",
    "message": "You do not have permission to archive this article"
  }
}
```

## Side Effects

- Article removed from search index
- Article excluded from listings and recommendations
- Direct link access preserved

## Example Request

```bash
curl -X POST "https://api.example.com/api/articles/article_200/archive" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Notes

- Only published articles can be archived
- Archived articles accessible via direct link
- Can be unarchived by publishing again
- Engagement stats preserved

