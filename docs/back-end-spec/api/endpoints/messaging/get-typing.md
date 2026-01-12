# Get Typing Users

Get users currently typing in a conversation.

## Endpoint

```
GET /api/conversations/typing/{conversationId}
```

## Description

Returns a list of users currently typing in the specified conversation. Typing indicators expire after 3 seconds without refresh. This endpoint is primarily for polling-based clients; WebSocket clients receive typing updates in real-time.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `conversationId` | string | Yes | Conversation ID |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "conversationId": "conv_123",
    "typingUsers": [
      {
        "id": "12",
        "fullName": "Sarah Chen",
        "timestamp": 1705841400000
      }
    ]
  }
}
```

### Multiple Users Typing

```json
{
  "success": true,
  "data": {
    "conversationId": "conv_789",
    "typingUsers": [
      {
        "id": "15",
        "fullName": "Emily Wong",
        "timestamp": 1705841400000
      },
      {
        "id": "22",
        "fullName": "Michael Brown",
        "timestamp": 1705841398000
      }
    ]
  }
}
```

### No Users Typing

```json
{
  "success": true,
  "data": {
    "conversationId": "conv_123",
    "typingUsers": []
  }
}
```

### Error Responses

#### Conversation Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "CONVERSATION_NOT_FOUND",
    "message": "Conversation 'conv_invalid' does not exist"
  }
}
```

#### Not Participant (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_PARTICIPANT",
    "message": "You are not a participant in this conversation"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `conversationId` | string | Conversation ID |
| `typingUsers` | array | Users currently typing |
| `typingUsers[].id` | string | User ID |
| `typingUsers[].fullName` | string | User's display name |
| `typingUsers[].timestamp` | number | Unix timestamp of last typing signal |

## Example Request

```bash
curl -X GET "https://api.example.com/api/conversations/typing/conv_123" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Typing indicators expire after 3 seconds
- For real-time updates, prefer WebSocket subscription
- Polling recommended interval: 1-2 seconds
- The requesting user is excluded from the typing list

