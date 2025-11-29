'use client';

import { useRef, useEffect } from 'react';
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
              const isOwn = message.sender?.id === currentUserId;
              const showAvatar = !isOwn && (
                index === 0 ||
                messages[index - 1]?.sender?.id !== message.sender?.id
              );

              return (
                <div
                  key={message.id}
                  className={`${styles.message} ${isOwn ? styles.messageOwn : ''}`}
                >
                  {!isOwn && (
                    showAvatar ? (
                      <div className={styles.messageAvatar}>
                        <Avatar
                          src={message.sender?.profile?.photo || null}
                          alt={message.sender?.profile?.fullName || `${message.sender?.profile?.firstName || ''} ${message.sender?.profile?.lastName || ''}`.trim() || 'Unknown'}
                          fallback={
                            message.sender?.profile?.fullName?.[0] ||
                            message.sender?.profile?.firstName?.[0] ||
                            '?'
                          }
                          size="md"
                        />
                      </div>
                    ) : (
                      <div className={styles.messageAvatarPlaceholder} />
                    )
                  )}

                  <div className={styles.messageContent}>
                    {!isOwn && showAvatar && (
                      <div className={styles.messageSender}>
                        {message.sender?.profile?.fullName || `${message.sender?.profile?.firstName || ''} ${message.sender?.profile?.lastName || ''}`.trim() || 'Unknown'}
                      </div>
                    )}

                    <div className={styles.messageBubble}>
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

                    <div className={styles.messageTime}>{formatTime(message.lastUpdated)}</div>
                  </div>

                  {isOwn && onDeleteMessage && (
                    <div className={styles.messageActions}>
                      <button
                        className={styles.messageActionButton}
                        onClick={() => onDeleteMessage(message.id)}
                        title="Delete message"
                      >
                        <Icon icon="x" size={16} />
                      </button>
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
