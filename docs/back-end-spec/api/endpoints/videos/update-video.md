# Update Video

Update an existing video.

## Endpoint

```
PUT /api/videos/{id}
```

## Description

Updates video metadata, source, and content.

## Authentication

**Required.** Must be video author or administrator.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Video ID |

## Request Body

```json
{
  "title": "Introduction to Python Programming - Updated",
  "description": "<p>Updated comprehensive tutorial...</p>",
  "excerpt": "Updated Python tutorial for beginners",
  "thumbnailId": "media_502",
  "transcript": "Updated transcript content...",
  "categoryIds": ["cat_5", "cat_6"],
  "tagIds": ["tag_10", "tag_12"],
  "difficulty": "beginner"
}
```

### Request Fields

All fields are optional. Only specified fields are updated.

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Video title |
| `description` | string | Rich text description |
| `excerpt` | string | Short summary |
| `thumbnailId` | string | Thumbnail media ID |
| `transcript` | string | Full transcript |
| `categoryIds` | string[] | Categories (replaces all) |
| `tagIds` | string[] | Tags (replaces all) |
| `difficulty` | string | Difficulty level |
| `visibility` | string | Visibility (platform videos only) |
| `collectionId` | string | Collection ID |
| `collectionOrder` | number | Order in collection |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "video_123",
    "slug": "introduction-to-python",
    "status": "published",
    "title": "Introduction to Python Programming - Updated",
    "description": "<p>Updated comprehensive tutorial...</p>",
    "author": {
      "id": "user_100",
      "name": "Dr. Sarah Chen"
    },
    "createdAt": "2024-01-10T09:00:00Z",
    "updatedAt": "2024-01-21T14:00:00Z",
    "categories": [
      { "id": "cat_5", "name": "Programming" },
      { "id": "cat_6", "name": "Tutorials" }
    ],
    "difficulty": "beginner"
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

#### Not Author (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_AUTHOR",
    "message": "Only the video author can update this video"
  }
}
```

## Example Request

```bash
curl -X PUT "https://api.example.com/api/videos/video_123" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Python Programming - Updated",
    "transcript": "Updated transcript..."
  }'
```

## Notes

- Categories/tags update replaces entire list
- `updatedAt` timestamp always refreshed
- To change video source, create new video

