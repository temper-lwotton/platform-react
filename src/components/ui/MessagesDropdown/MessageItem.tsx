import { ConversationHead } from '@/lib/conversations';
import { getTimeAgo } from '../primitives';
import styles from './MessageItem.module.scss';

interface MessageItemProps {
  conversation: ConversationHead;
  displayName: string;
  currentUserId: string | null;
}

export function MessageItem({ conversation, displayName, currentUserId }: MessageItemProps) {
  const otherParticipants =
    conversation.participants?.filter(p => p.id !== currentUserId) || [];

  const initials =
    displayName
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';

  const firstParticipant = otherParticipants[0];
  const hasPhoto =
    (firstParticipant as any)?.photo || firstParticipant?.profile?.photo;

  return (
    <button
      className={`${styles.item} ${
        conversation.unread > 0 ? styles.itemUnread : ''
      }`}
    >
      <div className={styles.itemAvatar}>
        {hasPhoto ? (
          <img
            src={hasPhoto}
            alt={displayName}
            className={styles.itemAvatarImg}
          />
        ) : (
          <div className={styles.itemAvatarPlaceholder}>{initials}</div>
        )}
      </div>
      <div className={styles.itemContent}>
        <h4 className={styles.itemName}>{displayName}</h4>
        <p className={styles.itemPreview}>{conversation.lastMessage}</p>
        <span className={styles.itemTime}>
          {getTimeAgo(conversation.updatedAt)}
        </span>
      </div>
      {conversation.unread > 0 && (
        <span className={styles.itemBadge}>{conversation.unread}</span>
      )}
    </button>
  );
}
