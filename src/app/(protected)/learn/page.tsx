'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { LearningCard } from '@/components/ui/LearningCard/LearningCard';
import styles from './page.module.scss';

type ContentType = 'all' | 'article' | 'video';
type Category = 'all' | 'innovation' | 'technology' | 'business' | 'design' | 'leadership';

interface LearningContent {
    id: string;
    type: 'article' | 'video';
    title: string;
    excerpt: string;
    imageUrl: string;
    category: string;
    duration?: string; // for videos
    readTime?: string; // for articles
    author: {
        name: string;
        avatar?: string;
    };
    publishedAt: string;
    tags: string[];
}

// Placeholder data
const LEARNING_CONTENT: LearningContent[] = [
    {
        id: '1',
        type: 'article',
        title: 'The Future of AI in Innovation Management',
        excerpt: 'Exploring how artificial intelligence is transforming the way organizations manage and accelerate innovation processes.',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        category: 'innovation',
        readTime: '8 min read',
        author: {
            name: 'Dr. Sarah Chen',
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
        publishedAt: '2024-01-15',
        tags: ['AI', 'Innovation', 'Technology'],
    },
    {
        id: '2',
        type: 'video',
        title: 'Design Thinking Workshop: From Concept to Prototype',
        excerpt: 'A comprehensive guide to applying design thinking methodologies in real-world innovation challenges.',
        imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=400&fit=crop',
        category: 'design',
        duration: '24:30',
        author: {
            name: 'Marcus Johnson',
            avatar: 'https://i.pravatar.cc/150?img=12',
        },
        publishedAt: '2024-01-12',
        tags: ['Design Thinking', 'Prototyping', 'Workshop'],
    },
    {
        id: '3',
        type: 'article',
        title: 'Building a Culture of Innovation: Best Practices',
        excerpt: 'Learn how leading companies create environments that foster creativity, experimentation, and breakthrough ideas.',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
        category: 'leadership',
        readTime: '12 min read',
        author: {
            name: 'Emily Rodriguez',
            avatar: 'https://i.pravatar.cc/150?img=5',
        },
        publishedAt: '2024-01-10',
        tags: ['Culture', 'Leadership', 'Innovation'],
    },
    {
        id: '4',
        type: 'video',
        title: 'Quantum Computing: The Next Frontier',
        excerpt: 'Understanding the potential impact of quantum computing on business and technology innovation.',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        category: 'technology',
        duration: '18:45',
        author: {
            name: 'Dr. James Wilson',
            avatar: 'https://i.pravatar.cc/150?img=8',
        },
        publishedAt: '2024-01-08',
        tags: ['Quantum Computing', 'Technology', 'Future'],
    },
    {
        id: '5',
        type: 'article',
        title: 'Agile Innovation: Adapting to Market Changes',
        excerpt: 'Strategies for maintaining innovation velocity in rapidly changing market conditions and customer needs.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
        category: 'business',
        readTime: '10 min read',
        author: {
            name: 'Alex Thompson',
            avatar: 'https://i.pravatar.cc/150?img=14',
        },
        publishedAt: '2024-01-05',
        tags: ['Agile', 'Business Strategy', 'Market Analysis'],
    },
    {
        id: '6',
        type: 'video',
        title: 'Sustainable Innovation for a Better Future',
        excerpt: 'How companies are integrating sustainability into their innovation processes and product development.',
        imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop',
        category: 'innovation',
        duration: '32:15',
        author: {
            name: 'Dr. Maya Patel',
            avatar: 'https://i.pravatar.cc/150?img=9',
        },
        publishedAt: '2024-01-03',
        tags: ['Sustainability', 'Green Tech', 'Innovation'],
    },
    {
        id: '7',
        type: 'article',
        title: 'The Role of Data Analytics in Innovation',
        excerpt: 'Leveraging data-driven insights to identify opportunities, validate ideas, and measure innovation success.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        category: 'technology',
        readTime: '15 min read',
        author: {
            name: 'David Park',
            avatar: 'https://i.pravatar.cc/150?img=13',
        },
        publishedAt: '2024-01-01',
        tags: ['Data Analytics', 'Innovation Metrics', 'Strategy'],
    },
    {
        id: '8',
        type: 'video',
        title: 'Leading Remote Innovation Teams',
        excerpt: 'Best practices for managing and inspiring innovation teams in distributed and hybrid work environments.',
        imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop',
        category: 'leadership',
        duration: '21:10',
        author: {
            name: 'Lisa Anderson',
            avatar: 'https://i.pravatar.cc/150?img=10',
        },
        publishedAt: '2023-12-28',
        tags: ['Remote Work', 'Team Management', 'Leadership'],
    },
];

export default function LearnPage() {
    const [typeFilter, setTypeFilter] = useState<ContentType>('all');
    const [categoryFilter, setCategoryFilter] = useState<Category>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredContent = LEARNING_CONTENT.filter((content) => {
        const matchesType = typeFilter === 'all' || content.type === typeFilter;
        const matchesCategory = categoryFilter === 'all' || content.category === categoryFilter;
        const matchesSearch =
            searchQuery === '' ||
            content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            content.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            content.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesType && matchesCategory && matchesSearch;
    });

    const stats = {
        total: LEARNING_CONTENT.length,
        articles: LEARNING_CONTENT.filter((c) => c.type === 'article').length,
        videos: LEARNING_CONTENT.filter((c) => c.type === 'video').length,
    };

    return (
        <div className={styles.learnPage}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.titleSection}>
                        <h1 className={styles.title}>Learning Center</h1>
                        <p className={styles.subtitle}>
                            Discover articles, videos, and resources to fuel your innovation journey
                        </p>
                    </div>

                    <div className={styles.stats}>
                        <div className={styles.statCard}>
                            <Icon icon="fileText" size={20} />
                            <div>
                                <div className={styles.statValue}>{stats.articles}</div>
                                <div className={styles.statLabel}>Articles</div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <Icon icon="video" size={20} />
                            <div>
                                <div className={styles.statValue}>{stats.videos}</div>
                                <div className={styles.statLabel}>Videos</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <div className={styles.searchBar}>
                    <Icon icon="search" size={20} />
                    <input
                        type="text"
                        placeholder="Search content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Type:</label>
                    <div className={styles.filterButtons}>
                        <button
                            className={`${styles.filterButton} ${typeFilter === 'all' ? styles.active : ''}`}
                            onClick={() => setTypeFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`${styles.filterButton} ${typeFilter === 'article' ? styles.active : ''}`}
                            onClick={() => setTypeFilter('article')}
                        >
                            <Icon icon="fileText" size={16} />
                            Articles
                        </button>
                        <button
                            className={`${styles.filterButton} ${typeFilter === 'video' ? styles.active : ''}`}
                            onClick={() => setTypeFilter('video')}
                        >
                            <Icon icon="video" size={16} />
                            Videos
                        </button>
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Category:</label>
                    <div className={styles.filterButtons}>
                        <button
                            className={`${styles.filterButton} ${categoryFilter === 'all' ? styles.active : ''}`}
                            onClick={() => setCategoryFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`${styles.filterButton} ${categoryFilter === 'innovation' ? styles.active : ''}`}
                            onClick={() => setCategoryFilter('innovation')}
                        >
                            Innovation
                        </button>
                        <button
                            className={`${styles.filterButton} ${categoryFilter === 'technology' ? styles.active : ''}`}
                            onClick={() => setCategoryFilter('technology')}
                        >
                            Technology
                        </button>
                        <button
                            className={`${styles.filterButton} ${categoryFilter === 'business' ? styles.active : ''}`}
                            onClick={() => setCategoryFilter('business')}
                        >
                            Business
                        </button>
                        <button
                            className={`${styles.filterButton} ${categoryFilter === 'design' ? styles.active : ''}`}
                            onClick={() => setCategoryFilter('design')}
                        >
                            Design
                        </button>
                        <button
                            className={`${styles.filterButton} ${categoryFilter === 'leadership' ? styles.active : ''}`}
                            onClick={() => setCategoryFilter('leadership')}
                        >
                            Leadership
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className={styles.contentGrid}>
                {filteredContent.length > 0 ? (
                    filteredContent.map((content) => (
                        <LearningCard key={content.id} content={content} />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <Icon icon="search" size={48} />
                        <h3>No content found</h3>
                        <p>Try adjusting your filters or search query</p>
                    </div>
                )}
            </div>
        </div>
    );
}
