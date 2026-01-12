# Delete Video

Permanently delete a video.

## Endpoint

```
DELETE /api/videos/{id}
```

## Description

Permanently deletes a video and all associated data.

## Authentication

**Required.** Administrator role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Video ID |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "video_123",
    "deleted": true
  }
}
```

### Error Responses

#### Video Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "VIDEO_NOT_FOUND",
    "message": "Video 'video_invalid' does not exist"
  }
}
```

#### Forbidden (403)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Only administrators can delete videos"
  }
}
```

## Side Effects

- Video removed from search index
- Comments deleted
- Collection membership removed
- Engagement data deleted

## Example Request

```bash
curl -X DELETE "https://api.example.com/api/videos/video_123" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Only administrators can delete
- Consider archiving instead
- Deletion is permanent

