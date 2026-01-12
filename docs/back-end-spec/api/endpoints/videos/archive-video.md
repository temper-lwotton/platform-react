# Archive Video

Archive a published video.

## Endpoint

```
POST /api/videos/{id}/archive
```

## Description

Archives a video, removing it from listings but keeping it accessible via direct link.

## Authentication

**Required.** Must be video author, editor, or administrator.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Video ID |

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
    "id": "video_123",
    "slug": "introduction-to-python",
    "status": "archived",
    "title": "Introduction to Python Programming",
    "author": {
      "id": "user_100",
      "name": "Dr. Sarah Chen"
    },
    "publishedAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-22T10:00:00Z"
  }
}
```

### Error Responses

#### Video Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "VIDEO_NOT_FOUND",
    "message": "Video 'video_invalid' does not exist"
  }
}
```

#### Cannot Archive Draft (400)

```json
{
  "success": false,
  "error": {
    "code": "CANNOT_ARCHIVE_DRAFT",
    "message": "Cannot archive an unpublished video"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/videos/video_123/archive" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Notes

- Only published videos can be archived
- Direct link access preserved
- Can be unarchived by publishing again

