# Component: PostEditor

## Description
Full-featured post editing interface with Lexical rich text editor, tabbed sidebar panels for publish settings, media, content organization, SEO, and version history. Supports both new post creation and editing existing posts with autosave functionality.

## Location
`src/components/cms/posts/PostEditor.tsx`

## Props Interface

```typescript
interface PostEditorProps {
  postId?: number;
}
```

## Data Requirements

### Post Type
```typescript
// From @/types/cms
interface Post {
  id: number;
  title: string;
  slug: string;
  isPublished: boolean;
  publishedAt: string | null;
  hasUnpublishedChanges: boolean;
  featuredImage?: string;
  postType: {
    id: number;
    name: string;
    singularLabel: string;
  };
  terms: Array<{ id: number; name: string }>;
  latestVersion?: PostVersion;
}
```

### LexicalEditorState Type
```typescript
interface LexicalEditorState {
  root: {
    children: any[];
    direction: 'ltr' | 'rtl';
    format: string;
    indent: number;
    type: 'root';
    version: number;
  };
}
```

### SEOMetadata Type
```typescript
// From @/services/cms/types/seo
interface SEOMetadata {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `title` | `string` | Post title |
| `slug` | `string` | URL slug |
| `content` | `string` | Plain text content |
| `contentHtml` | `string` | HTML content from editor |
| `selectedPostType` | `number \| null` | Selected post type ID |
| `featuredImage` | `string` | Featured image URL |
| `selectedTerms` | `number[]` | Selected term IDs |
| `metaFields` | `Record<string, any>` | Custom meta fields |
| `seoData` | `SEOMetadata` | SEO configuration |
| `isDirty` | `boolean` | Unsaved changes flag |
| `lastSaved` | `Date \| null` | Last save timestamp |
| `comparisonVersions` | `{ v1: number; v2: number } \| null` | Version comparison state |
| `showBlockPicker` | `boolean` | Block template picker visibility |

## Dependencies

### Components
- `LexicalEditor` - Rich text editing
- `PublishPanel` - Publish controls
- `FeaturedImagePanel` - Image selection
- `CategoriesPanel` - Taxonomy terms
- `MetaFieldsPanel` - Custom fields
- `SEOPanel` - SEO configuration
- `VersionHistoryPanel` - Version management
- `VersionComparisonModal` - Version diff viewer
- `BlockTemplatePicker` - Block template insertion
- `Icon` - UI icons

### Hooks
- `useCreatePost` - Create new post
- `useUpdatePost` - Update existing post
- `usePost` - Fetch post data
- `useCreateVersion` - Create new version
- `useAutosaveVersion` - Autosave content
- `usePostTypes` - Fetch post types

### Libraries
- `@radix-ui/react-tabs` - Tabbed interface
- `next/navigation` - useRouter

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleContentChange` | Editor change | Updates content and HTML |
| `handleAutosave` | 30-second interval | Saves autosave version |
| `handleSaveDraft` | Save Draft button | Creates version or new post |
| `handlePublish` | Publish button | Saves and publishes |
| `handleInsertBlock` | Block picker selection | Inserts block template |

## Styling
- **CSS Module**: `PostEditor.module.scss`

## Usage Example

```tsx
import { PostEditor } from '@/components/cms/posts/PostEditor';

// New post
<PostEditor />

// Edit existing post
<PostEditor postId={123} />
```

## Features
- Title input field
- Lexical rich text editor
- Block template insertion button
- Tabbed sidebar with 5 panels:
  - Publish (status, slug, actions)
  - Media (featured image)
  - Content (categories, custom fields)
  - SEO (meta tags, social media)
  - History (versions, comparison) - edit mode only
- Auto-generated slug from title (new posts)
- Autosave every 30 seconds
- Dirty state tracking
- Last saved timestamp
- Version comparison modal
- Redirect to edit page after new post creation

## Layout Structure

### Main Area
- Title input (full width)
- Editor toolbar with "Insert Block Template" button
- LexicalEditor component

### Sidebar (Tabbed)
- **Publish Tab**: PublishPanel
- **Media Tab**: FeaturedImagePanel
- **Content Tab**: CategoriesPanel + MetaFieldsPanel
- **SEO Tab**: SEOPanel
- **History Tab** (edit mode): VersionHistoryPanel

### Modals
- VersionComparisonModal (when comparing versions)
- BlockTemplatePicker (when inserting blocks)

## Autosave Behavior
- Triggers every 30 seconds when:
  - In edit mode (`isEditMode` is true)
  - Has unsaved changes (`isDirty` is true)
  - Has a valid post ID
- Creates autosave version via `useAutosaveVersion`
- Updates `lastSaved` timestamp on success

## Auto-Generated Slug
- Only for new posts (not edit mode)
- Converts title to lowercase
- Replaces non-alphanumeric characters with hyphens
- Removes leading/trailing hyphens

## Related Components
- Parent: Admin layout
- Children: All sidebar panel components
- See also: `PostsList`, `PageEditor`
