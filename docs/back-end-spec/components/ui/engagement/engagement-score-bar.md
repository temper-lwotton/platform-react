# **Component Specification: EngagementScoreBar**

## **1. Component Name**

**`EngagementScoreBar`**

## **2. Description**

Displays individual engagement score categories as labeled bars with numeric values and visual fill indicators.

* Shows Clarity, Structure, and Appeal scores
* Each score has a label, numeric value, and progress bar
* Colour-coded by score level (high/medium/low)
* Used within EngagementAnalysis for score breakdown

## **3. Location**

```
src/components/ui/EngagementScoreBar/EngagementScoreBar.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component for score display.

## **5. Props Interface**

```typescript
interface EngagementScoreBarProps {
  scores: EngagementScores;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `scores` | `EngagementScores` | Yes | - | Score values for each category |

## **7. Data Requirements**

### **External Data Sources**

* Scores data passed from parent `EngagementAnalysis` component

### **EngagementScores Type**

```typescript
// From @/types/engagement
interface EngagementScores {
  overall: number; // 0-100 (not displayed in this component)
  clarity: number; // 0-100
  structure: number; // 0-100
  appeal: number; // 0-100
}
```

## **8. Internal State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| - | - | No internal state – stateless component |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Score >= 80 | Green styling (high) | `.level-high` class |
| Score 60-79 | Yellow styling (medium) | `.level-medium` class |
| Score < 60 | Red styling (low) | `.level-low` class |
| Any score | Progress bar width = score% | Inline style |

### **Categories Displayed**

| Category | Description |
|----------|-------------|
| Clarity | How clear and understandable the content is |
| Structure | Organization and formatting quality |
| Appeal | Visual and emotional engagement potential |

## **10. Dependencies**

### **Child Components**

* None – uses internal `ScoreItem` sub-component

### **Types**

* `EngagementScores` from `@/types/engagement`

### **Directives**

* `'use client'` – Client component

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| - | - | No events – static display |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `EngagementScoreBar.module.scss`

### **Visual States**

* **Score Item**: Label + value + bar in a row
* **Bar Fill**: Width proportional to score value
* **Level High**: Green colour (score >= 80)
* **Level Medium**: Yellow colour (score 60-79)
* **Level Low**: Red colour (score < 60)

### **CSS Classes**

* `.scores` – Container for all score items
* `.item` – Individual score row
* `.label` – Category label text
* `.value` – Numeric score value
* `.bar` – Progress bar container
* `.barFill` – Filled portion of bar
* `.level-high`, `.level-medium`, `.level-low` – Colour variants

## **13. Accessibility Requirements**

* **Screen Reader**: Label and value text readable
* **Semantic**: Uses descriptive labels for each category

### **Improvements Needed**

* Add `role="progressbar"` to bar elements
* Add `aria-valuenow`, `aria-valuemin`, `aria-valuemax` to bars
* Add `aria-label` combining category and score

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Missing scores | Component won't render properly | Required prop |
| Score out of range | Bar may overflow/underflow | Clamp in CSS |

## **15. Performance & Lifecycle Notes**

* **Re-renders**: Only on scores prop change
* **No Side Effects**: Pure render component
* **Minimal DOM**: Three score items

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { EngagementScoreBar } from '@/components/ui/EngagementScoreBar';

<EngagementScoreBar
  scores={{
    overall: 75,
    clarity: 80,
    structure: 70,
    appeal: 75
  }}
/>
```

### **Within EngagementAnalysis**

```tsx
// In EngagementAnalysis component
<EngagementScoreBar scores={analysis.scores} />
```

## **17. Features Summary**

* Three score categories: Clarity, Structure, Appeal
* Numeric value display for each score
* Progress bar visualization
* Colour coding based on score level
* Responsive bar width based on score percentage

## **18. Testing Considerations**

### **Unit Tests**

* Renders all three categories
* Score values display correctly
* Bar widths match score percentages
* Correct level class applied for each threshold

### **Mocking**

* None required – pure render

### **Edge Cases**

* All scores high (80+)
* All scores low (<60)
* Mixed score levels
* Score exactly 60 (medium boundary)
* Score exactly 80 (high boundary)
* Score 0 (minimum)
* Score 100 (maximum)

## **19. Out of Scope / Non-Goals**

* **Overall Score**: Not displayed (shown separately in parent)
* **Animation**: No animated bar fills
* **Tooltips**: No additional explanation on hover
* **Score History**: No comparison to previous scores

## **20. Related Components & System Context**

### **Parent Component**

* `EngagementAnalysis` – Primary parent

### **Sibling Components**

* `EngagementTipsList` – Improvement tips
* `EngagementPredictions` – Performance predictions

### **Internal Sub-Components**

* `ScoreItem` – Renders individual score row

### **Typical Usage Location**

* Middle of EngagementAnalysis card

## **21. Open Questions / Notes**

* Consider adding tooltips explaining each category
* May want animation on initial render
* Could show change indicators vs previous analysis

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Mixed scores | Varied levels | Base state |
| `AllHigh` | All scores 80+ | All high level | Green bars |
| `AllMedium` | All scores 60-79 | All medium level | Yellow bars |
| `AllLow` | All scores <60 | All low level | Red bars |
| `Perfect` | All scores 100 | Maximum values | Full bars |
| `Minimum` | All scores 0 | Minimum values | Empty bars |
| `BoundaryScores` | Scores at 60, 80 | Boundary cases | Level transitions |

### **Controls (Args) Required**

* `scores.clarity` (number) – 0-100 slider
* `scores.structure` (number) – 0-100 slider
* `scores.appeal` (number) – 0-100 slider

### **Mocking Requirements**

* **None** – Pure presentational component

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify progress bars have accessible names
* Check colour contrast at all levels
* Verify labels are readable

### **Interaction Tests**

* None – static display component
