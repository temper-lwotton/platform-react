# Messaging API Endpoints

API endpoints for direct messaging between users.

## Overview

The Messaging API provides endpoints for managing conversations and messages between connected users.

## Base URL

```
/api/conversations
```

## Endpoints

### Conversations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/conversations/{userId}](./list-conversations.md) | List user's conversations |
| GET | [/api/conversations/{userId}/{conversationId}](./get-conversation.md) | Get conversation thread |
| POST | [/api/conversations](./start-conversation.md) | Start new conversation |

### Messages {#messages}

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | [/api/conversations/{conversationId}](./send-message.md) | Send message to conversation |
| DELETE | [/api/conversations/{userId}/{conversationId}/{messageId}](./delete-message.md) | Delete a message |

### Typing Indicators {#typing}

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/conversations/typing/{conversationId}](./get-typing.md) | Get typing users |
| POST | [/api/conversations/typing/{conversationId}](./send-typing.md) | Send typing indicator |

## Authentication

All endpoints require JWT authentication.

```
Authorization: Bearer <token>
```

## Common Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `CONVERSATION_NOT_FOUND` | 404 | Conversation does not exist |
| `MESSAGE_NOT_FOUND` | 404 | Message does not exist |
| `NOT_PARTICIPANT` | 403 | User is not a participant |
| `NOT_CONNECTED` | 403 | No connection with recipient |
| `NOT_MESSAGE_SENDER` | 403 | Only sender can delete |
| `MESSAGE_TOO_LONG` | 400 | Exceeds character limit |
| `TOO_MANY_ATTACHMENTS` | 400 | Exceeds attachment limit |
| `FILE_TOO_LARGE` | 400 | File exceeds size limit |

## Real-Time Updates

For real-time message delivery, use WebSocket:

```javascript
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: `conversations:${userId}`
}));
```

## Related Documentation

- [Messaging Domain Specification](../../domains/messaging.md)
- [Users Domain](../../domains/users.md)
