# Get Video Comments

Retrieve comments on a video.

## Endpoint

```
GET /api/videos/{id}/comments
```

## Description

Returns a paginated list of comments on a video. Comments are threaded with replies nested under parent comments.

## Authentication

Optional for public videos. Required for members-only or space videos.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Video ID |

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Max comments to return |
| `offset` | number | 0 | Skip comments |
| `sortBy` | string | date | Sort: date, likes |
| `sortOrder` | string | desc | Sort order |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "comment_100",
      "videoId": "video_123",
      "parentId": null,
      "author": {
        "id": "user_50",
        "name": "Michael Brown",
        "avatar": "https://cdn.example.com/avatars/michael.jpg"
      },
      "content": "Great tutorial! The explanation at 15:30 was especially helpful.",
      "timestamp": 930,
      "likeCount": 15,
      "hasLiked": false,
      "isAuthorResponse": false,
      "createdAt": "2024-01-16T10:00:00Z",
      "updatedAt": "2024-01-16T10:00:00Z",
      "replies": [
        {
          "id": "comment_101",
          "videoId": "video_123",
          "parentId": "comment_100",
          "author": {
            "id": "user_100",
            "name": "Dr. Sarah Chen",
            "avatar": "https://cdn.example.com/avatars/sarah.jpg"
          },
          "content": "Thanks! That section took a while to get right.",
          "likeCount": 5,
          "hasLiked": true,
          "isAuthorResponse": true,
          "createdAt": "2024-01-16T11:00:00Z",
          "replies": []
        }
      ]
    }
  ],
  "meta": {
    "total": 45,
    "limit": 50,
    "offset": 0,
    "hasMore": false
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

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | number | Video timestamp reference (seconds) |
| `isAuthorResponse` | boolean | Comment from video author |

## Example Request

```bash
curl -X GET "https://api.example.com/api/videos/video_123/comments" \
  -H "Authorization: Bearer <token>"
```

## Notes

- `timestamp` links comment to video position
- `isAuthorResponse` highlights author's comments

