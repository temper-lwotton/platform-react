/**
 * Exchange / Community Sharing System
 * Allows users to share resources, facilities, expertise or request help
 */

export type ExchangeType = 'offering' | 'request';
export type ExchangeCategory = 'equipment' | 'space' | 'expertise' | 'collaboration' | 'materials' | 'other';
export type ExchangeAvailability = 'available' | 'in-use' | 'fulfilled' | 'expired';
export type ExchangeTerms = 'free' | 'trade' | 'paid';
export type LocationType = 'in-person' | 'remote' | 'hybrid';

export interface ExchangeLocation {
    type: LocationType;
    address?: string;
}

export interface MediaItem {
    url: string;
    caption?: string;
    type: 'image' | 'video';
}

export interface InterestedUser {
    id: string;
    fullName: string;
    email: string;
    message: string;
    requestedDate?: string;
    createdAt: string;
}

export interface Exchange {
    id: string;
    type: ExchangeType;
    category: ExchangeCategory;

    // Core fields
    title: string;
    excerpt?: string;
    htmlContent: string;
    images?: MediaItem[];

    // Availability
    availability: ExchangeAvailability;
    availableFrom?: string;
    availableUntil?: string;
    schedule?: string; // e.g., "Mon-Fri 9am-5pm"

    // Terms
    terms: ExchangeTerms;
    price?: number;
    conditions?: string;

    // Location
    location?: ExchangeLocation;

    // Matching
    interestedUsers?: InterestedUser[];
    interestedCount: number;
    matchedWith?: {
        id: string;
        fullName: string;
    };

    // Standard fields
    author: {
        id: string;
        email: string;
        fullName: string;
        profile?: {
            photo?: string;
            fullName?: string;
        };
    };
    space: {
        id: number;
        title: string;
    };
    tags?: Array<{ id: number; name: string }>;
    likesCount?: number;
    commentsCount?: number;

    createdAt: string;
    updatedAt: string;
    expiresAt?: string;

    // Engagement
    viewCount: number;
    isInterested: boolean;

    isPinned?: boolean;
}

