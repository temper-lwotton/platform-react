'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatusUpdate, formatTimeAgo } from '@/lib/status-updates';
import { Icon } from '../Icon';
import { Avatar, Badge } from '../primitives';
import * as Popover from '@radix-ui/react-popover';
import styles from './StatusUpdateCard.module.scss';

interface StatusUpdateCardProps {
    statusUpdate: StatusUpdate;
    isAdmin?: boolean;
    isPinned?: boolean;
    currentSpaceId?: string;
}

export function StatusUpdateCard({ statusUpdate, isAdmin = false, isPinned = false, currentSpaceId }: StatusUpdateCardProps) {
    const { author, text, emoji, space, project, tags, createdAt, likesCount, commentsCount } = statusUpdate;
    const [menuOpen, setMenuOpen] = useState(false);

    const handlePinPost = () => {
        console.log('Pin post in space:', currentSpaceId || space.id);
        // In real implementation: POST /api/spaces/{spaceId}/pins
        setMenuOpen(false);
    };

    const handleBroadcastPost = () => {
        console.log('Broadcast post:', statusUpdate.id);
        // In real implementation: Open modal to select spaces
        setMenuOpen(false);
    };

    const handleMarkSpam = () => {
        console.log('Mark as spam:', statusUpdate.id);
        // In real implementation: POST /api/status-updates/{id}/spam
        setMenuOpen(false);
    };

    const handleDeletePost = () => {
        if (confirm('Are you sure you want to delete this post?')) {
            console.log('Delete post:', statusUpdate.id);
            // In real implementation: DELETE /api/status-updates/{id}
        }
        setMenuOpen(false);
    };

    const handleFeaturePost = () => {
        console.log('Feature in digest:', statusUpdate.id);
        // In real implementation: POST /api/status-updates/{id}/feature
        setMenuOpen(false);
    };

    const handleUnpinPost = () => {
        console.log('Unpin post from space:', currentSpaceId || space.id);
        // In real implementation: DELETE /api/spaces/{spaceId}/pins/{postId}
        setMenuOpen(false);
    };

    return (
        <div className={`${styles.card} ${isPinned ? styles.pinned : ''}`}>
            {/* Pin Indicator */}
            {isPinned && (
                <div className={styles.pinIndicator}>
                    <Icon icon="pin" size={14} />
                    <span>Pinned</span>
                </div>
            )}

            {/* Header */}
            <div className={styles.header}>
                <Link href={`/users/${author.id}`} className={styles.authorLink}>
                    <Avatar
                        src={author.photo}
                        alt={author.fullName}
                        fallback={author.fullName.charAt(0).toUpperCase()}
                        size="md"
                    />
                    <div className={styles.authorInfo}>
                        <div className={styles.authorName}>{author.fullName}</div>
                        {author.jobTitle && (
                            <div className={styles.authorTitle}>{author.jobTitle}</div>
                        )}
                    </div>
                </Link>
                <div className={styles.headerActions}>
                    <div className={styles.meta}>
                        <span className={styles.time}>{formatTimeAgo(createdAt)}</span>
                    </div>

                    {/* Settings Menu - Admin Only */}
                    {isAdmin && (
                        <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
                            <Popover.Trigger asChild>
                                <button className="status-update-menu-trigger" aria-label="Post options">
                                    <Icon icon="moreVertical" size={18} />
                                </button>
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content className="status-update-menu" sideOffset={5} align="end">
                                    <div className="status-update-menu-items">
                                        {/* Pin/Unpin */}
                                        {isPinned ? (
                                            <button className="status-update-menu-item" onClick={handleUnpinPost}>
                                                <Icon icon="x" size={16} />
                                                <span>Unpin from this space</span>
                                            </button>
                                        ) : (
                                            <button className="status-update-menu-item" onClick={handlePinPost}>
                                                <Icon icon="pin" size={16} />
                                                <span>Pin to this space</span>
                                            </button>
                                        )}

                                        {/* Broadcast */}
                                        <button className="status-update-menu-item" onClick={handleBroadcastPost}>
                                            <Icon icon="rss" size={16} />
                                            <span>Broadcast to spaces</span>
                                        </button>

                                        {/* Feature in Digest */}
                                        <button className="status-update-menu-item" onClick={handleFeaturePost}>
                                            <Icon icon="star" size={16} />
                                            <span>Feature in digest</span>
                                        </button>

                                        <div className="status-update-menu-separator" />

                                        {/* Mark as Spam */}
                                        <button className="status-update-menu-item danger" onClick={handleMarkSpam}>
                                            <Icon icon="alertCircle" size={16} />
                                            <span>Mark as spam</span>
                                        </button>

                                        {/* Delete */}
                                        <button className="status-update-menu-item danger" onClick={handleDeletePost}>
                                            <Icon icon="x" size={16} />
                                            <span>Delete post</span>
                                        </button>
                                    </div>
                                    <Popover.Arrow className="status-update-menu-arrow" />
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.text}>
                    {emoji && <span className={styles.emoji}>{emoji}</span>}
                    <span>{text}</span>
                </div>

                {/* Media Attachments */}
                {statusUpdate.media && statusUpdate.media.length > 0 && (
                    <div className={`${styles.media} ${statusUpdate.media.length === 1 ? styles.mediaSingle : styles.mediaGrid}`}>
                        {statusUpdate.media.map((media) => (
                            <div key={media.id} className={styles.mediaItem}>
                                {media.type === 'image' && (
                                    <div className={styles.mediaImage}>
                                        <img src={media.url} alt={media.caption || ''} />
                                        {media.caption && (
                                            <div className={styles.mediaCaption}>{media.caption}</div>
                                        )}
                                    </div>
                                )}
                                {media.type === 'video' && (
                                    <div className={styles.mediaVideo}>
                                        <video src={media.url} controls poster={media.thumbnail} />
                                        {media.caption && (
                                            <div className={styles.mediaCaption}>{media.caption}</div>
                                        )}
                                    </div>
                                )}
                                {media.type === 'link' && (
                                    <a
                                        href={media.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.mediaLinkCard}
                                    >
                                        {media.thumbnail && (
                                            <div className={styles.mediaLinkImage}>
                                                <img src={media.thumbnail} alt="" />
                                            </div>
                                        )}
                                        <div className={styles.mediaLinkContent}>
                                            {media.title && (
                                                <div className={styles.mediaLinkTitle}>{media.title}</div>
                                            )}
                                            {media.description && (
                                                <div className={styles.mediaLinkDescription}>{media.description}</div>
                                            )}
                                            <div className={styles.mediaLinkUrl}>
                                                {media.favicon && <img src={media.favicon} alt="" className={styles.mediaFavicon} />}
                                                <span>{new URL(media.url).hostname}</span>
                                            </div>
                                        </div>
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Context */}
                <div className={styles.context}>
                    <Link href={`/spaces/${space.id}`} className={styles.spaceLink}>
                        <Icon icon="users" size={14} />
                        <span>{space.title}</span>
                    </Link>

                    {project && (
                        <div className={styles.project}>
                            <Icon icon="folder" size={14} />
                            <span>{project.name}</span>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className={styles.tags}>
                        {tags.map((tag) => (
                            <Badge key={tag.id} variant="outline" size="sm">
                                #{tag.name}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <button className={styles.action}>
                    <Icon icon="heart" size={16} />
                    <span>{likesCount > 0 ? likesCount : ''}</span>
                </button>
                <button className={styles.action}>
                    <Icon icon="comment" size={16} />
                    <span>{commentsCount > 0 ? commentsCount : ''}</span>
                </button>
                <button className={styles.action}>
                    <Icon icon="bookmark" size={16} />
                </button>
            </div>
        </div>
    );
}
