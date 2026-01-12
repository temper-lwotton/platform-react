# Create Space Download

Create a new download within a space.

## Endpoint

```
POST /api/spaces/{spaceId}/downloads
```

## Description

Creates a new downloadable resource within a specific space. Access is controlled by space membership.

## Authentication

**Required.** User must be a space member with content creation permissions.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spaceId` | string | Yes | Space ID |

## Request Body

```json
{
  "title": "Team Brand Assets",
  "description": "<p>Official logos, colors, and templates for the team</p>",
  "shortDescription": "Official brand assets",
  "type": "archive",
  "featuredImageId": "img_601",
  "fileId": "file_300",
  "categoryIds": ["cat_15"],
  "tagIds": ["tag_25"],
  "requiresAuth": true,
  "version": "1.0",
  "status": "draft"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Download title |
| `description` | string | No | Rich text description |
| `shortDescription` | string | No | Short summary |
| `type` | string | Yes | Download type |
| `featuredImageId` | string | No | Featured image |
| `fileId` | string | Yes | Primary file |
| `additionalFileIds` | string[] | No | Additional files |
| `categoryIds` | string[] | No | Categories |
| `tagIds` | string[] | No | Tags |
| `requiresAuth` | boolean | No | Require login (default: true) |
| `version` | string | No | Version string |
| `status` | string | No | draft or pending_review |

**Note:** `visibility` is inherited from space settings.

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "download_201",
    "slug": "team-brand-assets",
    "status": "draft",
    "spaceId": "space_23",
    "space": {
      "id": "space_23",
      "title": "ML Engineers",
      "slug": "ml-engineers"
    },
    "title": "Team Brand Assets",
    "description": "<p>Official logos, colors, and templates</p>",
    "type": "archive",
    "file": {
      "id": "file_300",
      "filename": "brand-assets.zip",
      "mimeType": "application/zip",
      "sizeFormatted": "15 MB"
    },
    "author": {
      "id": "user_5",
      "name": "Luke Wotton"
    },
    "publishedAt": null,
    "createdAt": "2024-01-21T11:00:00Z",
    "updatedAt": "2024-01-21T11:00:00Z",
    "downloadCount": 0,
    "viewCount": 0
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
    "message": "You must be a member of this space to create downloads"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/spaces/space_23/downloads" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team Brand Assets",
    "type": "archive",
    "fileId": "file_300"
  }'
```

## Notes

- Visibility inherited from space
- Only space members can access
- Space admins can publish directly

