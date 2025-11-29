import { BookmarkedItem } from './BookmarksDropdown';
import { Icon } from '../Icon';
import { getTimeAgo } from '../primitives';
import styles from './BookmarkItem.module.scss';

interface BookmarkItemProps {
  bookmark: BookmarkedItem;
  onRemove?: (bookmark: BookmarkedItem) => void;
}

export function BookmarkItem({ bookmark, onRemove }: BookmarkItemProps) {
  return (
    <button className={styles.item}>
      <div className={styles.itemIcon}>
        <Icon icon="bookmarkFilled" size={16} />
      </div>

      <div className={styles.itemContent}>
        <h4 className={styles.itemTitle}>{bookmark.title}</h4>

        {bookmark.excerpt && (
          <p className={styles.itemExcerpt}>
            {bookmark.excerpt.length > 60
              ? `${bookmark.excerpt.slice(0, 60)}...`
              : bookmark.excerpt}
          </p>
        )}

        <div className={styles.itemMeta}>
          {bookmark.spaceName && (
            <span className={styles.itemSpace}>
              <Icon icon="folder" size={12} />
              {bookmark.spaceName}
            </span>
          )}
          <span className={styles.itemTime}>
            {getTimeAgo(bookmark.createdAt)}
          </span>
        </div>
      </div>

      {onRemove && (
        <button
          className={styles.itemRemove}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(bookmark);
          }}
          aria-label="Remove bookmark"
        >
          <Icon icon="bookmark" size={14} />
        </button>
      )}
    </button>
  );
}
