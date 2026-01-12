# List Downloads

Retrieve a list of platform-wide downloads.

## Endpoint

```
GET /api/downloads
```

## Description

Returns a paginated list of downloadable resources. Supports filtering by type, category, and more.

## Authentication

Optional. Required for accessing members-only content.

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `spaceId` | string | - | Filter by space (null for platform-only) |
| `type` | string | - | Filter by type: document, spreadsheet, etc. |
| `status` | string | published | Filter by status |
| `category` | string | - | Filter by category slug |
| `tag` | string | - | Filter by tag slug |
| `author` | string | - | Filter by author ID |
| `visibility` | string | - | Filter: public, members, restricted |
| `search` | string | - | Search query |
| `sortBy` | string | date | Sort: date, downloads, views, likes |
| `sortOrder` | string | desc | Sort order: asc, desc |
| `limit` | number | 20 | Max items to return |
| `cursor` | string | - | Pagination cursor |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "download_50",
      "slug": "machine-learning-cheat-sheet",
      "status": "published",
      "spaceId": "space_23",
      "space": {
        "id": "space_23",
        "title": "ML Engineers",
        "slug": "ml-engineers"
      },
      "title": "Machine Learning Algorithms Cheat Sheet",
      "shortDescription": "Quick reference for ML algorithms with examples and use cases",
      "featuredImage": {
        "url": "https://cdn.example.com/downloads/ml-cheatsheet-preview.jpg",
        "thumbnails": {
          "medium": "https://cdn.example.com/downloads/ml-cheatsheet-preview-600.jpg"
        }
      },
      "file": {
        "filename": "ml-algorithms-cheatsheet-v2.pdf",
        "mimeType": "application/pdf",
        "sizeFormatted": "2.4 MB"
      },
      "author": {
        "id": "user_100",
        "name": "Dr. Sarah Chen",
        "avatar": "https://cdn.example.com/avatars/sarah.jpg"
      },
      "publishedAt": "2024-01-12T10:00:00Z",
      "type": "document",
      "categories": [
        { "id": "cat_1", "name": "Machine Learning", "slug": "machine-learning" }
      ],
      "downloadCount": 1847,
      "viewCount": 4230,
      "likeCount": 256,
      "version": "2.0"
    },
    {
      "id": "download_51",
      "slug": "python-project-template",
      "status": "published",
      "spaceId": null,
      "title": "Python Project Template",
      "shortDescription": "Ready-to-use Python project structure with best practices",
      "file": {
        "filename": "python-template.zip",
        "mimeType": "application/zip",
        "sizeFormatted": "1.2 MB"
      },
      "author": {
        "id": "user_101",
        "name": "James Wilson"
      },
      "publishedAt": "2024-01-10T08:00:00Z",
      "type": "code",
      "categories": [
        { "id": "cat_5", "name": "Templates", "slug": "templates" }
      ],
      "downloadCount": 956,
      "viewCount": 2100,
      "version": "1.0"
    }
  ],
  "meta": {
    "nextCursor": "eyJpZCI6ImRvd25sb2FkXzQ5In0=",
    "hasMore": true,
    "total": 89
  }
}
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/downloads?type=document&category=machine-learning" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Results ordered by `publishedAt` descending by default
- Only published downloads returned for non-admin users
- File details included for quick display

