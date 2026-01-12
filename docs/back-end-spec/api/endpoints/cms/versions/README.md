# CMS Versions Endpoints

API endpoints for managing post versions.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| [GET](./list.md) | `/api/cms/posts/{id}/versions` | List versions |
| [GET](./get.md) | `/api/cms/posts/{id}/versions/{vid}` | Get version |
| [POST](./create.md) | `/api/cms/posts/{id}/versions` | Create version |
| [POST](./autosave.md) | `/api/cms/posts/{id}/autosave` | Autosave |
| [POST](./publish.md) | `/api/cms/posts/{id}/publish/{vid}` | Publish version |
| [POST](./unpublish.md) | `/api/cms/posts/{id}/unpublish` | Unpublish post |
| [GET](./compare.md) | `/api/cms/posts/{id}/versions/compare` | Compare versions |
| [DELETE](./delete.md) | `/api/cms/posts/{id}/versions/{vid}` | Delete version |
| [PUT](./restore.md) | `/api/cms/posts/{id}/versions/{vid}/restore` | Restore version |

## See Also

- [CMS Domain Specification](../../../domains/cms.md)
- [Posts Endpoints](../posts/README.md)
- [API Conventions](../../../_index.md)
