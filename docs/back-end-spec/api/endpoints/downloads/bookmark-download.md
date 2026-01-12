# Bookmark/Unbookmark Download

Save or remove a download from bookmarks.

## Endpoints

```
POST /api/downloads/{id}/bookmark
DELETE /api/downloads/{id}/bookmark
```

## Description

Allows authenticated users to bookmark downloads for easy access.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Download ID |

## Bookmark Download

### Request

```
POST /api/downloads/{id}/bookmark
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "downloadId": "download_50",
    "bookmarked": true,
    "bookmarkCount": 490,
    "bookmarkedAt": "2024-01-21T16:00:00Z"
  }
}
```

## Remove Bookmark

### Request

```
DELETE /api/downloads/{id}/bookmark
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "downloadId": "download_50",
    "bookmarked": false,
    "bookmarkCount": 489
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

### Bookmark

```bash
curl -X POST "https://api.example.com/api/downloads/download_50/bookmark" \
  -H "Authorization: Bearer <token>"
```

### Remove

```bash
curl -X DELETE "https://api.example.com/api/downloads/download_50/bookmark" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Bookmarks are private to the user
- Access via `/api/users/{userId}/bookmarks`