// Mock data
export const MOCK_EXCHANGES: Exchange[] = [
    {
        id: '1',
        type: 'offering',
        category: 'equipment',
        title: 'Ultimaker 3 Extended 3D Printer Available',
        excerpt: 'Professional-grade 3D printer available for community members to prototype and test designs.',
        htmlContent: `
            <h2>About the Equipment</h2>
            <p>Our Innovation Lab has an Ultimaker 3 Extended 3D printer that we're making available to the community. This is a professional-grade printer capable of producing high-quality prototypes.</p>

            <h3>Specifications</h3>
            <ul>
                <li>Build volume: 215 x 215 x 300 mm</li>
                <li>Dual extrusion for multi-material printing</li>
                <li>Supports PLA, ABS, Nylon, and specialty filaments</li>
                <li>Heated glass build plate</li>
            </ul>

            <h3>Requirements</h3>
            <ul>
                <li>Basic knowledge of 3D printing and slicing software</li>
                <li>Bring your own filament</li>
                <li>Clean up and maintain the printer after use</li>
                <li>Book a time slot in advance</li>
            </ul>

            <p>Perfect for prototyping products, creating custom parts, or educational projects!</p>
        `,
        images: [
            {
                url: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=800',
                caption: 'Ultimaker 3 Extended in our Innovation Lab',
                type: 'image',
            },
        ],
        availability: 'available',
        schedule: 'Monday-Friday: 9am-5pm, Weekends: By appointment',
        terms: 'free',
        conditions: 'Bring your own filament. First-time users must complete a brief orientation.',
        location: {
            type: 'in-person',
            address: 'Innovation Lab, Building 2, Room 205',
        },
        interestedCount: 7,
        interestedUsers: [
            {
                id: '101',
                fullName: 'Mike Torres',
                email: 'mike@example.com',
                message: "Hi! I'd like to use the printer to prototype a new product case. I have experience with 3D printing.",
                requestedDate: '2024-01-20',
                createdAt: '2024-01-15T10:30:00Z',
            },
        ],
        author: {
            id: '1',
            email: 'sarah@example.com',
            fullName: 'Sarah Chen',
            profile: {
                fullName: 'Sarah Chen',
                photo: 'https://i.pravatar.cc/150?img=1',
            },
        },
        space: {
            id: 1,
            title: 'Tech Innovation Space',
        },
        tags: [
            { id: 1, name: 'prototyping' },
            { id: 2, name: '3d-printing' },
            { id: 3, name: 'manufacturing' },
        ],
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-10T09:00:00Z',
        viewCount: 142,
        isInterested: false,
        isPinned: true,
    },
    {
        id: '2',
        type: 'request',
        category: 'expertise',
        title: 'Looking for UX Design Feedback on Mobile App',
        excerpt: 'Need an experienced UX designer to review my app prototype and provide feedback.',
        htmlContent: `
            <h2>What I Need</h2>
            <p>I'm developing a mobile app for community engagement and need feedback from an experienced UX designer. I have a working prototype in Figma and would love to get your insights on:</p>

            <ul>
                <li>User flow and navigation</li>
                <li>Visual design and consistency</li>
                <li>Accessibility considerations</li>
                <li>Mobile-specific UX patterns</li>
            </ul>

            <h3>What I'm Offering</h3>
            <p>I'm a marketing strategist and would be happy to trade services! I can help you with:</p>
            <ul>
                <li>Marketing strategy consultation</li>
                <li>Social media content planning</li>
                <li>Brand messaging review</li>
            </ul>

            <p>Or if you prefer, I'm happy to buy you coffee and lunch during our session!</p>

            <h3>Time Commitment</h3>
            <p>Looking for about 1-2 hours for an initial review session. Can be done remotely via video call.</p>
        `,
        availability: 'available',
        availableFrom: '2024-01-20T00:00:00Z',
        availableUntil: '2024-02-15T00:00:00Z',
        schedule: 'Flexible - evenings and weekends preferred',
        terms: 'trade',
        conditions: 'Happy to trade for marketing advice or buy you lunch!',
        location: {
            type: 'remote',
        },
        interestedCount: 5,
        author: {
            id: '2',
            email: 'mike@example.com',
            fullName: 'Mike Torres',
            profile: {
                fullName: 'Mike Torres',
            },
        },
        space: {
            id: 2,
            title: 'Startup Hub',
        },
        tags: [
            { id: 4, name: 'ux-design' },
            { id: 5, name: 'mobile' },
            { id: 6, name: 'feedback' },
        ],
        createdAt: '2024-01-12T14:00:00Z',
        updatedAt: '2024-01-12T14:00:00Z',
        viewCount: 89,
        isInterested: false,
    },
    {
        id: '3',
        type: 'offering',
        category: 'space',
        title: 'Co-working Desk Available in Downtown Office',
        excerpt: 'Dedicated desk in our shared office space, perfect for remote workers or early-stage startups.',
        htmlContent: `
            <h2>About the Space</h2>
            <p>We have an extra desk in our downtown office that we'd like to offer to the community. Great for someone who needs a professional space to work from occasionally or regularly.</p>

            <h3>Amenities</h3>
            <ul>
                <li>High-speed fiber internet (1Gbps)</li>
                <li>Standing desk option</li>
                <li>Access to meeting rooms (book in advance)</li>
                <li>Kitchen with coffee, tea, and snacks</li>
                <li>Printer/scanner access</li>
                <li>24/7 building access with key card</li>
            </ul>

            <h3>Location Details</h3>
            <p>Downtown Toronto, steps from Union Station. Easy access to TTC and GO Transit.</p>

            <h3>What We're Looking For</h3>
            <p>Someone who is working on an interesting project and would benefit from being around other innovators. Preference for people working on social impact or sustainability projects.</p>
        `,
        images: [
            {
                url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                caption: 'Our co-working space',
                type: 'image',
            },
            {
                url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
                caption: 'Meeting room available for booking',
                type: 'image',
            },
        ],
        availability: 'available',
        schedule: 'Available immediately. Flexible hours.',
        terms: 'paid',
        price: 250,
        conditions: '$250/month or $15/day for occasional use',
        location: {
            type: 'in-person',
            address: 'Downtown Toronto, near Union Station (exact address shared with interested parties)',
        },
        interestedCount: 12,
        author: {
            id: '3',
            email: 'lisa@example.com',
            fullName: 'Lisa Wang',
            profile: {
                fullName: 'Lisa Wang',
                photo: 'https://i.pravatar.cc/150?img=5',
            },
        },
        space: {
            id: 3,
            title: 'Social Enterprise Hub',
        },
        tags: [
            { id: 7, name: 'co-working' },
            { id: 8, name: 'office-space' },
            { id: 9, name: 'downtown' },
        ],
        createdAt: '2024-01-08T11:00:00Z',
        updatedAt: '2024-01-08T11:00:00Z',
        viewCount: 203,
        isInterested: false,
    },
    {
        id: '4',
        type: 'request',
        category: 'collaboration',
        title: 'Seeking Beta Testers for Sustainability App',
        excerpt: 'Looking for 10-15 people to test our new app that helps track personal carbon footprint.',
        htmlContent: `
            <h2>About the Project</h2>
            <p>We're launching a mobile app that helps individuals track and reduce their carbon footprint. We need beta testers to try the app and provide feedback before our public launch.</p>

            <h3>What Beta Testers Will Do</h3>
            <ul>
                <li>Use the app for 2 weeks</li>
                <li>Track daily activities (we make it easy!)</li>
                <li>Complete a brief survey after testing</li>
                <li>Optional: Join a feedback session (30 mins via video call)</li>
            </ul>

            <h3>What You Get</h3>
            <ul>
                <li>Free lifetime premium subscription</li>
                <li>Your name in our "Founding Testers" credits</li>
                <li>Early access to new features</li>
                <li>Opportunity to shape a product for positive impact</li>
            </ul>

            <h3>Ideal Testers</h3>
            <p>We're looking for people who care about sustainability but aren't necessarily tech experts. iPhone and Android users both welcome!</p>
        `,
        availability: 'available',
        availableFrom: '2024-01-22T00:00:00Z',
        availableUntil: '2024-02-05T00:00:00Z',
        schedule: 'Testing period: Jan 22 - Feb 5 (2 weeks)',
        terms: 'free',
        conditions: 'Commitment to use the app for 2 weeks and provide honest feedback',
        location: {
            type: 'remote',
        },
        interestedCount: 23,
        author: {
            id: '4',
            email: 'james@example.com',
            fullName: 'James Liu',
            profile: {
                fullName: 'James Liu',
            },
        },
        space: {
            id: 4,
            title: 'Green Innovation Lab',
        },
        tags: [
            { id: 10, name: 'beta-testing' },
            { id: 11, name: 'sustainability' },
            { id: 12, name: 'mobile-app' },
        ],
        createdAt: '2024-01-14T16:00:00Z',
        updatedAt: '2024-01-14T16:00:00Z',
        expiresAt: '2024-02-05T23:59:59Z',
        viewCount: 156,
        isInterested: true,
    },
    {
        id: '5',
        type: 'offering',
        category: 'expertise',
        title: 'Free Grant Writing Workshop - Monthly',
        excerpt: 'Monthly workshop teaching grant writing fundamentals for social impact projects.',
        htmlContent: `
            <h2>About the Workshop</h2>
            <p>I'm a professional grant writer with 10+ years of experience helping non-profits and social enterprises secure funding. I'm offering free monthly workshops to help innovators improve their grant applications.</p>

            <h3>What We'll Cover</h3>
            <ul>
                <li>Understanding funder priorities</li>
                <li>Crafting compelling narratives</li>
                <li>Building realistic budgets</li>
                <li>Common mistakes to avoid</li>
                <li>Q&A and feedback on your drafts</li>
            </ul>

            <h3>Workshop Format</h3>
            <ul>
                <li>2-hour session</li>
                <li>Max 15 participants for interactive learning</li>
                <li>Bring your laptop and draft applications</li>
                <li>Held last Friday of every month</li>
            </ul>

            <h3>Who Should Attend</h3>
            <p>Perfect for social entrepreneurs, non-profit leaders, researchers, or anyone seeking grant funding for impact-driven projects.</p>
        `,
        availability: 'available',
        schedule: 'Last Friday of each month, 6:00-8:00 PM',
        terms: 'free',
        conditions: 'RSVP required (limited to 15 participants per session)',
        location: {
            type: 'hybrid',
            address: 'In-person at Social Enterprise Hub or join via Zoom',
        },
        interestedCount: 34,
        author: {
            id: '5',
            email: 'rachel@example.com',
            fullName: 'Rachel Martinez',
            profile: {
                fullName: 'Rachel Martinez',
                photo: 'https://i.pravatar.cc/150?img=9',
            },
        },
        space: {
            id: 3,
            title: 'Social Enterprise Hub',
        },
        tags: [
            { id: 13, name: 'grant-writing' },
            { id: 14, name: 'workshop' },
            { id: 15, name: 'funding' },
        ],
        createdAt: '2024-01-05T10:00:00Z',
        updatedAt: '2024-01-05T10:00:00Z',
        viewCount: 287,
        isInterested: false,
        isPinned: true,
    },
];

