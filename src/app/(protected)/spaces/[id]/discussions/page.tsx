'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getSpaceDiscussions } from '@/lib/discussions';
import { DiscussionCard } from '@/components/ui/DiscussionCard';

export default function SpaceDiscussionsPage() {
    const params = useParams();
    const spaceId = params.id as string;

    const { data: discussions, isLoading, error } = useQuery({
        queryKey: ['space-discussions', spaceId],
        queryFn: () => getSpaceDiscussions(spaceId),
        enabled: !!spaceId,
    });

    if (isLoading) {
        return (
            <div className="discussions-page">
                <p className="discussions-loading">Loading discussions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="discussions-page">
                <p className="discussions-error">Error loading discussions.</p>
            </div>
        );
    }

    return (
        <div className="discussions-page">
            <header className="discussions-header">
                <div className="discussions-header-top">
                    <div>
                        <h1 className="discussions-title">Discussions</h1>
                        <p className="discussions-subtitle">Join the conversation</p>
                    </div>
                    <Link
                        href={`/spaces/${spaceId}/discussions/new`}
                        className="discussions-new-button"
                    >
                        New Discussion
                    </Link>
                </div>
            </header>

            {discussions && discussions.length > 0 ? (
                <div className="discussions-list">
                    {discussions.map((discussion) => (
                        <DiscussionCard
                            key={discussion.id}
                            discussion={discussion}
                            spaceId={spaceId}
                        />
                    ))}
                </div>
            ) : (
                <div className="discussions-empty">
                    <p>No discussions yet. Start the first conversation!</p>
                </div>
            )}
        </div>
    );
}
