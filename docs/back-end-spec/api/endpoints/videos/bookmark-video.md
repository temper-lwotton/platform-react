# Bookmark/Unbookmark Video

Save or remove a video from bookmarks.

## Endpoints

```
POST /api/videos/{id}/bookmark
DELETE /api/videos/{id}/bookmark
```

## Description

Allows authenticated users to bookmark videos for easy access.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Video ID |

## Bookmark Video

### Request

```
POST /api/videos/{id}/bookmark
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "videoId": "video_123",
    "bookmarked": true,
    "bookmarkCount": 157,
    "bookmarkedAt": "2024-01-21T16:00:00Z"
  }
}
```

## Remove Bookmark

### Request

```
DELETE /api/videos/{id}/bookmark
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "videoId": "video_123",
    "bookmarked": false,
    "bookmarkCount": 156
  }
}
```

## Error Responses

### Video Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "VIDEO_NOT_FOUND",
    "message": "Video 'video_invalid' does not exist"
  }
}
```

## Example Requests

### Bookmark

```bash
curl -X POST "https://api.example.com/api/videos/video_123/bookmark" \
  -H "Authorization: Bearer <token>"
```

### Remove

```bash
curl -X DELETE "https://api.example.com/api/videos/video_123/bookmark" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Bookmarks are private to the user
- Access via `/api/users/{userId}/bookmarks`

