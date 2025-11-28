'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { createShowcase } from '@/lib/showcases';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { LexicalEditor } from '@/components/ui/LexicalEditor';
import { Icon } from '@/components/ui/Icon';
import { Input, Textarea, Button } from '@/components/ui/primitives';
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
                    {/* Space selector - keeping Radix UI for now */}
                    <div className="form-field">
                        <label htmlFor="showcase-space" className="form-label">
                            Space *
                        </label>
                        <div className="select-wrapper">
                            <select
                                id="showcase-space"
                                className="form-select"
                                value={selectedSpaceId}
                                onChange={(e) => setSelectedSpaceId(e.target.value)}
                                required
                            >
                                <option value="">Select a space...</option>
                                {userSpaces.map((space) => (
                                    <option key={space.id} value={String(space.id)}>
                                        {space.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Input
                        id="showcase-title"
                        type="text"
                        label="Title"
                        placeholder="E.g. Electric Bus Pilot: A Sustainable Success"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        fullWidth
                    />

                    <Textarea
                        id="showcase-excerpt"
                        label="Excerpt (Optional)"
                        placeholder="A brief summary that appears in cards and previews (recommended 1-2 sentences)"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={3}
                        fullWidth
                    />

                    <div className="form-row">
                        <Input
                            id="showcase-start"
                            type="date"
                            label="Project Start Date (Optional)"
                            value={projectStart}
                            onChange={(e) => setProjectStart(e.target.value)}
                            fullWidth
                        />
                        <Input
                            id="showcase-end"
                            type="date"
                            label="Project End Date (Optional)"
                            value={projectEnd}
                            onChange={(e) => setProjectEnd(e.target.value)}
                            min={projectStart || undefined}
                            fullWidth
                        />
                    </div>

                    <div className="form-section">
                        <div className="form-section-header">
                            <label className="form-label">
                                Impact Metrics (Optional)
                            </label>
                            <Button
                                type="button"
                                onClick={addImpactMetric}
                                variant="outline"
                                size="sm"
                            >
                                <Icon icon="plus" size={16} />
                                Add Metric
                            </Button>
                        </div>
                        <p className="form-field-hint">
                            Add key metrics that demonstrate the impact of this project (e.g., "60%" "Carbon Reduction")
                        </p>
                        {impactMetrics.map((metric, index) => (
                            <div key={index} className="form-row">
                                <Input
                                    type="text"
                                    placeholder="Metric value (e.g., 60%, $50k, 2x)"
                                    value={metric.value}
                                    onChange={(e) => updateImpactMetric(index, 'value', e.target.value)}
                                    fullWidth
                                />
                                <Input
                                    type="text"
                                    placeholder="Metric label (e.g., Carbon Reduction)"
                                    value={metric.label}
                                    onChange={(e) => updateImpactMetric(index, 'label', e.target.value)}
                                    fullWidth
                                />
                                {impactMetrics.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeImpactMetric(index)}
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Remove metric"
                                    >
                                        <Icon icon="x" size={16} />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="form-field">
                        <label htmlFor="showcase-content" className="form-label">
                            Content *
                        </label>
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
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={!isFormValid}
                            loading={createMutation.isPending}
                        >
                            Publish Showcase
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
