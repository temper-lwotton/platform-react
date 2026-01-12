# Delete Article

Permanently delete an article.

## Endpoint

```
DELETE /api/articles/{id}
```

## Description

Permanently deletes an article and all associated data. This action cannot be undone.

## Authentication

**Required.** Administrator role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Article ID |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "article_200",
    "deleted": true
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

#### Forbidden (403)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Only administrators can delete articles"
  }
}
```

## Side Effects

- Article removed from search index
- Comments deleted
- Engagement data deleted
- Related content links removed

## Example Request

```bash
curl -X DELETE "https://api.example.com/api/articles/article_200" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Only administrators can delete articles
- Consider archiving instead for outdated content
- Deletion is permanent and cannot be undone
- All associated comments are also deleted

