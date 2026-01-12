// Document types and API functions

export interface Document {
    id: string;
    title: string;
    description?: string;
    excerpt?: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    wordCount?: number;
    createdAt: string;
    updatedAt: string;
    uploadedBy: {
        id: string;
        name: string;
        avatar?: string;
    };
    authorName?: string;
    authorPhoto?: string;
    collaborators?: Array<{
        id: string;
        name: string;
        photo?: string;
    }>;
    tags?: string[];
    status?: 'published' | 'draft' | 'archived';
    visibility?: 'public' | 'members' | 'private';
    stats?: {
        views?: number;
        edits?: number;
        comments?: number;
    };
}

// Placeholder functions - to be implemented
export async function getDocuments(): Promise<Document[]> {
    // TODO: Implement API call
    return [];
}

export async function getDocument(id: string): Promise<Document | null> {
    // TODO: Implement API call
    return null;
}

export async function uploadDocument(file: File): Promise<Document> {
    // TODO: Implement API call
    throw new Error('Not implemented');
}

export async function deleteDocument(id: string): Promise<void> {
    // TODO: Implement API call
    throw new Error('Not implemented');
}
