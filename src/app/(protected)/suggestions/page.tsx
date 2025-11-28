'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

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
    {
        id: '11',
        type: 'user',
        title: 'Dr. Priya Sharma',
        description: 'Neuroscientist exploring brain-computer interfaces',
        reason: 'You both follow similar research topics',
        image: '/avatars/priya.jpg',
        url: '/users/42',
    },
    {
        id: '12',
        type: 'space',
        title: 'Web3 Developers Guild',
        description: 'Community for blockchain developers and Web3 enthusiasts',
        reason: 'Based on your participation in Decentralized Systems',
        url: '/spaces/89',
        metadata: {
            memberCount: 567,
        },
    },
    {
        id: '13',
        type: 'resource',
        title: 'Advanced Git Workflows',
        description: 'Master branching strategies and collaborative development',
        reason: 'Popular among developers in your network',
        url: '/resources/234',
    },
    {
        id: '14',
        type: 'showcase',
        title: 'Scaling to 1M Users',
        description: 'Our journey from MVP to serving a million users',
        reason: 'Relevant to your interest in System Architecture',
        url: '/showcases/145',
        metadata: {
            author: 'StartupCo Engineering',
        },
    },
    {
        id: '15',
        type: 'event',
        title: 'Open Source Contribution Day',
        description: 'Join us for a day of contributing to open source projects',
        reason: 'You\'ve shown interest in Open Source Development',
        url: '/events/167',
        metadata: {
            date: 'Jan 10, 2025',
        },
    },
];

const getTypeIcon = (type: SuggestionType): string => {
    switch (type) {
        case 'user':
            return 'user';
        case 'space':
            return 'users';
        case 'event':
            return 'calendar';
        case 'discussion':
            return 'chat';
        case 'resource':
            return 'book';
        case 'showcase':
            return 'star';
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

export default function SuggestionsPage() {
    const [filterType, setFilterType] = useState<SuggestionType | 'all'>('all');

    const filteredSuggestions = filterType === 'all'
        ? MOCK_SUGGESTIONS
        : MOCK_SUGGESTIONS.filter(s => s.type === filterType);

    return (
        <main className="suggestions-page-container">
            <div className="suggestions-page-main">
                <header className="suggestions-header">
                    <div className="suggestions-header-title">
                        <Icon icon="sparkles" size={24} />
                        <h1 className="suggestions-title">Suggestions for You</h1>
                    </div>
                    <p className="suggestions-subtitle">
                        Discover people, spaces, and content tailored to your interests
                    </p>
                </header>

                {/* Filter Tabs */}
                <div className="suggestions-filters">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`suggestions-filter-btn ${filterType === 'all' ? 'suggestions-filter-btn--active' : ''}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterType('user')}
                        className={`suggestions-filter-btn ${filterType === 'user' ? 'suggestions-filter-btn--active' : ''}`}
                    >
                        <Icon icon="user" size={16} />
                        People
                    </button>
                    <button
                        onClick={() => setFilterType('space')}
                        className={`suggestions-filter-btn ${filterType === 'space' ? 'suggestions-filter-btn--active' : ''}`}
                    >
                        <Icon icon="users" size={16} />
                        Spaces
                    </button>
                    <button
                        onClick={() => setFilterType('event')}
                        className={`suggestions-filter-btn ${filterType === 'event' ? 'suggestions-filter-btn--active' : ''}`}
                    >
                        <Icon icon="calendar" size={16} />
                        Events
                    </button>
                    <button
                        onClick={() => setFilterType('discussion')}
                        className={`suggestions-filter-btn ${filterType === 'discussion' ? 'suggestions-filter-btn--active' : ''}`}
                    >
                        <Icon icon="chat" size={16} />
                        Discussions
                    </button>
                    <button
                        onClick={() => setFilterType('resource')}
                        className={`suggestions-filter-btn ${filterType === 'resource' ? 'suggestions-filter-btn--active' : ''}`}
                    >
                        <Icon icon="book" size={16} />
                        Resources
                    </button>
                    <button
                        onClick={() => setFilterType('showcase')}
                        className={`suggestions-filter-btn ${filterType === 'showcase' ? 'suggestions-filter-btn--active' : ''}`}
                    >
                        <Icon icon="star" size={16} />
                        Showcases
                    </button>
                </div>

                {/* Suggestions Grid */}
                <div className="suggestions-grid">
                    {filteredSuggestions.map((suggestion) => (
                        <Link
                            key={suggestion.id}
                            href={suggestion.url}
                            className="suggestion-card"
                        >
                            <div className="suggestion-card-header">
                                <div className="suggestion-card-type">
                                    <Icon icon={getTypeIcon(suggestion.type)} size={14} />
                                    <span>{getTypeLabel(suggestion.type)}</span>
                                </div>
                            </div>

                            <div className="suggestion-card-content">
                                {suggestion.type === 'user' ? (
                                    <div className="suggestion-card-avatar">
                                        {suggestion.image ? (
                                            <img src={suggestion.image} alt={suggestion.title} />
                                        ) : (
                                            <span className="suggestion-card-avatar-placeholder">
                                                {suggestion.title.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <div className="suggestion-card-icon">
                                        <Icon icon={getTypeIcon(suggestion.type)} size={32} />
                                    </div>
                                )}

                                <h3 className="suggestion-card-title">{suggestion.title}</h3>
                                <p className="suggestion-card-description">{suggestion.description}</p>

                                {suggestion.metadata && (
                                    <div className="suggestion-card-metadata">
                                        {suggestion.metadata.memberCount && (
                                            <span className="suggestion-card-meta-item">
                                                <Icon icon="users" size={12} />
                                                {suggestion.metadata.memberCount} members
                                            </span>
                                        )}
                                        {suggestion.metadata.date && (
                                            <span className="suggestion-card-meta-item">
                                                <Icon icon="calendar" size={12} />
                                                {suggestion.metadata.date}
                                            </span>
                                        )}
                                        {suggestion.metadata.replies !== undefined && (
                                            <span className="suggestion-card-meta-item">
                                                <Icon icon="chat" size={12} />
                                                {suggestion.metadata.replies} replies
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="suggestion-card-reason">
                                <Icon icon="sparkles" size={12} />
                                <span>{suggestion.reason}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredSuggestions.length === 0 && (
                    <div className="suggestions-empty">
                        <Icon icon="sparkles" size={48} />
                        <p className="suggestions-empty-title">No suggestions available</p>
                        <p className="suggestions-empty-description">
                            Check back later for personalized recommendations
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
