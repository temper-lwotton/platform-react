# Navigation API Endpoints

API endpoints for platform navigation management.

## Overview

The Navigation API provides endpoints for retrieving and managing navigation configurations across the platform, including main navigation, sidebars, and user menus.

## Base URL

```
/api/navigation
/api/admin/navigation
/api/spaces/{spaceId}/navigation
```

## Endpoints

### Core Navigation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/navigation/{type}](./get-navigation.md) | Get navigation by type |
| GET | [/api/navigation/user-menu](./get-user-menu.md) | Get user menu |

### Badge Counts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/navigation/badges](./get-badges.md) | Get all badge counts |
| GET | [/api/navigation/badges/{source}](./get-badge.md) | Get single badge count |

### Admin Navigation Management {#admin}

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/admin/navigation](./admin-list-navigation.md) | List all navigation configs |
| PUT | [/api/admin/navigation/{type}](./admin-update-navigation.md) | Update navigation config |
| POST | [/api/admin/navigation/{type}/items](./admin-add-item.md) | Add navigation item |
| PUT | [/api/admin/navigation/{type}/items/{itemId}](./admin-update-item.md) | Update navigation item |
| DELETE | [/api/admin/navigation/{type}/items/{itemId}](./admin-delete-item.md) | Delete navigation item |
| PUT | [/api/admin/navigation/{type}/reorder](./admin-reorder-items.md) | Reorder navigation items |

### Space Navigation {#space}

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [/api/spaces/{spaceId}/navigation](./get-space-navigation.md) | Get space sidebar |
| PUT | [/api/spaces/{spaceId}/navigation](./update-space-navigation.md) | Update space sidebar |
| POST | [/api/spaces/{spaceId}/navigation/reset](./reset-space-navigation.md) | Reset to defaults |

## Authentication

All endpoints require JWT authentication except public navigation retrieval.

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
| `NAVIGATION_NOT_FOUND` | 404 | Navigation type does not exist |
| `ITEM_NOT_FOUND` | 404 | Navigation item not found |
| `SPACE_NOT_FOUND` | 404 | Space does not exist |
| `INVALID_TYPE` | 400 | Invalid navigation type |
| `INVALID_VISIBILITY_RULE` | 400 | Malformed visibility rule |
| `MAX_DEPTH_EXCEEDED` | 400 | Nesting exceeds maximum |
| `NOT_SPACE_ADMIN` | 403 | User is not space admin |
| `FORBIDDEN` | 403 | Not authorized |

## Related Documentation

- [Navigation Domain Specification](../../domains/navigation.md)
- [Spaces Domain](../../domains/spaces.md)
