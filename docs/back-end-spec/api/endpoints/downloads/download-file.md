# Download File

Download a file from a download resource.

## Endpoints

```
GET /api/downloads/{id}/file
GET /api/downloads/{id}/files/{fileId}
```

## Description

Initiates file download. Records the download and either redirects to a secure URL or streams the file directly.

## Authentication

Varies by download visibility and `requiresAuth` setting.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Download ID |
| `fileId` | string | No | Specific file ID (for multi-file downloads) |

## Response

### Success Response (302 Redirect)

Redirects to secure download URL:

```
HTTP/1.1 302 Found
Location: https://cdn.example.com/secure/downloads/file_100?token=xyz&expires=1705766400
```

### Success Response (200 OK - Stream)

For direct streaming:

```
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="ml-algorithms-cheatsheet-v2.pdf"
Content-Length: 2457600

[Binary file data]
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

#### Not Space Member (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_SPACE_MEMBER",
    "message": "You must be a member of this space to download this file"
  }
}
```

## Side Effects

- Download recorded in tracking system
- Download count incremented

## Example Requests

### Primary File

```bash
curl -X GET "https://api.example.com/api/downloads/download_50/file" \
  -H "Authorization: Bearer <token>" \
  -L -O
```

### Specific File

```bash
curl -X GET "https://api.example.com/api/downloads/download_50/files/file_101" \
  -H "Authorization: Bearer <token>" \
  -L -O
```

## Notes

- Downloads are tracked per user
- Redirects to CDN URL for performance
- Content-Disposition header sets filename

