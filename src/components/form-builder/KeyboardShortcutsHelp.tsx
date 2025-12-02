'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Keyboard } from 'lucide-react';
import styles from './KeyboardShortcutsHelp.module.scss';

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Shortcut {
  keys: string[];
  description: string;
}

interface ShortcutGroup {
  title: string;
  shortcuts: Shortcut[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Quick Field Insertion',
    shortcuts: [
      { keys: ['T'], description: 'Add Text field' },
      { keys: ['E'], description: 'Add Email field' },
      { keys: ['N'], description: 'Add Number field' },
      { keys: ['P'], description: 'Add Phone field' },
      { keys: ['S'], description: 'Add Select field' },
      { keys: ['R'], description: 'Add Radio field' },
      { keys: ['C'], description: 'Add Checkbox field' },
      { keys: ['D'], description: 'Add Date field' },
      { keys: ['F'], description: 'Add File upload field' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['↑', '↓'], description: 'Navigate between fields' },
      { keys: ['Enter'], description: 'Open field settings' },
      { keys: ['Esc'], description: 'Clear selection' },
    ],
  },
  {
    title: 'Editing',
    shortcuts: [
      { keys: ['⌘/Ctrl', 'Z'], description: 'Undo' },
      { keys: ['⌘/Ctrl', 'Shift', 'Z'], description: 'Redo' },
      { keys: ['⌘/Ctrl', 'A'], description: 'Select all fields' },
      { keys: ['⌘/Ctrl', 'C'], description: 'Copy selected fields' },
      { keys: ['⌘/Ctrl', 'V'], description: 'Paste fields' },
      { keys: ['⌘/Ctrl', 'D'], description: 'Duplicate selected fields' },
      { keys: ['Delete'], description: 'Delete selected fields' },
    ],
  },
  {
    title: 'Selection',
    shortcuts: [
      { keys: ['Shift', 'Click'], description: 'Range select' },
      { keys: ['⌘/Ctrl', 'Click'], description: 'Toggle selection' },
    ],
  },
  {
    title: 'Help',
    shortcuts: [
      { keys: ['?'], description: 'Show/hide this help' },
    ],
  },
];

export default function KeyboardShortcutsHelp({
  open,
  onOpenChange,
}: KeyboardShortcutsHelpProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <Keyboard size={24} />
              <Dialog.Title className={styles.title}>
                Keyboard Shortcuts
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className={styles.closeButton} aria-label="Close">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className={styles.body}>
            {SHORTCUT_GROUPS.map((group) => (
              <div key={group.title} className={styles.group}>
                <h3 className={styles.groupTitle}>{group.title}</h3>
                <div className={styles.shortcuts}>
                  {group.shortcuts.map((shortcut, index) => (
                    <div key={index} className={styles.shortcut}>
                      <div className={styles.keys}>
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className={styles.key}>{key}</kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className={styles.plus}>+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className={styles.description}>
                        {shortcut.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <p>Press <kbd>?</kbd> to toggle this help panel</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
