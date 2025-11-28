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
