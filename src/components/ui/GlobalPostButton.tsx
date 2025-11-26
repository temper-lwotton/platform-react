'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { getCurrentUserId } from '@/lib/auth';

export function GlobalPostButton() {
    const router = useRouter();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCurrentUserId(getCurrentUserId());
    }, []);

    // Don't render until we're on the client to avoid hydration mismatch
    if (!isClient || !currentUserId) {
        return null;
    }

    const handleNavigate = (path: string) => {
        setIsOpen(false);
        router.push(path);
    };

    return (
        <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu.Trigger asChild>
                <button
                    className="global-post-button"
                    aria-label="Create new content"
                >
                    + New
                    <span className="global-post-button-icon">▼</span>
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="global-post-dropdown-content"
                    align="end"
                    sideOffset={8}
                >
                    <DropdownMenu.Item
                        className="global-post-dropdown-item"
                        onSelect={() => handleNavigate('/posts/new')}
                    >
                        <span className="global-post-dropdown-icon">💬</span>
                        <div className="global-post-dropdown-text">
                            <div className="global-post-dropdown-label">Discussion</div>
                            <div className="global-post-dropdown-description">
                                Start a conversation or ask a question
                            </div>
                        </div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="global-post-dropdown-separator" />

                    <DropdownMenu.Item
                        className="global-post-dropdown-item"
                        onSelect={() => handleNavigate('/events/new')}
                    >
                        <span className="global-post-dropdown-icon">📅</span>
                        <div className="global-post-dropdown-text">
                            <div className="global-post-dropdown-label">Event</div>
                            <div className="global-post-dropdown-description">
                                Create an event for your community
                            </div>
                        </div>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
