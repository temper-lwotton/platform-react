# List Videos

Retrieve a list of platform-wide videos.

## Endpoint

```
GET /api/videos
```

## Description

Returns a paginated list of videos. Supports filtering by category, author, difficulty, and more.

## Authentication

Optional. Required for accessing members-only content.

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `spaceId` | string | - | Filter by space |
| `status` | string | published | Filter by status |
| `category` | string | - | Filter by category slug |
| `tag` | string | - | Filter by tag slug |
| `author` | string | - | Filter by author ID |
| `difficulty` | string | - | Filter: beginner, intermediate, advanced |
| `collectionId` | string | - | Filter by collection |
| `search` | string | - | Search query |
| `sortBy` | string | date | Sort: date, views, likes, duration |
| `sortOrder` | string | desc | Sort order: asc, desc |
| `limit` | number | 20 | Max items to return |
| `cursor` | string | - | Pagination cursor |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "video_123",
      "slug": "introduction-to-python",
      "status": "published",
      "spaceId": null,
      "title": "Introduction to Python Programming",
      "excerpt": "Learn Python basics in this comprehensive video tutorial.",
      "thumbnail": {
        "url": "https://cdn.example.com/videos/python-intro-thumb.jpg",
        "thumbnails": {
          "medium": "https://cdn.example.com/videos/python-intro-thumb-640.jpg"
        }
      },
      "source": {
        "type": "upload",
        "duration": 1845
      },
      "author": {
        "id": "user_100",
        "name": "Dr. Sarah Chen",
        "avatar": "https://cdn.example.com/avatars/sarah.jpg"
      },
      "publishedAt": "2024-01-15T10:00:00Z",
      "categories": [
        { "id": "cat_5", "name": "Programming", "slug": "programming" }
      ],
      "difficulty": "beginner",
      "duration": 1845,
      "viewCount": 3200,
      "likeCount": 287,
      "commentCount": 45
    },
    {
      "id": "video_124",
      "slug": "advanced-ml-techniques",
      "status": "published",
      "spaceId": "space_23",
      "space": {
        "id": "space_23",
        "title": "ML Engineers",
        "slug": "ml-engineers"
      },
      "title": "Advanced Machine Learning Techniques",
      "excerpt": "Deep dive into advanced ML algorithms.",
      "thumbnail": {
        "url": "https://cdn.example.com/videos/ml-advanced-thumb.jpg"
      },
      "source": {
        "type": "youtube",
        "duration": 2700
      },
      "author": {
        "id": "user_101",
        "name": "James Wilson"
      },
      "publishedAt": "2024-01-10T08:00:00Z",
      "categories": [
        { "id": "cat_1", "name": "Machine Learning", "slug": "machine-learning" }
      ],
      "difficulty": "advanced",
      "duration": 2700,
      "viewCount": 1500,
      "likeCount": 156
    }
  ],
  "meta": {
    "nextCursor": "eyJpZCI6InZpZGVvXzEyMCJ9",
    "hasMore": true,
    "total": 245
  }
}
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/videos?category=programming&difficulty=beginner" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Results ordered by `publishedAt` descending by default
- Duration in seconds
- Only published videos for non-admin users

