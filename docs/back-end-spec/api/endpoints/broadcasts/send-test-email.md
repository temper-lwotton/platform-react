# Send Test Email

Send a test email for a broadcast.

## Endpoint

```
POST /api/broadcasts/{id}/test
```

## Description

Sends a test version of the broadcast to specified email addresses. Useful for previewing the email before scheduling or sending to the full audience.

## Authentication

**Required.** Administrator role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Broadcast ID |

## Request Body

```json
{
  "emails": [
    "test@example.com",
    "reviewer@example.com"
  ]
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `emails` | string[] | Yes | Email addresses to send test to (max 5) |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "broadcastId": "bc_123",
    "sentTo": [
      "test@example.com",
      "reviewer@example.com"
    ],
    "sentAt": "2024-01-21T12:00:00Z"
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

#### Content Required (400)

```json
{
  "success": false,
  "error": {
    "code": "CONTENT_REQUIRED",
    "message": "Email content is required for test send"
  }
}
```

#### Too Many Recipients (400)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Maximum 5 test recipients allowed"
  }
}
```

#### Invalid Email (400)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "errors": {
      "emails": ["Invalid email address: not-an-email"]
    }
  }
}
```

#### Rate Limit Exceeded (429)

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Maximum 20 test sends per day"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/broadcasts/bc_123/test" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "emails": ["test@example.com"]
  }'
```

## Notes

- Test emails are marked with "[TEST]" in subject line
- Maximum 5 recipients per test send
- Rate limited to 20 test sends per day
- Test sends don't affect broadcast statistics
- Works for broadcasts in any status except `sending`

