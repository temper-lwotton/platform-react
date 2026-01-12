# Send Broadcast

Send a broadcast immediately.

## Endpoint

```
POST /api/broadcasts/{id}/send
```

## Description

Initiates immediate delivery of a draft broadcast. The broadcast must have subject, content, and at least one recipient configured.

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
    "status": "sending",
    "scheduledAt": null,
    "sentAt": null,
    "recipients": [
      { "type": "space", "spaceId": "1", "count": 156 }
    ],
    "createdAt": "2024-01-10T14:00:00Z",
    "updatedAt": "2024-01-21T12:00:00Z"
  },
  "meta": {
    "estimatedDeliveryTime": "2024-01-21T12:05:00Z",
    "recipientCount": 156
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
    "message": "Only draft broadcasts can be sent"
  }
}
```

#### No Recipients (400)

```json
{
  "success": false,
  "error": {
    "code": "NO_RECIPIENTS",
    "message": "At least one recipient required before sending"
  }
}
```

#### Subject Required (400)

```json
{
  "success": false,
  "error": {
    "code": "SUBJECT_REQUIRED",
    "message": "Email subject is required before sending"
  }
}
```

#### Content Required (400)

```json
{
  "success": false,
  "error": {
    "code": "CONTENT_REQUIRED",
    "message": "Email content is required before sending"
  }
}
```

#### Rate Limit Exceeded (429)

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Maximum 5 broadcasts per day"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/broadcasts/bc_123/send" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Notes

- Sending is asynchronous; status changes to `sending` immediately
- Large broadcasts are processed in batches
- Status updates to `sent` when delivery completes
- Check stats endpoint for delivery progress
- Rate limited to 5 sends per day