// Mock API functions with simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface GetExchangesParams {
    limit?: number;
    offset?: number;
    type?: ExchangeType;
    category?: ExchangeCategory;
    terms?: ExchangeTerms;
    availability?: ExchangeAvailability;
}

export const getExchanges = async (params: GetExchangesParams = {}): Promise<Exchange[]> => {
    await delay(300);

    let filtered = [...MOCK_EXCHANGES];

    // Filter by type
    if (params.type) {
        filtered = filtered.filter(e => e.type === params.type);
    }

    // Filter by category
    if (params.category) {
        filtered = filtered.filter(e => e.category === params.category);
    }

    // Filter by terms
    if (params.terms) {
        filtered = filtered.filter(e => e.terms === params.terms);
    }

    // Filter by availability
    if (params.availability) {
        filtered = filtered.filter(e => e.availability === params.availability);
    }

    // Sort by created date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination
    const offset = params.offset || 0;
    const limit = params.limit || filtered.length;

    return filtered.slice(offset, offset + limit);
};

export const getExchange = async (id: string): Promise<Exchange | null> => {
    await delay(300);
    return MOCK_EXCHANGES.find(e => e.id === id) || null;
};

export interface CreateExchangeData {
    type: ExchangeType;
    category: ExchangeCategory;
    title: string;
    excerpt?: string;
    htmlContent: string;
    availability: ExchangeAvailability;
    schedule?: string;
    terms: ExchangeTerms;
    price?: number;
    conditions?: string;
    location?: ExchangeLocation;
    space: number;
    availableFrom?: string;
    availableUntil?: string;
    expiresAt?: string;
}

