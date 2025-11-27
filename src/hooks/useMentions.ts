import { useState, useEffect, useCallback, useRef } from 'react';

export interface MentionUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface UseMentionsOptions {
  users: MentionUser[];
  onMention?: (user: MentionUser) => void;
}

interface MentionState {
  isOpen: boolean;
  query: string;
  position: { top: number; left: number } | null;
  mentionStartIndex: number;
  filteredUsers: MentionUser[];
  selectedIndex: number;
}

export function useMentions({ users, onMention }: UseMentionsOptions) {
  const [mentionState, setMentionState] = useState<MentionState>({
    isOpen: false,
    query: '',
    position: null,
    mentionStartIndex: -1,
    filteredUsers: [],
    selectedIndex: 0,
  });

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Filter users based on query
  const filterUsers = useCallback((query: string) => {
    const searchQuery = query.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery) ||
        user.email?.toLowerCase().includes(searchQuery)
    ).slice(0, 10); // Limit to 10 suggestions
  }, [users]);

  // Get caret coordinates for positioning dropdown
  const getCaretCoordinates = useCallback((textarea: HTMLTextAreaElement, position: number) => {
    const div = document.createElement('div');
    const style = getComputedStyle(textarea);

    // Copy textarea styles to div
    ['fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'lineHeight',
     'padding', 'borderWidth', 'boxSizing', 'wordWrap', 'whiteSpace'].forEach(prop => {
      div.style[prop as any] = style[prop as any];
    });

    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.width = `${textarea.offsetWidth}px`;
    div.style.height = 'auto';

    // Get text up to caret position
    const text = textarea.value.substring(0, position);
    div.textContent = text;

    // Create span for caret position
    const span = document.createElement('span');
    span.textContent = textarea.value.substring(position) || '.';
    div.appendChild(span);

    document.body.appendChild(div);

    const textareaRect = textarea.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();

    const coordinates = {
      top: spanRect.top - textareaRect.top + textarea.scrollTop,
      left: spanRect.left - textareaRect.left,
    };

    document.body.removeChild(div);

    return coordinates;
  }, []);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const value = textarea.value;
    const cursorPosition = textarea.selectionStart;

    // Find the last @ before cursor
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    // Check if we're in a mention context
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);

      // Check if there's no space after @ (valid mention context)
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        const coords = getCaretCoordinates(textarea, cursorPosition);
        const filteredUsers = filterUsers(textAfterAt);

        setMentionState({
          isOpen: filteredUsers.length > 0,
          query: textAfterAt,
          position: coords,
          mentionStartIndex: lastAtIndex,
          filteredUsers,
          selectedIndex: 0,
        });
        return;
      }
    }

    // Close mention dropdown
    setMentionState(prev => ({
      ...prev,
      isOpen: false,
      query: '',
      position: null,
      mentionStartIndex: -1,
    }));
  }, [filterUsers, getCaretCoordinates]);

  // Handle key down for navigation and selection
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!mentionState.isOpen) return false;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setMentionState(prev => ({
          ...prev,
          selectedIndex: Math.min(prev.selectedIndex + 1, prev.filteredUsers.length - 1),
        }));
        return true;

      case 'ArrowUp':
        e.preventDefault();
        setMentionState(prev => ({
          ...prev,
          selectedIndex: Math.max(prev.selectedIndex - 1, 0),
        }));
        return true;

      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (mentionState.filteredUsers[mentionState.selectedIndex]) {
          insertMention(mentionState.filteredUsers[mentionState.selectedIndex]);
        }
        return true;

      case 'Escape':
        e.preventDefault();
        setMentionState(prev => ({ ...prev, isOpen: false }));
        return true;

      default:
        return false;
    }
  }, [mentionState]);

  // Insert mention into textarea
  const insertMention = useCallback((user: MentionUser) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const value = textarea.value;
    const { mentionStartIndex } = mentionState;

    // Replace @query with @username
    const beforeMention = value.substring(0, mentionStartIndex);
    const afterMention = value.substring(textarea.selectionStart);
    const mention = `@${user.name} `;

    const newValue = beforeMention + mention + afterMention;
    const newCursorPosition = beforeMention.length + mention.length;

    // Update textarea value
    textarea.value = newValue;

    // Set cursor position
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);

    // Trigger change event
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);

    // Close dropdown
    setMentionState(prev => ({
      ...prev,
      isOpen: false,
      query: '',
      position: null,
      mentionStartIndex: -1,
    }));

    // Focus textarea
    textarea.focus();

    // Callback
    onMention?.(user);
  }, [mentionState, onMention]);

  // Select user by index
  const selectUser = useCallback((user: MentionUser) => {
    insertMention(user);
  }, [insertMention]);

  // Set textarea ref
  const setTextareaRef = useCallback((ref: HTMLTextAreaElement | null) => {
    textareaRef.current = ref;
  }, []);

  return {
    mentionState,
    handleInputChange,
    handleKeyDown,
    selectUser,
    setTextareaRef,
  };
}
