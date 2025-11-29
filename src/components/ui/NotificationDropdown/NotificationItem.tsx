import { Notification } from '@/lib/notifications';
import { getTimeAgo } from '../primitives';
import styles from './NotificationItem.module.scss';

interface NotificationItemProps {
  notification: Notification;
  title: string;
  text: string;
}

export function NotificationItem({ notification, title, text }: NotificationItemProps) {
  const actorName =
    notification.actor?.profile?.fullName ||
    notification.actor?.profile?.firstName ||
    notification.actor?.email ||
    'Someone';
  const actorInitial = actorName[0]?.toUpperCase() || '?';
  const hasPhoto = notification.actor?.profile?.photo;

  return (
    <button
      className={`${styles.item} ${!notification.readAt ? styles.itemUnread : ''}`}
    >
      <div className={styles.itemAvatar}>
        {hasPhoto ? (
          <img
            src={notification.actor.profile!.photo}
            alt={actorName}
            className={styles.itemAvatarImg}
          />
        ) : (
          <div className={styles.itemAvatarPlaceholder}>
            {actorInitial}
          </div>
        )}
      </div>

      <div className={styles.itemContent}>
        <h4 className={styles.itemTitle}>{title}</h4>
        <p className={styles.itemText}>{text}</p>
        <span className={styles.itemTime}>
          {getTimeAgo(notification.createdAt)}
        </span>
      </div>

      {!notification.readAt && <span className={styles.itemDot} />}
    </button>
  );
}
