'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from './Icon';

type SuggestionType = 'user' | 'space' | 'event' | 'discussion' | 'resource' | 'showcase';

interface Suggestion {
    id: string;
    type: SuggestionType;
    title: string;
    description: string;
    reason: string;
    image?: string;
    url: string;
    metadata?: {
        memberCount?: number;
        date?: string;
        author?: string;
        replies?: number;
    };
}

// Mock data - this will be replaced with API data
const MOCK_SUGGESTIONS: Suggestion[] = [
    {
        id: '1',
        type: 'user',
        title: 'Dr. Emily Chen',
        description: 'AI Research Scientist specializing in neural networks and deep learning',
        reason: 'You both have interest in Machine Learning and Neural Networks',
        image: '/avatars/emily.jpg',
        url: '/users/15',
    },
    {
        id: '2',
        type: 'space',
        title: 'Quantum Computing Enthusiasts',
        description: 'A community exploring the frontiers of quantum computing and its applications',
        reason: 'Based on your interest in Advanced Computing and Physics',
        url: '/spaces/45',
        metadata: {
            memberCount: 234,
        },
    },
    {
        id: '3',
        type: 'event',
        title: 'AI Ethics Workshop 2024',
        description: 'Discussing ethical considerations in AI development and deployment',
        reason: 'You\'ve been discussing AI safety in recent conversations',
        url: '/events/78',
        metadata: {
            date: 'Dec 15, 2024',
        },
    },
    {
        id: '4',
        type: 'discussion',
        title: 'Best practices for fine-tuning LLMs',
        description: 'Community discussion on effective strategies for fine-tuning large language models',
        reason: 'You and 5 others in your network are discussing this topic',
        url: '/spaces/23/discussions/89',
        metadata: {
            replies: 42,
            author: 'Alex Rodriguez',
        },
    },
    {
        id: '5',
        type: 'resource',
        title: 'Introduction to Transformer Architecture',
        description: 'Comprehensive guide covering attention mechanisms and transformer models',
        reason: 'Related to your recent reading on Neural Networks',
        url: '/resources/156',
    },
    {
        id: '6',
        type: 'user',
        title: 'Marcus Thompson',
        description: 'Full-stack developer passionate about distributed systems',
        reason: 'You both recently posted about Microservices Architecture',
        image: '/avatars/marcus.jpg',
        url: '/users/27',
    },
    {
        id: '7',
        type: 'showcase',
        title: 'Building a Real-time Collaborative Editor',
        description: 'How our team built a Google Docs alternative using CRDTs',
        reason: 'Matches your interest in Real-time Systems',
        url: '/showcases/92',
        metadata: {
            author: 'TechCorp Team',
        },
    },
    {
        id: '8',
        type: 'space',
        title: 'Climate Tech Innovators',
        description: 'Connecting researchers and entrepreneurs working on climate solutions',
        reason: 'Similar to other communities you\'ve joined',
        url: '/spaces/67',
        metadata: {
            memberCount: 189,
        },
    },
    {
        id: '9',
        type: 'event',
        title: 'Startup Pitch Night',
        description: 'Watch emerging startups pitch their innovative solutions to investors',
        reason: 'You attended similar events in Entrepreneurship',
        url: '/events/103',
        metadata: {
            date: 'Dec 20, 2024',
        },
    },
    {
        id: '10',
        type: 'discussion',
        title: 'Comparing RAG vs Fine-tuning approaches',
        description: 'Pros and cons of different methods for customizing LLM behavior',
        reason: 'Active discussion among people with similar interests',
        url: '/spaces/23/discussions/94',
        metadata: {
            replies: 28,
            author: 'Dr. Sarah Kim',
        },
    },
];

const getTypeIcon = (type: SuggestionType) => {
    switch (type) {
        case 'user':
            return 'user' as const;
        case 'space':
            return 'users' as const;
        case 'event':
            return 'calendar' as const;
        case 'discussion':
            return 'chat' as const;
        case 'resource':
            return 'book' as const;
        case 'showcase':
            return 'star' as const;
    }
};

const getTypeLabel = (type: SuggestionType): string => {
    switch (type) {
        case 'user':
            return 'Person';
        case 'space':
            return 'Space';
        case 'event':
            return 'Event';
        case 'discussion':
            return 'Discussion';
        case 'resource':
            return 'Resource';
        case 'showcase':
            return 'Success Story';
    }
};

export function SuggestedCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 10
        );
    };

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = container.clientWidth * 0.8;
        const newScrollLeft =
            direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

        container.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth',
        });

        // Update button states after animation
        setTimeout(checkScroll, 300);
    };

    return (
        <div className="suggested-carousel">
            <div className="suggested-carousel-header">
                <div className="suggested-carousel-title-row">
                    <Icon icon="sparkles" size={20} />
                    <h2 className="suggested-carousel-title">Suggested for you</h2>
                </div>
                <Link href="/suggestions" className="suggested-carousel-view-all">
                    View all suggestions
                    <Icon icon="chevronRight" size={16} />
                </Link>
            </div>

            <div className="suggested-carousel-container">
                {canScrollLeft && (
                    <button
                        className="suggested-carousel-nav suggested-carousel-nav--left"
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        <Icon icon="chevronLeft" size={20} />
                    </button>
                )}

                <div
                    ref={scrollContainerRef}
                    className="suggested-carousel-scroll"
                    onScroll={checkScroll}
                >
                    {MOCK_SUGGESTIONS.map((suggestion) => (
                        <Link
                            key={suggestion.id}
                            href={suggestion.url}
                            className="suggested-card"
                        >
                            <div className="suggested-card-header">
                                <div className="suggested-card-type">
                                    <Icon icon={getTypeIcon(suggestion.type)} size={14} />
                                    <span>{getTypeLabel(suggestion.type)}</span>
                                </div>
                            </div>

                            <div className="suggested-card-content">
                                {suggestion.type === 'user' ? (
                                    <div className="suggested-card-avatar">
                                        {suggestion.image ? (
                                            <img src={suggestion.image} alt={suggestion.title} />
                                        ) : (
                                            <span className="suggested-card-avatar-placeholder">
                                                {suggestion.title.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <div className="suggested-card-icon">
                                        <Icon icon={getTypeIcon(suggestion.type)} size={24} />
                                    </div>
                                )}

                                <h3 className="suggested-card-title">{suggestion.title}</h3>
                                <p className="suggested-card-description">{suggestion.description}</p>

                                {suggestion.metadata && (
                                    <div className="suggested-card-metadata">
                                        {suggestion.metadata.memberCount && (
                                            <span className="suggested-card-meta-item">
                                                <Icon icon="users" size={12} />
                                                {suggestion.metadata.memberCount} members
                                            </span>
                                        )}
                                        {suggestion.metadata.date && (
                                            <span className="suggested-card-meta-item">
                                                <Icon icon="calendar" size={12} />
                                                {suggestion.metadata.date}
                                            </span>
                                        )}
                                        {suggestion.metadata.replies !== undefined && (
                                            <span className="suggested-card-meta-item">
                                                <Icon icon="chat" size={12} />
                                                {suggestion.metadata.replies} replies
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="suggested-card-reason">
                                <Icon icon="sparkles" size={12} />
                                <span>{suggestion.reason}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {canScrollRight && (
                    <button
                        className="suggested-carousel-nav suggested-carousel-nav--right"
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                    >
                        <Icon icon="chevronRight" size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}
