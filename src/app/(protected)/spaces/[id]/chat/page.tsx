'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getSpace } from '@/lib/spaces';
import { getStatusUpdatesBySpace } from '@/lib/status-updates';
import { SpaceChatInput } from '@/components/ui/SpaceChatInput';
import { SpaceChatMembers } from '@/components/ui/SpaceChatMembers';
import { StatusUpdateCard } from '@/components/ui/StatusUpdateCard';
import { Icon } from '@/components/ui/Icon';

export default function SpaceChatPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: space, isLoading: spaceLoading } = useQuery({
        queryKey: ['space', id],
        queryFn: () => getSpace(id),
        enabled: !!id,
    });

    // Get status updates for this space
    const statusUpdates = getStatusUpdatesBySpace(id);

    if (spaceLoading) {
        return (
            <div className="space-chat-container">
                <div className="space-chat-main">
                    <p className="space-chat-loading">Loading chat...</p>
                </div>
            </div>
        );
    }

    if (!space) {
        return (
            <div className="space-chat-container">
                <div className="space-chat-main">
                    <p className="space-chat-error">Space not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-chat-container">
            {/* Main Chat Area */}
            <div className="space-chat-main">
                {/* Channel Header */}
                <header className="space-chat-channel-header">
                    <div className="space-chat-channel-name">
                        <Icon icon="comment" size={20} />
                        <h1>general-chat</h1>
                    </div>
                    <div className="space-chat-channel-description">
                        Share updates, ask questions, and collaborate
                    </div>
                </header>

                {/* Messages */}
                <div className="space-chat-messages-container">
                    {statusUpdates.length === 0 ? (
                        <div className="space-chat-empty">
                            <div className="space-chat-empty-icon">
                                <Icon icon="comment" size={48} />
                            </div>
                            <h2 className="space-chat-empty-title">Welcome to #general-chat</h2>
                            <p className="space-chat-empty-description">
                                This is the beginning of the #general-chat channel.
                            </p>
                            <div className="space-chat-empty-tips">
                                <p className="space-chat-empty-tip-title">Share updates like:</p>
                                <ul className="space-chat-empty-tips-list">
                                    <li>🔬 What you're currently researching</li>
                                    <li>🚀 Progress on your projects</li>
                                    <li>🤝 Questions or requests for collaboration</li>
                                    <li>💡 Ideas and insights</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="space-chat-messages-list">
                            {statusUpdates.map((statusUpdate) => (
                                <div key={statusUpdate.id} className="space-chat-message">
                                    <StatusUpdateCard
                                        statusUpdate={statusUpdate}
                                        isAdmin={false}
                                        isPinned={false}
                                        currentSpaceId={id}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Chat Input at Bottom */}
                <div className="space-chat-input-wrapper">
                    <SpaceChatInput spaceId={id} spaceTitle={space.title} />
                </div>
            </div>

            {/* Members Sidebar */}
            <SpaceChatMembers admins={space.admins} members={space.members} />
        </div>
    );
}
