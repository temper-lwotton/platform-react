# List Space Articles

Retrieve articles belonging to a specific space.

## Endpoint

```
GET /api/spaces/{spaceId}/articles
```

## Description

Returns articles within a specific space. User must be a space member to access. Results include published articles and drafts for authors/editors.

## Authentication

**Required.** User must be a space member.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spaceId` | string | Yes | Space ID |

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | - | Filter by type: text, video, mixed |
| `status` | string | published | Filter by status |
| `category` | string | - | Filter by category slug |
| `tag` | string | - | Filter by tag slug |
| `author` | string | - | Filter by author ID |
| `difficulty` | string | - | Filter: beginner, intermediate, advanced |
| `search` | string | - | Search query |
| `sortBy` | string | date | Sort: date, views, likes, readingTime |
| `sortOrder` | string | desc | Sort order: asc, desc |
| `limit` | number | 20 | Max items to return |
| `cursor` | string | - | Pagination cursor |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "article_125",
      "slug": "team-code-review-guidelines",
      "type": "text",
      "status": "published",
      "spaceId": "space_23",
      "space": {
        "id": "space_23",
        "title": "ML Engineers",
        "slug": "ml-engineers"
      },
      "title": "Team Code Review Guidelines",
      "excerpt": "Best practices for conducting effective code reviews in our team.",
      "featuredImage": {
        "url": "https://cdn.example.com/articles/code-review.jpg",
        "thumbnails": {
          "medium": "https://cdn.example.com/articles/code-review-600.jpg"
        }
      },
      "author": {
        "id": "user_102",
        "name": "Emily Wong",
        "avatar": "https://cdn.example.com/avatars/emily.jpg"
      },
      "publishedAt": "2024-01-18T14:00:00Z",
      "categories": [
        { "id": "cat_10", "name": "Best Practices", "slug": "best-practices" }
      ],
      "difficulty": "intermediate",
      "readingTime": 8,
      "viewCount": 156,
      "likeCount": 23,
      "commentCount": 5
    }
  ],
  "meta": {
    "nextCursor": null,
    "hasMore": false,
    "total": 12
  }
}
```

### Error Responses

#### Not Space Member (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_SPACE_MEMBER",
    "message": "You must be a member of this space to view articles"
  }
}
```

#### Space Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "SPACE_NOT_FOUND",
    "message": "Space 'space_invalid' does not exist"
  }
}
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/spaces/space_23/articles?sortBy=views" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Only space members can access space articles
- Space admins can see draft articles
- Article authors can see their own drafts

