# Create Space Article

Create a new article within a space.

## Endpoint

```
POST /api/spaces/{spaceId}/articles
```

## Description

Creates a new article within a specific space. Article visibility is inherited from space settings. User must have content creation permissions within the space.

## Authentication

**Required.** User must be a space member with content creation permissions.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spaceId` | string | Yes | Space ID |

## Request Body

```json
{
  "type": "text",
  "title": "Team Guidelines for Code Reviews",
  "subtitle": "Best practices for our team",
  "content": "{\"root\":{\"children\":[...]}}",
  "excerpt": "Learn how we approach code reviews",
  "featuredImageId": "img_501",
  "categoryIds": ["cat_5"],
  "tagIds": ["tag_10"],
  "difficulty": "intermediate",
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
| `excerpt` | string | No | Short summary |
| `featuredImageId` | string | No | Featured image media ID |
| `videoId` | string | No | Video media ID (for video/mixed) |
| `categoryIds` | string[] | No | Category IDs |
| `tagIds` | string[] | No | Tag IDs |
| `difficulty` | string | No | beginner, intermediate, advanced |
| `status` | string | No | draft, pending_review (default: draft) |

**Note:** `visibility` is not required as it's inherited from space settings.

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "article_201",
    "slug": "team-guidelines-for-code-reviews",
    "type": "text",
    "status": "draft",
    "spaceId": "space_23",
    "space": {
      "id": "space_23",
      "title": "ML Engineers",
      "slug": "ml-engineers"
    },
    "title": "Team Guidelines for Code Reviews",
    "subtitle": "Best practices for our team",
    "excerpt": "Learn how we approach code reviews",
    "content": "{\"root\":{\"children\":[...]}}",
    "featuredImage": {
      "id": "img_501",
      "url": "https://cdn.example.com/images/img_501.jpg",
      "thumbnails": {...}
    },
    "author": {
      "id": "user_5",
      "name": "Luke Wotton",
      "avatar": "https://cdn.example.com/avatars/luke.jpg"
    },
    "publishedAt": null,
    "createdAt": "2024-01-21T11:00:00Z",
    "updatedAt": "2024-01-21T11:00:00Z",
    "categories": [
      { "id": "cat_5", "name": "Best Practices", "slug": "best-practices" }
    ],
    "difficulty": "intermediate",
    "readingTime": 8,
    "viewCount": 0,
    "likeCount": 0,
    "bookmarkCount": 0,
    "commentCount": 0
  }
}
```

### Error Responses

#### Not Space Member (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_SPACE_MEMBER",
    "message": "You must be a member of this space to create articles"
  }
}
```

#### No Permission (403)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to create articles in this space"
  }
}
```

#### Space Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "SPACE_NOT_FOUND",
    "message": "Space 'space_invalid' does not exist"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/spaces/space_23/articles" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "text",
    "title": "Team Guidelines for Code Reviews",
    "content": "{\"root\":{\"children\":[]}}",
    "categoryIds": ["cat_5"]
  }'
```

## Notes

- Space articles inherit visibility from space settings
- Only space members can view space articles
- Space admins can publish articles directly
- Regular members may need approval (configurable)

