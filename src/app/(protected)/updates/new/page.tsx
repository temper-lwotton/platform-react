'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import Link from 'next/link';
import { createUpdate } from '@/lib/updates';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { LexicalEditor } from '@/components/ui/LexicalEditor';
import { Icon } from '@/components/ui/Icon';
import { MentionUser } from '@/hooks/useMentions';
import { getSpace } from '@/lib/spaces';

export default function NewUpdatePage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
    const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
    const [category, setCategory] = useState<'news' | 'milestone' | 'policy' | 'announcement' | 'other'>('announcement');
    const [expiresAt, setExpiresAt] = useState('');

    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCurrentUserId(getCurrentUserId());
    }, []);

    // Fetch current user with their spaces
    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['current-user'],
        queryFn: fetchCurrentUser,
        enabled: isClient && !!currentUserId,
    });

    // Get space IDs from user data
    const userSpaceIds = userData
        ? [...userData.adminSpaces, ...userData.memberSpaces].map(s => String(s.id))
        : [];

    // Fetch full details for each space
    const spaceQueries = useQuery({
        queryKey: ['user-spaces', userSpaceIds],
        queryFn: async () => {
            if (userSpaceIds.length === 0) return [];
            const spaces = await Promise.all(
                userSpaceIds.map(id => getSpace(id))
            );
            return spaces;
        },
        enabled: userSpaceIds.length > 0,
    });

    const userSpaces = spaceQueries.data || [];
    const selectedSpace = userSpaces.find(s => String(s.id) === selectedSpaceId);

    // Convert space members to MentionUser format
    const mentionUsers: MentionUser[] = useMemo(() => {
        if (!selectedSpace) return [];

        const allMembers = [
            ...(selectedSpace.admins || []),
            ...(selectedSpace.members || []),
        ];

        const uniqueMembers = new Map();
        allMembers.forEach(member => {
            if (member.id && !uniqueMembers.has(member.id)) {
                uniqueMembers.set(member.id, member);
            }
        });

        return Array.from(uniqueMembers.values()).map(member => ({
            id: member.id,
            name: member.profile?.fullName ||
                  `${member.profile?.firstName || ''} ${member.profile?.lastName || ''}`.trim() ||
                  member.email ||
                  'Unknown User',
            email: member.email,
            avatar: member.profile?.photo,
        }));
    }, [selectedSpace]);

    const createMutation = useMutation({
        mutationFn: () =>
            createUpdate({
                title: title.trim(),
                htmlContent: htmlContent || `<p>${content.trim()}</p>`,
                priority,
                category,
                space: Number(selectedSpaceId),
                expiresAt: expiresAt || undefined,
            }),
        onSuccess: (newUpdate) => {
            queryClient.invalidateQueries({ queryKey: ['feed-updates'] });
            router.push(`/updates/${newUpdate.id}`);
        },
    });

    const handleEditorChange = (plainText: string, html: string) => {
        setContent(plainText);
        setHtmlContent(html);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && content.trim() && selectedSpaceId && currentUserId) {
            createMutation.mutate();
        }
    };

    const isFormValid = title.trim() && content.trim() && selectedSpaceId && currentUserId;

    if (!isClient || !currentUserId) {
        return null;
    }

    return (
        <div className="new-update-page">
            <div className="new-update-container">
                <header className="new-update-header">
                    <h1 className="new-update-title">Create Update</h1>
                    <Link href="/feed" className="new-update-cancel-link">
                        Cancel
                    </Link>
                </header>

                <form className="new-update-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <Label.Root htmlFor="update-space" className="form-label">
                            Space *
                        </Label.Root>
                        <Select.Root value={selectedSpaceId} onValueChange={setSelectedSpaceId}>
                            <Select.Trigger className="select-trigger" id="update-space">
                                <Select.Value placeholder="Select a space..." />
                                <Select.Icon className="select-icon">
                                    <Icon icon="chevronDown" size={16} />
                                </Select.Icon>
                            </Select.Trigger>
                            <Select.Portal>
                                <Select.Content className="select-content">
                                    <Select.Viewport className="select-viewport">
                                        {userSpaces.map((space) => (
                                            <Select.Item key={space.id} value={String(space.id)} className="select-item">
                                                <Select.ItemText>{space.title}</Select.ItemText>
                                            </Select.Item>
                                        ))}
                                    </Select.Viewport>
                                </Select.Content>
                            </Select.Portal>
                        </Select.Root>
                    </div>

                    <div className="form-field">
                        <Label.Root htmlFor="update-title" className="form-label">
                            Title *
                        </Label.Root>
                        <input
                            id="update-title"
                            type="text"
                            className="form-input"
                            placeholder="Brief, clear title for your update"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <Label.Root htmlFor="update-priority" className="form-label">
                                Priority
                            </Label.Root>
                            <Select.Root value={priority} onValueChange={(value: any) => setPriority(value)}>
                                <Select.Trigger className="select-trigger" id="update-priority">
                                    <Select.Value />
                                    <Select.Icon className="select-icon">
                                        <Icon icon="chevronDown" size={16} />
                                    </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content className="select-content">
                                        <Select.Viewport className="select-viewport">
                                            <Select.Item value="low" className="select-item">
                                                <Select.ItemText>Low</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="normal" className="select-item">
                                                <Select.ItemText>Normal</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="high" className="select-item">
                                                <Select.ItemText>High</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="urgent" className="select-item">
                                                <Select.ItemText>Urgent</Select.ItemText>
                                            </Select.Item>
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </div>

                        <div className="form-field">
                            <Label.Root htmlFor="update-category" className="form-label">
                                Category
                            </Label.Root>
                            <Select.Root value={category} onValueChange={(value: any) => setCategory(value)}>
                                <Select.Trigger className="select-trigger" id="update-category">
                                    <Select.Value />
                                    <Select.Icon className="select-icon">
                                        <Icon icon="chevronDown" size={16} />
                                    </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content className="select-content">
                                        <Select.Viewport className="select-viewport">
                                            <Select.Item value="announcement" className="select-item">
                                                <Select.ItemText>Announcement</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="news" className="select-item">
                                                <Select.ItemText>News</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="milestone" className="select-item">
                                                <Select.ItemText>Milestone</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="policy" className="select-item">
                                                <Select.ItemText>Policy</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="other" className="select-item">
                                                <Select.ItemText>Other</Select.ItemText>
                                            </Select.Item>
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </div>
                    </div>

                    <div className="form-field">
                        <Label.Root htmlFor="update-expiry" className="form-label">
                            Expiry Date (Optional)
                        </Label.Root>
                        <input
                            id="update-expiry"
                            type="date"
                            className="form-input"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <p className="form-field-hint">
                            Set an expiry date for time-sensitive updates
                        </p>
                    </div>

                    <div className="form-field">
                        <Label.Root htmlFor="update-content" className="form-label">
                            Content *
                        </Label.Root>
                        <LexicalEditor
                            value={content}
                            onChange={handleEditorChange}
                            mode="simple"
                            placeholder="Share your update... Type @ to mention someone"
                            users={mentionUsers}
                            onMention={(user) => console.log('Mentioned:', user.name)}
                        />
                    </div>

                    {createMutation.isError && (
                        <div className="form-error-box">
                            {createMutation.error instanceof Error
                                ? createMutation.error.message
                                : 'Failed to create update. Please try again.'}
                        </div>
                    )}

                    <div className="new-update-actions">
                        <Link
                            href="/feed"
                            className="new-update-cancel"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="form-button new-update-submit"
                            disabled={!isFormValid || createMutation.isPending}
                        >
                            {createMutation.isPending ? 'Publishing...' : 'Publish Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
