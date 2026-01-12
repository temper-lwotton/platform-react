# Get Collection

Retrieve a video collection with its videos.

## Endpoint

```
GET /api/videos/collections/{id}
```

## Description

Returns collection details including the ordered list of videos.

## Authentication

Optional for public collections. Required for members-only or space collections.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Collection ID or slug |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "collection": {
      "id": "coll_10",
      "slug": "python-for-beginners",
      "title": "Python for Beginners",
      "description": "Complete Python course from zero to hero. Learn Python programming from the ground up with hands-on examples and projects.",
      "thumbnail": {
        "url": "https://cdn.example.com/collections/python-course.jpg",
        "thumbnails": {
          "small": "https://cdn.example.com/collections/python-course-320.jpg",
          "medium": "https://cdn.example.com/collections/python-course-640.jpg",
          "large": "https://cdn.example.com/collections/python-course-1280.jpg"
        }
      },
      "videoCount": 10,
      "totalDuration": 18000,
      "author": {
        "id": "user_100",
        "name": "Dr. Sarah Chen",
        "avatar": "https://cdn.example.com/avatars/sarah.jpg",
        "bio": "Senior Python Developer"
      },
      "visibility": "public",
      "spaceId": null,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-15T14:00:00Z"
    },
    "videos": [
      {
        "id": "video_123",
        "slug": "introduction-to-python",
        "title": "Introduction to Python Programming",
        "thumbnail": {
          "thumbnails": {
            "medium": "https://cdn.example.com/videos/python-intro-640.jpg"
          }
        },
        "duration": 1845,
        "difficulty": "beginner",
        "collectionOrder": 1,
        "viewCount": 3200,
        "likeCount": 287
      },
      {
        "id": "video_124",
        "slug": "python-variables-and-types",
        "title": "Variables and Data Types",
        "thumbnail": {
          "thumbnails": {
            "medium": "https://cdn.example.com/videos/python-vars-640.jpg"
          }
        },
        "duration": 1500,
        "difficulty": "beginner",
        "collectionOrder": 2,
        "viewCount": 2800,
        "likeCount": 245
      }
    ],
    "userProgress": {
      "completedVideos": 3,
      "totalVideos": 10,
      "percentComplete": 30,
      "lastWatchedVideoId": "video_126",
      "lastWatchedAt": "2024-01-20T14:00:00Z"
    }
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

## Example Request

```bash
curl -X GET "https://api.example.com/api/videos/collections/python-for-beginners" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Videos ordered by `collectionOrder`
- User progress included for authenticated users
- `totalDuration` in seconds

