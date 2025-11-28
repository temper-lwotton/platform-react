'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Icon } from '@/components/ui/Icon';

interface QuickStartModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function QuickStartModal({ open, onOpenChange }: QuickStartModalProps) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [isStarting, setIsStarting] = useState(false);

    const handleQuickStart = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        setIsStarting(true);

        // Simulate creating webinar
        await new Promise(resolve => setTimeout(resolve, 500));

        // In a real app, this would create the webinar via API
        // and redirect to the live room
        console.log('Starting webinar:', title);

        // For now, just close modal and redirect to webinars page
        onOpenChange(false);
        setIsStarting(false);
        setTitle('');
        router.push('/webinars');
    };

    const handleCancel = () => {
        setTitle('');
        onOpenChange(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="quick-start-overlay" />
                <Dialog.Content className="quick-start-content">
                    <div className="quick-start-header">
                        <Dialog.Title className="quick-start-title">
                            Go Live
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="quick-start-close" aria-label="Close">
                                <Icon icon="x" size={20} />
                            </button>
                        </Dialog.Close>
                    </div>

                    <Dialog.Description className="quick-start-description">
                        Start your webinar instantly with default settings
                    </Dialog.Description>

                    <form onSubmit={handleQuickStart} className="quick-start-form">
                        <div className="quick-start-field">
                            <label htmlFor="quick-title" className="quick-start-label">
                                Webinar Title
                            </label>
                            <input
                                type="text"
                                id="quick-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Team Meeting"
                                className="quick-start-input"
                                autoFocus
                                required
                            />
                        </div>

                        <div className="quick-start-info">
                            <div className="quick-start-info-item">
                                <Icon icon="check" size={16} />
                                <span>Chat enabled</span>
                            </div>
                            <div className="quick-start-info-item">
                                <Icon icon="check" size={16} />
                                <span>Q&A enabled</span>
                            </div>
                            <div className="quick-start-info-item">
                                <Icon icon="check" size={16} />
                                <span>1 hour duration</span>
                            </div>
                        </div>

                        <p className="quick-start-hint">
                            Need more options?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    onOpenChange(false);
                                    router.push('/webinars/new');
                                }}
                                className="quick-start-link"
                            >
                                Use the full form
                            </button>
                        </p>

                        <div className="quick-start-actions">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="quick-start-cancel"
                                disabled={isStarting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="quick-start-submit"
                                disabled={isStarting || !title.trim()}
                            >
                                {isStarting ? (
                                    <>
                                        <div className="quick-start-spinner" />
                                        Starting...
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="video" size={20} />
                                        Go Live
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
