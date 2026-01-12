# Get Download Analytics

Retrieve analytics for a download.

## Endpoint

```
GET /api/admin/downloads/{id}/analytics
```

## Description

Returns detailed analytics including download counts, trends, and top referrers. Administrators only.

## Authentication

**Required.** Administrator role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Download ID |

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `startDate` | string | 30 days ago | Analytics period start |
| `endDate` | string | now | Analytics period end |
| `groupBy` | string | day | Group by: day, week, month |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "downloadId": "download_50",
    "title": "Machine Learning Algorithms Cheat Sheet",
    "period": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-31T23:59:59Z"
    },
    "summary": {
      "totalDownloads": 847,
      "uniqueDownloaders": 623,
      "totalViews": 2150,
      "conversionRate": 39.4
    },
    "downloadsByDate": [
      { "date": "2024-01-01", "downloads": 25, "uniqueUsers": 22 },
      { "date": "2024-01-02", "downloads": 31, "uniqueUsers": 28 },
      { "date": "2024-01-03", "downloads": 18, "uniqueUsers": 16 }
    ],
    "downloadsByFile": [
      {
        "fileId": "file_100",
        "filename": "ml-algorithms-cheatsheet-v2.pdf",
        "downloads": 780
      },
      {
        "fileId": "file_101",
        "filename": "ml-examples.zip",
        "downloads": 67
      }
    ],
    "topReferrers": [
      { "referrer": "https://example.com/learn", "count": 245 },
      { "referrer": "direct", "count": 189 },
      { "referrer": "https://google.com", "count": 156 }
    ],
    "versionDownloads": [
      { "version": "2.0", "downloads": 780 },
      { "version": "1.0", "downloads": 67 }
    ]
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

#### Forbidden (403)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Administrator access required"
  }
}
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/admin/downloads/download_50/analytics?startDate=2024-01-01&groupBy=week" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Analytics may be delayed up to 1 hour
- Conversion rate = downloads / views * 100
- Referrer "direct" means no referrer header

