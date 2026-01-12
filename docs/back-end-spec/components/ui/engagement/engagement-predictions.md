# **Component Specification: EngagementPredictions**

## **1. Component Name**

**`EngagementPredictions`**

## **2. Description**

Displays expected performance metrics for content with visual level indicators.

* Shows predicted views (low/medium/high)
* Shows predicted replies (low/medium/high)
* Shows expected engagement rate percentage
* Uses emoji icons for visual level indication
* Used within EngagementAnalysis to show predictions

## **3. Location**

```
src/components/ui/EngagementPredictions/EngagementPredictions.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component for prediction display.

## **5. Props Interface**

```typescript
interface EngagementPredictionsProps {
  predictions: EngagementPredictionsType;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `predictions` | `EngagementPredictionsType` | Yes | - | Prediction data object |

## **7. Data Requirements**

### **External Data Sources**

* Predictions data passed from parent `EngagementAnalysis` component

### **EngagementPredictionsType**

```typescript
// From @/types/engagement
interface EngagementPredictionsType {
  expectedViews: 'low' | 'medium' | 'high';
  expectedReplies: 'low' | 'medium' | 'high';
  expectedEngagementRate: number; // Percentage
}
```

## **8. Internal State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| - | - | No internal state – stateless component |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Views: high | "🔥 High views" | Fire emoji |
| Views: medium | "📊 Medium views" | Chart emoji |
| Views: low | "📉 Low views" | Chart down emoji |
| Replies: high | "🔥 High replies" | Fire emoji |
| Replies: medium | "📊 Medium replies" | Chart emoji |
| Replies: low | "📉 Low replies" | Chart down emoji |
| Engagement rate | "~X% engagement" | Percentage display |

## **10. Dependencies**

### **Child Components**

* `Badge` – Level indicators (imported but not currently used in render)

### **Directives**

* `'use client'` – Client component

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| - | - | No events – static display |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `EngagementPredictions.module.scss`

### **Visual States**

* **Container**: Horizontal row with title
* **Items**: Icon + label pairs separated by bullets
* **Level Styling**: `.level-high`, `.level-medium`, `.level-low`

### **CSS Classes**

* `.container` – Main wrapper
* `.title` – "Expected Performance" heading
* `.items` – Horizontal item row
* `.item` – Individual prediction item
* `.separator` – Bullet separator
* `.icon` – Emoji container
* `.label` – Text label

## **13. Accessibility Requirements**

* **Screen Reader**: Level labels provide text context
* **Semantic**: Uses semantic heading for title

### **Improvements Needed**

* Add `aria-label` to container describing overall predictions
* Consider hiding decorative emojis from screen readers
* Add `role="list"` structure for prediction items

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Missing predictions | Component won't render properly | Required prop |
| Invalid level value | Would fail switch statement | TypeScript prevents |

## **15. Performance & Lifecycle Notes**

* **Re-renders**: Only on predictions prop change
* **No Side Effects**: Pure render component
* **Minimal DOM**: Simple structure

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { EngagementPredictions } from '@/components/ui/EngagementPredictions';

<EngagementPredictions
  predictions={{
    expectedViews: 'high',
    expectedReplies: 'medium',
    expectedEngagementRate: 12
  }}
/>
```

### **Within EngagementAnalysis**

```tsx
// In EngagementAnalysis component
<EngagementPredictions predictions={analysis.predictions} />
```

## **17. Features Summary**

* "Expected Performance" title
* Views prediction with level icon
* Replies prediction with level icon
* Engagement rate percentage
* Level-based colour styling
* Emoji indicators (🔥📊📉)

## **18. Testing Considerations**

### **Unit Tests**

* Renders all three prediction metrics
* Level label capitalizes correctly
* Correct emoji for each level
* Engagement rate displays with ~% format

### **Mocking**

* None required – pure render

### **Edge Cases**

* All predictions high
* All predictions low
* Mixed predictions
* Engagement rate 0
* Engagement rate 100

## **19. Out of Scope / Non-Goals**

* **Detailed Breakdown**: No drill-down into predictions
* **Historical Comparison**: No comparison to past content
* **Confidence Intervals**: No uncertainty display
* **Tooltips**: No additional explanation on hover

## **20. Related Components & System Context**

### **Parent Component**

* `EngagementAnalysis` – Primary parent

### **Sibling Components**

* `EngagementScoreBar` – Score breakdown
* `EngagementTipsList` – Improvement tips

### **Typical Usage Location**

* Bottom of EngagementAnalysis card

## **21. Open Questions / Notes**

* Consider adding tooltips explaining each prediction
* May want confidence indicators
* Could add historical comparison

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Mixed levels | Views high, replies medium | Base state |
| `AllHigh` | All predictions high | All 'high' | Fire emojis |
| `AllMedium` | All predictions medium | All 'medium' | Chart emojis |
| `AllLow` | All predictions low | All 'low' | Chart down emojis |
| `HighEngagement` | High engagement rate | `expectedEngagementRate: 25` | High percentage |
| `LowEngagement` | Low engagement rate | `expectedEngagementRate: 2` | Low percentage |

### **Controls (Args) Required**

* `predictions.expectedViews` (select) – low/medium/high
* `predictions.expectedReplies` (select) – low/medium/high
* `predictions.expectedEngagementRate` (number) – percentage

### **Mocking Requirements**

* **None** – Pure presentational component

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify text labels are readable
* Check colour contrast on level styling

### **Interaction Tests**

* None – static display component
