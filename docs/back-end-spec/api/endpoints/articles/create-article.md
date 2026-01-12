# Create Article

Create a new platform-wide article.

## Endpoint

```
POST /api/articles
```

## Description

Creates a new article at the platform level (not associated with a space). Article is created in draft status by default.

## Authentication

**Required.** User must have content creation permissions.

## Request Body

```json
{
  "type": "text",
  "title": "Getting Started with Python",
  "subtitle": "A beginner's guide",
  "content": "{\"root\":{\"children\":[...]}}",
  "excerpt": "Learn Python basics in this comprehensive guide",
  "featuredImageId": "img_500",
  "categoryIds": ["cat_5"],
  "tagIds": ["tag_10", "tag_11"],
  "difficulty": "beginner",
  "visibility": "public",
  "status": "draft"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Article type: text, video, mixed |
| `title` | string | Yes | Article title (max 200 chars) |
| `subtitle` | string | No | Article subtitle |
| `content` | string | No | Lexical JSON content |
| `excerpt` | string | No | Short summary (auto-generated if empty) |
| `featuredImageId` | string | No | Featured image media ID |
| `videoId` | string | No | Video media ID (for video/mixed types) |
| `categoryIds` | string[] | No | Category IDs |
| `tagIds` | string[] | No | Tag IDs |
| `difficulty` | string | No | beginner, intermediate, advanced |
| `visibility` | string | No | public, members, restricted (default: members) |
| `status` | string | No | draft, pending_review (default: draft) |
| `seoTitle` | string | No | SEO title override |
| `seoDescription` | string | No | SEO description override |

### Video Article Request

```json
{
  "type": "video",
  "title": "Python Tutorial: Variables and Data Types",
  "videoId": "vid_123",
  "transcript": "In this video, we'll learn about...",
  "featuredImageId": "img_501",
  "categoryIds": ["cat_5"],
  "difficulty": "beginner",
  "visibility": "public"
}
```

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "article_200",
    "slug": "getting-started-with-python",
    "type": "text",
    "status": "draft",
    "spaceId": null,
    "title": "Getting Started with Python",
    "subtitle": "A beginner's guide",
    "excerpt": "Learn Python basics in this comprehensive guide",
    "content": "{\"root\":{\"children\":[...]}}",
    "featuredImage": {
      "id": "img_500",
      "url": "https://cdn.example.com/images/img_500.jpg",
      "thumbnails": {...}
    },
    "author": {
      "id": "user_5",
      "name": "Luke Wotton",
      "avatar": "https://cdn.example.com/avatars/luke.jpg"
    },
    "publishedAt": null,
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T10:00:00Z",
    "categories": [
      { "id": "cat_5", "name": "Programming", "slug": "programming" }
    ],
    "tags": [
      { "id": "tag_10", "name": "Python", "slug": "python" }
    ],
    "difficulty": "beginner",
    "readingTime": 12,
    "viewCount": 0,
    "likeCount": 0,
    "bookmarkCount": 0,
    "commentCount": 0,
    "visibility": "public"
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
      "title": ["Title is required"],
      "type": ["Invalid article type"]
    }
  }
}
```

#### Slug Exists (400)

```json
{
  "success": false,
  "error": {
    "code": "SLUG_EXISTS",
    "message": "An article with this slug already exists"
  }
}
```

#### Video Required (400)

```json
{
  "success": false,
  "error": {
    "code": "VIDEO_REQUIRED",
    "message": "Video content is required for video article type"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/articles" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "text",
    "title": "Getting Started with Python",
    "content": "{\"root\":{\"children\":[]}}",
    "categoryIds": ["cat_5"],
    "visibility": "public"
  }'
```

## Notes

- Slug auto-generated from title if not provided
- Reading time calculated from content word count
- Author set to authenticated user
- Draft articles visible only to author and editors

