'use client';

import React, { useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MentionUser } from '@/hooks/useMentions';
import { MentionHoverCard } from './MentionHoverCard';

interface RichContentWithMentionsProps {
    content: string;
    users: MentionUser[];
    className?: string;
}

/**
 * Component to render HTML content with interactive mention hover cards
 * Enhances mention links with Radix UI HoverCard on the client side
 */
export function RichContentWithMentions({ content, users, className = '' }: RichContentWithMentionsProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const hoverCardRootsRef = useRef<Map<Element, Root>>(new Map());

    useEffect(() => {
        if (!contentRef.current) return;

        // Small delay to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            if (!contentRef.current) return;

            // Find all mention links
            const mentionLinks = contentRef.current.querySelectorAll('a.mention-link[data-user-id]');

            mentionLinks.forEach((link) => {
                const userId = link.getAttribute('data-user-id');
                if (!userId) return;

                // Match user - handle both string and number IDs
                const user = users.find(u => String(u.id) === String(userId));
                if (!user) return;

                // Create a wrapper span for the hover card
                const wrapper = document.createElement('span');
                wrapper.className = 'mention-hover-wrapper';

                // Clone the link to preserve it
                const linkClone = link.cloneNode(true) as HTMLElement;

                // Replace the original link with our wrapper
                link.replaceWith(wrapper);

                // Create a React root and render the HoverCard
                const root = createRoot(wrapper);
                hoverCardRootsRef.current.set(wrapper, root);

                root.render(
                    <MentionHoverCard user={user}>
                        <a
                            href={`/users/${user.id}`}
                            className="mention-link"
                            data-user-id={user.id}
                        >
                            {linkClone.textContent}
                        </a>
                    </MentionHoverCard>
                );
            });
        }, 100);

        // Cleanup function
        return () => {
            clearTimeout(timeoutId);
            hoverCardRootsRef.current.forEach((root) => {
                root.unmount();
            });
            hoverCardRootsRef.current.clear();
        };
    }, [content, users]);

    return (
        <div
            ref={contentRef}
            className={`rich-content ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
