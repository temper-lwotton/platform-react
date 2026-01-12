# Send Typing Indicator

Signal that the user is typing in a conversation.

## Endpoint

```
POST /api/conversations/typing/{conversationId}
```

## Description

Sends a typing indicator to notify other participants that the user is composing a message. Indicators automatically expire after 3 seconds, so clients should send periodic updates while the user continues typing.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `conversationId` | string | Yes | Conversation ID |

## Request Body

```json
{
  "userId": 5
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | number | Yes | ID of the typing user |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "conversationId": "conv_123",
    "userId": "5",
    "expiresAt": "2024-01-21T15:30:03Z"
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

## Side Effects

- Updates typing status for the user in the conversation
- Broadcasts typing indicator to other participants via WebSocket
- Sets expiration timer (3 seconds)

## Client Implementation

```javascript
// Send typing indicator while user is typing
let typingTimer;

inputField.addEventListener('input', () => {
  // Clear existing timer
  clearTimeout(typingTimer);

  // Send typing indicator
  sendTypingIndicator(conversationId, userId);

  // Set timer to stop sending after 3 seconds of inactivity
  typingTimer = setTimeout(() => {
    // Typing will auto-expire on server
  }, 3000);
});

async function sendTypingIndicator(conversationId, userId) {
  await fetch(`/api/conversations/typing/${conversationId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId })
  });
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/conversations/typing/conv_123" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 5
  }'
```

## Notes

- Typing indicators expire after 3 seconds without refresh
- Rate limited to 10 requests per second per user
- Send indicators every 2-3 seconds while user is actively typing
- No need to explicitly clear typing status - it expires automatically

