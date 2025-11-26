'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { DiscussionUser } from '@/lib/discussions';
import { Icon } from './Icon';

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
    <div className="likes-display">
      {/* Like Button */}
      <button
        onClick={onLikeToggle}
        className={`likes-button ${isLiked ? 'likes-button--liked' : ''}`}
        aria-label={isLiked ? 'Unlike' : 'Like'}
      >
        <Icon icon="heart" size={18} className="likes-button-icon" />
      </button>

      {/* Likes Count with Tooltip and Modal */}
      {likesCount > 0 && (
        <Tooltip.Provider delayDuration={300}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Dialog.Trigger asChild>
                  <button className="likes-count-button">
                    {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                  </button>
                </Dialog.Trigger>

                <Dialog.Portal>
                  <Dialog.Overlay className="dialog-overlay" />
                  <Dialog.Content className="dialog-content likes-modal">
                    <Dialog.Title className="likes-modal-title">
                      Likes ({likesCount})
                    </Dialog.Title>
                    <Dialog.Close className="dialog-close" aria-label="Close">
                      ×
                    </Dialog.Close>

                    <div className="likes-modal-list">
                      {likedBy && likedBy.length > 0 ? (
                        likedBy.map((liker) => {
                          const name = getLikerName(liker);
                          const initials = getLikerInitials(name);

                          return (
                            <div key={liker.id} className="likes-modal-item">
                              {liker.photo ? (
                                <img
                                  src={liker.photo}
                                  alt={name}
                                  className="likes-modal-avatar"
                                />
                              ) : (
                                <div className="likes-modal-avatar likes-modal-avatar--placeholder">
                                  {initials}
                                </div>
                              )}
                              <span className="likes-modal-name">{name}</span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="likes-modal-empty">No likes yet</p>
                      )}
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </Tooltip.Trigger>

            {!isModalOpen && likedBy && likedBy.length > 0 && (
              <Tooltip.Portal>
                <Tooltip.Content className="tooltip-content" sideOffset={5}>
                  {getTooltipText()}
                  <Tooltip.Arrow className="tooltip-arrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>
        </Tooltip.Provider>
      )}

      {likesCount === 0 && (
        <span className="likes-count-text">
          {likesCount} likes
        </span>
      )}
    </div>
  );
}
