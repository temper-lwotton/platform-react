# Like/Unlike Video

Add or remove a like from a video.

## Endpoints

```
POST /api/videos/{id}/like
DELETE /api/videos/{id}/like
```

## Description

Allows authenticated users to like or unlike a video.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Video ID |

## Like Video

### Request

```
POST /api/videos/{id}/like
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "videoId": "video_123",
    "liked": true,
    "likeCount": 288
  }
}
```

## Unlike Video

### Request

```
DELETE /api/videos/{id}/like
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "videoId": "video_123",
    "liked": false,
    "likeCount": 287
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

### Like

```bash
curl -X POST "https://api.example.com/api/videos/video_123/like" \
  -H "Authorization: Bearer <token>"
```

### Unlike

```bash
curl -X DELETE "https://api.example.com/api/videos/video_123/like" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Users can only like once
- Like count returned for immediate UI update

