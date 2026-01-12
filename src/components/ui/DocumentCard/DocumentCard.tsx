'use client';

import Link from 'next/link';
import { Document } from '@/lib/documents';
import { Icon } from '../Icon';
import { Avatar, Badge } from '../primitives';
import styles from './DocumentCard.module.scss';

interface DocumentCardProps {
    document: Document;
    viewType?: 'grid' | 'list';
}

export function DocumentCard({ document, viewType = 'grid' }: DocumentCardProps) {
    const getStatusVariant = (): 'success' | 'warning' | 'default' => {
        switch (document.status) {
            case 'published':
                return 'success';
            case 'draft':
                return 'warning';
            case 'archived':
                return 'default';
            default:
                return 'default';
        }
    };

    const getVisibilityIcon = () => {
        switch (document.visibility) {
            case 'public':
                return 'globe' as const;
            case 'members':
                return 'users' as const;
            case 'private':
                return 'lock' as const;
            default:
                return 'fileText' as const;
        }
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <Link
            href={`/documents/${document.id}`}
            className={`${styles.card} ${viewType === 'list' ? styles.listView : ''}`}
        >
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <Badge variant={getStatusVariant()} size="sm">
                        {document.status}
                    </Badge>
                    <div className={styles.visibility}>
                        <Icon icon={getVisibilityIcon()} size={14} />
                    </div>
                </div>
                <h3 className={styles.title}>{document.title}</h3>
                {document.excerpt && (
                    <p className={styles.excerpt}>{document.excerpt}</p>
                )}
            </div>

            <div className={styles.meta}>
                <div className={styles.author}>
                    <Avatar
                        src={document.authorPhoto}
                        alt={document.authorName || 'Unknown'}
                        fallback={document.authorName?.charAt(0).toUpperCase() || 'U'}
                        size="sm"
                    />
                    <div className={styles.authorInfo}>
                        <div className={styles.authorName}>{document.authorName || 'Unknown'}</div>
                        <div className={styles.date}>
                            Updated {formatDate(document.updatedAt)}
                        </div>
                    </div>
                </div>

                {document.collaborators && document.collaborators.length > 0 && (
                    <div className={styles.collaborators}>
                        <div className={styles.collaboratorAvatars}>
                            {document.collaborators.slice(0, 3).map((collab) => (
                                <Avatar
                                    key={collab.id}
                                    src={collab.photo}
                                    alt={collab.name}
                                    fallback={collab.name.charAt(0).toUpperCase()}
                                    size="xs"
                                />
                            ))}
                            {document.collaborators.length > 3 && (
                                <span className={styles.collaboratorCount}>
                                    +{document.collaborators.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {document.tags && document.tags.length > 0 && (
                <div className={styles.tags}>
                    {document.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" size="sm">
                            {tag}
                        </Badge>
                    ))}
                </div>
            )}

            <div className={styles.footer}>
                <div className={styles.stat}>
                    <Icon icon="eye" size={14} />
                    <span>{document.stats?.views || 0}</span>
                </div>
                <div className={styles.stat}>
                    <Icon icon="pencil" size={14} />
                    <span>{document.stats?.edits || 0}</span>
                </div>
                <div className={styles.stat}>
                    <Icon icon="comment" size={14} />
                    <span>{document.stats?.comments || 0}</span>
                </div>
                <div className={styles.stat}>
                    <Icon icon="fileText" size={14} />
                    <span>{document.wordCount} words</span>
                </div>
            </div>
        </Link>
    );
}
