'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import Link from 'next/link';
import { createResource } from '@/lib/resources';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { LexicalEditor } from '@/components/ui/LexicalEditor';
import { Icon } from '@/components/ui/Icon';
import { MentionUser } from '@/hooks/useMentions';
import { getSpace } from '@/lib/spaces';

export default function NewResourcePage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
    const [resourceType, setResourceType] = useState<'guide' | 'template' | 'documentation' | 'best-practice' | 'tool'>('guide');
    const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | ''>('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [version, setVersion] = useState('');

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

    const userSpaceIds = userData
        ? [...userData.adminSpaces, ...userData.memberSpaces].map(s => String(s.id))
        : [];

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
            createResource({
                title: title.trim(),
                excerpt: excerpt.trim() || undefined,
                htmlContent: htmlContent || `<p>${content.trim()}</p>`,
                resourceType,
                difficulty: difficulty || undefined,
                estimatedTime: estimatedTime ? Number(estimatedTime) : undefined,
                version: version.trim() || undefined,
                space: Number(selectedSpaceId),
            }),
        onSuccess: (newResource) => {
            queryClient.invalidateQueries({ queryKey: ['feed-resources'] });
            router.push(`/resources/${newResource.id}`);
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
        <div className="new-resource-page">
            <div className="new-resource-container">
                <header className="new-resource-header">
                    <h1 className="new-resource-title">Create Resource</h1>
                    <Link href="/feed" className="new-resource-cancel-link">
                        Cancel
                    </Link>
                </header>

                <form className="new-resource-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <Label.Root htmlFor="resource-space" className="form-label">
                            Space *
                        </Label.Root>
                        <Select.Root value={selectedSpaceId} onValueChange={setSelectedSpaceId}>
                            <Select.Trigger className="select-trigger" id="resource-space">
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
                        <Label.Root htmlFor="resource-title" className="form-label">
                            Title *
                        </Label.Root>
                        <input
                            id="resource-title"
                            type="text"
                            className="form-input"
                            placeholder="E.g. Innovation Proposal Template"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <Label.Root htmlFor="resource-excerpt" className="form-label">
                            Excerpt (Optional)
                        </Label.Root>
                        <textarea
                            id="resource-excerpt"
                            className="form-textarea"
                            placeholder="A brief summary of what this resource provides (recommended 1-2 sentences)"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <Label.Root htmlFor="resource-type" className="form-label">
                                Resource Type *
                            </Label.Root>
                            <Select.Root value={resourceType} onValueChange={(value: any) => setResourceType(value)}>
                                <Select.Trigger className="select-trigger" id="resource-type">
                                    <Select.Value />
                                    <Select.Icon className="select-icon">
                                        <Icon icon="chevronDown" size={16} />
                                    </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content className="select-content">
                                        <Select.Viewport className="select-viewport">
                                            <Select.Item value="guide" className="select-item">
                                                <Select.ItemText>Guide</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="template" className="select-item">
                                                <Select.ItemText>Template</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="documentation" className="select-item">
                                                <Select.ItemText>Documentation</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="best-practice" className="select-item">
                                                <Select.ItemText>Best Practice</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="tool" className="select-item">
                                                <Select.ItemText>Tool</Select.ItemText>
                                            </Select.Item>
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </div>

                        <div className="form-field">
                            <Label.Root htmlFor="resource-difficulty" className="form-label">
                                Difficulty Level (Optional)
                            </Label.Root>
                            <Select.Root value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                                <Select.Trigger className="select-trigger" id="resource-difficulty">
                                    <Select.Value placeholder="Select difficulty..." />
                                    <Select.Icon className="select-icon">
                                        <Icon icon="chevronDown" size={16} />
                                    </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content className="select-content">
                                        <Select.Viewport className="select-viewport">
                                            <Select.Item value="beginner" className="select-item">
                                                <Select.ItemText>Beginner</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="intermediate" className="select-item">
                                                <Select.ItemText>Intermediate</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="advanced" className="select-item">
                                                <Select.ItemText>Advanced</Select.ItemText>
                                            </Select.Item>
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <Label.Root htmlFor="resource-time" className="form-label">
                                Est. Time (minutes)
                            </Label.Root>
                            <input
                                id="resource-time"
                                type="number"
                                className="form-input"
                                placeholder="30"
                                value={estimatedTime}
                                onChange={(e) => setEstimatedTime(e.target.value)}
                                min="1"
                            />
                            <p className="form-field-hint">
                                How long it typically takes to use this resource
                            </p>
                        </div>

                        <div className="form-field">
                            <Label.Root htmlFor="resource-version" className="form-label">
                                Version (Optional)
                            </Label.Root>
                            <input
                                id="resource-version"
                                type="text"
                                className="form-input"
                                placeholder="1.0"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                            />
                            <p className="form-field-hint">
                                E.g., 1.0, 2.1, etc.
                            </p>
                        </div>
                    </div>

                    <div className="form-field">
                        <Label.Root htmlFor="resource-content" className="form-label">
                            Content *
                        </Label.Root>
                        <LexicalEditor
                            value={content}
                            onChange={handleEditorChange}
                            mode="simple"
                            placeholder="Provide detailed information, instructions, or guidance. Use headings, lists, and code blocks to structure your content. Type @ to mention collaborators."
                            users={mentionUsers}
                            onMention={(user) => console.log('Mentioned:', user.name)}
                        />
                        <p className="form-field-hint">
                            Tip: Structure your content with clear headings and step-by-step instructions
                        </p>
                    </div>

                    <div className="form-info-box">
                        <Icon icon="info" size={16} />
                        <div>
                            <strong>Note:</strong> File attachments and related resources can be added after creating the resource.
                        </div>
                    </div>

                    {createMutation.isError && (
                        <div className="form-error-box">
                            {createMutation.error instanceof Error
                                ? createMutation.error.message
                                : 'Failed to create resource. Please try again.'}
                        </div>
                    )}

                    <div className="new-resource-actions">
                        <Link
                            href="/feed"
                            className="new-resource-cancel"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="form-button new-resource-submit"
                            disabled={!isFormValid || createMutation.isPending}
                        >
                            {createMutation.isPending ? 'Publishing...' : 'Publish Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
