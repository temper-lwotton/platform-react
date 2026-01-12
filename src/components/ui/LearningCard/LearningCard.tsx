import Link from 'next/link';
import { Icon } from '../Icon';
import { Avatar } from '../primitives';
import styles from './LearningCard.module.scss';

interface LearningContent {
    id: string;
    type: 'article' | 'video';
    title: string;
    excerpt: string;
    imageUrl: string;
    category: string;
    duration?: string;
    readTime?: string;
    author: {
        name: string;
        avatar?: string;
    };
    publishedAt: string;
    tags: string[];
}

interface LearningCardProps {
    content: LearningContent;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function LearningCard({ content }: LearningCardProps) {
    const contentUrl = `/learn/${content.id}`;

    return (
        <Link href={contentUrl} className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={content.imageUrl} alt={content.title} className={styles.image} />
                <div className={styles.typeBadge}>
                    {content.type === 'video' ? (
                        <>
                            <Icon icon="video" size={14} />
                            <span>{content.duration}</span>
                        </>
                    ) : (
                        <>
                            <Icon icon="fileText" size={14} />
                            <span>{content.readTime}</span>
                        </>
                    )}
                </div>
                {content.type === 'video' && (
                    <div className={styles.playButton}>
                        <Icon icon="play" size={24} />
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.category}>{content.category}</div>

                <h3 className={styles.title}>{content.title}</h3>
                <p className={styles.excerpt}>{content.excerpt}</p>

                <div className={styles.tags}>
                    {content.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className={styles.tag}>
                            {tag}
                        </span>
                    ))}
                </div>

                <div className={styles.footer}>
                    <div className={styles.author}>
                        <Avatar
                            src={content.author.avatar}
                            alt={content.author.name}
                            fallback={content.author.name.charAt(0).toUpperCase()}
                            size="sm"
                        />
                        <div className={styles.authorInfo}>
                            <div className={styles.authorName}>{content.author.name}</div>
                            <div className={styles.date}>{formatDate(content.publishedAt)}</div>
                        </div>
                    </div>

                    <div className={styles.arrow}>
                        <Icon icon="chevronRight" size={20} />
                    </div>
                </div>
            </div>
        </Link>
    );
}
