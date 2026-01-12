# Get Download

Retrieve a single download with full details.

## Endpoint

```
GET /api/downloads/{idOrSlug}
```

## Description

Returns complete download details including file information, version history, and user interaction state.

## Authentication

Optional for public downloads. Required for members-only or space downloads.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idOrSlug` | string | Yes | Download ID or slug |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "download": {
      "id": "download_50",
      "slug": "machine-learning-cheat-sheet",
      "status": "published",
      "spaceId": "space_23",
      "space": {
        "id": "space_23",
        "title": "ML Engineers",
        "slug": "ml-engineers",
        "icon": "https://cdn.example.com/spaces/ml-engineers-icon.png"
      },
      "title": "Machine Learning Algorithms Cheat Sheet",
      "description": "<p>A comprehensive reference guide covering all major ML algorithms including supervised learning, unsupervised learning, and reinforcement learning techniques.</p>",
      "shortDescription": "Quick reference for ML algorithms with examples and use cases",
      "featuredImage": {
        "id": "img_789",
        "url": "https://cdn.example.com/downloads/ml-cheatsheet-preview.jpg",
        "alt": "ML Cheat Sheet Preview",
        "width": 1200,
        "height": 800,
        "thumbnails": {
          "small": "https://cdn.example.com/downloads/ml-cheatsheet-preview-300.jpg",
          "medium": "https://cdn.example.com/downloads/ml-cheatsheet-preview-600.jpg",
          "large": "https://cdn.example.com/downloads/ml-cheatsheet-preview-1200.jpg"
        }
      },
      "file": {
        "id": "file_100",
        "filename": "ml-algorithms-cheatsheet-v2.pdf",
        "originalFilename": "ML Algorithms Cheat Sheet v2.pdf",
        "mimeType": "application/pdf",
        "size": 2457600,
        "sizeFormatted": "2.4 MB",
        "uploadedAt": "2024-01-10T09:00:00Z"
      },
      "additionalFiles": [
        {
          "id": "file_101",
          "filename": "ml-examples.zip",
          "originalFilename": "Code Examples.zip",
          "mimeType": "application/zip",
          "size": 5242880,
          "sizeFormatted": "5 MB",
          "uploadedAt": "2024-01-10T09:00:00Z"
        }
      ],
      "author": {
        "id": "user_100",
        "name": "Dr. Sarah Chen",
        "avatar": "https://cdn.example.com/avatars/sarah.jpg",
        "bio": "AI Researcher and Educator"
      },
      "publishedAt": "2024-01-12T10:00:00Z",
      "updatedAt": "2024-01-15T14:30:00Z",
      "createdAt": "2024-01-10T09:00:00Z",
      "type": "document",
      "categories": [
        { "id": "cat_1", "name": "Machine Learning", "slug": "machine-learning" },
        { "id": "cat_3", "name": "Cheat Sheets", "slug": "cheat-sheets" }
      ],
      "tags": [
        { "id": "tag_1", "name": "AI", "slug": "ai" },
        { "id": "tag_4", "name": "Reference", "slug": "reference" }
      ],
      "downloadCount": 1847,
      "viewCount": 4231,
      "likeCount": 256,
      "bookmarkCount": 489,
      "visibility": "members",
      "requiresAuth": true,
      "version": "2.0",
      "changelog": [
        {
          "version": "2.0",
          "date": "2024-01-10",
          "changes": [
            "Added new section on transformer architectures",
            "Updated examples for Python 3.11",
            "Fixed typos in decision tree section"
          ],
          "fileId": "file_100"
        },
        {
          "version": "1.0",
          "date": "2023-06-15",
          "changes": ["Initial release"]
        }
      ],
      "relatedArticles": ["article_123"],
      "relatedDownloads": ["download_51", "download_52"]
    },
    "userInteraction": {
      "hasLiked": true,
      "hasBookmarked": false,
      "hasDownloaded": true,
      "lastDownloadedAt": "2024-01-16T14:30:00Z",
      "downloadCount": 2
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
    "message": "Download 'invalid-slug' does not exist"
  }
}
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/downloads/machine-learning-cheat-sheet" \
  -H "Authorization: Bearer <token>"
```

## Notes

- View count incremented on access
- User interaction included for authenticated users
- Version changelog shows history

