# List Space Downloads

Retrieve downloads belonging to a specific space.

## Endpoint

```
GET /api/spaces/{spaceId}/downloads
```

## Description

Returns downloads within a specific space. User must be a space member to access.

## Authentication

**Required.** User must be a space member.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spaceId` | string | Yes | Space ID |

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | - | Filter by type |
| `status` | string | published | Filter by status |
| `category` | string | - | Filter by category slug |
| `tag` | string | - | Filter by tag slug |
| `author` | string | - | Filter by author ID |
| `search` | string | - | Search query |
| `sortBy` | string | date | Sort: date, downloads, views |
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
      "id": "download_100",
      "slug": "team-brand-assets",
      "status": "published",
      "spaceId": "space_23",
      "space": {
        "id": "space_23",
        "title": "ML Engineers",
        "slug": "ml-engineers"
      },
      "title": "Team Brand Assets",
      "shortDescription": "Official logos, colors, and templates",
      "file": {
        "filename": "brand-assets.zip",
        "mimeType": "application/zip",
        "sizeFormatted": "15 MB"
      },
      "author": {
        "id": "user_102",
        "name": "Emily Wong"
      },
      "publishedAt": "2024-01-18T14:00:00Z",
      "type": "archive",
      "downloadCount": 45,
      "viewCount": 120
    }
  ],
  "meta": {
    "nextCursor": null,
    "hasMore": false,
    "total": 8
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
    "message": "You must be a member of this space to view downloads"
  }
}
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/spaces/space_23/downloads" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Only space members can access space downloads
- Space admins can see draft downloads

