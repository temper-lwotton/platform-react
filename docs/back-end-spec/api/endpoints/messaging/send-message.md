# Send Message

Send a message to an existing conversation.

## Endpoint

```
POST /api/conversations/{conversationId}
```

## Description

Sends a new message to an existing conversation. Supports text content and file attachments. All conversation participants receive the message via WebSocket if online, or push notification if offline.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `conversationId` | string | Yes | Conversation ID |

## Request Body

### JSON Request

```json
{
  "content": "Here's the update we discussed.",
  "sender": 5,
  "type": "user"
}
```

### With Attachments (multipart/form-data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | Message text |
| `sender` | number | Yes | Sender user ID |
| `type` | string | Yes | Message type (`user`) |
| `attachments` | File[] | No | File attachments (max 10) |

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | Message text (max 10,000 chars) |
| `sender` | number | Yes | Sender user ID |
| `type` | string | Yes | Message type (`user` or `system`) |

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "msg_456",
    "conversationId": "conv_123",
    "type": "user",
    "sender": {
      "id": "5",
      "profile": {
        "fullName": "Luke Wotton",
        "photo": "https://cdn.example.com/photos/5.jpg"
      }
    },
    "content": "Here's the update we discussed.",
    "attachments": [],
    "createdAt": "2024-01-21T14:30:00Z",
    "updatedAt": "2024-01-21T14:30:00Z"
  }
}
```

### With Attachments Response

```json
{
  "success": true,
  "data": {
    "id": "msg_457",
    "conversationId": "conv_123",
    "type": "user",
    "sender": {
      "id": "5",
      "profile": {
        "fullName": "Luke Wotton"
      }
    },
    "content": "Check out these files",
    "attachments": [
      {
        "id": "att_1",
        "filename": "report.pdf",
        "url": "https://cdn.example.com/attachments/att_1.pdf",
        "mimeType": "application/pdf",
        "size": 1048576,
        "sizeFormatted": "1 MB"
      },
      {
        "id": "att_2",
        "filename": "screenshot.png",
        "url": "https://cdn.example.com/attachments/att_2.png",
        "mimeType": "image/png",
        "size": 245760,
        "sizeFormatted": "240 KB",
        "thumbnailUrl": "https://cdn.example.com/attachments/att_2_thumb.png"
      }
    ],
    "createdAt": "2024-01-21T14:35:00Z",
    "updatedAt": "2024-01-21T14:35:00Z"
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

#### Message Too Long (400)

```json
{
  "success": false,
  "error": {
    "code": "MESSAGE_TOO_LONG",
    "message": "Message exceeds 10,000 character limit"
  }
}
```

#### Too Many Attachments (400)

```json
{
  "success": false,
  "error": {
    "code": "TOO_MANY_ATTACHMENTS",
    "message": "Maximum 10 attachments per message"
  }
}
```

#### File Too Large (400)

```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File exceeds 25MB size limit"
  }
}
```

## Side Effects

- Updates conversation `lastMessage` and `updatedAt`
- Broadcasts message to online participants via WebSocket
- Sends push notification to offline participants
- Increments unread count for other participants

## With Attachments Example

```bash
curl -X POST "https://api.example.com/api/conversations/conv_123" \
  -H "Authorization: Bearer <token>" \
  -F "content=Here are the documents" \
  -F "sender=5" \
  -F "type=user" \
  -F "attachments=@/path/to/file1.pdf" \
  -F "attachments=@/path/to/file2.png"
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/conversations/conv_123" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Here is the update we discussed.",
    "sender": 5,
    "type": "user"
  }'
```

## Notes

- Sender must be a participant in the conversation
- File attachments require multipart/form-data encoding
- Image attachments automatically generate thumbnails
- Rate limited to 60 messages per minute

