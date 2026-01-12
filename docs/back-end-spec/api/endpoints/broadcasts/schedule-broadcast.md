# Schedule Broadcast

Schedule a broadcast for future delivery.

## Endpoint

```
POST /api/broadcasts/{id}/schedule
```

## Description

Schedules a draft broadcast for delivery at a specified future time. The broadcast must have subject, content, and at least one recipient configured.

## Authentication

**Required.** Administrator role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Broadcast ID |

## Request Body

```json
{
  "scheduledAt": "2024-02-10T09:00:00Z"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `scheduledAt` | string | Yes | ISO 8601 datetime (must be in future) |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "bc_123",
    "name": "EV Meetup Announcement",
    "subject": "Don't miss: EV Industry Meetup",
    "status": "scheduled",
    "scheduledAt": "2024-02-10T09:00:00Z",
    "sentAt": null,
    "recipients": [
      { "type": "space", "spaceId": "1", "count": 156 }
    ],
    "createdAt": "2024-01-10T14:00:00Z",
    "updatedAt": "2024-01-21T12:00:00Z"
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
    "message": "Only draft broadcasts can be scheduled"
  }
}
```

#### No Recipients (400)

```json
{
  "success": false,
  "error": {
    "code": "NO_RECIPIENTS",
    "message": "At least one recipient required before scheduling"
  }
}
```

#### Subject Required (400)

```json
{
  "success": false,
  "error": {
    "code": "SUBJECT_REQUIRED",
    "message": "Email subject is required before scheduling"
  }
}
```

#### Content Required (400)

```json
{
  "success": false,
  "error": {
    "code": "CONTENT_REQUIRED",
    "message": "Email content is required before scheduling"
  }
}
```

#### Schedule In Past (400)

```json
{
  "success": false,
  "error": {
    "code": "SCHEDULE_IN_PAST",
    "message": "Scheduled time must be in the future"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/broadcasts/bc_123/schedule" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "scheduledAt": "2024-02-10T09:00:00Z"
  }'
```

## Notes

- Scheduled time must be at least 5 minutes in the future
- Scheduled broadcasts can be cancelled before sending begins
- Use the cancel endpoint to reschedule (cancel, update, schedule again)
- Rate limited to 5 scheduled sends per day

