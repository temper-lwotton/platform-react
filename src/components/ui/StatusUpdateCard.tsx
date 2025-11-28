'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatusUpdate, formatTimeAgo } from '@/lib/status-updates';
import { Icon } from './Icon';
import * as Popover from '@radix-ui/react-popover';

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
        <div className={`status-update-card ${isPinned ? 'pinned' : ''}`}>
            {/* Pin Indicator */}
            {isPinned && (
                <div className="status-update-pin-indicator">
                    <Icon icon="pin" size={14} />
                    <span>Pinned</span>
                </div>
            )}

            {/* Header */}
            <div className="status-update-card-header">
                <Link href={`/users/${author.id}`} className="status-update-card-author">
                    <div className="status-update-card-avatar">
                        {author.photo ? (
                            <img src={author.photo} alt={author.fullName} />
                        ) : (
                            <span>{author.fullName.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <div className="status-update-card-author-info">
                        <div className="status-update-card-author-name">{author.fullName}</div>
                        {author.jobTitle && (
                            <div className="status-update-card-author-title">{author.jobTitle}</div>
                        )}
                    </div>
                </Link>
                <div className="status-update-card-header-actions">
                    <div className="status-update-card-meta">
                        <span className="status-update-card-time">{formatTimeAgo(createdAt)}</span>
                    </div>

                    {/* Settings Menu - Admin Only */}
                    {isAdmin && (
                        <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
                            <Popover.Trigger asChild>
                                <button className="status-update-menu-trigger" aria-label="Post options">
                                    <Icon icon="more-vertical" size={18} />
                                </button>
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content className="status-update-menu" sideOffset={5} align="end">
                                    <div className="status-update-menu-items">
                                        {/* Pin/Unpin */}
                                        {isPinned ? (
                                            <button className="status-update-menu-item" onClick={handleUnpinPost}>
                                                <Icon icon="pin-off" size={16} />
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
                                            <Icon icon="radio" size={16} />
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
                                            <Icon icon="alert-triangle" size={16} />
                                            <span>Mark as spam</span>
                                        </button>

                                        {/* Delete */}
                                        <button className="status-update-menu-item danger" onClick={handleDeletePost}>
                                            <Icon icon="trash-2" size={16} />
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
            <div className="status-update-card-content">
                <div className="status-update-card-text">
                    {emoji && <span className="status-update-card-emoji">{emoji}</span>}
                    <span>{text}</span>
                </div>

                {/* Media Attachments */}
                {statusUpdate.media && statusUpdate.media.length > 0 && (
                    <div className={`status-update-card-media ${statusUpdate.media.length === 1 ? 'single' : 'grid'}`}>
                        {statusUpdate.media.map((media) => (
                            <div key={media.id} className="status-update-card-media-item">
                                {media.type === 'image' && (
                                    <div className="status-media-image">
                                        <img src={media.url} alt={media.caption || ''} />
                                        {media.caption && (
                                            <div className="status-media-caption">{media.caption}</div>
                                        )}
                                    </div>
                                )}
                                {media.type === 'video' && (
                                    <div className="status-media-video">
                                        <video src={media.url} controls poster={media.thumbnail} />
                                        {media.caption && (
                                            <div className="status-media-caption">{media.caption}</div>
                                        )}
                                    </div>
                                )}
                                {media.type === 'link' && (
                                    <a
                                        href={media.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="status-media-link-card"
                                    >
                                        {media.thumbnail && (
                                            <div className="status-media-link-image">
                                                <img src={media.thumbnail} alt="" />
                                            </div>
                                        )}
                                        <div className="status-media-link-content">
                                            {media.title && (
                                                <div className="status-media-link-title">{media.title}</div>
                                            )}
                                            {media.description && (
                                                <div className="status-media-link-description">{media.description}</div>
                                            )}
                                            <div className="status-media-link-url">
                                                {media.favicon && <img src={media.favicon} alt="" className="status-media-favicon" />}
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
                <div className="status-update-card-context">
                    <Link href={`/spaces/${space.id}`} className="status-update-card-space">
                        <Icon icon="users" size={14} />
                        <span>{space.title}</span>
                    </Link>

                    {project && (
                        <div className="status-update-card-project">
                            <Icon icon="folder" size={14} />
                            <span>{project.name}</span>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="status-update-card-tags">
                        {tags.map((tag) => (
                            <span key={tag.id} className="status-update-card-tag">
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="status-update-card-actions">
                <button className="status-update-card-action">
                    <Icon icon="heart" size={16} />
                    <span>{likesCount > 0 ? likesCount : ''}</span>
                </button>
                <button className="status-update-card-action">
                    <Icon icon="comment" size={16} />
                    <span>{commentsCount > 0 ? commentsCount : ''}</span>
                </button>
                <button className="status-update-card-action">
                    <Icon icon="bookmark" size={16} />
                </button>
            </div>
        </div>
    );
}
