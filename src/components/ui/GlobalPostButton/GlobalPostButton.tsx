'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { getCurrentUserId } from '@/lib/auth';
import { Icon } from '../Icon';
import styles from './GlobalPostButton.module.scss';

export function GlobalPostButton() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentUserId(getCurrentUserId());
  }, []);

  // Don't render until we're on the client to avoid hydration mismatch
  if (!isClient || !currentUserId) {
    return null;
  }

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button className={styles.button} aria-label="Create new content">
          + New
          <span className={styles.icon}>▼</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={styles.dropdownContent}
          align="end"
          sideOffset={8}
        >
          <DropdownMenu.Item
            className={styles.dropdownItem}
            onSelect={() => handleNavigate('/posts/new')}
          >
            <Icon icon="comment" size={20} className={styles.dropdownIcon} />
            <div className={styles.dropdownText}>
              <div className={styles.dropdownLabel}>Discussion</div>
              <div className={styles.dropdownDescription}>
                Start a conversation or ask a question
              </div>
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className={styles.dropdownSeparator} />

          <DropdownMenu.Item
            className={styles.dropdownItem}
            onSelect={() => handleNavigate('/events/new')}
          >
            <Icon icon="calendar" size={20} className={styles.dropdownIcon} />
            <div className={styles.dropdownText}>
              <div className={styles.dropdownLabel}>Event</div>
              <div className={styles.dropdownDescription}>
                Create an event for your community
              </div>
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className={styles.dropdownSeparator} />

          <DropdownMenu.Item
            className={styles.dropdownItem}
            onSelect={() => handleNavigate('/webinars/new')}
          >
            <Icon icon="video" size={20} className={styles.dropdownIcon} />
            <div className={styles.dropdownText}>
              <div className={styles.dropdownLabel}>Webinar</div>
              <div className={styles.dropdownDescription}>
                Host a live or scheduled webinar
              </div>
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className={styles.dropdownSeparator} />

          <DropdownMenu.Item
            className={styles.dropdownItem}
            onSelect={() => handleNavigate('/updates/new')}
          >
            <Icon icon="bell" size={20} className={styles.dropdownIcon} />
            <div className={styles.dropdownText}>
              <div className={styles.dropdownLabel}>Update</div>
              <div className={styles.dropdownDescription}>
                Share an important announcement
              </div>
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className={styles.dropdownSeparator} />

          <DropdownMenu.Item
            className={styles.dropdownItem}
            onSelect={() => handleNavigate('/showcases/new')}
          >
            <Icon icon="star" size={20} className={styles.dropdownIcon} />
            <div className={styles.dropdownText}>
              <div className={styles.dropdownLabel}>Showcase</div>
              <div className={styles.dropdownDescription}>
                Share a success story or case study
              </div>
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={styles.dropdownItem}
            onSelect={() => handleNavigate('/resources/new')}
          >
            <Icon icon="book" size={20} className={styles.dropdownIcon} />
            <div className={styles.dropdownText}>
              <div className={styles.dropdownLabel}>Resource</div>
              <div className={styles.dropdownDescription}>
                Add a guide, template, or documentation
              </div>
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className={styles.dropdownSeparator} />

          <DropdownMenu.Item
            className={styles.dropdownItem}
            onSelect={() => handleNavigate('/exchanges/new')}
          >
            <Icon icon="repeat" size={20} className={styles.dropdownIcon} />
            <div className={styles.dropdownText}>
              <div className={styles.dropdownLabel}>Exchange</div>
              <div className={styles.dropdownDescription}>
                Offer or request equipment, space, or expertise
              </div>
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
