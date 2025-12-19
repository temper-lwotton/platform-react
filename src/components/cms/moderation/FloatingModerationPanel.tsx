'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Shield,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Keyboard,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import styles from './FloatingModerationPanel.module.scss';

interface QuickModerationItem {
  id: string;
  type: 'post' | 'comment';
  title: string;
  excerpt: string;
  priority: 'urgent' | 'high' | 'medium';
  timestamp: string;
}

// Dummy data
const quickItems: QuickModerationItem[] = [
  {
    id: '1',
    type: 'comment',
    title: 'Comment flagged for review',
    excerpt: 'This is absolutely ridiculous...',
    priority: 'urgent',
    timestamp: '2 min ago',
  },
  {
    id: '2',
    type: 'post',
    title: 'Spam post detected',
    excerpt: 'MAKE $5000/WEEK WORKING FROM HOME!!!',
    priority: 'high',
    timestamp: '15 min ago',
  },
  {
    id: '3',
    type: 'comment',
    title: 'Possible false flag',
    excerpt: 'I strongly disagree with...',
    priority: 'medium',
    timestamp: '1 hour ago',
  },
];

export function FloatingModerationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [items, setItems] = useState(quickItems);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Mod+Shift+M to toggle panel (Cmd on Mac, Ctrl on Windows)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        return;
      }

      // Only handle other shortcuts if panel is open
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;

        case 'ArrowDown':
        case 'j':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % items.length);
          break;

        case 'ArrowUp':
        case 'k':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
          break;

        case 'a':
          e.preventDefault();
          handleAction(items[selectedIndex].id, 'approve');
          break;

        case 'r':
          e.preventDefault();
          handleAction(items[selectedIndex].id, 'reject');
          break;

        case 'f':
          e.preventDefault();
          handleAction(items[selectedIndex].id, 'flag');
          break;

        case 'Enter':
          e.preventDefault();
          handleViewDetails(items[selectedIndex].id);
          break;

        case '?':
          e.preventDefault();
          setShowKeyboardHelp(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items, selectedIndex]);

  const handleAction = (id: string, action: string) => {
    console.log(`Quick action: ${action} on ${id}`);
    // Remove item from queue after action
    setItems(prev => prev.filter(item => item.id !== id));
    // Adjust selected index if needed
    if (selectedIndex >= items.length - 1) {
      setSelectedIndex(Math.max(0, items.length - 2));
    }
  };

  const handleViewDetails = (id: string) => {
    console.log(`View details for ${id}`);
    // In real implementation, navigate to full moderation view
  };

  if (!isOpen) {
    return (
      <button
        className={styles.floatingButton}
        onClick={() => setIsOpen(true)}
        title="Quick Moderation (⌘⇧M)"
      >
        <Shield className={styles.buttonIcon} />
        {items.length > 0 && <span className={styles.badge}>{items.length}</span>}
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={() => setIsOpen(false)} />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`${styles.panel} ${isExpanded ? styles.expanded : ''}`}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Shield className={styles.headerIcon} />
            <div>
              <h3 className={styles.title}>Quick Moderation</h3>
              <p className={styles.subtitle}>{items.length} items pending</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.headerButton}
              onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
              title="Keyboard shortcuts (?)"
            >
              <Keyboard />
            </button>
            <button
              className={styles.headerButton}
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Minimize' : 'Maximize'}
            >
              {isExpanded ? <Minimize2 /> : <Maximize2 />}
            </button>
            <button
              className={styles.headerButton}
              onClick={() => setIsOpen(false)}
              title="Close (Esc)"
            >
              <X />
            </button>
          </div>
        </div>

        {/* Keyboard Help */}
        {showKeyboardHelp && (
          <div className={styles.keyboardHelp}>
            <h4>Keyboard Shortcuts</h4>
            <div className={styles.shortcuts}>
              <div className={styles.shortcut}>
                <kbd>⌘⇧M</kbd>
                <span>Toggle panel</span>
              </div>
              <div className={styles.shortcut}>
                <kbd>↓</kbd> / <kbd>j</kbd>
                <span>Next item</span>
              </div>
              <div className={styles.shortcut}>
                <kbd>↑</kbd> / <kbd>k</kbd>
                <span>Previous item</span>
              </div>
              <div className={styles.shortcut}>
                <kbd>a</kbd>
                <span>Approve</span>
              </div>
              <div className={styles.shortcut}>
                <kbd>r</kbd>
                <span>Reject</span>
              </div>
              <div className={styles.shortcut}>
                <kbd>f</kbd>
                <span>Flag</span>
              </div>
              <div className={styles.shortcut}>
                <kbd>Enter</kbd>
                <span>View details</span>
              </div>
              <div className={styles.shortcut}>
                <kbd>?</kbd>
                <span>Toggle help</span>
              </div>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <CheckCircle2 className={styles.emptyIcon} />
              <p>All caught up!</p>
              <span>No items pending moderation</span>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={item.id}
                className={`${styles.item} ${idx === selectedIndex ? styles.selected : ''} ${styles[item.priority]}`}
                onClick={() => setSelectedIndex(idx)}
              >
                <div className={styles.itemHeader}>
                  <div className={styles.itemMeta}>
                    <span className={`${styles.priorityDot} ${styles[item.priority]}`}></span>
                    <span className={styles.itemType}>{item.type}</span>
                    <span className={styles.itemTime}>
                      <Clock className={styles.timeIcon} />
                      {item.timestamp}
                    </span>
                  </div>
                </div>
                <h4 className={styles.itemTitle}>{item.title}</h4>
                <p className={styles.itemExcerpt}>{item.excerpt}</p>

                {idx === selectedIndex && (
                  <div className={styles.quickActions}>
                    <button
                      className={`${styles.quickAction} ${styles.approve}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(item.id, 'approve');
                      }}
                    >
                      <CheckCircle2 />
                      <span>Approve</span>
                      <kbd>a</kbd>
                    </button>
                    <button
                      className={`${styles.quickAction} ${styles.reject}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(item.id, 'reject');
                      }}
                    >
                      <XCircle />
                      <span>Reject</span>
                      <kbd>r</kbd>
                    </button>
                    <button
                      className={`${styles.quickAction} ${styles.details}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(item.id);
                      }}
                    >
                      <ChevronRight />
                      <span>Details</span>
                      <kbd>↵</kbd>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <button
              className={styles.viewAllButton}
              onClick={() => window.location.href = '/admin/moderation'}
            >
              View Full Queue
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
