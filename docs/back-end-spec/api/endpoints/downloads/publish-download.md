# Publish Download

Publish a draft download.

## Endpoint

```
POST /api/downloads/{id}/publish
```

## Description

Changes download status from draft to published, making it available for download by authorized users.

## Authentication

**Required.** Must be download author, editor, or administrator.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Download ID |

## Request Body

No request body required.

```json
{}
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "download_200",
    "slug": "project-template-pack",
    "status": "published",
    "title": "Project Template Pack",
    "author": {
      "id": "user_5",
      "name": "Luke Wotton"
    },
    "publishedAt": "2024-01-21T15:00:00Z",
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T15:00:00Z"
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

#### Already Published (400)

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_PUBLISHED",
    "message": "Download is already published"
  }
}
```

#### File Required (400)

```json
{
  "success": false,
  "error": {
    "code": "FILE_REQUIRED",
    "message": "Download must have a file before publishing"
  }
}
```

## Side Effects

- Download indexed for search
- Space members notified (for space downloads)
- Download tracking begins

## Example Request

```bash
curl -X POST "https://api.example.com/api/downloads/download_200/publish" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Notes

- `publishedAt` set to current timestamp
- Download must have at least one file
- Cannot publish archived downloads

