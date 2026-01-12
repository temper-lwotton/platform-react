# Like/Unlike Download

Add or remove a like from a download.

## Endpoints

```
POST /api/downloads/{id}/like
DELETE /api/downloads/{id}/like
```

## Description

Allows authenticated users to like or unlike a download.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Download ID |

## Like Download

### Request

```
POST /api/downloads/{id}/like
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "downloadId": "download_50",
    "liked": true,
    "likeCount": 257
  }
}
```

## Unlike Download

### Request

```
DELETE /api/downloads/{id}/like
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "downloadId": "download_50",
    "liked": false,
    "likeCount": 256
  }
}
```

## Error Responses

### Download Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "DOWNLOAD_NOT_FOUND",
    "message": "Download 'download_invalid' does not exist"
  }
}
```

## Example Requests

### Like

```bash
curl -X POST "https://api.example.com/api/downloads/download_50/like" \
  -H "Authorization: Bearer <token>"
```

### Unlike

```bash
curl -X DELETE "https://api.example.com/api/downloads/download_50/like" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Users can only like once
- Like count returned for immediate UI update

