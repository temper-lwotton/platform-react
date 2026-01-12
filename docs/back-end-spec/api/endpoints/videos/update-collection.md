# Update Collection

Update a video collection.

## Endpoint

```
PUT /api/videos/collections/{id}
```

## Description

Updates collection metadata and video ordering.

## Authentication

**Required.** Must be collection author or administrator.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Collection ID |

## Request Body

```json
{
  "title": "React Fundamentals - Complete Course",
  "description": "Updated comprehensive React course.",
  "thumbnailId": "media_701",
  "videoIds": ["video_300", "video_303", "video_301", "video_302"]
}
```

### Request Fields

All fields are optional. Only specified fields are updated.

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Collection title |
| `description` | string | Collection description |
| `thumbnailId` | string | Thumbnail media ID |
| `visibility` | string | Visibility setting |
| `videoIds` | string[] | Ordered video IDs (replaces and reorders) |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "coll_20",
    "slug": "react-fundamentals",
    "title": "React Fundamentals - Complete Course",
    "description": "Updated comprehensive React course.",
    "thumbnail": {
      "id": "media_701",
      "url": "https://cdn.example.com/collections/react-updated.jpg"
    },
    "videoCount": 4,
    "totalDuration": 7200,
    "author": {
      "id": "user_5",
      "name": "Luke Wotton"
    },
    "visibility": "public",
    "createdAt": "2024-01-21T18:00:00Z",
    "updatedAt": "2024-01-21T19:00:00Z"
  }
}
```

### Error Responses

#### Collection Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "COLLECTION_NOT_FOUND",
    "message": "Collection 'coll_invalid' does not exist"
  }
}
```

#### Not Author (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_AUTHOR",
    "message": "Only the collection author can update this collection"
  }
}
```

## Example Request

```bash
curl -X PUT "https://api.example.com/api/videos/collections/coll_20" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Fundamentals - Complete Course",
    "videoIds": ["video_300", "video_303", "video_301", "video_302"]
  }'
```

## Notes

- `videoIds` replaces entire video list
- Videos reordered according to array order
- Use to add, remove, or reorder videos

