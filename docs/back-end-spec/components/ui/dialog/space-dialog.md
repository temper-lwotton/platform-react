# **Component Specification: SpaceDialog**

## **1. Component Name**

**`SpaceDialog`**

## **2. Description**

A basic dialog component built on Radix Dialog primitives for accessible modal interactions.

* Provides a trigger button that opens a modal dialog
* Includes overlay backdrop and centered content panel
* Renders title, optional description, and close button
* Fully accessible with keyboard navigation and screen reader support via Radix

## **3. Location**

```
src/components/ui/SpaceDialog/SpaceDialog.tsx
```

## **4. Component Type**

**UI** – Presentational wrapper around Radix Dialog primitives with no internal state.

## **5. Props Interface**

```typescript
interface SpaceDialogProps {
  triggerLabel: string;
  title: string;
  description?: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `triggerLabel` | `string` | Yes | - | Text displayed on the button that opens the dialog |
| `title` | `string` | Yes | - | Dialog title displayed in the header |
| `description` | `string` | No | - | Optional description text below the title |

## **7. Data Requirements**

### **External Data Sources**

* None – purely presentational component with content passed via props

## **8. Internal State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| - | - | No internal state – open/close managed by Radix Dialog |

*Radix Dialog.Root manages the open/closed state internally.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default (closed) | Only trigger button visible | Dialog content not in DOM |
| Dialog open | Overlay + content panel visible | Portal renders to body |
| With description | Title and description shown | Description below title |
| Without description | Title only | Description element not rendered |
| Click overlay | Dialog closes | Radix default behaviour |
| Click close button | Dialog closes | Explicit close action |
| Press Escape | Dialog closes | Radix keyboard handling |

## **10. Dependencies**

### **Radix UI**

* `@radix-ui/react-dialog` – All dialog primitives:
  * `Dialog.Root` – State container
  * `Dialog.Trigger` – Button to open
  * `Dialog.Portal` – Renders to document body
  * `Dialog.Overlay` – Backdrop overlay
  * `Dialog.Content` – Main content container
  * `Dialog.Title` – Accessible title
  * `Dialog.Description` – Accessible description
  * `Dialog.Close` – Close button

### **Directives**

* `'use client'` – Client component for Radix interactivity

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| Open dialog | Click trigger button | Dialog opens, focus moves to content |
| Close dialog | Click close/overlay or press Escape | Dialog closes, focus returns to trigger |

*No custom callbacks exposed – relies on Radix internal event handling.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `SpaceDialog.module.scss`

### **Styled Elements**

* `styles.overlay` – Semi-transparent backdrop
* `styles.content` – Centered content panel

### **Visual States**

* **Overlay**: Dark semi-transparent backdrop covering viewport
* **Content Panel**: White/light centered modal box
* **Trigger Button**: Default button styling (unstyled in current implementation)
* **Close Button**: Default button styling (unstyled in current implementation)

## **13. Accessibility Requirements**

* **Keyboard**:
  * Tab cycles through focusable elements within dialog
  * Escape closes dialog
  * Focus trapped inside dialog when open
* **Focus Management**:
  * Focus moves to content when opened
  * Focus returns to trigger when closed
* **Screen Reader**:
  * Dialog announced when opened
  * Title and description read via ARIA
* **ARIA**: Radix provides all required ARIA attributes automatically

### **Improvements Needed**

* Style the trigger button for better visual affordance
* Style the close button (currently plain text "Close")
* Consider adding an X icon for close button
* Add visible focus indicators to buttons

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty triggerLabel | Empty button rendered | Button still clickable |
| Empty title | Empty title element | Dialog still functional |
| Missing description | Description element not rendered | Conditional rendering |

## **15. Performance & Lifecycle Notes**

* **Portal Rendering**: Dialog content renders to document body via Portal
* **Lazy Mounting**: Content only mounts when dialog opens (Radix default)
* **No Re-renders**: No internal state means minimal re-renders
* **Animation**: Can add CSS animations to overlay/content for open/close

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { SpaceDialog } from '@/components/ui/SpaceDialog';

<SpaceDialog
  triggerLabel="Open Settings"
  title="Space Settings"
  description="Configure your space preferences"
/>
```

### **Without Description**

```tsx
<SpaceDialog
  triggerLabel="Delete Space"
  title="Confirm Deletion"
/>
```

### **In Settings Page**

```tsx
<div className={styles.actions}>
  <SpaceDialog
    triggerLabel="Advanced Options"
    title="Advanced Settings"
    description="These settings are for advanced users only"
  />
</div>
```

## **17. Features Summary**

* Trigger button to open dialog
* Modal overlay with backdrop
* Centered content panel
* Accessible title element
* Optional description text
* Close button
* Full keyboard accessibility via Radix
* Focus trapping and management
* Escape key to close
* Click outside to close

## **18. Testing Considerations**

### **Unit Tests**

* Trigger button renders with correct label
* Dialog opens when trigger clicked
* Title displays correctly
* Description displays when provided
* Description hidden when not provided
* Close button closes dialog
* Escape key closes dialog

### **Mocking**

* Radix Dialog may need portal container setup in tests

### **Edge Cases**

* Very long title text
* Very long description text
* Rapid open/close cycles
* Multiple dialogs on same page

## **19. Out of Scope / Non-Goals**

* **Custom content**: This component only renders title/description (no children slot)
* **Form handling**: No form submission logic
* **Controlled mode**: Open state not exposed to parent
* **Custom triggers**: Trigger is always a button with text
* **Animations**: No built-in animations (add via CSS)

## **20. Related Components & System Context**

### **Related Components**

* Other Radix-based dialogs in the application
* Confirmation dialogs
* Modal forms

### **Used By**

* Space settings pages
* Confirmation actions
* Information modals

### **Typical Usage Location**

* Settings pages
* Action confirmations
* Help/info popups

## **21. Open Questions / Notes**

* Consider adding `children` prop for custom dialog content
* May want controlled `open`/`onOpenChange` props for parent control
* Trigger button needs styling
* Close button could use an icon
* Consider size variants (small, medium, large)

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Basic dialog with all props | Title + description | Base state |
| `Open` | Dialog in open state | Force open for visual | Show content panel |
| `NoDescription` | Title only | `description: undefined` | Minimal content |
| `LongContent` | Long title and description | Extended text | Test overflow |
| `Interaction` | Full open/close flow | Interactive | Test focus management |

### **Controls (Args) Required**

* `triggerLabel` (string) – controllable
* `title` (string) – controllable
* `description` (string) – controllable

### **Mocking Requirements**

* **Portal container**: May need custom decorator for portal rendering
* **Focus management**: Ensure focus testing works in Storybook

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify focus moves to dialog on open
* Verify focus returns to trigger on close
* Check escape key closes dialog
* Verify ARIA attributes present

### **Interaction Tests**

* Click trigger opens dialog
* Click close button closes dialog
* Click overlay closes dialog
* Press Escape closes dialog
* Tab cycles through dialog elements
* Focus trapped inside dialog
