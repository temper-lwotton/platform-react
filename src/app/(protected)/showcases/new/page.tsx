'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import Link from 'next/link';
import { createShowcase } from '@/lib/showcases';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { LexicalEditor } from '@/components/ui/LexicalEditor';
import { Icon } from '@/components/ui/Icon';
import { MentionUser } from '@/hooks/useMentions';
import { getSpace } from '@/lib/spaces';

export default function NewShowcasePage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
    const [projectStart, setProjectStart] = useState('');
    const [projectEnd, setProjectEnd] = useState('');

    // Dynamic impact metrics
    const [impactMetrics, setImpactMetrics] = useState<Array<{ label: string; value: string }>>([
        { label: '', value: '' }
    ]);

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

    const addImpactMetric = () => {
        setImpactMetrics([...impactMetrics, { label: '', value: '' }]);
    };

    const removeImpactMetric = (index: number) => {
        setImpactMetrics(impactMetrics.filter((_, i) => i !== index));
    };

    const updateImpactMetric = (index: number, field: 'label' | 'value', value: string) => {
        const updated = [...impactMetrics];
        updated[index][field] = value;
        setImpactMetrics(updated);
    };

    const createMutation = useMutation({
        mutationFn: () =>
            createShowcase({
                title: title.trim(),
                excerpt: excerpt.trim() || undefined,
                htmlContent: htmlContent || `<p>${content.trim()}</p>`,
                projectStart: projectStart || undefined,
                projectEnd: projectEnd || undefined,
                space: Number(selectedSpaceId),
            }),
        onSuccess: (newShowcase) => {
            queryClient.invalidateQueries({ queryKey: ['feed-showcases'] });
            router.push(`/showcases/${newShowcase.id}`);
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
        <div className="new-showcase-page">
            <div className="new-showcase-container">
                <header className="new-showcase-header">
                    <h1 className="new-showcase-title">Create Showcase</h1>
                    <Link href="/feed" className="new-showcase-cancel-link">
                        Cancel
                    </Link>
                </header>

                <form className="new-showcase-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <Label.Root htmlFor="showcase-space" className="form-label">
                            Space *
                        </Label.Root>
                        <Select.Root value={selectedSpaceId} onValueChange={setSelectedSpaceId}>
                            <Select.Trigger className="select-trigger" id="showcase-space">
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
                        <Label.Root htmlFor="showcase-title" className="form-label">
                            Title *
                        </Label.Root>
                        <input
                            id="showcase-title"
                            type="text"
                            className="form-input"
                            placeholder="E.g. Electric Bus Pilot: A Sustainable Success"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <Label.Root htmlFor="showcase-excerpt" className="form-label">
                            Excerpt (Optional)
                        </Label.Root>
                        <textarea
                            id="showcase-excerpt"
                            className="form-textarea"
                            placeholder="A brief summary that appears in cards and previews (recommended 1-2 sentences)"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <Label.Root htmlFor="showcase-start" className="form-label">
                                Project Start Date (Optional)
                            </Label.Root>
                            <input
                                id="showcase-start"
                                type="date"
                                className="form-input"
                                value={projectStart}
                                onChange={(e) => setProjectStart(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <Label.Root htmlFor="showcase-end" className="form-label">
                                Project End Date (Optional)
                            </Label.Root>
                            <input
                                id="showcase-end"
                                type="date"
                                className="form-input"
                                value={projectEnd}
                                onChange={(e) => setProjectEnd(e.target.value)}
                                min={projectStart || undefined}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-header">
                            <Label.Root className="form-label">
                                Impact Metrics (Optional)
                            </Label.Root>
                            <button
                                type="button"
                                onClick={addImpactMetric}
                                className="form-add-button"
                            >
                                <Icon icon="plus" size={16} />
                                Add Metric
                            </button>
                        </div>
                        <p className="form-field-hint">
                            Add key metrics that demonstrate the impact of this project (e.g., "60%" "Carbon Reduction")
                        </p>
                        {impactMetrics.map((metric, index) => (
                            <div key={index} className="form-row">
                                <div className="form-field">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Metric value (e.g., 60%, $50k, 2x)"
                                        value={metric.value}
                                        onChange={(e) => updateImpactMetric(index, 'value', e.target.value)}
                                    />
                                </div>
                                <div className="form-field">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Metric label (e.g., Carbon Reduction)"
                                        value={metric.label}
                                        onChange={(e) => updateImpactMetric(index, 'label', e.target.value)}
                                    />
                                </div>
                                {impactMetrics.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeImpactMetric(index)}
                                        className="form-remove-button"
                                        aria-label="Remove metric"
                                    >
                                        <Icon icon="close" size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="form-field">
                        <Label.Root htmlFor="showcase-content" className="form-label">
                            Content *
                        </Label.Root>
                        <LexicalEditor
                            value={content}
                            onChange={handleEditorChange}
                            mode="simple"
                            placeholder="Tell the story of your project. Include the challenge, solution, results, and lessons learned. Type @ to mention team members."
                            users={mentionUsers}
                            onMention={(user) => console.log('Mentioned:', user.name)}
                        />
                        <p className="form-field-hint">
                            Tip: Use headings like "The Challenge", "Our Approach", "Results", "Lessons Learned"
                        </p>
                    </div>

                    <div className="form-info-box">
                        <Icon icon="info" size={16} />
                        <div>
                            <strong>Note:</strong> Image galleries, team member attribution, and related links can be added after creating the showcase.
                        </div>
                    </div>

                    {createMutation.isError && (
                        <div className="form-error-box">
                            {createMutation.error instanceof Error
                                ? createMutation.error.message
                                : 'Failed to create showcase. Please try again.'}
                        </div>
                    )}

                    <div className="new-showcase-actions">
                        <Link
                            href="/feed"
                            className="new-showcase-cancel"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="form-button new-showcase-submit"
                            disabled={!isFormValid || createMutation.isPending}
                        >
                            {createMutation.isPending ? 'Publishing...' : 'Publish Showcase'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
