# Downloads API Endpoints

API endpoints for downloadable resource management.

## Overview

The Downloads API provides endpoints for creating, managing, and delivering downloadable files. Downloads can be platform-wide or space-specific, and support multiple file types with version tracking.

## Base URL

```
/api/downloads
/api/spaces/{spaceId}/downloads
```

## Endpoints

### Downloads

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/downloads](./list-downloads.md) | List platform downloads |
| GET | [/api/spaces/{spaceId}/downloads](./list-space-downloads.md) | List space downloads |
| GET | [/api/downloads/{idOrSlug}](./get-download.md) | Get download details |
| POST | [/api/downloads](./create-download.md) | Create platform download |
| POST | [/api/spaces/{spaceId}/downloads](./create-space-download.md) | Create space download |
| PUT | [/api/downloads/{id}](./update-download.md) | Update download |
| POST | [/api/downloads/{id}/publish](./publish-download.md) | Publish download |
| POST | [/api/downloads/{id}/versions](./upload-version.md) | Upload new version |

### Files {#files}

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/downloads/{id}/file](./download-file.md) | Download primary file |
| GET | [/api/downloads/{id}/files/{fileId}](./download-file.md) | Download specific file |
| POST | [/api/downloads/{id}/request](./request-download-url.md) | Get signed download URL |

### Interactions {#interactions}

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | [/api/downloads/{id}/like](./like-download.md) | Like download |
| DELETE | [/api/downloads/{id}/like](./like-download.md) | Unlike download |
| POST | [/api/downloads/{id}/bookmark](./bookmark-download.md) | Bookmark download |
| DELETE | [/api/downloads/{id}/bookmark](./bookmark-download.md) | Remove bookmark |

### Admin {#admin}

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/admin/downloads/{id}/analytics](./get-analytics.md) | Get download analytics |
| GET | [/api/admin/downloads/{id}/records](./get-records.md) | List who downloaded |
| GET | [/api/admin/downloads/{id}/records/export](./export-records.md) | Export download records |

## Authentication

Most read endpoints vary by visibility. Write and admin endpoints require authentication.

```
Authorization: Bearer <token>
```

## Common Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `DOWNLOAD_NOT_FOUND` | 404 | Download does not exist |
| `FILE_NOT_FOUND` | 404 | File does not exist |
| `NOT_AUTHOR` | 403 | Only author can perform action |
| `NOT_SPACE_MEMBER` | 403 | User not a space member |
| `AUTH_REQUIRED` | 401 | Download requires authentication |

## Download Types

| Type | Description |
|------|-------------|
| `document` | PDF, DOCX, PPTX |
| `spreadsheet` | XLSX, CSV |
| `archive` | ZIP, RAR |
| `image` | PNG, JPG, SVG |
| `code` | Code samples |
| `media` | Audio/video |
| `other` | Other files |

## Related Documentation

- [Downloads Domain Specification](../../domains/downloads.md)
- [Spaces Domain](../../domains/spaces.md)
- [Articles Domain](../../domains/articles.md)

