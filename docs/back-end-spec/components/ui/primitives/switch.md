# **Component Specification: Switch**

## **1. Component Name**

**`Switch`**

## **2. Description**

A toggle switch component built on Radix UI Switch primitive.

* Provides accessible on/off toggle functionality
* Supports labels, helper text, and error states
* Immediate effect (vs form submission)
* Full keyboard support

## **3. Location**

```
src/components/ui/primitives/Switch/Switch.tsx
```

## **4. Component Type**

**UI** – Presentational component managed by Radix UI.

## **5. Props Interface**

```typescript
interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  size?: SwitchSize;
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
}

type SwitchSize = 'sm' | 'md' | 'lg';
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `checked` | `boolean` | No | - | Controlled checked state |
| `defaultChecked` | `boolean` | No | - | Initial uncontrolled state |
| `onCheckedChange` | `(checked: boolean) => void` | No | - | State change handler |
| `disabled` | `boolean` | No | `false` | Disable switch |
| `required` | `boolean` | No | `false` | Mark as required |
| `name` | `string` | No | - | Form field name |
| `value` | `string` | No | - | Form field value |
| `size` | `SwitchSize` | No | `'md'` | Switch size |
| `label` | `string` | No | - | Label text |
| `helperText` | `string` | No | - | Helper text |
| `error` | `string` | No | - | Error message |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – controlled via Radix UI primitives.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `checked === true` | Thumb on right | On state |
| `checked === false` | Thumb on left | Off state |
| `error` provided | Error styling + message | Error state |
| `disabled === true` | Disabled styling | Non-interactive |
| Click label | Toggles switch | Label association |
| Space bar | Toggles switch | Keyboard |

## **10. Dependencies**

### **External Libraries**

* `@radix-ui/react-switch`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onCheckedChange` | State changes | Called with new boolean value |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Switch.module.scss`

### **CSS Classes**

* `.container` – Wrapper container
* `.wrapper` – Switch + label wrapper
* `.switch` – Switch track
* `.thumb` – Switch thumb
* `.label` – Label text
* `.size-sm`, `.size-md`, `.size-lg` – Size variants
* `.disabled` – Disabled state

## **13. Accessibility Requirements**

* **Keyboard**: Space toggles, Tab focuses
* **ARIA**: Proper role="switch" via Radix
* **Focus**: Clear focus ring
* **Screen Reader**: Announces state and label

### **Improvements Needed**

* None – Radix provides full accessibility

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid size | Default to 'md' | No error |

## **15. Performance & Lifecycle Notes**

### **Controlled Usage**

```tsx
const [enabled, setEnabled] = useState(false);

<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
  label="Enable notifications"
/>
```

### **Switch vs Checkbox**

| Component | Use Case |
|-----------|----------|
| `Switch` | Immediate effect (settings, toggles) |
| `Checkbox` | Form submission, multiple selections |

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { Switch } from '@/components/ui/primitives/Switch';

<Switch
  label="Enable notifications"
  checked={notifications}
  onCheckedChange={setNotifications}
/>
```

### **With Helper Text**

```tsx
<Switch
  label="Dark mode"
  helperText="Reduce eye strain in low light"
  checked={darkMode}
  onCheckedChange={setDarkMode}
/>
```

### **With Error**

```tsx
<Switch
  label="Accept terms"
  error="You must accept the terms"
  checked={accepted}
  onCheckedChange={setAccepted}
/>
```

### **Different Sizes**

```tsx
<Switch size="sm" label="Small" />
<Switch size="md" label="Medium" />
<Switch size="lg" label="Large" />
```

### **In Settings List**

```tsx
<div className={styles.settingsList}>
  <Switch
    label="Email notifications"
    checked={settings.emailNotifications}
    onCheckedChange={(v) => updateSetting('emailNotifications', v)}
  />
  <Switch
    label="Push notifications"
    checked={settings.pushNotifications}
    onCheckedChange={(v) => updateSetting('pushNotifications', v)}
  />
  <Switch
    label="SMS notifications"
    checked={settings.smsNotifications}
    onCheckedChange={(v) => updateSetting('smsNotifications', v)}
    disabled
  />
</div>
```

## **17. Features Summary**

### **States**

| State | Visual |
|-------|--------|
| Off | Thumb on left |
| On | Thumb on right |
| Disabled | Faded styling |

### **Sizes**

| Size | Use Case |
|------|----------|
| `sm` | Compact settings |
| `md` | Standard settings |
| `lg` | Prominent toggles |

## **18. Testing Considerations**

### **Unit Tests**

* Toggles on click
* Toggles on space key
* Shows on state correctly
* Shows error message
* Label click toggles
* Disabled prevents toggle

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Rapid toggling
* Long label text
* Disabled state

## **19. Out of Scope / Non-Goals**

* **Checkbox behavior**: Use Checkbox
* **Multiple options**: Use RadioGroup
* **Custom icons**: Not supported
* **Loading state**: Not built-in

## **20. Related Components & System Context**

### **Siblings**

* `Checkbox`
* `RadioGroup`

### **Used In**

* Settings pages
* Preferences
* Feature toggles

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Off` | Default | checked: false | Thumb left |
| `On` | Enabled | checked: true | Thumb right |
| `WithLabel` | Labeled | label provided | Label shown |
| `WithHelper` | Helper text | helperText provided | Description |
| `WithError` | Error | error provided | Error styling |
| `Disabled` | Disabled | disabled: true | Non-interactive |
| `Sizes` | All sizes | sm, md, lg | Size comparison |

### **Controls (Args) Required**

* `checked` (boolean) – Checked state
* `label` (text) – Label text
* `helperText` (text) – Helper text
* `error` (text) – Error message
* `size` (select) – Switch size
* `disabled` (boolean) – Disabled state

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify keyboard navigation
* Check state announcement
* Verify label association

### **Interaction Tests**

* Click to toggle
* Space key toggle
* Label click