export const createExchange = async (data: CreateExchangeData): Promise<Exchange> => {
    await delay(500);

    const newExchange: Exchange = {
        id: String(MOCK_EXCHANGES.length + 1),
        ...data,
        author: {
            id: '1',
            email: 'current@example.com',
            fullName: 'Current User',
        },
        space: {
            id: data.space,
            title: 'Selected Space',
        },
        interestedCount: 0,
        viewCount: 0,
        isInterested: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    MOCK_EXCHANGES.push(newExchange);
    return newExchange;
};

export const expressInterest = async (exchangeId: string, message: string, requestedDate?: string): Promise<void> => {
    await delay(300);
    const exchange = MOCK_EXCHANGES.find(e => e.id === exchangeId);
    if (exchange) {
        exchange.isInterested = true;
        exchange.interestedCount += 1;
    }
};

export const withdrawInterest = async (exchangeId: string): Promise<void> => {
    await delay(300);
    const exchange = MOCK_EXCHANGES.find(e => e.id === exchangeId);
    if (exchange) {
        exchange.isInterested = false;
        exchange.interestedCount = Math.max(0, exchange.interestedCount - 1);
    }
};

export const markAsUnavailable = async (exchangeId: string): Promise<void> => {
    await delay(300);
    const exchange = MOCK_EXCHANGES.find(e => e.id === exchangeId);
    if (exchange) {
        exchange.availability = 'in-use';
    }
};

export const markAsFulfilled = async (exchangeId: string): Promise<void> => {
    await delay(300);
    const exchange = MOCK_EXCHANGES.find(e => e.id === exchangeId);
    if (exchange) {
        exchange.availability = 'fulfilled';
    }
};

export const markAsAvailable = async (exchangeId: string): Promise<void> => {
    await delay(300);
    const exchange = MOCK_EXCHANGES.find(e => e.id === exchangeId);
    if (exchange) {
        exchange.availability = 'available';
    }
};
