# Add Comment

Add a comment to a video.

## Endpoint

```
POST /api/videos/{id}/comments
```

## Description

Adds a new comment to a video. Can include a timestamp reference to link to a specific point in the video.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Video ID |

## Request Body

### Standard Comment

```json
{
  "content": "Really helpful tutorial, thanks for sharing!"
}
```

### Comment with Timestamp

```json
{
  "content": "The explanation at this point was super clear!",
  "timestamp": 930
}
```

### Reply to Comment

```json
{
  "content": "I agree, this section was really well explained.",
  "parentId": "comment_100"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | Comment text (max 5000 chars) |
| `parentId` | string | No | Parent comment ID for replies |
| `timestamp` | number | No | Video timestamp in seconds |

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "comment_200",
    "videoId": "video_123",
    "parentId": null,
    "author": {
      "id": "user_5",
      "name": "Luke Wotton",
      "avatar": "https://cdn.example.com/avatars/luke.jpg"
    },
    "content": "The explanation at this point was super clear!",
    "timestamp": 930,
    "likeCount": 0,
    "hasLiked": false,
    "isAuthorResponse": false,
    "createdAt": "2024-01-21T17:00:00Z",
    "updatedAt": "2024-01-21T17:00:00Z",
    "replies": []
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

#### Parent Comment Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "COMMENT_NOT_FOUND",
    "message": "Parent comment does not exist"
  }
}
```

#### Comments Disabled (403)

```json
{
  "success": false,
  "error": {
    "code": "COMMENTS_DISABLED",
    "message": "Comments are disabled for this video"
  }
}
```

## Side Effects

- Video `commentCount` incremented
- Video author notified of new comment
- Parent comment author notified of reply

## Example Request

```bash
curl -X POST "https://api.example.com/api/videos/video_123/comments" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great explanation at 15:30!",
    "timestamp": 930
  }'
```

## Notes

- Timestamp allows clicking to jump to that point
- Replies limited to one level deep
- Rate limited to 30 comments per minute

