# **Component Specification Template**

**Use this template for all production components.**  
Sections marked **(Optional)** may be omitted for very simple components.

## **1\. Component Name**

**`ComponentName`**

*Canonical component name. Must match the exported component name exactly.*

## **2\. Description**

A concise description of:

* What the component does  
* The problem it solves  
* When it should be used

*Should be understandable without reading code.*

## **3\. Location**

```
src/path/to/ComponentName.tsx
```

*Include full path relative to project root.*

## **4\. Component Type (Optional but Recommended)**

* UI  
* Layout  
* Feature  
* Wrapper  
* Utility  
* Hook

*Helps communicate scope and reuse expectations.*

## **5\. Props Interface**

```ts
interface ComponentNameProps {
  // Props here
}
```

Public API of the component.

## **6\. Props**

| Prop | Type | Required | Default | Description |
| ----- | ----- | ----- | ----- | ----- |
|  |  |  |  |  |

*All public props must be documented.*

## **7\. Data Requirements**

### **External Data Sources**

* APIs  
* Context  
* Stores  
* Utilities

```ts
// Example
function getSomething(): ReturnType;
```

Document where data comes from and how it is interpreted.

## **8\. Internal State**

| State Variable | Type | Purpose |
| ----- | ----- | ----- |
|  |  |  |

*Only include state owned by the component itself.*

## **9\. Behaviour Matrix (Required for Conditional UI)**

| Condition / State | UI Rendered | Notes |
| ----- | ----- | ----- |
|  |  |  |

***Authoritative** mapping of logic → UI.*

## **10\. Dependencies**

### **Child Components**

* ComponentA  
* ComponentB

### **Utilities / Hooks**

* useSomething  
* helperFunction

*Makes coupling explicit.*

## **11\. Events & Callbacks**

| Event / Callback | Trigger | Description |
| ----- | ----- | ----- |
|  |  |  |

*Include user actions and system events.*

## **12\. Styling**

* Styling approach (CSS Modules, SCSS, Tailwind, etc.)  
* File(s):  
  * `ComponentName.module.scss`

### **Visual States**

* Default  
* Hover  
* Active  
* Disabled  
* Loading  
* Error

*List all states that require styling.*

## **13\. Accessibility Requirements**

* Keyboard interaction expectations  
* Focus management  
* Screen reader behaviour  
* ARIA roles or announcements (if applicable)

Accessibility is mandatory for production components.

## **14\. Error Handling**

* Expected error conditions  
* Fallback behaviour  
* What the component does *not* handle

*Explicitly state failure behaviour, even if minimal.*

## **15\. Performance & Lifecycle Notes (Optional)**

* When side effects run  
* Re-render expectations  
* Event listeners / cleanup  
* Known performance constraints

## **16\. Usage Examples**

```
<ComponentName prop="value">
  <Child />
</ComponentName>
```

*Show realistic usage. Avoid contrived examples.*

## **17\. Features Summary**

* Bullet list of supported features  
* One line per feature

*Useful for reviews and acceptance checks.*

## **18\. Testing Considerations**

* What should be unit tested  
* What should be mocked  
* Edge cases to cover

*Do not prescribe tools unless necessary.*

## **19\. Out of Scope / Non-Goals**

* Explicitly excluded responsibilities  
* Related functionality handled elsewhere

*Prevents scope creep and misuse.*

## **20\. Related Components & System Context**

* Child components  
* Parent layouts  
* Related hooks/utilities  
* Typical usage locations

## **21\. Open Questions / Notes (Optional)**

* Known unknowns  
* Follow-ups  
* Decisions pending validation

*Keeps uncertainty visible.*

## **22\. Storybook Mapping**

### **Stories Required**

List the **minimum** stories that must exist. Use this format:

| Story ID | Scenario | Props / State | Notes |
| ----- | ----- | ----- | ----- |
| `Default` | Normal rendering | `{ ... }` | – |
| `Loading` | Loading state | state: `loading` | Use mock auth/store |
| `Error` | Error case | `{ ... }` | If applicable |

**Rule:** Every *documented visual state* must have a story.

### **Controls (Args) Required**

Document which props must be controllable in Storybook:

* `message` (string) – controllable  
* `children` – use representative demo content

**Rule:** Any prop that changes UI should be exposed as a control unless it’s unsafe/noisy.

### **Mocking Requirements**

Document how Storybook simulates data:

* Data source(s) mocked: `getCurrentUserId`  
* Event simulation: `auth:logout`  
* Network mocking: (MSW / mocked modules / test provider)

**Rule:** Stories must not require a real backend.

### **Accessibility Check (Storybook)**

* a11y addon enabled (if used in your setup)  
* no critical violations in default \+ key states

### **Interaction Tests (Optional but Recommended for complex components)**

If using Storybook play functions:

* “Happy path” interaction (e.g. login success)  
* “Negative path” (e.g. logout event)