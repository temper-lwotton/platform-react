# Component: CategoriesPanel

## Description
Taxonomy and term selection panel for assigning categories, tags, and other taxonomy terms to content. Features a taxonomy selector dropdown and checkbox list for term selection.

## Location
`src/components/cms/shared/CategoriesPanel.tsx`

## Props Interface

```typescript
interface CategoriesPanelProps {
  selectedTerms: number[];
  onChange: (terms: number[]) => void;
}
```

## Data Requirements

### Taxonomy Type
```typescript
// From taxonomy hooks
interface Taxonomy {
  id: number;
  name: string;
  singularLabel: string;
  pluralLabel: string;
  isActive: boolean;
}
```

### Term Type
```typescript
// From terms hooks
interface Term {
  id: number;
  name: string;
  slug: string;
  count: number;
  taxonomyId: number;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `selectedTaxonomy` | `number \| null` | Currently selected taxonomy |

## Dependencies

### Hooks
- `useTaxonomies` - Fetch all active taxonomies
- `useTerms` - Fetch terms for selected taxonomy

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleTermToggle` | Checkbox change | Adds/removes term from selection |
| `setSelectedTaxonomy` | Dropdown change | Changes active taxonomy |

## Styling
- **CSS Module**: `CategoriesPanel.module.scss`

## Usage Example

```tsx
import { CategoriesPanel } from '@/components/cms/shared/CategoriesPanel';

<CategoriesPanel
  selectedTerms={selectedTermIds}
  onChange={setSelectedTermIds}
/>
```

## Features
- Taxonomy selector dropdown
- Auto-selects first taxonomy on load
- Checkbox list of terms
- Term count display in parentheses
- Loading state for terms
- Empty state messaging
- Multi-taxonomy support

## Panel Sections

### Taxonomy Selector
- Dropdown showing all active taxonomies
- Uses `pluralLabel` for display
- Auto-selects first taxonomy when none selected

### Terms List
- Checkbox for each term in selected taxonomy
- Shows term name and usage count
- Supports multi-selection
- Loading indicator while fetching
- Empty states:
  - "Loading terms..." when fetching
  - "No terms available" when taxonomy has no terms
  - "Select a taxonomy" when none selected

## Query Configuration

```typescript
// Taxonomies query
useTaxonomies({ active: true })

// Terms query (depends on selected taxonomy)
useTerms(selectedTaxonomy || 0)
```

## Related Components
- Parent: `PostEditor`, `PageEditor`
- See also: `MetaFieldsPanel`
