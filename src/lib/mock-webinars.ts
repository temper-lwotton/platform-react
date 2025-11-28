import { Webinar, WebinarAttendee, ChatMessage, QAQuestion } from './webinars';

// Mock webinars
export const mockWebinars: Webinar[] = [
    {
        id: '1',
        title: 'Future of Urban Transport',
        description: 'Join us for a deep dive into sustainable transportation solutions for modern cities. We\'ll explore innovative approaches to reducing congestion and emissions.',
        hostId: '1',
        hostName: 'Dr. Sarah Johnson',
        hostPhoto: '/avatars/sarah.jpg',
        spaceId: '23',
        spaceName: 'Tech Community',
        status: 'live',
        scheduledFor: '2025-11-28T14:00:00Z',
        startedAt: new Date(Date.now() - 1000 * 60 * 23).toISOString(), // 23 mins ago
        duration: 60,
        maxAttendees: 500,
        settings: {
            enableChat: true,
            enableQA: true,
            enableRecording: true,
            requireRegistration: false,
        },
        stats: {
            registeredCount: 89,
            attendeeCount: 142,
            peakAttendees: 156,
        },
        coHosts: [
            {
                id: '2',
                name: 'Mike Chen',
                email: 'mike@example.com',
                photo: '/avatars/mike.jpg',
                role: 'presenter',
            },
        ],
        createdAt: '2025-11-25T10:00:00Z',
    },
    {
        id: '2',
        title: 'Monthly Community Meetup',
        description: 'Regular monthly sync for all community members. Share updates, ask questions, and network with fellow transport professionals.',
        hostId: '3',
        hostName: 'Emma Williams',
        hostPhoto: '/avatars/emma.jpg',
        spaceId: '23',
        spaceName: 'Tech Community',
        status: 'scheduled',
        scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 25).toISOString(), // Tomorrow
        duration: 45,
        maxAttendees: 200,
        settings: {
            enableChat: true,
            enableQA: true,
            enableRecording: true,
            requireRegistration: true,
        },
        stats: {
            registeredCount: 67,
            attendeeCount: 0,
            peakAttendees: 0,
        },
        createdAt: '2025-11-20T10:00:00Z',
    },
    {
        id: '3',
        title: 'Electric Vehicle Infrastructure Workshop',
        description: 'Learn about the latest developments in EV charging infrastructure and how to plan for future growth.',
        hostId: '4',
        hostName: 'James Peterson',
        hostPhoto: '/avatars/james.jpg',
        spaceId: '28',
        spaceName: 'Innovation Hub',
        status: 'scheduled',
        scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(), // 3 days
        duration: 90,
        maxAttendees: 300,
        settings: {
            enableChat: true,
            enableQA: true,
            enableRecording: true,
            requireRegistration: true,
        },
        stats: {
            registeredCount: 124,
            attendeeCount: 0,
            peakAttendees: 0,
        },
        coHosts: [
            {
                id: '5',
                name: 'Lisa Anderson',
                email: 'lisa@example.com',
                photo: '/avatars/lisa.jpg',
                role: 'moderator',
            },
        ],
        createdAt: '2025-11-18T09:00:00Z',
    },
    {
        id: '4',
        title: 'Public Transport Recovery Post-Pandemic',
        description: 'A discussion on strategies for rebuilding ridership and adapting services in the new normal.',
        hostId: '1',
        hostName: 'Dr. Sarah Johnson',
        hostPhoto: '/avatars/sarah.jpg',
        spaceId: '23',
        spaceName: 'Tech Community',
        status: 'ended',
        scheduledFor: '2025-11-20T15:00:00Z',
        startedAt: '2025-11-20T15:02:00Z',
        endedAt: '2025-11-20T16:15:00Z',
        duration: 60,
        maxAttendees: 500,
        settings: {
            enableChat: true,
            enableQA: true,
            enableRecording: true,
            requireRegistration: false,
        },
        stats: {
            registeredCount: 234,
            attendeeCount: 0,
            peakAttendees: 189,
        },
        createdAt: '2025-11-15T10:00:00Z',
    },
];

