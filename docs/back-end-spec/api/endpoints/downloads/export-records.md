# Export Download Records

Export download records as CSV, XLSX, or JSON.

## Endpoint

```
GET /api/admin/downloads/{id}/records/export
```

## Description

Exports download records to a downloadable file. Administrators only.

## Authentication

**Required.** Administrator role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Download ID |

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `format` | string | csv | Export format: csv, xlsx, json |
| `startDate` | string | - | Filter from date |
| `endDate` | string | - | Filter to date |

## Response

### Success Response (200 OK)

Returns file download with appropriate content type:

**CSV:**
```
HTTP/1.1 200 OK
Content-Type: text/csv
Content-Disposition: attachment; filename="download-records-download_50-2024-01-21.csv"

User ID,User Name,User Email,Downloaded At,File Name,Version,Referrer
user_200,John Smith,john@example.com,2024-01-20T14:30:00Z,ml-algorithms-cheatsheet-v2.pdf,2.0,https://example.com/learn
user_201,Jane Doe,jane@example.com,2024-01-20T14:15:00Z,ml-algorithms-cheatsheet-v2.pdf,2.0,
```

**JSON:**
```json
{
  "downloadId": "download_50",
  "title": "Machine Learning Algorithms Cheat Sheet",
  "exportedAt": "2024-01-21T16:00:00Z",
  "records": [
    {
      "userId": "user_200",
      "userName": "John Smith",
      "userEmail": "john@example.com",
      "downloadedAt": "2024-01-20T14:30:00Z",
      "filename": "ml-algorithms-cheatsheet-v2.pdf",
      "version": "2.0",
      "referrer": "https://example.com/learn"
    }
  ]
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

## Export Columns

| Column | Description |
|--------|-------------|
| User ID | User identifier |
| User Name | Full name |
| User Email | Email address |
| Downloaded At | Timestamp |
| File Name | Downloaded file name |
| Version | Download version |
| Referrer | Source URL |

## Example Request

```bash
curl -X GET "https://api.example.com/api/admin/downloads/download_50/records/export?format=csv" \
  -H "Authorization: Bearer <token>" \
  -O -J
```

## Notes

- Large exports may take time to generate
- Anonymous downloads show empty user fields
- Useful for reporting and compliance

