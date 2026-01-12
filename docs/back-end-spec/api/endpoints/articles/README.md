# Articles API Endpoints

API endpoints for article content management.

## Overview

The Articles API provides endpoints for creating, managing, and reading longform articles. Articles can be platform-wide or space-specific, and support text, video, or mixed content types.

## Base URL

```
/api/articles
/api/spaces/{spaceId}/articles
```

## Endpoints

### Articles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/articles](./list-articles.md) | List platform articles |
| GET | [/api/spaces/{spaceId}/articles](./list-space-articles.md) | List space articles |
| GET | [/api/articles/{idOrSlug}](./get-article.md) | Get article |
| POST | [/api/articles](./create-article.md) | Create platform article |
| POST | [/api/spaces/{spaceId}/articles](./create-space-article.md) | Create space article |
| PUT | [/api/articles/{id}](./update-article.md) | Update article |
| POST | [/api/articles/{id}/publish](./publish-article.md) | Publish article |
| POST | [/api/articles/{id}/archive](./archive-article.md) | Archive article |
| DELETE | [/api/articles/{id}](./delete-article.md) | Delete article |

### Interactions {#interactions}

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | [/api/articles/{id}/like](./like-article.md) | Like article |
| DELETE | [/api/articles/{id}/like](./like-article.md) | Unlike article |
| POST | [/api/articles/{id}/bookmark](./bookmark-article.md) | Bookmark article |
| DELETE | [/api/articles/{id}/bookmark](./bookmark-article.md) | Remove bookmark |
| POST | [/api/articles/{id}/progress](./update-progress.md) | Update reading progress |

### Comments {#comments}

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/articles/{id}/comments](./get-comments.md) | Get article comments |
| POST | [/api/articles/{id}/comments](./add-comment.md) | Add comment |

## Authentication

Most read endpoints are public or require authentication based on visibility. Write endpoints require authentication and appropriate permissions.

```
Authorization: Bearer <token>
```

## Common Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `ARTICLE_NOT_FOUND` | 404 | Article does not exist |
| `SLUG_EXISTS` | 400 | Slug already in use |
| `NOT_AUTHOR` | 403 | Only author can perform action |
| `NOT_SPACE_MEMBER` | 403 | User not a space member |
| `ALREADY_PUBLISHED` | 400 | Article already published |

## Article Types

| Type | Description |
|------|-------------|
| `text` | Written content only |
| `video` | Video with optional transcript |
| `mixed` | Video and written content |

## Related Documentation

- [Articles Domain Specification](../../domains/articles.md)
- [Spaces Domain](../../domains/spaces.md)
- [Comments Domain](../../domains/comments.md)

