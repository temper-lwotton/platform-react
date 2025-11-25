'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUserId } from '@/lib/auth';

export function GlobalPostButton() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCurrentUserId(getCurrentUserId());
    }, []);

    // Don't render until we're on the client to avoid hydration mismatch
    if (!isClient || !currentUserId) {
        return null;
    }

    return (
        <Link
            href="/posts/new"
            className="global-post-button"
            aria-label="Create new discussion"
        >
            + Post
        </Link>
    );
}
