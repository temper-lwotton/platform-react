# Update Article

Update an existing article.

## Endpoint

```
PUT /api/articles/{id}
```

## Description

Updates article content and metadata. Only article authors and administrators can update articles.

## Authentication

**Required.** Must be article author or administrator.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Article ID |

## Request Body

```json
{
  "title": "Getting Started with Python - Updated",
  "subtitle": "A comprehensive beginner's guide",
  "content": "{\"root\":{\"children\":[...]}}",
  "excerpt": "Updated guide to Python basics",
  "featuredImageId": "img_502",
  "categoryIds": ["cat_5", "cat_6"],
  "tagIds": ["tag_10", "tag_12"],
  "difficulty": "beginner",
  "seoTitle": "Python Tutorial for Beginners 2024",
  "seoDescription": "Learn Python programming from scratch..."
}
```

### Request Fields

All fields are optional. Only specified fields are updated.

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Article title |
| `subtitle` | string | Article subtitle |
| `content` | string | Lexical JSON content |
| `excerpt` | string | Short summary |
| `featuredImageId` | string | Featured image media ID |
| `videoId` | string | Video media ID |
| `transcript` | string | Video transcript |
| `categoryIds` | string[] | Category IDs (replaces all) |
| `tagIds` | string[] | Tag IDs (replaces all) |
| `difficulty` | string | Difficulty level |
| `visibility` | string | Visibility (platform articles only) |
| `seoTitle` | string | SEO title |
| `seoDescription` | string | SEO description |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "article_200",
    "slug": "getting-started-with-python",
    "type": "text",
    "status": "draft",
    "title": "Getting Started with Python - Updated",
    "subtitle": "A comprehensive beginner's guide",
    "excerpt": "Updated guide to Python basics",
    "content": "{\"root\":{\"children\":[...]}}",
    "featuredImage": {
      "id": "img_502",
      "url": "https://cdn.example.com/images/img_502.jpg"
    },
    "author": {
      "id": "user_5",
      "name": "Luke Wotton"
    },
    "publishedAt": null,
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T14:00:00Z",
    "categories": [
      { "id": "cat_5", "name": "Programming", "slug": "programming" },
      { "id": "cat_6", "name": "Tutorials", "slug": "tutorials" }
    ],
    "difficulty": "beginner",
    "readingTime": 14,
    "viewCount": 0,
    "likeCount": 0
  }
}
```

### Error Responses

#### Article Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "ARTICLE_NOT_FOUND",
    "message": "Article 'article_invalid' does not exist"
  }
}
```

#### Not Author (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_AUTHOR",
    "message": "Only the article author can update this article"
  }
}
```

## Example Request

```bash
curl -X PUT "https://api.example.com/api/articles/article_200" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with Python - Updated",
    "content": "{\"root\":{\"children\":[...]}}"
  }'
```

## Notes

- Reading time recalculated when content changes
- Categories/tags update replaces entire list
- Published articles can still be updated
- `updatedAt` timestamp always refreshed

