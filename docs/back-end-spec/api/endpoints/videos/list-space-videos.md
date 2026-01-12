# List Space Videos

Retrieve videos belonging to a specific space.

## Endpoint

```
GET /api/spaces/{spaceId}/videos
```

## Description

Returns videos within a specific space. User must be a space member to access.

## Authentication

**Required.** User must be a space member.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spaceId` | string | Yes | Space ID |

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | published | Filter by status |
| `category` | string | - | Filter by category |
| `tag` | string | - | Filter by tag |
| `author` | string | - | Filter by author |
| `difficulty` | string | - | Filter by difficulty |
| `search` | string | - | Search query |
| `sortBy` | string | date | Sort: date, views, likes |
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
      "id": "video_200",
      "slug": "team-onboarding-video",
      "status": "published",
      "spaceId": "space_23",
      "space": {
        "id": "space_23",
        "title": "ML Engineers",
        "slug": "ml-engineers"
      },
      "title": "Team Onboarding: Getting Started",
      "excerpt": "Welcome to the team! Here's everything you need to know.",
      "thumbnail": {
        "url": "https://cdn.example.com/videos/onboarding-thumb.jpg"
      },
      "source": {
        "type": "upload",
        "duration": 900
      },
      "author": {
        "id": "user_102",
        "name": "Emily Wong"
      },
      "publishedAt": "2024-01-18T14:00:00Z",
      "duration": 900,
      "viewCount": 45,
      "likeCount": 12
    }
  ],
  "meta": {
    "nextCursor": null,
    "hasMore": false,
    "total": 15
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
    "message": "You must be a member of this space to view videos"
  }
}
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/spaces/space_23/videos" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Only space members can access
- Space admins can see draft videos

