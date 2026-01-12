# Delete Broadcast

Delete a broadcast campaign.

## Endpoint

```
DELETE /api/broadcasts/{id}
```

## Description

Permanently deletes a broadcast. Only broadcasts in `draft` or `cancelled` status can be deleted.

## Authentication

**Required.** Administrator role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Broadcast ID |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "bc_123",
    "deleted": true
  }
}
```

### Error Responses

#### Broadcast Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "BROADCAST_NOT_FOUND",
    "message": "Broadcast 'bc_invalid' does not exist"
  }
}
```

#### Invalid Status (400)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS",
    "message": "Cannot delete broadcast in 'sent' status"
  }
}
```

#### Send In Progress (400)

```json
{
  "success": false,
  "error": {
    "code": "SEND_IN_PROGRESS",
    "message": "Cannot delete broadcast while sending is in progress"
  }
}
```

## Example Request

```bash
curl -X DELETE "https://api.example.com/api/broadcasts/bc_123" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Only `draft` or `cancelled` broadcasts can be deleted
- Sent broadcasts are retained for analytics purposes
- Scheduled broadcasts must be cancelled first
- This action cannot be undone

