# Videos API Endpoints

API endpoints for video content management.

## Overview

The Videos API provides endpoints for creating, managing, and playing video content. Videos can be platform-wide or space-specific, supporting both uploads and external embeds.

## Base URL

```
/api/videos
/api/spaces/{spaceId}/videos
```

## Endpoints

### Videos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/videos](./list-videos.md) | List platform videos |
| GET | [/api/spaces/{spaceId}/videos](./list-space-videos.md) | List space videos |
| GET | [/api/videos/{idOrSlug}](./get-video.md) | Get video details |
| POST | [/api/videos](./create-video.md) | Create platform video |
| POST | [/api/spaces/{spaceId}/videos](./create-space-video.md) | Create space video |
| PUT | [/api/videos/{id}](./update-video.md) | Update video |
| POST | [/api/videos/{id}/publish](./publish-video.md) | Publish video |
| POST | [/api/videos/{id}/archive](./archive-video.md) | Archive video |
| DELETE | [/api/videos/{id}](./delete-video.md) | Delete video |

### Interactions {#interactions}

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | [/api/videos/{id}/like](./like-video.md) | Like video |
| DELETE | [/api/videos/{id}/like](./like-video.md) | Unlike video |
| POST | [/api/videos/{id}/bookmark](./bookmark-video.md) | Bookmark video |
| DELETE | [/api/videos/{id}/bookmark](./bookmark-video.md) | Remove bookmark |
| POST | [/api/videos/{id}/progress](./update-progress.md) | Update watch progress |

### Comments {#comments}

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/videos/{id}/comments](./get-comments.md) | Get video comments |
| POST | [/api/videos/{id}/comments](./add-comment.md) | Add comment |

### Collections {#collections}

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/videos/collections](./list-collections.md) | List collections |
| GET | [/api/videos/collections/{id}](./get-collection.md) | Get collection |
| POST | [/api/videos/collections](./create-collection.md) | Create collection |
| PUT | [/api/videos/collections/{id}](./update-collection.md) | Update collection |

## Authentication

Most read endpoints vary by visibility. Write endpoints require authentication.

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
| `VIDEO_NOT_FOUND` | 404 | Video does not exist |
| `COLLECTION_NOT_FOUND` | 404 | Collection does not exist |
| `NOT_AUTHOR` | 403 | Only author can perform action |
| `NOT_SPACE_MEMBER` | 403 | User not a space member |
| `INVALID_SOURCE` | 400 | Video source URL is invalid |

## Video Source Types

| Type | Description |
|------|-------------|
| `upload` | Uploaded video file |
| `youtube` | YouTube embed |
| `vimeo` | Vimeo embed |
| `wistia` | Wistia embed |
| `embed` | Generic iframe |

## Related Documentation

- [Videos Domain Specification](../../domains/videos.md)
- [Articles Domain](../../domains/articles.md)
- [Spaces Domain](../../domains/spaces.md)

