'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';
import { Icon, IconName } from '../../Icon';
import styles from './TabbedDropdown.module.scss';

export interface TabbedDropdownTab<T = any> {
  id: string;
  label: string;
  count?: number;
  items: T[];
}

export interface TabbedDropdownProps<T = any> {
  // Trigger
  icon: IconName;
  badgeCount?: number;
  ariaLabel: string;

  // Header
  title: string;
  headerAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };

  // Tabs
  tabs: TabbedDropdownTab<T>[];
  defaultTab?: string;

  // Content
  renderItem: (item: T) => ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;

  // Footer
  viewAllLink: string;
  viewAllLabel?: string;

  // Behavior
  onItemClick?: (item: T) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TabbedDropdown<T = any>({
  icon,
  badgeCount = 0,
  ariaLabel,
  title,
  headerAction,
  tabs,
  defaultTab,
  renderItem,
  isLoading = false,
  emptyMessage = 'No items',
  viewAllLink,
  viewAllLabel = 'View all',
  onItemClick,
  isOpen,
  onOpenChange,
}: TabbedDropdownProps<T>) {
  const handleItemClick = (item: T) => {
    if (onItemClick) {
      onItemClick(item);
    }
    onOpenChange(false);
  };

  const firstTabId = tabs[0]?.id || '';
  const activeDefaultTab = defaultTab || firstTabId;

  return (
    <Popover.Root open={isOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={styles.button}
          aria-label={ariaLabel}
        >
          <Icon icon={icon} size={20} className={styles.icon} />
          {badgeCount > 0 && (
            <span className={styles.badge}>
              {badgeCount > 9 ? '9+' : badgeCount}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={styles.dropdownMenu}
          align="end"
          sideOffset={8}
        >
          {/* Header */}
          <div className={styles.dropdownHeader}>
            <span className={styles.dropdownTitle}>{title}</span>

            {headerAction && (
              <button
                type="button"
                className={styles.headerAction}
                onClick={headerAction.onClick}
                disabled={headerAction.disabled}
              >
                {headerAction.label}
              </button>
            )}
          </div>

          {/* Tabs */}
          {tabs.length > 1 ? (
            <Tabs.Root className={styles.tabs} defaultValue={activeDefaultTab}>
              <Tabs.List className={styles.tabsList}>
                {tabs.map((tab) => (
                  <Tabs.Trigger
                    key={tab.id}
                    value={tab.id}
                    className={styles.tabTrigger}
                  >
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={styles.tabBadge}>{tab.count}</span>
                    )}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              {tabs.map((tab) => (
                <Tabs.Content
                  key={tab.id}
                  value={tab.id}
                  className={styles.tabContent}
                >
                  {isLoading ? (
                    <div className={styles.loading}>Loading...</div>
                  ) : tab.items.length === 0 ? (
                    <div className={styles.empty}>{emptyMessage}</div>
                  ) : (
                    <div className={styles.list}>
                      {tab.items.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleItemClick(item)}
                        >
                          {renderItem(item)}
                        </div>
                      ))}
                    </div>
                  )}
                </Tabs.Content>
              ))}
            </Tabs.Root>
          ) : (
            // Single tab - no tabs UI, just content
            <>
              {isLoading ? (
                <div className={styles.loading}>Loading...</div>
              ) : tabs[0]?.items.length === 0 ? (
                <div className={styles.empty}>{emptyMessage}</div>
              ) : (
                <div className={styles.list}>
                  {tabs[0]?.items.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleItemClick(item)}
                    >
                      {renderItem(item)}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className={styles.dropdownFooter}>
            <Link
              href={viewAllLink}
              className={styles.viewAll}
              onClick={() => onOpenChange(false)}
            >
              {viewAllLabel}
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
