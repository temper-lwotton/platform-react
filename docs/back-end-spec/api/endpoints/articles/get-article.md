# Get Article

Retrieve a single article with full content.

## Endpoint

```
GET /api/articles/{idOrSlug}
```

## Description

Returns the full article including content, video, and user interaction state. Accessing this endpoint records a view and returns related content suggestions.

## Authentication

Optional for public articles. Required for members-only or space articles.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idOrSlug` | string | Yes | Article ID or slug |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "article": {
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
      "subtitle": "A comprehensive guide for beginners",
      "excerpt": "Learn the fundamentals of machine learning, from basic concepts to practical applications.",
      "content": "{\"root\":{\"children\":[...]}}",
      "featuredImage": {
        "id": "img_456",
        "url": "https://cdn.example.com/articles/ml-intro.jpg",
        "alt": "Machine Learning Illustration",
        "width": 1920,
        "height": 1080,
        "thumbnails": {
          "small": "https://cdn.example.com/articles/ml-intro-300.jpg",
          "medium": "https://cdn.example.com/articles/ml-intro-600.jpg",
          "large": "https://cdn.example.com/articles/ml-intro-1200.jpg"
        }
      },
      "video": {
        "id": "vid_789",
        "type": "upload",
        "url": "https://cdn.example.com/videos/ml-intro.mp4",
        "duration": 1845,
        "thumbnail": "https://cdn.example.com/videos/ml-intro-thumb.jpg",
        "transcript": "Welcome to this introduction to machine learning...",
        "captions": [
          {
            "language": "en",
            "url": "https://cdn.example.com/captions/ml-intro-en.vtt",
            "isDefault": true
          }
        ]
      },
      "author": {
        "id": "user_100",
        "name": "Dr. Sarah Chen",
        "avatar": "https://cdn.example.com/avatars/sarah.jpg",
        "bio": "AI Researcher and Educator",
        "role": "Senior Data Scientist"
      },
      "coAuthors": [],
      "publishedAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-18T14:30:00Z",
      "createdAt": "2024-01-10T09:00:00Z",
      "categories": [
        { "id": "cat_1", "name": "Machine Learning", "slug": "machine-learning" },
        { "id": "cat_2", "name": "Tutorials", "slug": "tutorials" }
      ],
      "tags": [
        { "id": "tag_1", "name": "AI", "slug": "ai" },
        { "id": "tag_2", "name": "Python", "slug": "python" },
        { "id": "tag_3", "name": "Beginner", "slug": "beginner" }
      ],
      "difficulty": "beginner",
      "readingTime": 15,
      "duration": 1845,
      "viewCount": 2451,
      "likeCount": 187,
      "bookmarkCount": 342,
      "commentCount": 28,
      "visibility": "members"
    },
    "userInteraction": {
      "hasLiked": false,
      "hasBookmarked": true,
      "readProgress": 45,
      "lastReadAt": "2024-01-18T10:00:00Z"
    },
    "relatedContent": {
      "articles": [
        {
          "id": "article_124",
          "slug": "deep-learning-fundamentals",
          "title": "Deep Learning Fundamentals",
          "excerpt": "Take your ML knowledge to the next level...",
          "featuredImage": {
            "thumbnails": {
              "medium": "https://cdn.example.com/articles/dl-600.jpg"
            }
          },
          "readingTime": 20,
          "difficulty": "intermediate"
        }
      ],
      "downloads": [
        {
          "id": "download_50",
          "slug": "ml-cheat-sheet",
          "title": "ML Algorithms Cheat Sheet",
          "type": "document",
          "file": {
            "sizeFormatted": "2.4 MB"
          }
        }
      ]
    }
  }
}
```

### Error Responses

#### Article Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "ARTICLE_NOT_FOUND",
    "message": "Article 'invalid-slug' does not exist"
  }
}
```

#### Not Authorized (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_SPACE_MEMBER",
    "message": "You must be a member of this space to view this article"
  }
}
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/articles/introduction-to-machine-learning" \
  -H "Authorization: Bearer <token>"
```

## Notes

- View count incremented on access
- User interaction included only for authenticated users
- Related content based on categories and tags
- Content is Lexical JSON for rich text rendering

