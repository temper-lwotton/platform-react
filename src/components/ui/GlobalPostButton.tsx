'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { getCurrentUserId } from '@/lib/auth';
import { Icon } from './Icon';

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
                        <Icon icon="comment" size={20} className="global-post-dropdown-icon" />
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
                        <Icon icon="calendar" size={20} className="global-post-dropdown-icon" />
                        <div className="global-post-dropdown-text">
                            <div className="global-post-dropdown-label">Event</div>
                            <div className="global-post-dropdown-description">
                                Create an event for your community
                            </div>
                        </div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="global-post-dropdown-separator" />

                    <DropdownMenu.Item
                        className="global-post-dropdown-item"
                        onSelect={() => handleNavigate('/webinars/new')}
                    >
                        <Icon icon="video" size={20} className="global-post-dropdown-icon" />
                        <div className="global-post-dropdown-text">
                            <div className="global-post-dropdown-label">Webinar</div>
                            <div className="global-post-dropdown-description">
                                Host a live or scheduled webinar
                            </div>
                        </div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="global-post-dropdown-separator" />

                    <DropdownMenu.Item
                        className="global-post-dropdown-item"
                        onSelect={() => handleNavigate('/updates/new')}
                    >
                        <Icon icon="bell" size={20} className="global-post-dropdown-icon" />
                        <div className="global-post-dropdown-text">
                            <div className="global-post-dropdown-label">Update</div>
                            <div className="global-post-dropdown-description">
                                Share an important announcement
                            </div>
                        </div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="global-post-dropdown-separator" />

                    <DropdownMenu.Item
                        className="global-post-dropdown-item"
                        onSelect={() => handleNavigate('/showcases/new')}
                    >
                        <Icon icon="star" size={20} className="global-post-dropdown-icon" />
                        <div className="global-post-dropdown-text">
                            <div className="global-post-dropdown-label">Showcase</div>
                            <div className="global-post-dropdown-description">
                                Share a success story or case study
                            </div>
                        </div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        className="global-post-dropdown-item"
                        onSelect={() => handleNavigate('/resources/new')}
                    >
                        <Icon icon="book" size={20} className="global-post-dropdown-icon" />
                        <div className="global-post-dropdown-text">
                            <div className="global-post-dropdown-label">Resource</div>
                            <div className="global-post-dropdown-description">
                                Add a guide, template, or documentation
                            </div>
                        </div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="global-post-dropdown-separator" />

                    <DropdownMenu.Item
                        className="global-post-dropdown-item"
                        onSelect={() => handleNavigate('/exchanges/new')}
                    >
                        <Icon icon="repeat" size={20} className="global-post-dropdown-icon" />
                        <div className="global-post-dropdown-text">
                            <div className="global-post-dropdown-label">Exchange</div>
                            <div className="global-post-dropdown-description">
                                Offer or request equipment, space, or expertise
                            </div>
                        </div>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
