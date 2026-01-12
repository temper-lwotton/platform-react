# Get Conversation

Retrieve a conversation thread with full messages.

## Endpoint

```
GET /api/conversations/{userId}/{conversationId}
```

## Description

Returns the full conversation including all messages. **This endpoint also marks the conversation as read for the requesting user.**

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | User ID (must match authenticated user) |
| `conversationId` | string | Yes | Conversation ID |

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Max messages to return |
| `before` | string | - | Get messages before this message ID |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "conv_123",
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-01-20T09:30:00Z",
    "participants": [
      {
        "id": "5",
        "profile": {
          "fullName": "Luke Wotton",
          "photo": "https://cdn.example.com/photos/5.jpg"
        }
      },
      {
        "id": "12",
        "profile": {
          "fullName": "Sarah Chen",
          "photo": "https://cdn.example.com/photos/12.jpg"
        }
      }
    ],
    "messages": [
      {
        "id": "msg_1",
        "conversationId": "conv_123",
        "type": "user",
        "sender": {
          "id": "5",
          "profile": {
            "fullName": "Luke Wotton",
            "photo": "https://cdn.example.com/photos/5.jpg"
          }
        },
        "content": "Hi Sarah! Quick question about the project.",
        "attachments": [],
        "createdAt": "2024-01-20T09:00:00Z",
        "updatedAt": "2024-01-20T09:00:00Z"
      },
      {
        "id": "msg_2",
        "conversationId": "conv_123",
        "type": "user",
        "sender": {
          "id": "12",
          "profile": {
            "fullName": "Sarah Chen",
            "photo": "https://cdn.example.com/photos/12.jpg"
          }
        },
        "content": "Hi Luke! Sure, what do you need?",
        "attachments": [],
        "createdAt": "2024-01-20T09:15:00Z",
        "updatedAt": "2024-01-20T09:15:00Z"
      },
      {
        "id": "msg_3",
        "conversationId": "conv_123",
        "type": "user",
        "sender": {
          "id": "5",
          "profile": {
            "fullName": "Luke Wotton"
          }
        },
        "content": "Can you review this document?",
        "attachments": [
          {
            "id": "att_1",
            "filename": "project-proposal.pdf",
            "url": "https://cdn.example.com/attachments/att_1.pdf",
            "mimeType": "application/pdf",
            "size": 245760,
            "sizeFormatted": "240 KB"
          }
        ],
        "createdAt": "2024-01-20T09:20:00Z",
        "updatedAt": "2024-01-20T09:20:00Z"
      },
      {
        "id": "msg_4",
        "conversationId": "conv_123",
        "type": "user",
        "sender": {
          "id": "12",
          "profile": {
            "fullName": "Sarah Chen"
          }
        },
        "content": "Looking forward to the meeting!",
        "attachments": [],
        "createdAt": "2024-01-20T09:30:00Z",
        "updatedAt": "2024-01-20T09:30:00Z"
      }
    ],
    "meta": {
      "hasMore": false,
      "oldestMessageId": "msg_1"
    }
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

- Marks conversation as read for the requesting user
- Resets unread count to 0

## Loading Older Messages

To load older messages, use the `before` parameter:

```bash
curl -X GET "https://api.example.com/api/conversations/5/conv_123?before=msg_1&limit=50" \
  -H "Authorization: Bearer <token>"
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/conversations/5/conv_123" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Messages ordered by `createdAt` ascending (oldest first)
- Deleted messages are excluded
- Use `before` parameter to paginate through message history
