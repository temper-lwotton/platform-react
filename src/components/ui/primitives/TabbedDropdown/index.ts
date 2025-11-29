export { TabbedDropdown } from './TabbedDropdown';
export type { TabbedDropdownProps, TabbedDropdownTab } from './TabbedDropdown';

// Shared utility function for time formatting
export function getTimeAgo(dateString: string): string {
  const normalized = dateString.replace(' ', 'T');
  const date = new Date(normalized);

  if (isNaN(date.getTime())) {
    return 'recently';
  }

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}
