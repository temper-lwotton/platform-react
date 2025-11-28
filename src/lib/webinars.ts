// Webinar type definitions

export interface Webinar {
    id: string;
    title: string;
    description?: string;
    hostId: string;
    hostName: string;
    hostPhoto?: string;
    spaceId: string;
    spaceName: string;
    status: 'scheduled' | 'live' | 'ended';
    scheduledFor?: string; // ISO 8601
    startedAt?: string;
    endedAt?: string;
    duration?: number; // minutes
    maxAttendees?: number;
    settings: WebinarSettings;
    stats?: WebinarStats;
    coHosts?: CoHost[];
    createdAt: string;
}

export interface WebinarSettings {
    enableChat: boolean;
    enableQA: boolean;
    enableRecording: boolean;
    requireRegistration: boolean;
}

export interface WebinarStats {
    registeredCount: number;
    attendeeCount: number;
    peakAttendees: number;
}

export interface CoHost {
    id: string;
    name: string;
    email: string;
    photo?: string;
    role: 'presenter' | 'moderator';
}

export interface WebinarAttendee {
    id: string;
    name: string;
    photo?: string;
    joinedAt: string;
    isHandRaised: boolean;
    isMuted?: boolean;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderPhoto?: string;
    message: string;
    timestamp: string;
    isPinned?: boolean;
}

export interface QAQuestion {
    id: string;
    askerId: string;
    askerName: string;
    askerPhoto?: string;
    question: string;
    timestamp: string;
    upvotes: number;
    isAnswered: boolean;
    answer?: string;
    answeredBy?: string;
    answeredAt?: string;
}

export interface WebinarFormData {
    title: string;
    description?: string;
    spaceId: string;
    scheduledFor?: string;
    duration?: number;
    settings: WebinarSettings;
    coHosts?: Omit<CoHost, 'id'>[];
}

export type WebinarFilter = 'all' | 'live' | 'upcoming' | 'past';