// Mock attendees for live webinar
export const mockAttendees: WebinarAttendee[] = [
    {
        id: '1',
        name: 'Alice Cooper',
        photo: '/avatars/alice.jpg',
        joinedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        isHandRaised: false,
    },
    {
        id: '2',
        name: 'Bob Martinez',
        photo: '/avatars/bob.jpg',
        joinedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        isHandRaised: true,
    },
    {
        id: '3',
        name: 'Carol White',
        joinedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        isHandRaised: false,
    },
    {
        id: '4',
        name: 'David Kim',
        photo: '/avatars/david.jpg',
        joinedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        isHandRaised: false,
    },
    {
        id: '5',
        name: 'Eva Rodriguez',
        photo: '/avatars/eva.jpg',
        joinedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        isHandRaised: false,
    },
    {
        id: '6',
        name: 'Frank Chen',
        joinedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        isHandRaised: false,
    },
    {
        id: '7',
        name: 'Grace Thompson',
        photo: '/avatars/grace.jpg',
        joinedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        isHandRaised: false,
    },
    {
        id: '8',
        name: 'Henry Zhang',
        joinedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        isHandRaised: false,
    },
];

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
    {
        id: '1',
        senderId: '1',
        senderName: 'Alice Cooper',
        senderPhoto: '/avatars/alice.jpg',
        message: 'Great presentation so far!',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
        id: '2',
        senderId: '2',
        senderName: 'Bob Martinez',
        message: 'Could you share the slides after the webinar?',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    },
    {
        id: '3',
        senderId: '1',
        senderName: 'Dr. Sarah Johnson',
        senderPhoto: '/avatars/sarah.jpg',
        message: 'Yes, I\'ll post them in the space resources after we finish.',
        timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
        isPinned: true,
    },
    {
        id: '4',
        senderId: '4',
        senderName: 'David Kim',
        senderPhoto: '/avatars/david.jpg',
        message: 'This is fascinating! Are there any case studies from Asian cities?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: '5',
        senderId: '5',
        senderName: 'Eva Rodriguez',
        senderPhoto: '/avatars/eva.jpg',
        message: 'Thanks for hosting this!',
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    },
    {
        id: '6',
        senderId: '6',
        senderName: 'Frank Chen',
        message: 'Can we see the cost breakdown again?',
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
];

// Mock Q&A questions
export const mockQAQuestions: QAQuestion[] = [
    {
        id: '1',
        askerId: '2',
        askerName: 'Bob Martinez',
        question: 'What are the biggest challenges in implementing bike-sharing programs in smaller cities?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        upvotes: 23,
        isAnswered: true,
        answer: 'The main challenges are lower population density and funding. However, electric bikes can help overcome distance barriers.',
        answeredBy: 'Dr. Sarah Johnson',
        answeredAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
        id: '2',
        askerId: '4',
        askerName: 'David Kim',
        askerPhoto: '/avatars/david.jpg',
        question: 'How do you see autonomous vehicles integrating with public transport systems?',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        upvotes: 18,
        isAnswered: false,
    },
    {
        id: '3',
        askerId: '7',
        askerName: 'Grace Thompson',
        askerPhoto: '/avatars/grace.jpg',
        question: 'Are there any successful examples of carbon-neutral transport systems?',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        upvotes: 15,
        isAnswered: false,
    },
    {
        id: '4',
        askerId: '1',
        askerName: 'Alice Cooper',
        askerPhoto: '/avatars/alice.jpg',
        question: 'What role does data play in optimizing transport routes?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        upvotes: 12,
        isAnswered: true,
        answer: 'Data is crucial! Real-time analytics help us predict demand and adjust services dynamically.',
        answeredBy: 'Mike Chen',
        answeredAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    },
    {
        id: '5',
        askerId: '8',
        askerName: 'Henry Zhang',
        question: 'How can we encourage behavioral change towards sustainable transport?',
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        upvotes: 8,
        isAnswered: false,
    },
];

// Helper function to get webinar by ID
export function getWebinarById(id: string): Webinar | undefined {
    return mockWebinars.find(w => w.id === id);
}

// Helper function to filter webinars
export function filterWebinars(filter: 'all' | 'live' | 'upcoming' | 'past'): Webinar[] {
    if (filter === 'all') return mockWebinars;
    if (filter === 'live') return mockWebinars.filter(w => w.status === 'live');
    if (filter === 'upcoming') return mockWebinars.filter(w => w.status === 'scheduled');
    if (filter === 'past') return mockWebinars.filter(w => w.status === 'ended');
    return mockWebinars;
}
