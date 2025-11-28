// Document Types

export type DocumentStatus = 'draft' | 'published' | 'archived';
export type DocumentVisibility = 'public' | 'members' | 'private';

export interface DocumentAuthor {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

export interface DocumentCollaborator {
    id: string;
    name: string;
    email: string;
    photo?: string;
    role: 'editor' | 'viewer' | 'commenter';
    lastActive?: string;
}

export interface DocumentVersion {
    id: string;
    version: number;
    createdAt: string;
    createdBy: DocumentAuthor;
    changes: string;
    size: number; // in characters
}

export interface DocumentComment {
    id: string;
    authorId: string;
    authorName: string;
    authorPhoto?: string;
    content: string;
    position?: number; // character position in document
    timestamp: string;
    resolved: boolean;
    replies?: DocumentComment[];
}

export interface Document {
    id: string;
    title: string;
    content: string; // In a real app, this would be rich text/markdown
    excerpt?: string;
    authorId: string;
    authorName: string;
    authorPhoto?: string;
    spaceId: string;
    spaceName: string;
    status: DocumentStatus;
    visibility: DocumentVisibility;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    collaborators: DocumentCollaborator[];
    tags?: string[];
    wordCount: number;
    versions: DocumentVersion[];
    comments?: DocumentComment[];
    stats?: {
        views: number;
        edits: number;
        comments: number;
        activeCollaborators: number;
    };
}
