# Upload New Version

Upload a new version of a download with changelog.

## Endpoint

```
POST /api/downloads/{id}/versions
```

## Description

Uploads a new version of the download file with changelog entry. Maintains version history.

## Authentication

**Required.** Must be download author or administrator.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Download ID |

## Request Body

```json
{
  "fileId": "file_202",
  "version": "2.1",
  "changes": [
    "Added new templates for React 18",
    "Fixed compatibility issues with Node 20",
    "Updated documentation"
  ]
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fileId` | string | Yes | New file media ID |
| `version` | string | Yes | New version string |
| `changes` | string[] | Yes | List of changes |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "download": {
      "id": "download_200",
      "slug": "project-template-pack",
      "title": "Project Template Pack",
      "file": {
        "id": "file_202",
        "filename": "project-templates-v2.1.zip",
        "mimeType": "application/zip",
        "sizeFormatted": "12 MB"
      },
      "version": "2.1",
      "changelog": [
        {
          "version": "2.1",
          "date": "2024-01-21",
          "changes": [
            "Added new templates for React 18",
            "Fixed compatibility issues with Node 20",
            "Updated documentation"
          ],
          "fileId": "file_202"
        },
        {
          "version": "2.0",
          "date": "2024-01-15",
          "changes": [
            "Major update with new architecture",
            "Added TypeScript support"
          ],
          "fileId": "file_201"
        },
        {
          "version": "1.0",
          "date": "2024-01-10",
          "changes": ["Initial release"],
          "fileId": "file_200"
        }
      ],
      "updatedAt": "2024-01-21T16:00:00Z"
    },
    "previousVersion": {
      "version": "2.0",
      "fileId": "file_201"
    }
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
    "message": "Only the download author can upload new versions"
  }
}
```

#### Version Exists (400)

```json
{
  "success": false,
  "error": {
    "code": "VERSION_EXISTS",
    "message": "Version '2.1' already exists"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/downloads/download_200/versions" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "file_202",
    "version": "2.1",
    "changes": ["Added new templates", "Fixed bugs"]
  }'
```

## Notes

- Previous file retained in history
- Version strings should follow semver pattern
- Changes array shown in changelog
- Download count continues from previous version

