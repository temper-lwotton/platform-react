'use client';

import Link from 'next/link';
import { Showcase } from '@/lib/showcases';
import { Icon } from '../Icon';
import { Avatar, Badge } from '../primitives';
import styles from './ShowcaseCard.module.scss';

interface ShowcaseCardProps {
    showcase: Showcase;
}

export function ShowcaseCard({ showcase }: ShowcaseCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getProjectDuration = () => {
        if (!showcase.projectStart || !showcase.projectEnd) return null;
        const start = new Date(showcase.projectStart);
        const end = new Date(showcase.projectEnd);
        const diffMs = end.getTime() - start.getTime();
        const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));

        if (diffMonths < 1) return '< 1 month';
        if (diffMonths === 1) return '1 month';
        return `${diffMonths} months`;
    };

    // Strip HTML and get first 200 chars
    const getExcerpt = () => {
        if (showcase.excerpt) return showcase.excerpt;
        const text = showcase.htmlContent.replace(/<[^>]*>/g, '');
        return text.length > 200 ? text.substring(0, 200) + '...' : text;
    };

    const duration = getProjectDuration();

    return (
        <Link href={`/showcases/${showcase.id}`} className={styles.link}>
            <article className={styles.card}>
                {showcase.media && showcase.media.length > 0 && (
                    <div className={styles.imageWrapper}>
                        <img
                            src={showcase.media[0].url}
                            alt={showcase.media[0].caption || showcase.title}
                            className={styles.image}
                        />
                        {showcase.media.length > 1 && (
                            <span className={styles.imageCount}>
                                <Icon icon="eye" size={14} />
                                {showcase.media.length}
                            </span>
                        )}
                    </div>
                )}

                <div className={styles.content}>
                    <div className={styles.header}>
                        {showcase.isPinned && (
                            <Badge variant="warning" size="sm">
                                <Icon icon="pin" size={14} />
                                Featured
                            </Badge>
                        )}
                    </div>

                    <h3 className={styles.title}>{showcase.title}</h3>

                    <p className={styles.excerpt}>{getExcerpt()}</p>

                    {showcase.impactMetrics && showcase.impactMetrics.length > 0 && (
                        <div className={styles.metrics}>
                            {showcase.impactMetrics.slice(0, 3).map((metric, index) => (
                                <div key={index} className={styles.metric}>
                                    <span className={styles.metricValue}>{metric.value}</span>
                                    <span className={styles.metricLabel}>{metric.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {showcase.teamMembers && showcase.teamMembers.length > 0 && (
                        <div className={styles.team}>
                            <span className={styles.teamLabel}>Team:</span>
                            <div className={styles.teamAvatars}>
                                {showcase.teamMembers.slice(0, 4).map((member) => (
                                    <Avatar
                                        key={member.id}
                                        src={member.photo}
                                        alt={member.fullName}
                                        fallback={member.fullName.charAt(0).toUpperCase()}
                                        size="xs"
                                        className={styles.teamAvatar}
                                    />
                                ))}
                                {showcase.teamMembers.length > 4 && (
                                    <Badge variant="default" size="sm" className={styles.teamMore}>
                                        +{showcase.teamMembers.length - 4}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    <div className={styles.meta}>
                        <Avatar
                            src={showcase.author.profile?.photo}
                            alt={showcase.author.fullName}
                            fallback={showcase.author.fullName.charAt(0).toUpperCase()}
                            size="sm"
                        />
                        <div className={styles.authorInfo}>
                            <span className={styles.author}>{showcase.author.fullName}</span>
                            {duration && (
                                <span className={styles.duration}>
                                    <Icon icon="clock" size={14} />
                                    {duration}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <span className={styles.stat}>
                            <Icon icon="heart" size={16} />
                            {showcase.likesCount}
                        </span>
                        <span className={styles.stat}>
                            <Icon icon="comment" size={16} />
                            {showcase.commentsCount}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
