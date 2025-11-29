'use client';

import { useState, useEffect, useRef } from 'react';
import { Icon } from '../Icon';
import { Input, Button } from '../primitives';
import styles from './CalendarSearch.module.scss';

interface CalendarSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function CalendarSearch({ onSearch, placeholder = 'Search events...' }: CalendarSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }

      if (e.key === 'Escape' && isFocused) {
        e.preventDefault();
        inputRef.current?.blur();
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className={`${styles.search} ${isFocused ? styles.focused : ''}`}>
      <Icon icon="search" size={16} className={styles.icon} />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Search events"
        className={styles.input}
      />
      {query && (
        <Button
          onClick={handleClear}
          aria-label="Clear search"
          variant="ghost"
          size="sm"
          className={styles.clearButton}
        >
          ×
        </Button>
      )}
      {!query && !isFocused && (
        <kbd className={styles.kbd}>/</kbd>
      )}
    </div>
  );
}

// Helper function to search events
export function searchEvents(events: any[], query: string) {
  if (!query.trim()) {
    return events;
  }

  const lowerQuery = query.toLowerCase();

  return events.filter(event => {
    // Search in title
    if (event.title?.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in content (strip HTML)
    if (event.htmlContent) {
      const plainText = event.htmlContent.replace(/<[^>]*>/g, '');
      if (plainText.toLowerCase().includes(lowerQuery)) {
        return true;
      }
    }

    // Search in location
    if (event.location?.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in space name
    if (event.space?.name?.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in tags
    if (event.tags?.some((tag: any) => tag.name.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    return false;
  });
}
