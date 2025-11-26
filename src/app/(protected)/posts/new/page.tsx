'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Popover from '@radix-ui/react-popover';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Label from '@radix-ui/react-label';
import Link from 'next/link';
import { createDiscussion } from '@/lib/discussions';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { getSpace, Space } from '@/lib/spaces';
import { ExcerptSelector } from '@/components/ui/ExcerptSelector';
import { EngagementAnalysis } from '@/components/ui/EngagementAnalysis';
import { LexicalEditor } from '@/components/ui/LexicalEditor';
import type { EngagementAnalysis as EngagementAnalysisType } from '@/types/engagement';

type Step = 1 | 2 | 3;

export default function NewPostPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Step 1 fields
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // Plain text for AI analysis
    const [htmlContent, setHtmlContent] = useState(''); // HTML for saving
    const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');

    // Step 2 fields (AI-generated)
    const [aiExcerpts, setAiExcerpts] = useState<string[]>([]);
    const [selectedExcerpt, setSelectedExcerpt] = useState('');
    const [customExcerpt, setCustomExcerpt] = useState('');
    const [engagementAnalysis, setEngagementAnalysis] = useState<EngagementAnalysisType | null>(null);

    // UI state
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
    const spacesLoading = userLoading || spaceQueries.isLoading;

    // Find selected space for display
    const selectedSpace = userSpaces.find(s => String(s.id) === selectedSpaceId);

    // Helper to get member count
    const getMemberCount = (space: Space) => {
        return space.members.length + space.admins.length;
    };

    // Handle space selection
    const handleSpaceSelect = (spaceId: string) => {
        setSelectedSpaceId(spaceId);
        setIsPopoverOpen(false);
    };

    // Generate excerpts mutation
    const generateExcerptsMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/discussions/generate-excerpts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to generate excerpts');
            }

            return res.json();
        },
        onSuccess: (data) => {
            setAiExcerpts(data.excerpts);
            // Auto-select the middle option (most balanced)
            if (data.excerpts.length > 0) {
                const defaultIndex = Math.floor(data.excerpts.length / 2);
                setSelectedExcerpt(data.excerpts[defaultIndex]);
            }
            setCurrentStep(2);
        },
    });

    // Analyze engagement mutation
    const analyzeEngagementMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/discussions/analyze-engagement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                    excerpt: selectedExcerpt.trim(),
                    spaceId: Number(selectedSpaceId),
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to analyze engagement');
            }

            return res.json();
        },
        onSuccess: (data) => {
            setEngagementAnalysis(data.analysis);
        },
    });

    // Create discussion mutation
    const createMutation = useMutation({
        mutationFn: () =>
            createDiscussion({
                title: title.trim(),
                excerpt: selectedExcerpt.trim(),
                htmlContent: htmlContent || `<p>${content.trim()}</p>`,
                author: Number(currentUserId),
                space: Number(selectedSpaceId),
            }),
        onSuccess: (newDiscussion) => {
            queryClient.invalidateQueries({ queryKey: ['space-discussions', selectedSpaceId] });
            router.push(`/spaces/${selectedSpaceId}/discussions/${newDiscussion.id}`);
        },
    });

    // Handler for Lexical editor changes
    const handleEditorChange = (plainText: string, html: string) => {
        setContent(plainText);
        setHtmlContent(html);
    };

    // Step 1 validation
    const isStep1Valid =
        title.trim() &&
        content.trim() &&
        selectedSpaceId &&
        currentUserId &&
        content.trim().length >= 50; // Minimum content for AI

    // Step 2 validation
    const isStep2Valid =
        selectedExcerpt.trim() &&
        selectedExcerpt.trim().length >= 30 &&
        selectedExcerpt.trim().length <= 200;

    const handleStep1Next = (e: React.FormEvent) => {
        e.preventDefault();
        if (isStep1Valid) {
            generateExcerptsMutation.mutate();
        }
    };

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isStep2Valid) {
            createMutation.mutate();
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
    };

    // Trigger engagement analysis after excerpt is selected
    useEffect(() => {
        if (currentStep === 2 && selectedExcerpt && !engagementAnalysis && !analyzeEngagementMutation.isPending) {
            analyzeEngagementMutation.mutate();
        }
    }, [currentStep, selectedExcerpt]);

    // Don't render until we're on the client to avoid hydration mismatch
    if (!isClient || !currentUserId) {
        return null;
    }

    return (
        <div className="new-post-page">
            <div className="new-post-container">
                <header className="new-post-header">
                    <h1 className="new-post-title">
                        {currentStep === 1 ? 'Post Content' : 'Enhance Your Post'}
                    </h1>
                    <Link href="/" className="new-post-cancel-link">
                        Cancel
                    </Link>
                </header>

                {/* Step indicator */}
                <div className="step-indicator">
                    <div className="step-indicator-item" data-active={currentStep === 1} data-completed={currentStep > 1}>
                        <div className="step-indicator-number">1</div>
                        <div className="step-indicator-label">Content</div>
                    </div>
                    <div className="step-indicator-line" data-completed={currentStep > 1} />
                    <div className="step-indicator-item" data-active={currentStep === 2} data-completed={currentStep > 2}>
                        <div className="step-indicator-number">2</div>
                        <div className="step-indicator-label">Enhance</div>
                    </div>
                </div>

                {/* Step 1: Content */}
                {currentStep === 1 && (
                    <form className="new-post-form" onSubmit={handleStep1Next}>
                        <div className="form-field">
                            <Label.Root className="form-label">
                                Space
                            </Label.Root>
                            <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                <Popover.Trigger asChild>
                                    <button
                                        type="button"
                                        className="space-selector-trigger"
                                        disabled={spacesLoading}
                                        aria-label="Select space"
                                    >
                                        {selectedSpace ? (
                                            <div className="space-selector-trigger-content">
                                                <div className="space-selector-trigger-title">
                                                    {selectedSpace.title}
                                                </div>
                                                <div className="space-selector-trigger-meta">
                                                    {selectedSpace.subtitle && (
                                                        <span>{selectedSpace.subtitle}</span>
                                                    )}
                                                    {selectedSpace.subtitle && <span className="space-meta-separator">•</span>}
                                                    <span>{getMemberCount(selectedSpace)} members</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="space-selector-placeholder">Select a space...</span>
                                        )}
                                        <span className="space-selector-icon">▼</span>
                                    </button>
                                </Popover.Trigger>

                                <Popover.Portal>
                                    <Popover.Content
                                        className="space-selector-content"
                                        align="start"
                                        sideOffset={8}
                                    >
                                        <RadioGroup.Root
                                            value={selectedSpaceId}
                                            onValueChange={handleSpaceSelect}
                                        >
                                            {spacesLoading ? (
                                                <div className="space-selector-loading">Loading spaces...</div>
                                            ) : userSpaces.length === 0 ? (
                                                <div className="space-selector-empty">No spaces available</div>
                                            ) : (
                                                userSpaces.map((space) => {
                                                    const memberCount = getMemberCount(space);
                                                    return (
                                                        <label
                                                            key={space.id}
                                                            className="space-selector-item"
                                                            htmlFor={`space-${space.id}`}
                                                        >
                                                            <RadioGroup.Item
                                                                value={String(space.id)}
                                                                id={`space-${space.id}`}
                                                                className="space-radio"
                                                            >
                                                                <RadioGroup.Indicator className="space-radio-indicator" />
                                                            </RadioGroup.Item>
                                                            <div className="space-info">
                                                                <div className="space-info-title">
                                                                    {space.title}
                                                                </div>
                                                                <div className="space-info-meta">
                                                                    {space.subtitle && (
                                                                        <span>{space.subtitle}</span>
                                                                    )}
                                                                    {space.subtitle && <span className="space-meta-separator">•</span>}
                                                                    <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    );
                                                })
                                            )}
                                        </RadioGroup.Root>
                                    </Popover.Content>
                                </Popover.Portal>
                            </Popover.Root>
                        </div>

                        <div className="form-field">
                            <Label.Root htmlFor="post-title" className="form-label">
                                Title
                            </Label.Root>
                            <input
                                id="post-title"
                                type="text"
                                className="form-input"
                                placeholder="What would you like to discuss?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <Label.Root htmlFor="post-content" className="form-label">
                                Content
                            </Label.Root>
                            <LexicalEditor
                                value={content}
                                onChange={handleEditorChange}
                                mode="simple"
                                placeholder="Share your thoughts, questions, or ideas... (minimum 50 characters)"
                            />
                            <div className="form-field-hint">
                                {content.length} characters {content.length < 50 && `(${50 - content.length} more needed)`}
                            </div>
                        </div>

                        {generateExcerptsMutation.isError && (
                            <div className="form-error-box">
                                {generateExcerptsMutation.error instanceof Error
                                    ? generateExcerptsMutation.error.message
                                    : 'Failed to generate excerpts. Please try again.'}
                            </div>
                        )}

                        <div className="new-post-actions">
                            <Link
                                href="/"
                                className="new-post-cancel"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="form-button new-post-submit"
                                disabled={!isStep1Valid || generateExcerptsMutation.isPending}
                            >
                                {generateExcerptsMutation.isPending ? 'Analyzing...' : 'Next: AI Enhancement'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2: AI Enhancement */}
                {currentStep === 2 && (
                    <form className="new-post-form" onSubmit={handleFinalSubmit}>
                        <ExcerptSelector
                            excerpts={aiExcerpts}
                            value={selectedExcerpt}
                            onChange={setSelectedExcerpt}
                            onCustomChange={setCustomExcerpt}
                            customExcerpt={customExcerpt}
                        />

                        <EngagementAnalysis
                            analysis={engagementAnalysis}
                            isLoading={analyzeEngagementMutation.isPending}
                            error={analyzeEngagementMutation.error?.message}
                            onRetry={() => analyzeEngagementMutation.mutate()}
                        />

                        {createMutation.isError && (
                            <div className="form-error-box">
                                {createMutation.error instanceof Error
                                    ? createMutation.error.message
                                    : 'Failed to create discussion. Please try again.'}
                            </div>
                        )}

                        <div className="new-post-actions">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="new-post-back"
                                disabled={createMutation.isPending}
                            >
                                ← Back
                            </button>
                            <button
                                type="submit"
                                className="form-button new-post-submit"
                                disabled={!isStep2Valid || createMutation.isPending}
                            >
                                {createMutation.isPending ? 'Posting...' : 'Post Discussion'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
