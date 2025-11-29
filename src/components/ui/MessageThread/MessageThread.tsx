'use client';

import { useRef, useEffect, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Avatar } from '../primitives';
import { TypingIndicator } from '../TypingIndicator';
import { Icon } from '../Icon';
import { Message as ConversationMessage } from '@/lib/conversations';
import { User } from '@/lib/users';
import styles from './MessageThread.module.scss';

interface MessageThreadProps {
  messages: ConversationMessage[];
  participants: User[];
  currentUserId?: string;
  onDeleteMessage?: (messageId: string) => void;
  typingUsers?: string[];
}

export function MessageThread({
  messages,
  participants,
  currentUserId,
  onDeleteMessage,
  typingUsers = [],
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const displayName = participants.length === 1
    ? participants[0].profile?.fullName || `${participants[0].profile?.firstName || ''} ${participants[0].profile?.lastName || ''}`.trim() || 'Unknown'
    : participants.length === 2
      ? participants
          .filter(p => p.id !== currentUserId)
          .map(p => p.profile?.fullName || `${p.profile?.firstName || ''} ${p.profile?.lastName || ''}`.trim() || 'Unknown')
          .join(', ')
      : participants
          .filter(p => p.id !== currentUserId)
          .slice(0, 2)
          .map(p => p.profile?.fullName || `${p.profile?.firstName || ''} ${p.profile?.lastName || ''}`.trim() || 'Unknown')
          .join(', ') + ` +${participants.length - 3}`;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  };

  return (
    <div className={styles.thread}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>{displayName}</h2>
          <span className={styles.participants}>
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>💬</div>
            <p className={styles.emptyText}>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              // Handle both cases: sender as User object or sender as string ID
              // Convert to string for consistent comparison with currentUserId (which is a string)
              const senderId = typeof message.sender === 'string'
                ? message.sender
                : String(message.sender?.id);

              const isOwn = senderId === currentUserId;

              const prevSender = messages[index - 1]?.sender;
              const prevSenderId = typeof prevSender === 'string'
                ? prevSender
                : String(prevSender?.id);

              const showAvatar = !isOwn && (
                index === 0 ||
                prevSenderId !== senderId
              );

              // Get sender info (handle both User object and string ID)
              const senderObj = typeof message.sender === 'string' ? null : message.sender;
              const senderName = senderObj?.profile?.fullName ||
                `${senderObj?.profile?.firstName || ''} ${senderObj?.profile?.lastName || ''}`.trim() ||
                'Unknown';
              const senderPhoto = senderObj?.profile?.photo || null;
              const senderInitial = senderObj?.profile?.fullName?.[0] ||
                senderObj?.profile?.firstName?.[0] ||
                '?';

              return (
                <div
                  key={message.id}
                  className={`${styles.message} ${isOwn ? styles.messageOwn : styles.messageOther}`}
                  data-own={isOwn}
                >
                  {!isOwn && (
                    showAvatar ? (
                      <div className={styles.messageAvatar}>
                        <Avatar
                          src={senderPhoto}
                          alt={senderName}
                          fallback={senderInitial}
                          size="md"
                        />
                      </div>
                    ) : (
                      <div className={styles.messageAvatarPlaceholder} />
                    )
                  )}

                  <div className={`${styles.messageContent} ${isOwn ? styles.messageContentOwn : styles.messageContentOther}`}>
                    {!isOwn && showAvatar && (
                      <div className={styles.messageSender}>
                        {senderName}
                      </div>
                    )}

                    <div className={`${styles.messageBubble} ${isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther}`}>
                      {message.content}

                      {message.attachments && message.attachments.length > 0 && (
                        <div className={styles.attachments}>
                          {message.attachments.map((attachment, attIndex) => (
                            <a
                              key={attIndex}
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.attachment}
                            >
                              <Icon icon="link" size={16} className={styles.attachmentIcon} />
                              <span className={styles.attachmentName}>
                                {attachment.split('/').pop() || 'Attachment'}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={`${styles.messageTime} ${isOwn ? styles.messageTimeOwn : styles.messageTimeOther}`}>
                      {formatTime(message.lastUpdated)}
                    </div>
                  </div>

                  {isOwn && (
                    <div className={styles.messageActions}>
                      <Popover.Root
                        open={openMenuId === message.id}
                        onOpenChange={(open) => setOpenMenuId(open ? message.id : null)}
                      >
                        <Popover.Trigger asChild>
                          <button
                            className={styles.messageActionButton}
                            aria-label="Message actions"
                          >
                            <Icon icon="chevronDown" size={16} />
                          </button>
                        </Popover.Trigger>

                        <Popover.Portal>
                          <Popover.Content
                            className={styles.messageActionsMenu}
                            align="end"
                            sideOffset={5}
                          >
                            <button
                              className={styles.messageActionsMenuItem}
                              onClick={() => {
                                // TODO: Implement reply
                                console.log('Reply to message:', message.id);
                                setOpenMenuId(null);
                              }}
                            >
                              <Icon icon="arrowLeft" size={16} />
                              <span>Reply</span>
                            </button>

                            <button
                              className={styles.messageActionsMenuItem}
                              onClick={() => {
                                // TODO: Implement edit
                                console.log('Edit message:', message.id);
                                setOpenMenuId(null);
                              }}
                            >
                              <Icon icon="pencil" size={16} />
                              <span>Edit</span>
                            </button>

                            <div className={styles.messageActionsMenuSeparator} />

                            <button
                              className={`${styles.messageActionsMenuItem} ${styles.messageActionsMenuItemDanger}`}
                              onClick={() => {
                                if (onDeleteMessage) {
                                  onDeleteMessage(message.id);
                                }
                                setOpenMenuId(null);
                              }}
                            >
                              <Icon icon="x" size={16} />
                              <span>Delete</span>
                            </button>
                          </Popover.Content>
                        </Popover.Portal>
                      </Popover.Root>
                    </div>
                  )}
                </div>
              );
            })}

            {typingUsers.length > 0 && (
              <TypingIndicator names={typingUsers} />
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
}
