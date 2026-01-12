# Start Conversation

Start a new conversation with one or more recipients.

## Endpoint

```
POST /api/conversations
```

## Description

Creates a new conversation and sends the first message. If a direct conversation already exists between the two users, returns the existing conversation with the new message added.

## Authentication

**Required.**

## Request Body

### JSON Request

```json
{
  "content": "Hello! I'd like to discuss the project.",
  "sender": 5,
  "recipients": [12],
  "type": "user"
}
```

### With Attachments (multipart/form-data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | Message text |
| `sender` | number | Yes | Sender user ID |
| `recipients[]` | number[] | Yes | Recipient user IDs |
| `type` | string | Yes | Message type (`user`) |
| `attachments` | File[] | No | File attachments |

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | Message text (max 10,000 chars) |
| `sender` | number | Yes | Sender user ID |
| `recipients` | number[] | Yes | One or more recipient IDs |
| `type` | string | Yes | Message type (`user` or `system`) |

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "conv_789",
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T10:00:00Z",
    "participants": [
      {
        "id": "5",
        "profile": {
          "fullName": "Luke Wotton"
        }
      },
      {
        "id": "12",
        "profile": {
          "fullName": "Sarah Chen"
        }
      }
    ],
    "messages": [
      {
        "id": "msg_1",
        "conversationId": "conv_789",
        "type": "user",
        "sender": {
          "id": "5",
          "profile": {
            "fullName": "Luke Wotton"
          }
        },
        "content": "Hello! I'd like to discuss the project.",
        "attachments": [],
        "createdAt": "2024-01-21T10:00:00Z",
        "updatedAt": "2024-01-21T10:00:00Z"
      }
    ]
  }
}
```

### Existing Conversation Response (200 OK)

If a direct conversation already exists:

```json
{
  "success": true,
  "data": {
    "id": "conv_123",
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-01-21T10:00:00Z",
    "participants": [...],
    "messages": [
      // Previous messages...
      {
        "id": "msg_new",
        "content": "Hello! I'd like to discuss the project.",
        "createdAt": "2024-01-21T10:00:00Z"
      }
    ]
  },
  "meta": {
    "existingConversation": true
  }
}
```

### Error Responses

#### Not Connected (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_CONNECTED",
    "message": "You must be connected with user to start a conversation"
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

#### Too Many Participants (400)

```json
{
  "success": false,
  "error": {
    "code": "TOO_MANY_PARTICIPANTS",
    "message": "Conversations limited to 50 participants"
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

## Group Conversations

To start a group conversation, include multiple recipients:

```json
{
  "content": "Hey team, let's discuss the project!",
  "sender": 5,
  "recipients": [12, 15, 22],
  "type": "user"
}
```

## With Attachments

```bash
curl -X POST "https://api.example.com/api/conversations" \
  -H "Authorization: Bearer <token>" \
  -F "content=Check out this document" \
  -F "sender=5" \
  -F "recipients[]=12" \
  -F "type=user" \
  -F "attachments=@/path/to/file.pdf"
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/conversations" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello! I would like to discuss the project.",
    "sender": 5,
    "recipients": [12],
    "type": "user"
  }'
```

## Notes

- Sender must be connected with all recipients
- For direct conversations, returns existing conversation if one exists
- Group conversations are always created new
