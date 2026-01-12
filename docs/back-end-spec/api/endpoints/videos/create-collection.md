# Create Collection

Create a new video collection.

## Endpoint

```
POST /api/videos/collections
```

## Description

Creates a new video collection (playlist/series).

## Authentication

**Required.** User must have content creation permissions.

## Request Body

```json
{
  "title": "React Fundamentals",
  "description": "Complete guide to React from basics to advanced concepts.",
  "thumbnailId": "media_700",
  "visibility": "public",
  "spaceId": null,
  "videoIds": ["video_300", "video_301", "video_302"]
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Collection title |
| `description` | string | No | Collection description |
| `thumbnailId` | string | No | Thumbnail media ID |
| `visibility` | string | No | public, members, restricted |
| `spaceId` | string | No | Space ID (for space collections) |
| `videoIds` | string[] | No | Ordered list of video IDs |

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "coll_20",
    "slug": "react-fundamentals",
    "title": "React Fundamentals",
    "description": "Complete guide to React from basics to advanced concepts.",
    "thumbnail": {
      "id": "media_700",
      "url": "https://cdn.example.com/collections/react-fundamentals.jpg"
    },
    "videoCount": 3,
    "totalDuration": 5400,
    "author": {
      "id": "user_5",
      "name": "Luke Wotton"
    },
    "visibility": "public",
    "spaceId": null,
    "createdAt": "2024-01-21T18:00:00Z",
    "updatedAt": "2024-01-21T18:00:00Z"
  }
}
```

### Error Responses

#### Validation Error (400)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "errors": {
      "title": ["Title is required"]
    }
  }
}
```

#### Video Not Found (400)

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
curl -X POST "https://api.example.com/api/videos/collections" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Fundamentals",
    "videoIds": ["video_300", "video_301"]
  }'
```

## Notes

- Slug auto-generated from title
- Videos added in order specified
- Videos can be added/reordered later

