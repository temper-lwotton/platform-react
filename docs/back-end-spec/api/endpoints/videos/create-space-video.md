# Create Space Video

Create a new video within a space.

## Endpoint

```
POST /api/spaces/{spaceId}/videos
```

## Description

Creates a new video within a specific space. Visibility is inherited from space settings.

## Authentication

**Required.** User must be a space member with content creation permissions.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spaceId` | string | Yes | Space ID |

## Request Body

```json
{
  "title": "Team Standup Recording - January 20",
  "description": "<p>Weekly team standup recording.</p>",
  "source": {
    "type": "upload",
    "videoId": "media_600"
  },
  "thumbnailId": "media_601",
  "categoryIds": ["cat_20"],
  "status": "draft"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Video title |
| `description` | string | No | Rich text description |
| `excerpt` | string | No | Short summary |
| `source` | object | Yes | Video source |
| `thumbnailId` | string | No | Thumbnail media ID |
| `transcript` | string | No | Full transcript |
| `categoryIds` | string[] | No | Categories |
| `tagIds` | string[] | No | Tags |
| `difficulty` | string | No | Difficulty level |
| `collectionId` | string | No | Add to collection |
| `status` | string | No | draft or pending_review |

**Note:** `visibility` is inherited from space settings.

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "video_301",
    "slug": "team-standup-recording-january-20",
    "status": "draft",
    "spaceId": "space_23",
    "space": {
      "id": "space_23",
      "title": "ML Engineers",
      "slug": "ml-engineers"
    },
    "title": "Team Standup Recording - January 20",
    "description": "<p>Weekly team standup recording.</p>",
    "source": {
      "type": "upload",
      "url": "https://cdn.example.com/videos/standup-jan20.mp4",
      "duration": 1800
    },
    "author": {
      "id": "user_5",
      "name": "Luke Wotton"
    },
    "publishedAt": null,
    "createdAt": "2024-01-21T11:00:00Z",
    "duration": 1800,
    "viewCount": 0,
    "likeCount": 0
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
    "message": "You must be a member of this space to create videos"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/spaces/space_23/videos" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team Standup Recording",
    "source": {
      "type": "upload",
      "videoId": "media_600"
    }
  }'
```

## Notes

- Visibility inherited from space
- Only space members can access
- Space admins can publish directly

