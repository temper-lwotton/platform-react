# Publish Video

Publish a draft video.

## Endpoint

```
POST /api/videos/{id}/publish
```

## Description

Changes video status from draft to published, making it visible to authorized users.

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
    "id": "video_300",
    "slug": "getting-started-with-react",
    "status": "published",
    "title": "Getting Started with React",
    "author": {
      "id": "user_5",
      "name": "Luke Wotton"
    },
    "publishedAt": "2024-01-21T15:00:00Z",
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T15:00:00Z"
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

#### Already Published (400)

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_PUBLISHED",
    "message": "Video is already published"
  }
}
```

#### Video Required (400)

```json
{
  "success": false,
  "error": {
    "code": "VIDEO_REQUIRED",
    "message": "Video must have a valid source before publishing"
  }
}
```

## Side Effects

- Video indexed for search
- Space members notified (for space videos)
- View count tracking begins

## Example Request

```bash
curl -X POST "https://api.example.com/api/videos/video_300/publish" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Notes

- `publishedAt` set to current timestamp
- Video must have valid source
- Cannot publish archived videos

