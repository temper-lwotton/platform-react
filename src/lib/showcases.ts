// Mock implementation for Showcases/Case Studies
// This will be replaced with real API calls once backend is ready

export interface ImpactMetric {
    label: string;
    value: string;
    icon?: string;
}

export interface MediaItem {
    type: 'image' | 'video';
    url: string;
    caption?: string;
}

export interface RelatedLink {
    label: string;
    url: string;
}

export interface Showcase {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    excerpt?: string;
    htmlContent: string;
    projectStart?: string;
    projectEnd?: string;
    teamMembers?: {
        id: string;
        fullName: string;
        role?: string;
        photo?: string;
    }[];
    impactMetrics?: ImpactMetric[];
    media?: MediaItem[];
    relatedLinks?: RelatedLink[];
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

export interface CreateShowcaseData {
    title: string;
    excerpt?: string;
    htmlContent: string;
    projectStart?: string;
    projectEnd?: string;
    space: number;
    tags?: number[];
}

// Mock data
export const MOCK_SHOWCASES: Showcase[] = [
    {
        id: '1',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Electric Bus Pilot Program: A Sustainable Success',
        excerpt: 'How we reduced carbon emissions by 60% while cutting operating costs and increasing ridership in our 6-month electric bus pilot.',
        htmlContent: '<h2>The Challenge</h2><p>Our city\'s public transport fleet was aging, expensive to maintain, and a significant source of carbon emissions. We needed a solution that was both environmentally sustainable and financially viable.</p><h2>The Solution</h2><p>We launched a 6-month pilot program replacing 10 diesel buses with electric vehicles on our busiest routes. The pilot included:</p><ul><li>Comprehensive driver training</li><li>Installation of charging infrastructure</li><li>Real-time monitoring and data collection</li><li>Community engagement and feedback sessions</li></ul><h2>Lessons Learned</h2><p><strong>What worked well:</strong> Early community engagement, phased rollout approach, data-driven decision making</p><p><strong>What we\'d do differently:</strong> Start charging infrastructure installation earlier, include more routes in the pilot</p><h2>Next Steps</h2><p>Based on the success of this pilot, we\'re expanding to 50 electric buses by end of 2025, with a goal of a fully electric fleet by 2030.</p>',
        projectStart: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        projectEnd: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        teamMembers: [
            {
                id: '1',
                fullName: 'Michael Chen',
                role: 'Project Lead',
                photo: 'https://i.pravatar.cc/150?img=2',
            },
            {
                id: '2',
                fullName: 'Sarah Johnson',
                role: 'Operations Manager',
                photo: 'https://i.pravatar.cc/150?img=1',
            },
            {
                id: '3',
                fullName: 'David Kim',
                role: 'Technical Lead',
                photo: 'https://i.pravatar.cc/150?img=4',
            },
        ],
        impactMetrics: [
            { label: 'Carbon Reduction', value: '60%', icon: 'leaf' },
            { label: 'Cost Savings', value: '40%', icon: 'dollar' },
            { label: 'Ridership Increase', value: '25%', icon: 'users' },
            { label: 'On-time Performance', value: '95%', icon: 'clock' },
        ],
        media: [
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
                caption: 'New electric bus in service',
            },
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
                caption: 'Charging infrastructure installation',
            },
        ],
        relatedLinks: [
            { label: 'Full Technical Report (PDF)', url: '/resources/electric-bus-report.pdf' },
            { label: 'News Article Coverage', url: 'https://example.com/news' },
        ],
        author: {
            id: '2',
            fullName: 'Michael Chen',
            profile: {
                fullName: 'Michael Chen',
                photo: 'https://i.pravatar.cc/150?img=2',
            },
        },
        space: {
            id: '3',
            title: 'Transport Innovation',
        },
        tags: [
            { id: 1, name: 'sustainability' },
            { id: 2, name: 'transport' },
            { id: 3, name: 'case-study' },
        ],
        likesCount: 127,
        commentsCount: 34,
        isPinned: false,
        isLiked: true,
    },
    {
        id: '2',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Digital Service Portal: Improving Citizen Experience',
        excerpt: 'Redesigning our online service portal resulted in 80% faster processing times and 95% user satisfaction.',
        htmlContent: '<h2>Background</h2><p>Our legacy online services portal was slow, confusing, and resulted in high abandonment rates. Citizens were frustrated, and staff spent countless hours on support calls.</p><h2>Our Approach</h2><p>We took a user-centered design approach:</p><ol><li>Conducted 50+ user interviews</li><li>Created journey maps for key services</li><li>Prototyped and tested iteratively</li><li>Launched with comprehensive training</li></ol><h2>Results</h2><p>The new portal has transformed how citizens interact with our services. Application completion rates increased from 45% to 92%, and support calls decreased by 70%.</p>',
        projectStart: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        projectEnd: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        teamMembers: [
            {
                id: '4',
                fullName: 'Emily Rodriguez',
                role: 'UX Lead',
                photo: 'https://i.pravatar.cc/150?img=3',
            },
            {
                id: '5',
                fullName: 'James Wilson',
                role: 'Developer',
                photo: 'https://i.pravatar.cc/150?img=5',
            },
        ],
        impactMetrics: [
            { label: 'Processing Time', value: '80% faster', icon: 'clock' },
            { label: 'User Satisfaction', value: '95%', icon: 'heart' },
            { label: 'Completion Rate', value: '92%', icon: 'check' },
            { label: 'Support Calls', value: '70% reduction', icon: 'phone' },
        ],
        media: [
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
                caption: 'New portal dashboard',
            },
        ],
        relatedLinks: [
            { label: 'Try the Portal', url: 'https://services.example.com' },
            { label: 'Design System Documentation', url: '/resources/design-system' },
        ],
        author: {
            id: '3',
            fullName: 'Emily Rodriguez',
            profile: {
                fullName: 'Emily Rodriguez',
                photo: 'https://i.pravatar.cc/150?img=3',
            },
        },
        space: {
            id: '4',
            title: 'Digital Services',
        },
        tags: [
            { id: 4, name: 'digital' },
            { id: 5, name: 'user-experience' },
            { id: 6, name: 'success-story' },
        ],
        likesCount: 98,
        commentsCount: 27,
        isPinned: true,
        isLiked: false,
    },
];

// Mock API functions
export async function getShowcases(): Promise<Showcase[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_SHOWCASES;
}

export async function getShowcase(id: string): Promise<Showcase> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const showcase = MOCK_SHOWCASES.find(s => s.id === id);
    if (!showcase) {
        throw new Error('Showcase not found');
    }
    return showcase;
}

export async function createShowcase(data: CreateShowcaseData): Promise<Showcase> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newShowcase: Showcase = {
        id: String(MOCK_SHOWCASES.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: data.title,
        excerpt: data.excerpt,
        htmlContent: data.htmlContent,
        projectStart: data.projectStart,
        projectEnd: data.projectEnd,
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
    return newShowcase;
}

export async function likeShowcase(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
}

export async function unlikeShowcase(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
}
