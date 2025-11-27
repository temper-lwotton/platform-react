'use client';

import { useEffect, useRef } from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { MentionUser } from '@/hooks/useMentions';

interface MentionDropdownProps {
  users: MentionUser[];
  selectedIndex: number;
  position: { top: number; left: number };
  onSelect: (user: MentionUser) => void;
  textareaRef: HTMLTextAreaElement | null;
}

export function MentionDropdown({
  users,
  selectedIndex,
  position,
  onSelect,
  textareaRef,
}: MentionDropdownProps) {
  console.log('[MentionDropdown] Rendered:', {
    usersCount: users.length,
    selectedIndex,
    position,
    hasTextareaRef: !!textareaRef,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  // Calculate absolute position based on textarea position
  const getAbsolutePosition = () => {
    if (!textareaRef) return { top: 0, left: 0 };

    const textareaRect = textareaRef.getBoundingClientRect();

    return {
      top: textareaRect.top + position.top + 24, // 24px below caret
      left: textareaRect.left + position.left,
    };
  };

  const absolutePosition = getAbsolutePosition();

  const getUserInitials = (user: MentionUser): string => {
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div
      ref={dropdownRef}
      className="mention-dropdown"
      style={{
        position: 'fixed',
        top: `${absolutePosition.top}px`,
        left: `${absolutePosition.left}px`,
      }}
    >
      <div className="mention-dropdown-content">
        {users.map((user, index) => (
          <button
            key={user.id}
            ref={index === selectedIndex ? selectedItemRef : null}
            className={`mention-dropdown-item ${
              index === selectedIndex ? 'mention-dropdown-item--selected' : ''
            }`}
            onClick={() => onSelect(user)}
            onMouseEnter={() => {
              // Optional: Update selected index on hover
            }}
            type="button"
          >
            <Avatar.Root className="mention-dropdown-avatar">
              {user.avatar && (
                <Avatar.Image src={user.avatar} alt={user.name} />
              )}
              <Avatar.Fallback className="mention-dropdown-avatar-fallback">
                {getUserInitials(user)}
              </Avatar.Fallback>
            </Avatar.Root>
            <div className="mention-dropdown-info">
              <div className="mention-dropdown-name">{user.name}</div>
              {user.email && (
                <div className="mention-dropdown-email">{user.email}</div>
              )}
            </div>
          </button>
        ))}
      </div>
      <div className="mention-dropdown-hint">
        ↑↓ to navigate • ↵ to select • esc to dismiss
      </div>
    </div>
  );
}
