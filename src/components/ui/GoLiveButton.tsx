'use client';

import { useState } from 'react';
import { Icon } from './Icon';
import { QuickStartModal } from '@/components/webinars/QuickStartModal';

export function GoLiveButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                className="go-live-button"
                onClick={() => setIsModalOpen(true)}
                aria-label="Start a webinar"
            >
                <Icon icon="video" size={20} />
                <span className="go-live-button-text">Go Live</span>
            </button>

            <QuickStartModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </>
    );
}
