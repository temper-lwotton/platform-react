# **API Domain Specification: Settings**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Settings`**

### **Description**

The Settings domain manages CMS and platform configuration across multiple categories. It provides:

* General site configuration (name, URL, timezone, locale)
* Media handling settings (upload limits, AI analysis)
* Reading and writing defaults
* Discussion and comment settings
* Permalink structure configuration
* Theme and branding customization

Settings are scoped globally or per-space with admin-only modification access.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Storing and retrieving platform configuration
* Managing settings across all categories
* Providing default values for unconfigured settings
* Supporting reset to factory defaults
* Emitting events for real-time theme updates

### **Out of scope:**

* User preferences (see [Users](./users.md))
* Notification preferences (see [Notifications](./notifications.md))
* Space-specific settings beyond themes (see [Spaces](./spaces.md))
* Authentication configuration (infrastructure concern)

---

## **Owned Data Models**

### **Core Entities**

#### **CMSSettings**

```typescript
interface CMSSettings {
  general: GeneralSettings;
  media: MediaSettings;
  reading: ReadingSettings;
  writing: WritingSettings;
  discussion: DiscussionSettings;
  permalinks: PermalinkSettings;
  theme: ThemeSettings;
}
```

#### **GeneralSettings**

```typescript
interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  timezone: string;                   // IANA timezone
  dateFormat: string;
  timeFormat: string;
  language: string;                   // ISO language code
  weekStartsOn: 0 | 1 | 6;           // Sunday, Monday, Saturday
}
```

#### **MediaSettings**

```typescript
interface MediaSettings {
  maxUploadSize: number;              // MB
  allowedFileTypes: string[];         // MIME types
  enableAIAnalysis: boolean;
  autoGenerateAltText: boolean;
  autoOptimizeImages: boolean;
  imageSizes: ImageSize[];
  defaultImageQuality: number;        // 1-100
}

interface ImageSize {
  name: string;
  width: number;
  height: number;
  crop: boolean;
}
```

#### **ReadingSettings**

```typescript
interface ReadingSettings {
  postsPerPage: number;
  feedPostsPerPage: number;
  feedShowSummary: boolean;
  searchEngineVisibility: boolean;
  defaultPostFormat: PostFormat;
}
```

#### **WritingSettings**

```typescript
interface WritingSettings {
  defaultPostStatus: 'draft' | 'pending' | 'published';
  defaultCommentStatus: 'open' | 'closed';
  enableAutosave: boolean;
  autosaveInterval: number;           // seconds
  enableRevisions: boolean;
  maxRevisions: number;               // 0 = unlimited
  defaultCategory: number | null;
  enableEmoji: boolean;
  enableMarkdown: boolean;
}
```

#### **DiscussionSettings**

```typescript
interface DiscussionSettings {
  enableComments: boolean;
  requireNameEmail: boolean;
  requireRegistration: boolean;
  autoCloseComments: boolean;
  autoCloseCommentsDays: number;
  enableThreadedComments: boolean;
  threadedCommentsDepth: number;
  pageComments: boolean;
  commentsPerPage: number;
  commentOrder: 'asc' | 'desc';
  emailOnComment: boolean;
  emailOnModeration: boolean;
  moderationRequired: boolean;
  moderationHoldKeywords: string[];
  disallowedKeywords: string[];
}
```

#### **PermalinkSettings**

```typescript
interface PermalinkSettings {
  structure: PermalinkStructure;
  customStructure?: string;
  categoryBase: string;
  tagBase: string;
}
```

#### **ThemeSettings**

```typescript
interface ThemeSettings {
  platformTheme: PlatformTheme;
  defaultColorMode: 'light' | 'dark' | 'system';
  allowUserOverride: boolean;
  primaryColor: string;               // Hex color
  infoColor: string;
  ctaColor: string;
  accentColor: string;
  customPrimaryColor?: string;
  customInfoColor?: string;
  customCtaColor?: string;
  customAccentColor?: string;
}
```

---

## **Enumerations**

### **PlatformTheme**

| Value | Description | Colors |
|-------|-------------|--------|
| `innovation-spectrum` | Default theme | Purple primary, blue info, orange CTA |
| `deep-focus` | Dark, focused palette | Deep blues and grays |
| `bright-studio` | Light, vibrant palette | Bright, energetic colors |
| `coastal-fusion` | Blue-green palette | Ocean-inspired tones |
| `custom` | User-defined colors | Uses custom color fields |

```typescript
type PlatformTheme = 'innovation-spectrum' | 'deep-focus' | 'bright-studio' | 'coastal-fusion' | 'custom';
```

### **PermalinkStructure**

