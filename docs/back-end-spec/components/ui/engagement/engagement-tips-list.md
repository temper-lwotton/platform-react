# **Component Specification: EngagementTipsList**

## **1. Component Name**

**`EngagementTipsList`**

## **2. Description**

Displays a prioritized list of actionable tips to improve content engagement.

* Groups tips by priority (high, medium, low)
* Shows impact scores for each tip
* Provides optional suggestions for implementation
* Supports expand/collapse for long lists
* Used within EngagementAnalysis to guide content improvements

## **3. Location**

```
src/components/ui/EngagementTipsList/EngagementTipsList.tsx
```

## **4. Component Type**

**Feature** – Manages show/hide state for tip list expansion.

## **5. Props Interface**

```typescript
interface EngagementTipsListProps {
  tips: EngagementTip[];
  maxVisible?: number;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tips` | `EngagementTip[]` | Yes | - | Array of improvement tips |
| `maxVisible` | `number` | No | `3` | Number of tips shown before expand |

## **7. Data Requirements**

### **External Data Sources**

* Tips data passed from parent `EngagementAnalysis` component

### **EngagementTip Type**

```typescript
// From @/types/engagement
interface EngagementTip {
  id: string;
  title: string;
  description: string;
  suggestion?: string;
  priority: 'high' | 'medium' | 'low';
  impact: number; // Points gained if implemented
}
```

## **8. Internal State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `showAll` | `boolean` | Toggle between showing maxVisible or all tips |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Empty tips array | Returns null | Nothing rendered |
| Tips <= maxVisible | All tips shown, no toggle | No expand button |
| Tips > maxVisible, showAll false | First maxVisible tips + expand button | "Show All Tips (X)" |
| Tips > maxVisible, showAll true | All tips + collapse button | "Show Less" |
| High priority tip | Red/high priority styling | `.priority-high` class |
| Medium priority tip | Yellow/medium priority styling | `.priority-medium` class |
| Low priority tip | Green/low priority styling | `.priority-low` class |
| Tip with suggestion | Suggestion row with comment icon | Conditional rendering |
| Tip without suggestion | No suggestion row | Conditional rendering |

## **10. Dependencies**

### **Child Components**

* `Icon` – Lightbulb and comment icons
* `Button` – Show all/less toggle
* `Badge` – Impact points display

### **Types**

* `EngagementTip` from `@/types/engagement`

### **React**

* `useState` – Expansion state

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `setShowAll(!showAll)` | Click expand/collapse button | Toggles tip list expansion |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `EngagementTipsList.module.scss`

### **Visual States**

* **Header**: Title with lightbulb icon + potential points badge
* **Tip Item**: Title, impact badge, description, optional suggestion
* **Priority Variants**: Different colours for priority levels
* **Toggle Button**: Full-width ghost button

### **CSS Classes**

* `.container` – Main wrapper
* `.header` – Title and potential points row
* `.tips` – Tips list container
* `.tip` – Individual tip item
* `.priority-high`, `.priority-medium`, `.priority-low` – Priority styling
* `.tipHeader` – Title and impact badge row
* `.tipDescription` – Description text
* `.tipSuggestion` – Suggestion with comment icon

## **13. Accessibility Requirements**

* **Keyboard**: Toggle button focusable
* **Screen Reader**: Tips list announced with count
* **Focus**: Maintains focus on toggle after click

### **Improvements Needed**

* Add `role="list"` to tips container
* Add `aria-expanded` to toggle button
* Announce tip count changes on expansion
* Add `aria-label` to impact badges

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty tips array | Returns null | Nothing rendered |
| Tips is null/undefined | Returns null | Early guard |
| Missing tip suggestion | Suggestion row not rendered | Conditional |

## **15. Performance & Lifecycle Notes**

* **Re-renders**: On tips change or showAll toggle
* **Priority Sorting**: Tips sorted by priority before slicing
* **Total Calculation**: Sum of all impacts (not just visible)

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { EngagementTipsList } from '@/components/ui/EngagementTipsList';

<EngagementTipsList
  tips={[
    {
      id: '1',
      title: 'Add a question',
      description: 'Ending with a question increases engagement',
      suggestion: 'Try asking "What do you think?"',
      priority: 'high',
      impact: 15
    }
  ]}
  maxVisible={3}
/>
```

### **Within EngagementAnalysis**

```tsx
// In EngagementAnalysis component
{analysis.tips && analysis.tips.length > 0 && (
  <EngagementTipsList tips={analysis.tips} />
)}
```

## **17. Features Summary**

* Header with lightbulb icon
* Total potential points badge
* Priority-based ordering (high → medium → low)
* Tip title with impact badge
* Description text
* Optional suggestion with comment icon
* Show all/less toggle for long lists
* Priority-based colour styling

## **18. Testing Considerations**

### **Unit Tests**

* Renders correct number of visible tips
* Toggle button shows/hides based on tip count
* Tips sorted by priority
* Total potential calculated correctly
* Suggestion only shown when present
* Toggle updates visible tips

### **Mocking**

* `Icon` and `Badge` components
* Button click handler

### **Edge Cases**

* Empty tips array
* Exactly maxVisible tips
* One more than maxVisible tips
* All same priority
* No tips with suggestions
* Very long tip text

## **19. Out of Scope / Non-Goals**

* **Tip Implementation**: No auto-apply functionality
* **Tip Dismissal**: No way to dismiss tips
* **Progress Tracking**: No tracking of implemented tips
* **Sorting Options**: No user-controlled sorting
* **Filtering**: No priority filtering

## **20. Related Components & System Context**

### **Parent Component**

* `EngagementAnalysis` – Primary parent

### **Sibling Components**

* `EngagementScoreBar` – Score breakdown
* `EngagementPredictions` – Performance predictions

### **Internal Sub-Components**

* `TipItem` – Renders individual tip

### **Typical Usage Location**

* Middle of EngagementAnalysis card

## **21. Open Questions / Notes**

* Consider adding tip dismissal
* May want "apply" action for auto-suggestions
* Could track which tips were implemented
* Consider animation for expand/collapse

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Mixed priority tips | 5 tips, varied priorities | Base state, collapsed |
| `Expanded` | All tips visible | `showAll: true` | Full list |
| `FewTips` | Under maxVisible | 2 tips | No toggle button |
| `AllHigh` | All high priority | All 'high' | Red styling |
| `NoSuggestions` | Tips without suggestions | `suggestion: undefined` | No suggestion rows |
| `SingleTip` | One tip only | Single item array | Minimal state |
| `ManyTips` | Long list | 10+ tips | Scroll behaviour |

### **Controls (Args) Required**

* `tips` (EngagementTip[]) – array control
* `maxVisible` (number) – controllable

### **Mocking Requirements**

* **Tip data**: Realistic EngagementTip objects
* **Actions**: Log toggle clicks

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify toggle button has accessible name
* Check priority colours have sufficient contrast
* Verify list structure is accessible

### **Interaction Tests**

* Click toggle expands list
* Click toggle again collapses list
* Expanded state shows all tips
* Collapsed state shows maxVisible tips
