/**
 * Shared UI Primitives
 *
 * These components are built on top of Radix UI primitives and provide
 * consistent, accessible, and themeable building blocks for the application.
 *
 * All components follow these principles:
 * - Built on Radix UI primitives where applicable for accessibility
 * - Use CSS Modules for styling
 * - Support theming through CSS custom properties
 * - Properly typed with TypeScript
 * - Forward refs for composition
 */

export { Avatar } from './Avatar';
export type { AvatarProps, AvatarSize } from './Avatar';

export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './Badge';

export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { Card, CardHeader, CardContent, CardFooter } from './Card';
export type { CardProps, CardSectionProps, CardVariant } from './Card';

export { Input } from './Input';
export type { InputProps, InputSize, InputVariant } from './Input';

export { Select } from './Select';
export type { SelectProps, SelectOption, SelectSize } from './Select';

export { Checkbox } from './Checkbox';
export type { CheckboxProps, CheckboxSize } from './Checkbox';

export { Textarea } from './Textarea';
export type { TextareaProps, TextareaSize, TextareaVariant } from './Textarea';

export { Radio, RadioGroup } from './Radio';
export type { RadioGroupProps, RadioOption, RadioSize, RadioOrientation } from './Radio';

export { Switch } from './Switch';
export type { SwitchProps, SwitchSize } from './Switch';

export { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel } from './Dropdown';
export type { DropdownProps, DropdownItemProps, DropdownSeparatorProps, DropdownLabelProps } from './Dropdown';

export { Popover, PopoverClose } from './Popover';
export type { PopoverProps, PopoverCloseProps } from './Popover';

export { HoverCard } from './HoverCard';
export type { HoverCardProps } from './HoverCard';

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './Dialog';
export type {
  DialogProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogFooterProps,
} from './Dialog';

export {
  ToastProvider,
  Toast,
  ToastViewport,
  ToastAction,
  ToastClose,
} from './Toast';
export type {
  ToastProviderProps,
  ToastProps,
  ToastViewportProps,
} from './Toast';

export { TabbedDropdown, getTimeAgo } from './TabbedDropdown';
export type { TabbedDropdownProps, TabbedDropdownTab } from './TabbedDropdown';
