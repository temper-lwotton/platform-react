# Create Video

Create a new platform-wide video.

## Endpoint

```
POST /api/videos
```

## Description

Creates a new video at the platform level. Supports both uploaded videos and external embeds.

## Authentication

**Required.** User must have content creation permissions.

## Request Body

### Uploaded Video

```json
{
  "title": "Getting Started with React",
  "description": "<p>Learn the fundamentals of React in this comprehensive tutorial.</p>",
  "excerpt": "React fundamentals for beginners",
  "source": {
    "type": "upload",
    "videoId": "media_500"
  },
  "thumbnailId": "media_501",
  "categoryIds": ["cat_5"],
  "tagIds": ["tag_15", "tag_16"],
  "difficulty": "beginner",
  "visibility": "public",
  "status": "draft"
}
```

### YouTube Embed

```json
{
  "title": "Advanced TypeScript Patterns",
  "description": "<p>Deep dive into advanced TypeScript patterns.</p>",
  "source": {
    "type": "youtube",
    "url": "https://www.youtube.com/watch?v=abc123"
  },
  "categoryIds": ["cat_5"],
  "difficulty": "advanced",
  "visibility": "members"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Video title (max 200 chars) |
| `description` | string | No | Rich text description |
| `excerpt` | string | No | Short summary |
| `source` | object | Yes | Video source |
| `source.type` | string | Yes | upload, youtube, vimeo, wistia, embed |
| `source.videoId` | string | Conditional | Media ID for uploaded videos |
| `source.url` | string | Conditional | URL for external videos |
| `thumbnailId` | string | No | Thumbnail media ID |
| `transcript` | string | No | Full transcript text |
| `categoryIds` | string[] | No | Category IDs |
| `tagIds` | string[] | No | Tag IDs |
| `difficulty` | string | No | beginner, intermediate, advanced |
| `visibility` | string | No | public, members, restricted |
| `collectionId` | string | No | Add to collection |
| `status` | string | No | draft or pending_review |

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "video_300",
    "slug": "getting-started-with-react",
    "status": "draft",
    "spaceId": null,
    "title": "Getting Started with React",
    "description": "<p>Learn the fundamentals of React...</p>",
    "excerpt": "React fundamentals for beginners",
    "thumbnail": {
      "id": "media_501",
      "url": "https://cdn.example.com/thumbs/react-intro.jpg"
    },
    "source": {
      "type": "upload",
      "url": "https://cdn.example.com/videos/react-intro.mp4",
      "duration": 1500
    },
    "author": {
      "id": "user_5",
      "name": "Luke Wotton"
    },
    "publishedAt": null,
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T10:00:00Z",
    "categories": [
      { "id": "cat_5", "name": "Programming", "slug": "programming" }
    ],
    "difficulty": "beginner",
    "duration": 1500,
    "viewCount": 0,
    "likeCount": 0,
    "visibility": "public"
  }
}
```

### Error Responses

#### Invalid Source (400)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_SOURCE",
    "message": "Video source URL is invalid or inaccessible"
  }
}
```

#### Video Required (400)

```json
{
  "success": false,
  "error": {
    "code": "VIDEO_REQUIRED",
    "message": "Video source is required"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/videos" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with React",
    "source": {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=abc123"
    },
    "categoryIds": ["cat_5"],
    "visibility": "public"
  }'
```

## Notes

- Slug auto-generated from title
- Duration auto-detected from source
- Thumbnail auto-generated for uploads if not provided
- External video metadata fetched automatically

