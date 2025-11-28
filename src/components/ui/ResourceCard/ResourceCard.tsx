'use client';

import Link from 'next/link';
import { Resource } from '@/lib/resources';
import { Icon } from '../Icon';
import { Avatar, Badge } from '../primitives';
import styles from './ResourceCard.module.scss';

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
            case 'template': return 'fileText';
            case 'documentation': return 'fileText';
            case 'best-practice': return 'star';
            case 'tool': return 'settings';
            default: return 'fileText';
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

    const getDifficultyVariant = (difficulty?: string): 'success' | 'warning' | 'danger' | 'default' => {
        switch (difficulty) {
            case 'beginner': return 'success';
            case 'intermediate': return 'warning';
            case 'advanced': return 'danger';
            default: return 'default';
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
        <Link href={`/resources/${resource.id}`} className={styles.link}>
            <article className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.badges}>
                        <Badge variant="primary" size="sm">
                            <Icon icon={getResourceTypeIcon(resource.resourceType)} size={14} />
                            {getResourceTypeLabel(resource.resourceType)}
                        </Badge>
                        {resource.difficulty && (
                            <Badge variant={getDifficultyVariant(resource.difficulty)} size="sm">
                                {resource.difficulty}
                            </Badge>
                        )}
                        {resource.isPinned && (
                            <Badge variant="warning" size="sm">
                                <Icon icon="pin" size={14} />
                                Pinned
                            </Badge>
                        )}
                    </div>
                    {estimatedTime && (
                        <span className={styles.time}>
                            <Icon icon="clock" size={14} />
                            {estimatedTime}
                        </span>
                    )}
                </div>

                <h3 className={styles.title}>{resource.title}</h3>

                <p className={styles.excerpt}>{getExcerpt()}</p>

                {resource.attachments && resource.attachments.length > 0 && (
                    <div className={styles.attachments}>
                        <Icon icon="download" size={14} />
                        <span>
                            {resource.attachments.length} file{resource.attachments.length !== 1 ? 's' : ''}
                            {resource.attachments.length === 1 && (
                                <> ({formatFileSize(resource.attachments[0].size)})</>
                            )}
                        </span>
                    </div>
                )}

                <div className={styles.footer}>
                    <div className={styles.author}>
                        <Avatar
                            src={resource.author.profile?.photo}
                            alt={resource.author.fullName}
                            fallback={resource.author.fullName.charAt(0).toUpperCase()}
                            size="sm"
                        />
                        <div className={styles.authorInfo}>
                            <span className={styles.authorName}>{resource.author.fullName}</span>
                            <span className={styles.space}>{resource.space.title}</span>
                        </div>
                    </div>
                    <div className={styles.meta}>
                        {resource.version && (
                            <>
                                <span className={styles.version}>v{resource.version}</span>
                                <span className={styles.separator}>•</span>
                            </>
                        )}
                        <span className={styles.date}>{formatDate(resource.updatedAt)}</span>
                    </div>
                </div>

                <div className={styles.stats}>
                    <span className={styles.stat}>
                        <Icon icon="eye" size={16} />
                        {resource.viewCount}
                    </span>
                    <span className={styles.stat}>
                        <Icon icon="download" size={16} />
                        {resource.downloadCount}
                    </span>
                    <span className={styles.stat}>
                        <Icon icon="thumbsUp" size={16} />
                        {resource.helpfulCount}
                    </span>
                </div>
            </article>
        </Link>
    );
}
