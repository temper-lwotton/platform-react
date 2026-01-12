# Update Download

Update an existing download resource.

## Endpoint

```
PUT /api/downloads/{id}
```

## Description

Updates download metadata and files. For version updates with changelog, use the upload version endpoint instead.

## Authentication

**Required.** Must be download author or administrator.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Download ID |

## Request Body

```json
{
  "title": "Project Template Pack - Updated",
  "description": "<p>Updated project templates...</p>",
  "shortDescription": "Improved project templates with new features",
  "featuredImageId": "img_602",
  "categoryIds": ["cat_10", "cat_11"],
  "tagIds": ["tag_20", "tag_21"],
  "visibility": "public"
}
```

### Request Fields

All fields are optional. Only specified fields are updated.

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Download title |
| `description` | string | Rich text description |
| `shortDescription` | string | Short summary |
| `featuredImageId` | string | Featured image |
| `fileId` | string | Primary file (updates without version) |
| `additionalFileIds` | string[] | Additional files |
| `categoryIds` | string[] | Categories (replaces all) |
| `tagIds` | string[] | Tags (replaces all) |
| `visibility` | string | Visibility (platform downloads only) |
| `requiresAuth` | boolean | Require authentication |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "download_200",
    "slug": "project-template-pack",
    "status": "draft",
    "title": "Project Template Pack - Updated",
    "description": "<p>Updated project templates...</p>",
    "shortDescription": "Improved project templates with new features",
    "file": {
      "id": "file_200",
      "filename": "project-templates.zip"
    },
    "author": {
      "id": "user_5",
      "name": "Luke Wotton"
    },
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T14:00:00Z",
    "categories": [
      { "id": "cat_10", "name": "Templates" },
      { "id": "cat_11", "name": "Web Development" }
    ],
    "visibility": "public"
  }
}
```

### Error Responses

#### Download Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "DOWNLOAD_NOT_FOUND",
    "message": "Download 'download_invalid' does not exist"
  }
}
```

#### Not Author (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_AUTHOR",
    "message": "Only the download author can update this resource"
  }
}
```

## Example Request

```bash
curl -X PUT "https://api.example.com/api/downloads/download_200" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Template Pack - Updated",
    "visibility": "public"
  }'
```

## Notes

- For versioned updates, use `/versions` endpoint
- Categories/tags update replaces entire list
- `updatedAt` timestamp always refreshed

