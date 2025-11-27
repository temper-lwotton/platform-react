// Mock implementation for Resources/Knowledge Base
// This will be replaced with real API calls once backend is ready

export interface Attachment {
    name: string;
    url: string;
    size: number;
    type: string;
}

export interface Resource {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    excerpt?: string;
    htmlContent: string;
    resourceType: 'guide' | 'template' | 'documentation' | 'best-practice' | 'tool';
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: number; // in minutes
    attachments?: Attachment[];
    version?: string;
    lastReviewed?: string;
    relatedResources?: string[]; // IDs of related resources
    viewCount: number;
    downloadCount: number;
    helpfulCount: number;
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
    isHelpful: boolean;
}

export interface CreateResourceData {
    title: string;
    excerpt?: string;
    htmlContent: string;
    resourceType: 'guide' | 'template' | 'documentation' | 'best-practice' | 'tool';
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: number;
    space: number;
    tags?: number[];
    version?: string;
}

// Mock data
export const MOCK_RESOURCES: Resource[] = [
    {
        id: '1',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Innovation Proposal Template',
        excerpt: 'A comprehensive template for submitting innovation proposals. Includes sections for problem statement, solution, impact metrics, and resource requirements.',
        htmlContent: '<h2>How to Use This Template</h2><p>This template is designed to help you structure your innovation proposal in a clear, compelling way. Follow each section carefully and provide as much detail as possible.</p><h2>Template Sections</h2><h3>1. Executive Summary</h3><p>A brief overview (2-3 paragraphs) of your proposal. Include the problem, your solution, and expected impact.</p><h3>2. Problem Statement</h3><p>Clearly define the problem you\'re addressing. Include:</p><ul><li>Current situation and pain points</li><li>Who is affected and how</li><li>Why this problem needs solving now</li><li>Data or evidence supporting the problem</li></ul><h3>3. Proposed Solution</h3><p>Describe your innovation in detail:</p><ul><li>What is it and how does it work?</li><li>Why is this approach innovative?</li><li>What makes it feasible?</li></ul><h3>4. Impact & Success Metrics</h3><p>Define how you\'ll measure success:</p><ul><li>Quantitative metrics (cost savings, time reduction, etc.)</li><li>Qualitative outcomes (improved experience, etc.)</li><li>Timeline for achieving results</li></ul><h3>5. Resource Requirements</h3><p>What you need to succeed:</p><ul><li>Budget and funding needs</li><li>Team members and roles</li><li>Tools, technology, or infrastructure</li><li>Timeline and milestones</li></ul><h3>6. Risks & Mitigation</h3><p>Identify potential risks and how you\'ll address them.</p>',
        resourceType: 'template',
        difficulty: 'beginner',
        estimatedTime: 30,
        attachments: [
            {
                name: 'innovation-proposal-template.docx',
                url: '/downloads/innovation-proposal-template.docx',
                size: 45000,
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            },
            {
                name: 'innovation-proposal-template.pdf',
                url: '/downloads/innovation-proposal-template.pdf',
                size: 125000,
                type: 'application/pdf',
            },
        ],
        version: '2.1',
        lastReviewed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        relatedResources: ['2', '3'],
        viewCount: 342,
        downloadCount: 87,
        helpfulCount: 76,
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
        tags: [
            { id: 1, name: 'template' },
            { id: 2, name: 'proposal' },
            { id: 3, name: 'getting-started' },
        ],
        likesCount: 54,
        commentsCount: 12,
        isPinned: true,
        isLiked: false,
        isHelpful: true,
    },
    {
        id: '2',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Guide to Design Thinking for Public Services',
        excerpt: 'Learn how to apply design thinking methodology to solve complex problems in public service delivery.',
        htmlContent: '<h2>What is Design Thinking?</h2><p>Design thinking is a human-centered approach to innovation that integrates the needs of people, the possibilities of technology, and the requirements for organizational success.</p><h2>The Five Stages</h2><h3>1. Empathize</h3><p>Understand your users through research and observation. Methods include:</p><ul><li>User interviews</li><li>Observation studies</li><li>Journey mapping</li><li>Stakeholder workshops</li></ul><h3>2. Define</h3><p>Clearly articulate the problem you want to solve based on your research insights.</p><h3>3. Ideate</h3><p>Generate a wide range of possible solutions. Use brainstorming techniques like:</p><ul><li>Rapid ideation</li><li>SCAMPER</li><li>Crazy 8s</li><li>How Might We questions</li></ul><h3>4. Prototype</h3><p>Build simple, low-cost prototypes to test your ideas quickly.</p><h3>5. Test</h3><p>Get feedback from real users and iterate on your solution.</p><h2>Case Study: Improving Permit Applications</h2><p>See how one city used design thinking to reduce permit processing time by 70%. <a href="/showcases/2">Read the full case study</a>.</p><h2>Tools & Resources</h2><ul><li><a href="/resources/3">Journey Mapping Template</a></li><li><a href="/resources/4">Stakeholder Interview Guide</a></li><li><a href="/resources/5">Prototyping Toolkit</a></li></ul>',
        resourceType: 'guide',
        difficulty: 'intermediate',
        estimatedTime: 45,
        attachments: [
            {
                name: 'design-thinking-guide.pdf',
                url: '/downloads/design-thinking-guide.pdf',
                size: 2500000,
                type: 'application/pdf',
            },
        ],
        version: '1.3',
        lastReviewed: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        relatedResources: ['3', '4'],
        viewCount: 567,
        downloadCount: 143,
        helpfulCount: 128,
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
            { id: 4, name: 'design-thinking' },
            { id: 5, name: 'methodology' },
            { id: 6, name: 'guide' },
        ],
        likesCount: 89,
        commentsCount: 23,
        isPinned: false,
        isLiked: true,
        isHelpful: true,
    },
    {
        id: '3',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'API Documentation: Innovation Platform',
        excerpt: 'Complete API reference for integrating with the innovation platform. Includes authentication, endpoints, and code examples.',
        htmlContent: '<h2>Getting Started</h2><p>The Innovation Platform API allows you to programmatically access and manage innovation content, users, and spaces.</p><h2>Authentication</h2><p>All API requests require authentication using a JWT token:</p><pre><code>Authorization: Bearer YOUR_TOKEN_HERE</code></pre><h2>Base URL</h2><pre><code>https://api.innovation-platform.example.com/v1</code></pre><h2>Core Endpoints</h2><h3>Discussions</h3><ul><li><code>GET /discussions</code> - List all discussions</li><li><code>POST /discussions</code> - Create a discussion</li><li><code>GET /discussions/:id</code> - Get single discussion</li><li><code>PATCH /discussions/:id</code> - Update discussion</li><li><code>DELETE /discussions/:id</code> - Delete discussion</li></ul><h3>Events</h3><ul><li><code>GET /events</code> - List all events</li><li><code>POST /events</code> - Create an event</li><li><code>POST /events/:id/rsvp</code> - RSVP to event</li></ul><h2>Rate Limits</h2><p>API is rate limited to 1000 requests per hour per user.</p><h2>Code Examples</h2><h3>JavaScript/TypeScript</h3><pre><code>const response = await fetch(\'https://api.example.com/v1/discussions\', {\n  headers: {\n    \'Authorization\': `Bearer ${token}`,\n    \'Content-Type\': \'application/json\'\n  }\n});\nconst discussions = await response.json();</code></pre>',
        resourceType: 'documentation',
        difficulty: 'advanced',
        estimatedTime: 60,
        version: '1.0.0',
        lastReviewed: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        viewCount: 234,
        downloadCount: 45,
        helpfulCount: 41,
        author: {
            id: '5',
            fullName: 'James Wilson',
            profile: {
                fullName: 'James Wilson',
                photo: 'https://i.pravatar.cc/150?img=5',
            },
        },
        space: {
            id: '4',
            title: 'Digital Services',
        },
        tags: [
            { id: 7, name: 'api' },
            { id: 8, name: 'documentation' },
            { id: 9, name: 'technical' },
        ],
        likesCount: 31,
        commentsCount: 8,
        isPinned: false,
        isLiked: false,
        isHelpful: false,
    },
];

// Mock API functions
export async function getResources(): Promise<Resource[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_RESOURCES;
}

export async function getResource(id: string): Promise<Resource> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const resource = MOCK_RESOURCES.find(r => r.id === id);
    if (!resource) {
        throw new Error('Resource not found');
    }
    return resource;
}

export async function createResource(data: CreateResourceData): Promise<Resource> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newResource: Resource = {
        id: String(MOCK_RESOURCES.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: data.title,
        excerpt: data.excerpt,
        htmlContent: data.htmlContent,
        resourceType: data.resourceType,
        difficulty: data.difficulty,
        estimatedTime: data.estimatedTime,
        version: data.version,
        viewCount: 0,
        downloadCount: 0,
        helpfulCount: 0,
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
        isHelpful: false,
    };
    return newResource;
}

export async function likeResource(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
}

export async function unlikeResource(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
}

export async function markResourceHelpful(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
}

export async function trackResourceView(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
}

export async function trackResourceDownload(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
}