| Value | Pattern | Example |
|-------|---------|---------|
| `plain` | `?p=123` | `?p=123` |
| `day-name` | `/YYYY/MM/DD/slug/` | `/2024/01/15/hello/` |
| `month-name` | `/YYYY/MM/slug/` | `/2024/01/hello/` |
| `numeric` | `/archives/123` | `/archives/123` |
| `post-name` | `/slug/` | `/hello/` |
| `custom` | User-defined | Custom pattern |

```typescript
type PermalinkStructure = 'plain' | 'day-name' | 'month-name' | 'numeric' | 'post-name' | 'custom';
```

### **PostFormat**

```typescript
type PostFormat = 'standard' | 'aside' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video';
```

---

## **Relationships & Concepts**

### **Settings Categories**

Settings are organized into logical categories:
* **General**: Core site identity and localization
* **Media**: File handling and AI features
* **Reading**: Content display defaults
* **Writing**: Editor behavior and defaults
* **Discussion**: Comment system configuration
* **Permalinks**: URL structure
* **Theme**: Visual appearance and branding

### **Theme System**

The platform supports pre-defined themes and custom colors:
* Pre-defined themes have fixed color palettes
* Custom theme allows user-defined colors
* `allowUserOverride` lets users choose their own color mode
* Theme changes emit browser events for real-time updates

### **Default Values**

All settings have sensible defaults:
* New installations use default values
* Reset restores all categories to defaults
* Individual categories can be reset independently

---

## **Business Rules**

1. **Admin Only**: Settings can only be modified by Admins
2. **Validation**: All settings values are validated before saving
3. **Theme Events**: Theme changes emit browser events for real-time updates
4. **Defaults**: System provides sensible defaults for all settings
5. **Reset**: Settings can be reset to factory defaults (all or per-category)
6. **Atomic Updates**: Each category is updated atomically

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes (all endpoints)
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| Read settings | Any authenticated user |
| Update settings | Admin only |
| Reset settings | Admin only |

---

## **API Capabilities Overview**

The Settings API allows consumers to:

* **Get all settings** across all categories
* **Get category settings** for specific needs
* **Update category settings** with validation
* **Reset settings** to defaults (all or per-category)

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Settings](../endpoints/cms/settings/README.md) | Settings management | 6 |

Full endpoint details in the [Endpoint Reference](../endpoints/cms/settings/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `settings.updated` | Any setting changed | `{ category, changes }` |
| `settings.theme_changed` | Theme settings changed | `{ theme, colorMode }` |
| `settings.reset` | Settings reset | `{ categories }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `settings.theme_changed` | Browser event for real-time theme update |
| `settings.updated` | May affect content display |

---

## **Error Model**

Standard error envelope (see [API Conventions](../_index.md#error-codes)):

```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    errors?: { [field: string]: string[] }
  }
}
```

### **Domain-Specific Error Codes**

| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_CATEGORY` | 400 | Unknown settings category |
| `VALIDATION_ERROR` | 422 | Invalid setting value |
| `FORBIDDEN` | 403 | Not an admin |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/admin/settings` | Settings dashboard |
| `/admin/settings/general` | General settings |
| `/admin/settings/theme` | Theme customization |
| Application root | Theme application |

### **Service Location**

```
src/services/cms/api/settings.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `getSettings()` | Get all settings |
| `getSettingsCategory(category)` | Get specific category |
| `updateGeneralSettings(data)` | Update general |
| `updateThemeSettings(data)` | Update theme |
| `resetSettings()` | Reset to defaults |

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| All settings | Medium TTL (5min), invalidate on update |
| Theme settings | Long TTL (1hr), invalidate on change |

### **Theme Integration**

Theme settings should be applied:
* On initial page load
* In response to `settings.theme_changed` events
* When user toggles color mode (if allowed)

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| Get settings | Medium (page loads) |
| Update settings | Very Low (admin only) |

### **Rate Limiting**

Standard rate limits apply (see [API Conventions](../_index.md#rate-limiting)).

### **Known Trade-offs**

* Full settings object returned even for single category
* No per-space settings override (global only)

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/settings` | Settings management |
| `/admin/settings/[category]` | Category editing |
| All routes | Theme application |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [CMS](./cms.md) | Content settings affect post behavior |
| [Media](./media.md) | Media settings affect uploads |
| [Discussions](./discussions.md) | Discussion settings affect comments |

---

## **Non-Goals / Explicit Exclusions**

* **User preferences** - Handled by Users domain
* **Per-space overrides** - Global settings only
* **Setting history** - No audit trail of changes
* **Scheduled changes** - Settings apply immediately
* **A/B testing** - No variant support

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Per-space setting overrides
* Settings import/export
* Setting change history
* Custom theme presets

---

## **Open Questions / Notes**

* Consider adding per-space setting overrides
* May need setting change audit trail
* Custom theme presets for easy switching
* Settings backup/restore functionality
