# Component: ContentComposer

## Description
Full-featured content creation interface with SEO scoring, AI suggestions, category/tag management, and scheduling capabilities. Supports edit and preview modes.

## Location
`src/components/cms/content/ContentComposer.tsx`

## Props Interface
None - self-contained composer component.

## Data Requirements

### Post Data
```typescript
interface PostData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
  };
}
```

### AI Suggestion Type
```typescript
interface AIsuggestion {
  type: 'grammar' | 'style' | 'seo' | 'engagement';
  title: string;
  description: string;
  before?: string;
  after?: string;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `currentView` | `'edit' \| 'preview'` | Editor/preview toggle |
| `showScheduler` | `boolean` | Schedule modal visibility |
| `postData` | `PostData` | Form data |
| `currentTag` | `string` | Tag input value |

## Dependencies

### Icons
- `lucide-react` - ArrowLeft, Save, Send, Calendar, Eye, Sparkles, Image, Link, Tag, Folder, User, CheckCircle, AlertCircle, TrendingUp, Target, Zap, Clock

## Styling
- **CSS Module**: `ContentComposer.module.scss`

## Features
- Edit/Preview mode toggle
- Title input with character count and validation
- Content textarea with toolbar
- Word/character count
- Excerpt field
- SEO score display (0-100)
- SEO fields (meta title, description, focus keyword)
- Category dropdown
- Tag management
- Featured image upload/URL
- AI suggestions panel
- Schedule modal with suggested times
- Save Draft / Schedule / Publish actions

## Layout Structure

### Header
- Back button
- Title and subtitle
- View toggle (Edit/Preview)
- Action buttons (Save Draft, Schedule, Publish)

### Main Editor Column
- Title input with character count
- Content editor with toolbar
- Excerpt textarea

### Preview Mode
- Rendered post preview
- Featured image
- Metadata display
- Tags display

### Sidebar
1. **SEO Score Card**
   - Circular score indicator
   - Color-coded (green/yellow/red)
   - Meta title input (60 char limit)
   - Meta description textarea (160 char limit)
   - Focus keyword input

2. **Category Card**
   - Category dropdown selector

3. **Tags Card**
   - Tag input with Add button
   - Tag list with remove buttons

4. **Featured Image Card**
   - Image preview or upload placeholder
   - URL input option

5. **AI Suggestions Card**
   - Suggestion type badges
   - Suggestion descriptions
   - Apply buttons

### Schedule Modal
- Datetime picker
- AI-suggested optimal times
- Cancel/Schedule buttons

## SEO Score Calculation
```typescript
const calculateSEOScore = () => {
  let score = 0;
  if (postData.seo.metaTitle) score += 25;
  if (postData.seo.metaDescription) score += 25;
  if (postData.seo.focusKeyword) score += 25;
  if (postData.title.length > 30 && postData.title.length < 60) score += 15;
  if (postData.excerpt) score += 10;
  return score;
};
```

## Related Components
- Parent: Admin layout
- See also: `PostEditor`, `ContentDashboard`
