# Component: SEOPanel

## Description
Comprehensive SEO configuration panel with real-time analysis, meta tag configuration, and social media optimization. Features tabbed interface for Basic SEO and Social Media settings with live SEO score feedback.

## Location
`src/components/cms/shared/SEOPanel.tsx`

## Props Interface

```typescript
interface SEOPanelProps {
  postTitle: string;
  postContent: string;
  seoData: SEOMetadata;
  onChange: (seo: SEOMetadata) => void;
}
```

## Data Requirements

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

### SEO Analysis Response
```typescript
// From useSEOAnalysis hook
interface SEOAnalysisResult {
  score: number;
  keywords: {
    density: number;
  };
  readability: {
    score: number;
  };
  issues: Array<{
    id: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
  }>;
  suggestions: Array<{
    id: string;
    message: string;
    impact: 'high' | 'medium' | 'low';
  }>;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `activeTab` | `'basic' \| 'social'` | Current tab selection |
| `localData` | `SEOMetadata` | Local form state |

## Dependencies

### Hooks
- `useSEOAnalysis` - Real-time SEO analysis based on content

### Icons
- `lucide-react` - Search, TrendingUp, Globe, Twitter, AlertCircle, CheckCircle2

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleChange` | Any field change | Updates local state and calls onChange |
| `setActiveTab` | Tab click | Switches between Basic SEO and Social Media |

## Styling
- **CSS Module**: `SEOPanel.module.scss`

## Usage Example

```tsx
import { SEOPanel } from '@/components/cms/shared/SEOPanel';

<SEOPanel
  postTitle="My Blog Post"
  postContent="<p>Content here...</p>"
  seoData={seoMetadata}
  onChange={setSeoMetadata}
/>
```

## Features
- Real-time SEO score with color-coded indicator (green/yellow/red)
- Keyword density and readability score display
- Tabbed interface (Basic SEO / Social Media)
- Character counters for meta title and description
- Field hints with recommendations
- SEO issues list with severity indicators
- Suggestions list with impact levels
- Fallback values from post title

## Form Sections

### SEO Score Card
- Circular score display (0-100)
- Color-coded: green (80+), yellow (60-79), red (<60)
- Keyword density percentage
- Readability score

### Basic SEO Tab
- **Meta Title**: Text input (max 60 chars) with character counter
- **Meta Description**: Textarea (max 160 chars) with character counter
- **Focus Keyword**: Target keyword/phrase input
- **Canonical URL**: URL input for duplicate content prevention
- **No Index**: Checkbox to hide from search engines
- **No Follow**: Checkbox to prevent link following

### Social Media Tab
- **Open Graph Section**:
  - OG Title
  - OG Description
  - OG Image URL (recommended: 1200x630px)
- **Twitter Card Section**:
  - Card Type: Summary or Summary Large Image
  - Twitter Title
  - Twitter Description
  - Twitter Image URL

### Issues Section
- Lists SEO problems with severity (error/warning/info)
- Displayed when analysis finds issues

### Suggestions Section
- Improvement recommendations with impact level
- Displayed when analysis has suggestions

## Related Components
- Parent: `PostEditor`, `PageEditor`
- See also: Permalink configuration
