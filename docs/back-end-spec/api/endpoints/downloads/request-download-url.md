# Request Download URL

Get a signed download URL for client-side downloads.

## Endpoint

```
POST /api/downloads/{id}/request
```

## Description

Returns a signed URL for downloading a file. Useful for client-side download handling where you need the URL rather than a redirect.

## Authentication

Varies by download visibility and `requiresAuth` setting.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Download ID |

## Request Body

```json
{
  "fileId": "file_100"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fileId` | string | No | Specific file ID (defaults to primary file) |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/secure/downloads/file_100?token=xyz123&expires=1705766400",
    "expiresAt": "2024-01-20T16:00:00Z",
    "filename": "ml-algorithms-cheatsheet-v2.pdf",
    "mimeType": "application/pdf",
    "size": 2457600,
    "sizeFormatted": "2.4 MB"
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

#### File Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "FILE_NOT_FOUND",
    "message": "File 'file_invalid' does not exist in this download"
  }
}
```

#### Authentication Required (401)

```json
{
  "success": false,
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "This download requires authentication"
  }
}
```

## Side Effects

- Download recorded in tracking system
- Download count incremented

## Example Request

```bash
curl -X POST "https://api.example.com/api/downloads/download_50/request" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "file_100"
  }'
```

## Notes

- URL expires after 1 hour
- Download tracked when URL is requested
- Use this for custom download UI/progress tracking

