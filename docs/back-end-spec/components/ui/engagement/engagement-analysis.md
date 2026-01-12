# **Component Specification: EngagementAnalysis**

## **1. Component Name**

**`EngagementAnalysis`**

## **2. Description**

A card component that displays AI-powered engagement analysis for content.

* Shows overall engagement score with visual circle indicator
* Displays category breakdowns (Clarity, Structure, Appeal)
* Lists actionable improvement tips
* Predicts expected performance metrics
* Used in content editors to preview engagement potential

## **3. Location**

```
src/components/ui/EngagementAnalysis/EngagementAnalysis.tsx
```

## **4. Component Type**

**UI** – Orchestrates child components based on analysis data and loading/error states.

## **5. Props Interface**

```typescript
interface EngagementAnalysisProps {
  analysis: EngagementAnalysisType | null;
  isLoading: boolean;
  error?: string;
  onRetry?: () => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `analysis` | `EngagementAnalysisType \| null` | Yes | - | Analysis data object |
| `isLoading` | `boolean` | Yes | - | Shows loading state |
| `error` | `string` | No | - | Error message to display |
| `onRetry` | `() => void` | No | - | Callback for retry button on error |

## **7. Data Requirements**

### **External Data Sources**

* Analysis data from AI engagement analysis API

### **EngagementAnalysisType**

```typescript
// From @/types/engagement
interface EngagementAnalysisType {
  scores: {
    overall: number; // 0-100
    clarity: number;
    structure: number;
    appeal: number;
  };
  tips: EngagementTip[];
  predictions: {
    expectedViews: 'low' | 'medium' | 'high';
    expectedReplies: 'low' | 'medium' | 'high';
    expectedEngagementRate: number;
  };
}
```

## **8. Internal State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| - | - | No internal state – controlled by props |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `isLoading === true` | Spinner with "Analyzing..." | Loading card |
| `error` present | Error message + retry button | Error card |
| `analysis === null` | Nothing rendered | Returns null |
| Valid analysis | Full analysis card | Header + scores + tips + predictions |
| Score >= 80 | Green high level styling | "Excellent!" message |
| Score 60-79 | Yellow medium level styling | "Good!" message |
| Score < 60 | Red low level styling | "Could benefit..." message |
| No tips | Tips section hidden | Conditional rendering |

## **10. Dependencies**

### **Child Components**

* `EngagementScoreBar` – Category score breakdown display
* `EngagementTipsList` – Improvement tips list
* `EngagementPredictions` – Expected performance metrics
* `Button` – Retry action button

### **Types**

* `EngagementAnalysis` type from `@/types/engagement`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onRetry` | Click retry button | Re-fetches analysis (parent handles) |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `EngagementAnalysis.module.scss`

### **Visual States**

* **Loading**: Centered spinner with message
* **Error**: Error message with optional retry button
* **Score Circle**: Coloured circle with score value
* **Score Levels**: High (green), Medium (yellow), Low (red)

### **CSS Classes**

* `.card` – Main container
* `.loading` – Loading state container
* `.error` – Error state container
* `.scoreCircle` – Overall score display
* `.level-high`, `.level-medium`, `.level-low` – Score level colours

## **13. Accessibility Requirements**

* **Screen Reader**: Score value and level announced
* **Focus**: Retry button focusable
* **Semantic**: Uses header element for title

### **Improvements Needed**

* Add `role="status"` to loading state
* Add `role="alert"` to error state
* Announce score level to screen readers
* Add `aria-label` to score circle

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| `error` prop set | Error card with message | Shows retry button if `onRetry` provided |
| `analysis` null (not loading) | Returns null | Nothing rendered |
| No tips in analysis | Tips section skipped | Conditional render |

## **15. Performance & Lifecycle Notes**

* **Re-renders**: On prop changes only
* **No Side Effects**: Pure render based on props
* **Child Components**: Only render when analysis available

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { EngagementAnalysis } from '@/components/ui/EngagementAnalysis';

<EngagementAnalysis
  analysis={analysisData}
  isLoading={isPending}
  error={error?.message}
  onRetry={() => refetch()}
/>
```

### **In Post Editor**

```tsx
<aside className={styles.sidebar}>
  <EngagementAnalysis
    analysis={engagement.data}
    isLoading={engagement.isLoading}
    error={engagement.error?.message}
    onRetry={engagement.refetch}
  />
</aside>
```

## **17. Features Summary**

* Overall score circle with colour coding
* Contextual score message based on level
* Category scores (Clarity, Structure, Appeal)
* Improvement tips section
* Expected performance predictions
* Loading spinner state
* Error state with retry button

## **18. Testing Considerations**

### **Unit Tests**

* Loading state renders correctly
* Error state shows message and retry button
* Null analysis returns null
* Score level calculated correctly
* Score message matches level
* Child components receive correct props

### **Mocking**

* Child components (EngagementScoreBar, EngagementTipsList, EngagementPredictions)
* `onRetry` callback

### **Edge Cases**

* Score exactly 60 (medium)
* Score exactly 80 (high)
* Score 0 (edge minimum)
* Score 100 (edge maximum)
* Empty tips array
* Missing predictions

## **19. Out of Scope / Non-Goals**

* **API Calls**: Parent handles data fetching
* **Caching**: No internal caching of results
* **Animation**: No animated score changes
* **Detailed Breakdown**: Individual tip details not expandable
* **History**: No comparison to previous analyses

## **20. Related Components & System Context**

### **Child Components**

* `EngagementScoreBar` – Score breakdown
* `EngagementTipsList` – Tips display
* `EngagementPredictions` – Predictions display

### **Used By**

* `PostEditor` – Shows analysis in sidebar
* Content creation pages

### **Typical Usage Location**

* Editor sidebars for content analysis

## **21. Open Questions / Notes**

* Consider adding animation for score changes
* May want history/comparison feature
* Could expand to show more detailed breakdowns
* Consider real-time analysis as user types

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | High score analysis | `overall: 85` | Green styling |
| `MediumScore` | Medium score | `overall: 70` | Yellow styling |
| `LowScore` | Low score | `overall: 45` | Red styling |
| `Loading` | Fetching analysis | `isLoading: true` | Spinner visible |
| `Error` | Analysis failed | `error: "Failed..."` | Error + retry |
| `ErrorNoRetry` | Error without retry | No `onRetry` | No retry button |
| `NoTips` | Analysis without tips | `tips: []` | Tips section hidden |
| `Null` | No analysis yet | `analysis: null` | Nothing rendered |

### **Controls (Args) Required**

* `isLoading` (boolean) – controllable
* `error` (string) – controllable
* `analysis.scores.overall` (number) – affects score display

### **Mocking Requirements**

* **Analysis data**: Realistic EngagementAnalysisType objects
* **Child components**: May need to mock or use actual
* **onRetry**: Action logger

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify loading state has appropriate role
* Check error state is announced
* Verify retry button is accessible

### **Interaction Tests**

* Click retry button triggers callback
* Loading state renders spinner
* Error state shows message
