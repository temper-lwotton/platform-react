# Suggestions Endpoints

API endpoints for the personalized suggestions/recommendations engine.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| [GET](./list.md) | `/api/suggestions` | List all suggestions |
| [GET](./carousel.md) | `/api/suggestions/carousel` | Carousel-optimized suggestions |
| [GET](./list-by-type.md) | `/api/suggestions/{type}` | Suggestions by type |
| [GET](./count.md) | `/api/suggestions/count` | Get suggestion counts |
| [POST](./dismiss.md) | `/api/suggestions/{id}/dismiss` | Dismiss a suggestion |
| [DELETE](./restore.md) | `/api/suggestions/{id}/dismiss` | Restore dismissed suggestion |
| [POST](./record-interaction.md) | `/api/suggestions/{id}/interactions` | Record interaction |
| [GET](./list-dismissed.md) | `/api/suggestions/dismissed` | List dismissed suggestions |
| [POST](./impressions.md) | `/api/suggestions/impressions` | Bulk record impressions |
| [POST](./refresh.md) | `/api/suggestions/refresh` | Force refresh suggestions |

## Admin Endpoints

| Method | Path | Description |
|--------|------|-------------|
| [GET](./admin-metrics.md) | `/api/admin/suggestions/metrics` | View suggestion metrics |
| [PUT](./admin-config.md) | `/api/admin/suggestions/config` | Configure suggestion weights |

## See Also

- [Suggestions Domain Specification](../../domains/suggestions.md)
- [API Conventions](../../_index.md)
