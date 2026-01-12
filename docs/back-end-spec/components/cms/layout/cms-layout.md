# Component: CMSLayout

## Description
The main layout wrapper for all CMS admin pages. Provides sidebar navigation, header, and content area with collapsible sidebar support.

## Location
`src/components/cms/layout/CMSLayout.tsx`

## Props Interface

```typescript
interface CMSLayoutProps {
  children: React.ReactNode;
}
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | Yes | - | Page content to render |

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `sidebarOpen` | `boolean` | Sidebar visibility toggle |

## Dependencies

### Child Components
- `CMSSidebar` - Navigation sidebar
- `CMSHeader` - Top header bar

## Styling
- **CSS Module**: `CMSLayout.module.scss`
- **Layout**: Fixed sidebar + flexible content area

## Usage Example

```tsx
import { CMSLayout } from '@/components/cms/layout';

export default function AdminPage() {
  return (
    <CMSLayout>
      <h1>Dashboard</h1>
      <p>Admin content here</p>
    </CMSLayout>
  );
}
```

## Layout Structure

```
┌─────────────────────────────────────────────┐
│ CMSSidebar │           CMSHeader            │
│            ├────────────────────────────────┤
│            │                                │
│  Nav       │         Page Content           │
│  Items     │         (children)             │
│            │                                │
└─────────────────────────────────────────────┘
```

## Features
- Collapsible sidebar (toggle via header or sidebar button)
- Fixed position sidebar
- Scrollable content area
- Responsive layout

## Related Components
- Children: `CMSSidebar`, `CMSHeader`
- Used by: All `/admin/*` pages
