'use client';

import Link from 'next/link';
import { Resource } from '@/lib/resources';
import { Icon } from './Icon';

interface ResourceCardProps {
    resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getResourceTypeIcon = (type: string) => {
        switch (type) {
            case 'guide': return 'book';
            case 'template': return 'document';
            case 'documentation': return 'file';
            case 'best-practice': return 'star';
            case 'tool': return 'settings';
            default: return 'file';
        }
    };

    const getResourceTypeLabel = (type: string) => {
        switch (type) {
            case 'guide': return 'Guide';
            case 'template': return 'Template';
            case 'documentation': return 'Documentation';
            case 'best-practice': return 'Best Practice';
            case 'tool': return 'Tool';
            default: return type;
        }
    };

    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case 'beginner': return 'difficulty-beginner';
            case 'intermediate': return 'difficulty-intermediate';
            case 'advanced': return 'difficulty-advanced';
            default: return '';
        }
    };

    const formatTime = (minutes?: number) => {
        if (!minutes) return null;
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Strip HTML and get first 200 chars
    const getExcerpt = () => {
        if (resource.excerpt) return resource.excerpt;
        const text = resource.htmlContent.replace(/<[^>]*>/g, '');
        return text.length > 200 ? text.substring(0, 200) + '...' : text;
    };

    const estimatedTime = formatTime(resource.estimatedTime);

    return (
        <Link href={`/resources/${resource.id}`} className="resource-card-link">
            <article className="resource-card">
                <div className="resource-card-header">
                    <div className="resource-card-badges">
                        <span className="resource-type-badge">
                            <Icon icon={getResourceTypeIcon(resource.resourceType)} size={14} />
                            <span>{getResourceTypeLabel(resource.resourceType)}</span>
                        </span>
                        {resource.difficulty && (
                            <span className={`difficulty-badge ${getDifficultyColor(resource.difficulty)}`}>
                                {resource.difficulty}
                            </span>
                        )}
                        {resource.isPinned && (
                            <span className="pinned-badge">
                                <Icon icon="pin" size={14} />
                                <span>Pinned</span>
                            </span>
                        )}
                    </div>
                    {estimatedTime && (
                        <span className="resource-card-time">
                            <Icon icon="clock" size={14} />
                            {estimatedTime}
                        </span>
                    )}
                </div>

                <h3 className="resource-card-title">{resource.title}</h3>

                <p className="resource-card-excerpt">{getExcerpt()}</p>

                {resource.attachments && resource.attachments.length > 0 && (
                    <div className="resource-card-attachments">
                        <Icon icon="download" size={14} />
                        <span>
                            {resource.attachments.length} file{resource.attachments.length !== 1 ? 's' : ''}
                            {resource.attachments.length === 1 && (
                                <> ({formatFileSize(resource.attachments[0].size)})</>
                            )}
                        </span>
                    </div>
                )}

                <div className="resource-card-footer">
                    <div className="resource-card-author">
                        {resource.author.profile?.photo ? (
                            <img
                                src={resource.author.profile.photo}
                                alt={resource.author.fullName}
                                className="resource-card-author-photo"
                            />
                        ) : (
                            <div className="resource-card-author-placeholder">
                                {resource.author.fullName.charAt(0)}
                            </div>
                        )}
                        <div className="resource-card-author-info">
                            <span className="resource-card-author-name">{resource.author.fullName}</span>
                            <span className="resource-card-space">{resource.space.title}</span>
                        </div>
                    </div>
                    <div className="resource-card-meta">
                        {resource.version && (
                            <>
                                <span className="resource-card-version">v{resource.version}</span>
                                <span className="resource-card-separator">•</span>
                            </>
                        )}
                        <span className="resource-card-date">{formatDate(resource.updatedAt)}</span>
                    </div>
                </div>

                <div className="resource-card-stats">
                    <span className="resource-card-stat">
                        <Icon icon="eye" size={16} />
                        {resource.viewCount}
                    </span>
                    <span className="resource-card-stat">
                        <Icon icon="download" size={16} />
                        {resource.downloadCount}
                    </span>
                    <span className="resource-card-stat">
                        <Icon icon={resource.isHelpful ? 'thumbsUpFilled' : 'thumbsUp'} size={16} />
                        {resource.helpfulCount}
                    </span>
                </div>
            </article>
        </Link>
    );
}
