'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useMentions, MentionUser } from '@/hooks/useMentions';
import * as Popover from '@radix-ui/react-popover';
import * as Avatar from '@radix-ui/react-avatar';

interface MentionTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  users: MentionUser[];
  onMention?: (user: MentionUser) => void;
}

export interface MentionTextareaHandle {
  focus: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
}

export const MentionTextarea = forwardRef<MentionTextareaHandle, MentionTextareaProps>(
  ({ users, onMention, onChange, onKeyDown, ...textareaProps }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);

    const {
      mentionState,
      handleInputChange,
      handleKeyDown: handleMentionKeyDown,
      selectUser,
      setTextareaRef,
    } = useMentions({ users, onMention });

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        internalRef.current?.focus();
      },
      getValue: () => {
        return internalRef.current?.value || '';
      },
      setValue: (value: string) => {
        if (internalRef.current) {
          internalRef.current.value = value;
          // Trigger change event
          const event = new Event('input', { bubbles: true });
          internalRef.current.dispatchEvent(event);
        }
      },
    }));

    // Combined ref handler
    const handleRef = (element: HTMLTextAreaElement | null) => {
      (internalRef as any).current = element;
      setTextareaRef(element);
    };

    // Combined onChange handler
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleInputChange(e);
      onChange?.(e);
    };

    // Combined onKeyDown handler
    const handleKeyDownCombined = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const handled = handleMentionKeyDown(e);
      if (!handled) {
        onKeyDown?.(e);
      }
    };

    const getUserInitials = (user: MentionUser): string => {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return user.name.charAt(0).toUpperCase();
    };

    return (
      <Popover.Root open={mentionState.isOpen}>
        <Popover.Anchor asChild>
          <div className="mention-textarea-wrapper">
            <textarea
              {...textareaProps}
              ref={handleRef}
              onChange={handleChange}
              onKeyDown={handleKeyDownCombined}
              className={`mention-textarea ${textareaProps.className || ''}`}
            />
          </div>
        </Popover.Anchor>

        <Popover.Portal>
          <Popover.Content
            className="mention-dropdown"
            side="bottom"
            align="start"
            sideOffset={4}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <div className="mention-dropdown-content">
              {mentionState.filteredUsers.map((user, index) => (
                <button
                  key={user.id}
                  className={`mention-dropdown-item ${
                    index === mentionState.selectedIndex ? 'mention-dropdown-item--selected' : ''
                  }`}
                  onClick={() => selectUser(user)}
                  onMouseDown={(e) => e.preventDefault()} // Prevent textarea blur
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
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }
);

MentionTextarea.displayName = 'MentionTextarea';
