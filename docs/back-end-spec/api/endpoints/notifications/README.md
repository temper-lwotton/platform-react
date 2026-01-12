# Notifications Endpoints

API endpoints for managing user notifications.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| [GET](./list.md) | `/api/notifications/{userId}` | Get all notifications |
| [GET](./count.md) | `/api/notifications/{userId}/count` | Get unread count |
| [POST](./mark-read.md) | `/api/notifications/{id}/mark-read` | Mark as read |
| [POST](./mark-all-read.md) | `/api/notifications/{userId}/mark-all-read` | Mark all as read |
| [GET](./preferences.md) | `/api/notifications/{userId}/preferences` | Get preferences |

## See Also

- [Notifications Domain Specification](../../domains/notifications.md)
- [API Conventions](../../_index.md)
