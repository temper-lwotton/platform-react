# CMS Posts Endpoints

API endpoints for managing CMS posts.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| [GET](./list.md) | `/api/cms/posts` | List posts |
| [GET](./get.md) | `/api/cms/posts/{id}` | Get post by ID |
| [GET](./get-published.md) | `/api/cms/posts/{slug}/published` | Get published post by slug |
| [POST](./create.md) | `/api/cms/posts` | Create post |
| [PUT](./update.md) | `/api/cms/posts/{id}` | Update post |
| [DELETE](./delete.md) | `/api/cms/posts/{id}` | Delete/archive post |
| [POST](./duplicate.md) | `/api/cms/posts/{id}/duplicate` | Duplicate post |

## See Also

- [CMS Domain Specification](../../../domains/cms.md)
- [Version Endpoints](../versions/README.md)
- [API Conventions](../../../_index.md)
