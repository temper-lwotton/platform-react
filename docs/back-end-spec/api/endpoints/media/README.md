# Media Endpoints

API endpoints for the Media domain.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| [POST](./upload.md) | `/api/media/upload` | Upload new media |
| [GET](./list.md) | `/api/media` | List media items |
| [GET](./get.md) | `/api/media/{id}` | Get media item |
| [PATCH](./update.md) | `/api/media/{id}` | Update metadata |
| [DELETE](./delete.md) | `/api/media/{id}` | Delete media |
| [POST](./analyze.md) | `/api/media/{id}/analyze` | Re-analyze image |
| [POST](./generate-alt-text.md) | `/api/media/generate-alt-text` | Generate alt text |
| [POST](./archive.md) | `/api/media/{id}/archive` | Archive media |
| [POST](./unarchive.md) | `/api/media/{id}/unarchive` | Unarchive media |

## See Also

- [Media Domain Specification](../../domains/media.md)
- [API Conventions](../../_index.md)
