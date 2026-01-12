# Delete Message

Delete a message from a conversation.

## Endpoint

```
DELETE /api/conversations/{userId}/{conversationId}/{messageId}
```

## Description

Soft-deletes a message from a conversation. Only the message sender can delete their own messages. Deleted messages are hidden from the UI but retained in the database.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | User ID (must match authenticated user) |
| `conversationId` | string | Yes | Conversation ID |
| `messageId` | string | Yes | Message ID to delete |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "msg_123",
    "deleted": true,
    "deletedAt": "2024-01-21T15:00:00Z"
  }
}
```

### Error Responses

#### Message Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "MESSAGE_NOT_FOUND",
    "message": "Message 'msg_invalid' does not exist"
  }
}
```

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

#### Not Message Sender (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_MESSAGE_SENDER",
    "message": "Only the message sender can delete this message"
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

- Message marked with `deletedAt` timestamp
- Message excluded from future conversation fetches
- WebSocket broadcast to notify participants of deletion
- If last message deleted, updates conversation `lastMessage` to previous message

## Example Request

```bash
curl -X DELETE "https://api.example.com/api/conversations/5/conv_123/msg_456" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Soft delete only - messages retained for audit purposes
- Attachments associated with deleted messages are also hidden
- Only the original sender can delete their messages
- Deleted messages cannot be restored via API

