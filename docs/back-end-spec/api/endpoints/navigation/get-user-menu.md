# Get User Menu

Retrieve the user dropdown menu configuration.

## Endpoint

```
GET /api/navigation/user-menu
```

## Description

Returns the user menu configuration with items filtered based on the current user's roles and permissions.

## Authentication

**Required.** Only authenticated users can access this endpoint.

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "nav_user_menu",
    "type": "user_menu",
    "sections": [
      {
        "id": "profile_section",
        "items": [
          {
            "id": "my_profile",
            "label": "My Profile",
            "href": "/profile",
            "icon": "user"
          },
          {
            "id": "my_spaces",
            "label": "My Spaces",
            "href": "/spaces",
            "icon": "users"
          },
          {
            "id": "bookmarks",
            "label": "Bookmarks",
            "href": "/bookmarks",
            "icon": "bookmark"
          }
        ]
      },
      {
        "id": "settings_section",
        "items": [
          {
            "id": "settings",
            "label": "Settings",
            "href": "/settings",
            "icon": "settings"
          },
          {
            "id": "admin",
            "label": "Admin Panel",
            "href": "/admin",
            "icon": "shield",
            "visibility": {
              "rule": "hasRole",
              "role": "admin"
            }
          }
        ]
      },
      {
        "id": "auth_section",
        "items": [
          {
            "id": "logout",
            "label": "Sign Out",
            "action": "logout",
            "icon": "log-out"
          }
        ]
      }
    ]
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

## Item Types

Items can have either:
- `href` - URL to navigate to
- `action` - Client-side action to perform (e.g., `logout`)

## Visibility Rules

Items are filtered based on user roles:
- Admin-only items only appear for admin users
- Role-specific items filtered by user's roles

## Caching

- Response can be cached for 30 minutes per user
- Invalidate on role changes

## Example Request

```bash
curl -X GET "https://api.example.com/api/navigation/user-menu" \
  -H "Authorization: Bearer <token>"
```
