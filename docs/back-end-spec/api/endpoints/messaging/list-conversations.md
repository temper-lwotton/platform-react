# List Conversations

Retrieve a user's conversations with preview information.

## Endpoint

```
GET /api/conversations/{userId}
```

## Description

Returns a list of conversations for the specified user, ordered by most recent activity. Includes last message preview and unread counts.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | User ID (must match authenticated user) |

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 20 | Max conversations to return |
| `cursor` | string | - | Pagination cursor |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "conv_123",
      "lastMessage": "Looking forward to the meeting!",
      "lastMessageAt": "2024-01-20T09:30:00Z",
      "unread": 2,
      "updatedAt": "2024-01-20T09:30:00Z",
      "participants": [
        {
          "id": "12",
          "email": "sarah@example.com",
          "profile": {
            "fullName": "Sarah Chen",
            "photo": "https://cdn.example.com/photos/12.jpg"
          }
        }
      ]
    },
    {
      "id": "conv_456",
      "lastMessage": "Thanks for sharing!",
      "lastMessageAt": "2024-01-19T15:00:00Z",
      "unread": 0,
      "updatedAt": "2024-01-19T15:00:00Z",
      "participants": [
        {
          "id": "8",
          "email": "james@example.com",
          "profile": {
            "fullName": "James Miller",
            "photo": null
          }
        }
      ]
    },
    {
      "id": "conv_789",
      "lastMessage": "Let's discuss the project proposal",
      "lastMessageAt": "2024-01-18T10:00:00Z",
      "unread": 0,
      "updatedAt": "2024-01-18T10:00:00Z",
      "participants": [
        {
          "id": "15",
          "profile": {
            "fullName": "Emily Wong"
          }
        },
        {
          "id": "22",
          "profile": {
            "fullName": "Michael Brown"
          }
        }
      ],
      "metadata": {
        "isGroup": true,
        "groupName": "Project Team"
      }
    }
  ],
  "meta": {
    "nextCursor": "eyJpZCI6ImNvbnZfNzg5In0=",
    "hasMore": true
  }
}
```

### Empty Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "nextCursor": null,
    "hasMore": false
  }
}
```

### Error Responses

#### Unauthorized (401)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

#### Forbidden (403)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Cannot access another user's conversations"
  }
}
```

## Notes

- `participants` excludes the requesting user
- `lastMessage` is truncated to ~100 characters
- Conversations ordered by `updatedAt` descending
- Group conversations include `metadata.isGroup: true`

## Example Request

```bash
curl -X GET "https://api.example.com/api/conversations/5?limit=20" \
  -H "Authorization: Bearer <token>"
```
