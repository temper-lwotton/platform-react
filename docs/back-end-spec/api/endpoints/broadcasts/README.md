# Broadcasts API Endpoints

API endpoints for email broadcast campaigns.

## Overview

The Broadcasts API provides endpoints for creating, managing, and sending email campaigns to platform members.

## Base URL

```
/api/broadcasts
```

## Endpoints

### Broadcasts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/broadcasts](./list-broadcasts.md) | List broadcasts |
| GET | [/api/broadcasts/{id}](./get-broadcast.md) | Get broadcast details |
| POST | [/api/broadcasts](./create-broadcast.md) | Create new broadcast |
| PATCH | [/api/broadcasts/{id}](./update-broadcast.md) | Update broadcast |
| DELETE | [/api/broadcasts/{id}](./delete-broadcast.md) | Delete broadcast |
| POST | [/api/broadcasts/{id}/schedule](./schedule-broadcast.md) | Schedule broadcast |
| POST | [/api/broadcasts/{id}/send](./send-broadcast.md) | Send immediately |
| POST | [/api/broadcasts/{id}/cancel](./cancel-broadcast.md) | Cancel scheduled broadcast |
| GET | [/api/broadcasts/{id}/stats](./get-broadcast-stats.md) | Get delivery statistics |
| POST | [/api/broadcasts/{id}/test](./send-test-email.md) | Send test email |

### Templates {#templates}

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/broadcasts/templates](./list-templates.md) | List templates |
| GET | [/api/broadcasts/templates/{id}](./get-template.md) | Get template |
| POST | [/api/broadcasts/templates](./create-template.md) | Create template |

## Authentication

All endpoints require JWT authentication with administrator privileges.

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
| `BROADCAST_NOT_FOUND` | 404 | Broadcast does not exist |
| `TEMPLATE_NOT_FOUND` | 404 | Template does not exist |
| `INVALID_STATUS` | 400 | Operation not allowed in current status |
| `NO_RECIPIENTS` | 400 | No recipients specified |
| `ALREADY_SENT` | 400 | Cannot modify sent broadcast |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many broadcasts |

## Email Block Types

Broadcasts use a block-based content system:

| Type | Description |
|------|-------------|
| `heading` | Header text (h1, h2, h3) |
| `text` | Rich text paragraph |
| `image` | Image with optional link |
| `button` | Call-to-action button |
| `divider` | Horizontal separator |
| `spacer` | Vertical spacing |

## Related Documentation

- [Broadcasts Domain Specification](../../domains/broadcasts.md)
- [Users Domain](../../domains/users.md)

