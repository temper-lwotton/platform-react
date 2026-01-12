# Get Download Records

List individual download records.

## Endpoint

```
GET /api/admin/downloads/{id}/records
```

## Description

Returns a paginated list of who downloaded the file. Administrators only.

## Authentication

**Required.** Administrator role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Download ID |

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `startDate` | string | - | Filter from date |
| `endDate` | string | - | Filter to date |
| `userId` | string | - | Filter by user |
| `fileId` | string | - | Filter by specific file |
| `limit` | number | 50 | Max items |
| `cursor` | string | - | Pagination cursor |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "record_1001",
      "downloadId": "download_50",
      "fileId": "file_100",
      "user": {
        "id": "user_200",
        "name": "John Smith",
        "email": "john@example.com",
        "avatar": "https://cdn.example.com/avatars/john.jpg"
      },
      "downloadedAt": "2024-01-20T14:30:00Z",
      "ipAddress": "192.168.1.x",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
      "referrer": "https://example.com/learn/machine-learning"
    },
    {
      "id": "record_1002",
      "downloadId": "download_50",
      "fileId": "file_100",
      "user": {
        "id": "user_201",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "downloadedAt": "2024-01-20T14:15:00Z",
      "referrer": null
    },
    {
      "id": "record_1003",
      "downloadId": "download_50",
      "fileId": "file_101",
      "user": null,
      "downloadedAt": "2024-01-20T13:00:00Z",
      "ipAddress": "10.0.0.x",
      "referrer": "https://google.com"
    }
  ],
  "meta": {
    "nextCursor": "eyJpZCI6InJlY29yZF8xMDAzIn0=",
    "hasMore": true,
    "total": 1847
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

## Example Request

```bash
curl -X GET "https://api.example.com/api/admin/downloads/download_50/records?limit=20" \
  -H "Authorization: Bearer <token>"
```

## Notes

- `user` is null for anonymous downloads (if allowed)
- IP addresses are partially masked for privacy
- Records ordered by `downloadedAt` descending

