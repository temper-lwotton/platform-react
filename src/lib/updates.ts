// Mock implementation for Updates/Announcements
// This will be replaced with real API calls once backend is ready

export interface Update {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    excerpt?: string;
    htmlContent: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    category: 'news' | 'milestone' | 'policy' | 'announcement' | 'other';
    expiresAt?: string;
    pinUntil?: string;
    author: {
        id: string;
        fullName: string;
        profile?: {
            fullName?: string;
            firstName?: string;
            lastName?: string;
            photo?: string;
        };
    };
    space: {
        id: string;
        title: string;
    };
    tags?: { id: number; name: string }[];
    likesCount: number;
    commentsCount: number;
    isPinned: boolean;
    isLiked: boolean;
}

export interface CreateUpdateData {
    title: string;
    excerpt?: string;
    htmlContent: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    category: 'news' | 'milestone' | 'policy' | 'announcement' | 'other';
    space: number;
    expiresAt?: string;
    tags?: number[];
}

// Mock data
export const MOCK_UPDATES: Update[] = [
    {
        id: '1',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        title: 'New Innovation Fund Applications Now Open',
        excerpt: 'We\'re excited to announce that applications for our Q1 2025 Innovation Fund are now open. This quarter, we\'re focusing on sustainable transport solutions.',
        htmlContent: '<p>We\'re excited to announce that applications for our Q1 2025 Innovation Fund are now open. This quarter, we\'re focusing on sustainable transport solutions.</p><p>Key details:</p><ul><li>Application deadline: January 31, 2025</li><li>Funding range: $10k - $50k per project</li><li>Focus areas: Electric vehicles, public transit, bike infrastructure</li></ul><p>Visit the <a href="/resources/innovation-fund-guide">Innovation Fund Guide</a> for application instructions.</p>',
        priority: 'high',
        category: 'announcement',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        author: {
            id: '1',
            fullName: 'Sarah Johnson',
            profile: {
                fullName: 'Sarah Johnson',
                photo: 'https://i.pravatar.cc/150?img=1',
            },
        },
        space: {
            id: '1',
            title: 'Innovation Hub',
        },
        tags: [{ id: 1, name: 'funding' }, { id: 2, name: 'opportunity' }],
        likesCount: 24,
        commentsCount: 7,
        isPinned: true,
        isLiked: false,
    },
    {
        id: '2',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        title: 'Milestone: 100 Projects Submitted This Quarter!',
        excerpt: 'Amazing news - we\'ve reached 100 project submissions this quarter, doubling our previous record!',
        htmlContent: '<p>Amazing news - we\'ve reached <strong>100 project submissions</strong> this quarter, doubling our previous record! 🎉</p><p>This incredible milestone shows the growing innovation culture across our organization. Thank you to everyone who contributed ideas and supported your colleagues.</p><p>Top contributing departments:</p><ol><li>Transport Innovation - 28 projects</li><li>Digital Services - 22 projects</li><li>Community Engagement - 19 projects</li></ol>',
        priority: 'normal',
        category: 'milestone',
        author: {
            id: '2',
            fullName: 'Michael Chen',
            profile: {
                fullName: 'Michael Chen',
                photo: 'https://i.pravatar.cc/150?img=2',
            },
        },
        space: {
            id: '1',
            title: 'Innovation Hub',
        },
        tags: [{ id: 3, name: 'milestone' }, { id: 4, name: 'celebration' }],
        likesCount: 56,
        commentsCount: 18,
        isPinned: false,
        isLiked: true,
    },
    {
        id: '3',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Policy Update: New Remote Work Guidelines',
        excerpt: 'Updated remote work policy effective February 1st. All teams can now work remotely up to 3 days per week.',
        htmlContent: '<p>We\'ve updated our remote work policy based on feedback from the innovation teams. Effective <strong>February 1st, 2025</strong>, the following changes apply:</p><h3>Key Changes</h3><ul><li>Teams can work remotely up to 3 days per week (previously 2 days)</li><li>Core collaboration hours: 10am-3pm (must be available for meetings)</li><li>Monthly in-person team days required</li></ul><p>Read the full policy in the <a href="/resources/remote-work-policy">Employee Handbook</a>.</p>',
        priority: 'high',
        category: 'policy',
        pinUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        author: {
            id: '3',
            fullName: 'Emily Rodriguez',
            profile: {
                fullName: 'Emily Rodriguez',
                photo: 'https://i.pravatar.cc/150?img=3',
            },
        },
        space: {
            id: '2',
            title: 'General',
        },
        tags: [{ id: 5, name: 'policy' }, { id: 6, name: 'remote-work' }],
        likesCount: 41,
        commentsCount: 23,
        isPinned: true,
        isLiked: false,
    },
    {
        id: '4',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Innovation Team Wins National Award',
        excerpt: 'Our Sustainable Transport team has won the National Innovation Excellence Award for their electric bus pilot program.',
        htmlContent: '<p>Exciting news! Our Sustainable Transport team has won the <strong>National Innovation Excellence Award</strong> for their groundbreaking electric bus pilot program.</p><p>The award recognizes the team\'s innovative approach to reducing carbon emissions while improving public transport accessibility. The pilot program resulted in:</p><ul><li>40% reduction in operating costs</li><li>60% reduction in carbon emissions</li><li>25% increase in ridership</li></ul><p>Congratulations to the entire team! Read more in the <a href="/showcases/electric-bus-pilot">full showcase</a>.</p>',
        priority: 'normal',
        category: 'news',
        author: {
            id: '1',
            fullName: 'Sarah Johnson',
            profile: {
                fullName: 'Sarah Johnson',
                photo: 'https://i.pravatar.cc/150?img=1',
            },
        },
        space: {
            id: '3',
            title: 'Transport Innovation',
        },
        tags: [{ id: 7, name: 'award' }, { id: 8, name: 'transport' }],
        likesCount: 89,
        commentsCount: 31,
        isPinned: false,
        isLiked: true,
    },
];

// Mock API functions
export async function getUpdates(): Promise<Update[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_UPDATES;
}

export async function getUpdate(id: string): Promise<Update> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const update = MOCK_UPDATES.find(u => u.id === id);
    if (!update) {
        throw new Error('Update not found');
    }
    return update;
}

export async function createUpdate(data: CreateUpdateData): Promise<Update> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock creation
    const newUpdate: Update = {
        id: String(MOCK_UPDATES.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: data.title,
        excerpt: data.excerpt,
        htmlContent: data.htmlContent,
        priority: data.priority,
        category: data.category,
        expiresAt: data.expiresAt,
        author: {
            id: '1',
            fullName: 'Current User',
            profile: {
                fullName: 'Current User',
            },
        },
        space: {
            id: String(data.space),
            title: 'Selected Space',
        },
        tags: data.tags?.map(id => ({ id, name: `Tag ${id}` })),
        likesCount: 0,
        commentsCount: 0,
        isPinned: false,
        isLiked: false,
    };
    return newUpdate;
}

export async function likeUpdate(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Mock like action
}

export async function unlikeUpdate(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Mock unlike action
}
