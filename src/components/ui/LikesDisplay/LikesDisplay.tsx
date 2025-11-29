'use client';

import { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { DiscussionUser } from '@/lib/discussions';
import { Icon } from '../Icon';
import { Avatar } from '../primitives';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../primitives';
import styles from './LikesDisplay.module.scss';

interface LikesDisplayProps {
  likesCount: number;
  isLiked: boolean;
  likedBy: DiscussionUser[];
  onLikeToggle: () => void;
}

export function LikesDisplay({ likesCount, isLiked, likedBy, onLikeToggle }: LikesDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getLikerName = (liker: DiscussionUser) => {
    return liker.name || 'Unknown';
  };

  const getLikerInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTooltipText = () => {
    if (!likedBy || likedBy.length === 0) return '';

    if (likedBy.length === 1) {
      return getLikerName(likedBy[0]);
    } else if (likedBy.length === 2) {
      return `${getLikerName(likedBy[0])} and ${getLikerName(likedBy[1])}`;
    } else {
      const firstLiker = getLikerName(likedBy[0]);
      const othersCount = likedBy.length - 1;
      return `${firstLiker} and ${othersCount} ${othersCount === 1 ? 'other' : 'others'}`;
    }
  };

  return (
    <div className={styles.container}>
      {/* Like Button */}
      <button
        onClick={onLikeToggle}
        className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
        aria-label={isLiked ? 'Unlike' : 'Like'}
      >
        <Icon icon="heart" size={18} />
      </button>

      {/* Likes Count with Tooltip and Modal */}
      {likesCount > 0 && (
        <Tooltip.Provider delayDuration={300}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <button className={styles.countButton}>
                  {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                </button>

                <DialogContent size="sm">
                  <DialogHeader>
                    <DialogTitle>Likes ({likesCount})</DialogTitle>
                  </DialogHeader>

                  <div className={styles.likersList}>
                    {likedBy && likedBy.length > 0 ? (
                      likedBy.map((liker) => {
                        const name = getLikerName(liker);
                        const initials = getLikerInitials(name);

                        return (
                          <div key={liker.id} className={styles.likerItem}>
                            <Avatar
                              src={liker.photo}
                              alt={name}
                              fallback={initials}
                              size="sm"
                            />
                            <span className={styles.likerName}>{name}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className={styles.emptyState}>No likes yet</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </Tooltip.Trigger>

            {!isModalOpen && likedBy && likedBy.length > 0 && (
              <Tooltip.Portal>
                <Tooltip.Content className={styles.tooltip} sideOffset={5}>
                  {getTooltipText()}
                  <Tooltip.Arrow className={styles.tooltipArrow} />
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>
        </Tooltip.Provider>
      )}

      {likesCount === 0 && (
        <span className={styles.countText}>
          {likesCount} likes
        </span>
      )}
    </div>
  );
}
