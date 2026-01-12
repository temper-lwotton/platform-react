# Delete Navigation Item

Delete a navigation item from a configuration.

## Endpoint

```
DELETE /api/admin/navigation/{type}/items/{itemId}
```

## Description

Removes a navigation item from the specified navigation configuration. If the item has children, they are also deleted.

## Authentication

**Required.** Admin role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Navigation type |
| `itemId` | string | Yes | Item ID to delete |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "deleted": true,
    "itemId": "nav_item_123",
    "childrenDeleted": 2
  }
}
```

### Error Responses

#### Item Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Navigation item 'nav_invalid' does not exist"
  }
}
```

#### Forbidden (403)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Admin access required"
  }
}
```

## Example Request

```bash
curl -X DELETE "https://api.example.com/api/admin/navigation/main/items/nav_item_123" \
  -H "Authorization: Bearer <admin_token>"
```

## Notes

- Deleting an item also deletes all its children
- Deletion is immediate and cannot be undone
- Consider implementing soft-delete for audit purposes
