# List Collections

Retrieve video collections.

## Endpoint

```
GET /api/videos/collections
```

## Description

Returns a list of video collections (playlists/series).

## Authentication

Optional. Required for members-only collections.

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `spaceId` | string | - | Filter by space |
| `author` | string | - | Filter by author |
| `search` | string | - | Search query |
| `sortBy` | string | date | Sort: date, videos, duration |
| `sortOrder` | string | desc | Sort order |
| `limit` | number | 20 | Max items |
| `cursor` | string | - | Pagination cursor |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "coll_10",
      "slug": "python-for-beginners",
      "title": "Python for Beginners",
      "description": "Complete Python course from zero to hero.",
      "thumbnail": {
        "url": "https://cdn.example.com/collections/python-course.jpg",
        "thumbnails": {
          "medium": "https://cdn.example.com/collections/python-course-640.jpg"
        }
      },
      "videoCount": 10,
      "totalDuration": 18000,
      "author": {
        "id": "user_100",
        "name": "Dr. Sarah Chen",
        "avatar": "https://cdn.example.com/avatars/sarah.jpg"
      },
      "visibility": "public",
      "spaceId": null,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-15T14:00:00Z"
    },
    {
      "id": "coll_11",
      "slug": "ml-fundamentals",
      "title": "Machine Learning Fundamentals",
      "description": "Introduction to ML concepts and techniques.",
      "thumbnail": {
        "url": "https://cdn.example.com/collections/ml-fundamentals.jpg"
      },
      "videoCount": 8,
      "totalDuration": 14400,
      "author": {
        "id": "user_101",
        "name": "James Wilson"
      },
      "visibility": "members",
      "spaceId": "space_23",
      "space": {
        "id": "space_23",
        "title": "ML Engineers"
      },
      "createdAt": "2024-01-05T09:00:00Z",
      "updatedAt": "2024-01-18T10:00:00Z"
    }
  ],
  "meta": {
    "nextCursor": null,
    "hasMore": false,
    "total": 12
  }
}
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/videos/collections?sortBy=videos" \
  -H "Authorization: Bearer <token>"
```

## Notes

- `totalDuration` is sum of all video durations
- Collections ordered by `updatedAt` by default

