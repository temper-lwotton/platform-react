# Create Download

Create a new platform-wide download resource.

## Endpoint

```
POST /api/downloads
```

## Description

Creates a new downloadable resource at the platform level. Download is created in draft status by default.

## Authentication

**Required.** User must have content creation permissions.

## Request Body

```json
{
  "title": "Project Template Pack",
  "description": "<p>Complete project templates for modern web development...</p>",
  "shortDescription": "Ready-to-use project templates",
  "type": "archive",
  "featuredImageId": "img_600",
  "fileId": "file_200",
  "additionalFileIds": ["file_201"],
  "categoryIds": ["cat_10"],
  "tagIds": ["tag_20"],
  "visibility": "members",
  "requiresAuth": true,
  "version": "1.0",
  "status": "draft"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Download title (max 200 chars) |
| `description` | string | No | Rich text description |
| `shortDescription` | string | No | Short summary for listings |
| `type` | string | Yes | Download type |
| `featuredImageId` | string | No | Featured image media ID |
| `fileId` | string | Yes | Primary file media ID |
| `additionalFileIds` | string[] | No | Additional file media IDs |
| `categoryIds` | string[] | No | Category IDs |
| `tagIds` | string[] | No | Tag IDs |
| `visibility` | string | No | public, members, restricted (default: members) |
| `requiresAuth` | boolean | No | Require login to download (default: true) |
| `version` | string | No | Version string |
| `status` | string | No | draft or pending_review (default: draft) |

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "download_200",
    "slug": "project-template-pack",
    "status": "draft",
    "spaceId": null,
    "title": "Project Template Pack",
    "description": "<p>Complete project templates...</p>",
    "shortDescription": "Ready-to-use project templates",
    "type": "archive",
    "featuredImage": {
      "id": "img_600",
      "url": "https://cdn.example.com/images/img_600.jpg"
    },
    "file": {
      "id": "file_200",
      "filename": "project-templates.zip",
      "mimeType": "application/zip",
      "size": 10485760,
      "sizeFormatted": "10 MB"
    },
    "additionalFiles": [
      {
        "id": "file_201",
        "filename": "documentation.pdf",
        "mimeType": "application/pdf",
        "sizeFormatted": "500 KB"
      }
    ],
    "author": {
      "id": "user_5",
      "name": "Luke Wotton"
    },
    "publishedAt": null,
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T10:00:00Z",
    "categories": [
      { "id": "cat_10", "name": "Templates", "slug": "templates" }
    ],
    "downloadCount": 0,
    "viewCount": 0,
    "visibility": "members",
    "requiresAuth": true,
    "version": "1.0"
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
      "fileId": ["File is required"]
    }
  }
}
```

#### File Required (400)

```json
{
  "success": false,
  "error": {
    "code": "FILE_REQUIRED",
    "message": "Download must have at least one file"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/downloads" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Template Pack",
    "type": "archive",
    "fileId": "file_200",
    "visibility": "public"
  }'
```

## Notes

- Slug auto-generated from title
- Files must be uploaded first via Media API
- Draft downloads visible only to author

