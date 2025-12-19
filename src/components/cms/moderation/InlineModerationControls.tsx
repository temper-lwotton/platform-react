'use client';

import { useState } from 'react';
import { Shield, Flag, Eye, EyeOff, Trash2, AlertTriangle, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';
import styles from './InlineModerationControls.module.scss';

interface InlineModerationControlsProps {
  contentId: string;
  contentType: 'post' | 'comment' | 'user';
  isAdmin?: boolean;
  isModerator?: boolean;
  compact?: boolean;
  onAction?: (action: string) => void;
}

export function InlineModerationControls({
  contentId,
  contentType,
  isAdmin = false,
  isModerator = false,
  compact = false,
  onAction,
}: InlineModerationControlsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Only show to admins and moderators
  if (!isAdmin && !isModerator) {
    return null;
  }

  const handleAction = async (action: string) => {
    setIsProcessing(true);
    console.log(`Moderation action: ${action} on ${contentType} ${contentId}`);

    // In real implementation, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));

    onAction?.(action);
    setShowMenu(false);
    setIsProcessing(false);
  };

  if (compact) {
    return (
      <div className={styles.inlineControls}>
        <button
          className={`${styles.moderationButton} ${styles.compact}`}
          onClick={() => setShowMenu(!showMenu)}
          disabled={isProcessing}
          title="Moderation actions"
        >
          <Shield className={styles.icon} />
        </button>

        {showMenu && (
          <>
            <div className={styles.backdrop} onClick={() => setShowMenu(false)} />
            <div className={styles.moderationMenu}>
              <div className={styles.menuHeader}>
                <Shield className={styles.menuIcon} />
                <span>Moderation</span>
              </div>

              <div className={styles.menuSection}>
                <button
                  className={styles.menuItem}
                  onClick={() => handleAction('approve')}
                  disabled={isProcessing}
                >
                  <CheckCircle2 className={styles.menuItemIcon} />
                  <span>Approve</span>
                </button>
                <button
                  className={styles.menuItem}
                  onClick={() => handleAction('flag')}
                  disabled={isProcessing}
                >
                  <Flag className={styles.menuItemIcon} />
                  <span>Flag for Review</span>
                </button>
                <button
                  className={styles.menuItem}
                  onClick={() => handleAction('hide')}
                  disabled={isProcessing}
                >
                  <EyeOff className={styles.menuItemIcon} />
                  <span>Hide {contentType === 'user' ? 'Profile' : 'Content'}</span>
                </button>
              </div>

              <div className={styles.menuSection}>
                <button
                  className={`${styles.menuItem} ${styles.warning}`}
                  onClick={() => handleAction('warn')}
                  disabled={isProcessing}
                >
                  <AlertTriangle className={styles.menuItemIcon} />
                  <span>Warn User</span>
                </button>
                <button
                  className={`${styles.menuItem} ${styles.danger}`}
                  onClick={() => handleAction('delete')}
                  disabled={isProcessing}
                >
                  <Trash2 className={styles.menuItemIcon} />
                  <span>Delete</span>
                </button>
              </div>

              {isAdmin && (
                <div className={styles.menuSection}>
                  <button
                    className={`${styles.menuItem} ${styles.danger}`}
                    onClick={() => handleAction('ban')}
                    disabled={isProcessing}
                  >
                    <XCircle className={styles.menuItemIcon} />
                    <span>Ban User</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Full controls (non-compact mode)
  return (
    <div className={styles.inlineControls}>
      <div className={styles.controlsBar}>
        <button
          className={`${styles.actionButton} ${styles.approve}`}
          onClick={() => handleAction('approve')}
          disabled={isProcessing}
          title="Approve content"
        >
          <CheckCircle2 className={styles.icon} />
          <span>Approve</span>
        </button>

        <button
          className={`${styles.actionButton} ${styles.flag}`}
          onClick={() => handleAction('flag')}
          disabled={isProcessing}
          title="Flag for review"
        >
          <Flag className={styles.icon} />
          <span>Flag</span>
        </button>

        <button
          className={`${styles.actionButton} ${styles.hide}`}
          onClick={() => handleAction('hide')}
          disabled={isProcessing}
          title="Hide content"
        >
          <EyeOff className={styles.icon} />
          <span>Hide</span>
        </button>

        <button
          className={`${styles.actionButton} ${styles.more}`}
          onClick={() => setShowMenu(!showMenu)}
          disabled={isProcessing}
          title="More actions"
        >
          <MoreVertical className={styles.icon} />
        </button>
      </div>

      {showMenu && (
        <>
          <div className={styles.backdrop} onClick={() => setShowMenu(false)} />
          <div className={styles.moderationMenu}>
            <div className={styles.menuHeader}>
              <Shield className={styles.menuIcon} />
              <span>More Actions</span>
            </div>

            <div className={styles.menuSection}>
              <button
                className={`${styles.menuItem} ${styles.warning}`}
                onClick={() => handleAction('warn')}
                disabled={isProcessing}
              >
                <AlertTriangle className={styles.menuItemIcon} />
                <span>Warn User</span>
              </button>
              <button
                className={`${styles.menuItem} ${styles.danger}`}
                onClick={() => handleAction('delete')}
                disabled={isProcessing}
              >
                <Trash2 className={styles.menuItemIcon} />
                <span>Delete {contentType === 'user' ? 'Account' : 'Content'}</span>
              </button>
            </div>

            {isAdmin && (
              <div className={styles.menuSection}>
                <button
                  className={`${styles.menuItem} ${styles.danger}`}
                  onClick={() => handleAction('ban')}
                  disabled={isProcessing}
                >
                  <XCircle className={styles.menuItemIcon} />
                  <span>Ban User</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
