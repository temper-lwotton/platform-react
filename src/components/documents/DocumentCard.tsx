'use client';

import Link from 'next/link';
import { Document } from '@/lib/documents';
import { Icon } from '@/components/ui/Icon';

interface DocumentCardProps {
    document: Document;
    viewType?: 'grid' | 'list';
}

export function DocumentCard({ document, viewType = 'grid' }: DocumentCardProps) {
    const getStatusColor = () => {
        switch (document.status) {
            case 'published':
                return 'document-status-badge--published';
            case 'draft':
                return 'document-status-badge--draft';
            case 'archived':
                return 'document-status-badge--archived';
            default:
                return '';
        }
    };

    const getVisibilityIcon = () => {
        switch (document.visibility) {
            case 'public':
                return 'globe';
            case 'members':
                return 'users';
            case 'private':
                return 'lock';
            default:
                return 'file';
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
            className={`document-card ${viewType === 'list' ? 'document-card--list' : ''}`}
        >
            <div className="document-card-header">
                <div className="document-card-header-top">
                    <span className={`document-status-badge ${getStatusColor()}`}>
                        {document.status}
                    </span>
                    <div className="document-card-visibility">
                        <Icon icon={getVisibilityIcon()} size={14} />
                    </div>
                </div>
                <h3 className="document-card-title">{document.title}</h3>
                {document.excerpt && (
                    <p className="document-card-excerpt">{document.excerpt}</p>
                )}
            </div>

            <div className="document-card-meta">
                <div className="document-card-author">
                    <div className="document-card-author-avatar">
                        {document.authorPhoto ? (
                            <img src={document.authorPhoto} alt={document.authorName} />
                        ) : (
                            document.authorName.charAt(0)
                        )}
                    </div>
                    <div className="document-card-author-info">
                        <div className="document-card-author-name">{document.authorName}</div>
                        <div className="document-card-date">
                            Updated {formatDate(document.updatedAt)}
                        </div>
                    </div>
                </div>

                {document.collaborators.length > 0 && (
                    <div className="document-card-collaborators">
                        <div className="document-card-collaborators-avatars">
                            {document.collaborators.slice(0, 3).map((collab) => (
                                <div
                                    key={collab.id}
                                    className="document-card-collaborator-avatar"
                                    title={collab.name}
                                >
                                    {collab.photo ? (
                                        <img src={collab.photo} alt={collab.name} />
                                    ) : (
                                        collab.name.charAt(0)
                                    )}
                                </div>
                            ))}
                            {document.collaborators.length > 3 && (
                                <div className="document-card-collaborator-count">
                                    +{document.collaborators.length - 3}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {document.tags && document.tags.length > 0 && (
                <div className="document-card-tags">
                    {document.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="document-card-tag">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="document-card-footer">
                <div className="document-card-stat">
                    <Icon icon="eye" size={14} />
                    <span>{document.stats?.views || 0}</span>
                </div>
                <div className="document-card-stat">
                    <Icon icon="pencil" size={14} />
                    <span>{document.stats?.edits || 0}</span>
                </div>
                <div className="document-card-stat">
                    <Icon icon="comment" size={14} />
                    <span>{document.stats?.comments || 0}</span>
                </div>
                <div className="document-card-stat">
                    <Icon icon="fileText" size={14} />
                    <span>{document.wordCount} words</span>
                </div>
            </div>
        </Link>
    );
}
