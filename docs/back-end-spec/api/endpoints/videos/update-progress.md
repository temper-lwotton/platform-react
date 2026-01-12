# Update Watch Progress

Save user's watch progress on a video.

## Endpoint

```
POST /api/videos/{id}/progress
```

## Description

Saves the user's watch progress for a video. Enables "continue watching" functionality and completion tracking.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Video ID |

## Request Body

```json
{
  "progress": 65,
  "watchedSeconds": 1199
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `progress` | number | Yes | Percentage watched (0-100) |
| `watchedSeconds` | number | Yes | Seconds watched |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "videoId": "video_123",
    "progress": 65,
    "watchedSeconds": 1199,
    "lastWatchedAt": "2024-01-21T16:30:00Z",
    "isComplete": false
  }
}
```

### Completed Video Response

When progress reaches 90%:

```json
{
  "success": true,
  "data": {
    "videoId": "video_123",
    "progress": 95,
    "watchedSeconds": 1753,
    "lastWatchedAt": "2024-01-21T16:45:00Z",
    "isComplete": true,
    "completedAt": "2024-01-21T16:45:00Z"
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

## Example Request

```bash
curl -X POST "https://api.example.com/api/videos/video_123/progress" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "progress": 65,
    "watchedSeconds": 1199
  }'
```

## Notes

- Progress debounced on client (recommended: 10-15 seconds)
- Completion tracked at 90% progress
- Rate limited to prevent excessive updates

