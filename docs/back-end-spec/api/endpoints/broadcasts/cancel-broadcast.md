# Cancel Broadcast

Cancel a scheduled broadcast.

## Endpoint

```
POST /api/broadcasts/{id}/cancel
```

## Description

Cancels a scheduled broadcast before it begins sending. Cancelled broadcasts can be edited and rescheduled.

## Authentication

**Required.** Administrator role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Broadcast ID |

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
    "id": "bc_123",
    "name": "EV Meetup Announcement",
    "subject": "Don't miss: EV Industry Meetup",
    "status": "cancelled",
    "scheduledAt": null,
    "sentAt": null,
    "recipients": [
      { "type": "space", "spaceId": "1", "count": 156 }
    ],
    "createdAt": "2024-01-10T14:00:00Z",
    "updatedAt": "2024-01-21T12:30:00Z"
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
    "message": "Only scheduled broadcasts can be cancelled"
  }
}
```

#### Send In Progress (400)

```json
{
  "success": false,
  "error": {
    "code": "SEND_IN_PROGRESS",
    "message": "Cannot cancel broadcast while sending is in progress"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/broadcasts/bc_123/cancel" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Notes

- Only `scheduled` broadcasts can be cancelled
- Cannot cancel once sending has begun
- Cancelled broadcasts can be edited and rescheduled
- Cancelled broadcasts can also be deleted

