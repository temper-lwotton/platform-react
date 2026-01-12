# List Articles

Retrieve a list of platform-wide articles.

## Endpoint

```
GET /api/articles
```

## Description

Returns a paginated list of articles. Supports filtering by type, category, author, and more. Results include published articles visible to the requesting user based on visibility settings.

## Authentication

Optional. Required for accessing members-only content.

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `spaceId` | string | - | Filter by space (null for platform-only) |
| `type` | string | - | Filter by type: text, video, mixed |
| `status` | string | published | Filter by status (admin only for non-published) |
| `category` | string | - | Filter by category slug |
| `tag` | string | - | Filter by tag slug |
| `author` | string | - | Filter by author ID |
| `difficulty` | string | - | Filter: beginner, intermediate, advanced |
| `visibility` | string | - | Filter: public, members, restricted |
| `search` | string | - | Search query |
| `sortBy` | string | date | Sort: date, views, likes, readingTime |
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
      "id": "article_123",
      "slug": "introduction-to-machine-learning",
      "type": "mixed",
      "status": "published",
      "spaceId": "space_23",
      "space": {
        "id": "space_23",
        "title": "ML Engineers",
        "slug": "ml-engineers",
        "icon": "https://cdn.example.com/spaces/ml-engineers-icon.png"
      },
      "title": "Introduction to Machine Learning",
      "excerpt": "Learn the fundamentals of machine learning, from basic concepts to practical applications.",
      "featuredImage": {
        "url": "https://cdn.example.com/articles/ml-intro.jpg",
        "thumbnails": {
          "medium": "https://cdn.example.com/articles/ml-intro-600.jpg"
        }
      },
      "author": {
        "id": "user_100",
        "name": "Dr. Sarah Chen",
        "avatar": "https://cdn.example.com/avatars/sarah.jpg"
      },
      "publishedAt": "2024-01-15T10:00:00Z",
      "categories": [
        { "id": "cat_1", "name": "Machine Learning", "slug": "machine-learning" }
      ],
      "tags": [
        { "id": "tag_1", "name": "AI", "slug": "ai" }
      ],
      "difficulty": "beginner",
      "readingTime": 15,
      "duration": 1845,
      "viewCount": 2450,
      "likeCount": 187,
      "commentCount": 28
    },
    {
      "id": "article_124",
      "slug": "getting-started-with-python",
      "type": "text",
      "status": "published",
      "spaceId": null,
      "title": "Getting Started with Python",
      "excerpt": "A comprehensive beginner's guide to Python programming.",
      "featuredImage": {
        "url": "https://cdn.example.com/articles/python-intro.jpg",
        "thumbnails": {
          "medium": "https://cdn.example.com/articles/python-intro-600.jpg"
        }
      },
      "author": {
        "id": "user_101",
        "name": "James Wilson",
        "avatar": "https://cdn.example.com/avatars/james.jpg"
      },
      "publishedAt": "2024-01-10T08:00:00Z",
      "categories": [
        { "id": "cat_5", "name": "Programming", "slug": "programming" }
      ],
      "difficulty": "beginner",
      "readingTime": 12,
      "viewCount": 3200,
      "likeCount": 245,
      "commentCount": 42
    }
  ],
  "meta": {
    "nextCursor": "eyJpZCI6ImFydGljbGVfMTIwIn0=",
    "hasMore": true,
    "total": 156
  }
}
```

### Empty Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "nextCursor": null,
    "hasMore": false,
    "total": 0
  }
}
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/articles?category=machine-learning&difficulty=beginner&limit=10" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Results ordered by `publishedAt` descending by default
- Only published articles returned for non-admin users
- Space articles included unless filtering for platform-only
- Reading time in minutes, duration in seconds (for video)

