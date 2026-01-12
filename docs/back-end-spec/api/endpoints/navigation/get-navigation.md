# Get Navigation

Retrieve navigation configuration by type.

## Endpoint

```
GET /api/navigation/{type}
```

## Description

Returns the navigation configuration for the specified type, with items filtered based on the current user's authentication state and permissions.

## Authentication

Optional. Unauthenticated requests receive only publicly visible items.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Navigation type: `main`, `main_mobile`, `home_sidebar`, `footer` |

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `context` | string | - | Optional context (e.g., space ID for contextual filtering) |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "nav_main",
    "type": "main",
    "logoUrl": "/images/logo.svg",
    "logoAltText": "Platform Logo",
    "items": [
      {
        "id": "nav_home",
        "label": "Home",
        "href": "/feed",
        "icon": "home",
        "order": 1,
        "visibility": {
          "rule": "authenticated"
        }
      },
      {
        "id": "nav_people",
        "label": "People",
        "href": "/users",
        "icon": "users",
        "order": 2,
        "visibility": {
          "rule": "authenticated"
        }
      },
      {
        "id": "nav_events",
        "label": "Events",
        "href": "/events",
        "icon": "calendar",
        "order": 3,
        "visibility": {
          "rule": "authenticated"
        }
      },
      {
        "id": "nav_learn",
        "label": "Learn",
        "href": "/learn",
        "icon": "book",
        "order": 4,
        "visibility": {
          "rule": "authenticated"
        }
      },
      {
        "id": "nav_contribute",
        "label": "Contribute",
        "icon": "plus",
        "order": 5,
        "visibility": {
          "rule": "authenticated"
        },
        "children": [
          {
            "id": "nav_new_discussion",
            "label": "New Discussion",
            "href": "/discussions/new",
            "icon": "message-square",
            "order": 1,
            "visibility": {
              "rule": "hasCapability",
              "capability": "create_discussions"
            }
          },
          {
            "id": "nav_new_event",
            "label": "New Event",
            "href": "/events/new",
            "icon": "calendar-plus",
            "order": 2,
            "visibility": {
              "rule": "hasCapability",
              "capability": "create_events"
            }
          }
        ]
      },
      {
        "id": "nav_login",
        "label": "Login",
        "href": "/login",
        "order": 10,
        "visibility": {
          "rule": "unauthenticated"
        }
      }
    ],
    "ctaButton": {
      "label": "Join Now",
      "href": "/register",
      "variant": "primary",
      "visibility": {
        "rule": "unauthenticated"
      }
    },
    "settings": {
      "showIcons": true,
      "maxDepth": 2
    }
  }
}
```

### Home Sidebar Response Example

```json
{
  "success": true,
  "data": {
    "id": "nav_home_sidebar",
    "type": "home_sidebar",
    "sections": [
      {
        "id": "section_main",
        "type": "static",
        "order": 1,
        "visibility": { "rule": "authenticated" },
        "collapsible": false,
        "defaultCollapsed": false,
        "items": [
          {
            "id": "item_feed",
            "label": "Feed",
            "href": "/feed",
            "icon": "rss",
            "order": 1,
            "visibility": { "rule": "always" }
          },
          {
            "id": "item_suggestions",
            "label": "Suggestions",
            "href": "/suggestions",
            "icon": "lightbulb",
            "order": 2,
            "visibility": { "rule": "always" },
            "badge": {
              "type": "count",
              "source": "/api/suggestions/count"
            }
          },
          {
            "id": "item_tasks",
            "label": "Tasks",
            "href": "/tasks",
            "icon": "check-square",
            "order": 3,
            "visibility": { "rule": "always" },
            "badge": {
              "type": "count",
              "source": "/api/tasks/pending/count"
            }
          },
          {
            "id": "item_calendar",
            "label": "Calendar",
            "href": "/calendar",
            "icon": "calendar",
            "order": 4,
            "visibility": { "rule": "always" }
          }
        ]
      },
      {
        "id": "section_spaces",
        "title": "My Spaces",
        "type": "dynamic",
        "order": 2,
        "visibility": { "rule": "authenticated" },
        "collapsible": true,
        "defaultCollapsed": false,
        "source": {
          "type": "user_spaces",
          "limit": 10,
          "showViewAll": true,
          "viewAllHref": "/spaces",
          "emptyMessage": "You haven't joined any spaces yet"
        }
      }
    ]
  }
}
```

### Error Responses

#### Navigation Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "NAVIGATION_NOT_FOUND",
    "message": "Navigation type 'invalid' does not exist"
  }
}
```

#### Invalid Type (400)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_TYPE",
    "message": "Invalid navigation type"
  }
}
```

## Visibility Filtering

Items are filtered based on visibility rules:
- `always` - Always included
- `never` - Always excluded
- `authenticated` - Only if user is logged in
- `unauthenticated` - Only if user is not logged in
- `hasRole` - Only if user has specified role
- `hasCapability` - Only if user has capability
- `spaceMember` - Only if user is member of context space
- `spaceAdmin` - Only if user is admin of context space

## Caching

- Response can be cached for 30 minutes
- Vary by `Authorization` header
- Invalidate on navigation update events

## Example Request

```bash
curl -X GET "https://api.example.com/api/navigation/main" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Items are returned sorted by `order` field
- Children are only included if parent item is visible
- Badge sources are URLs; frontend should fetch counts separately
