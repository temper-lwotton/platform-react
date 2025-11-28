'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Select from '@radix-ui/react-select';
import Link from 'next/link';
import { createExchange, ExchangeType, ExchangeCategory, ExchangeTerms, LocationType } from '@/lib/exchanges';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { LexicalEditor } from '@/components/ui/LexicalEditor';
import { Icon } from '@/components/ui/Icon';
import { Input, Textarea, Button } from '@/components/ui/primitives';
import { MentionUser } from '@/hooks/useMentions';
import { getSpace } from '@/lib/spaces';

export default function NewExchangePage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
    const [exchangeType, setExchangeType] = useState<ExchangeType>('offering');
    const [category, setCategory] = useState<ExchangeCategory>('equipment');
    const [terms, setTerms] = useState<ExchangeTerms>('free');
    const [price, setPrice] = useState('');
    const [conditions, setConditions] = useState('');
    const [locationType, setLocationType] = useState<LocationType>('in-person');
    const [locationAddress, setLocationAddress] = useState('');
    const [schedule, setSchedule] = useState('');
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
            createExchange({
                title: title.trim(),
                excerpt: excerpt.trim() || undefined,
                htmlContent: htmlContent || `<p>${content.trim()}</p>`,
                type: exchangeType,
                category,
                terms,
                availability: 'available',
                price: price && terms === 'paid' ? Number(price) : undefined,
                conditions: conditions.trim() || undefined,
                location: locationType ? {
                    type: locationType,
                    address: locationType === 'in-person' && locationAddress.trim() ? locationAddress.trim() : undefined,
                } : undefined,
                schedule: schedule.trim() || undefined,
                expiresAt: expiresAt || undefined,
                space: Number(selectedSpaceId),
            }),
        onSuccess: (newExchange) => {
            queryClient.invalidateQueries({ queryKey: ['feed-exchanges'] });
            router.push(`/exchanges/${newExchange.id}`);
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
        <div className="new-exchange-page">
            <div className="new-exchange-container">
                <header className="new-exchange-header">
                    <h1 className="new-exchange-title">Create Exchange</h1>
                    <Link href="/feed" className="new-exchange-cancel-link">
                        Cancel
                    </Link>
                </header>

                <form className="new-exchange-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="exchange-space" className="form-label">
                            Space *
                        </label>
                        <Select.Root value={selectedSpaceId} onValueChange={setSelectedSpaceId}>
                            <Select.Trigger className="select-trigger" id="exchange-space">
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

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="exchange-type" className="form-label">
                                Exchange Type *
                            </label>
                            <Select.Root value={exchangeType} onValueChange={(value: ExchangeType) => setExchangeType(value)}>
                                <Select.Trigger className="select-trigger" id="exchange-type">
                                    <Select.Value />
                                    <Select.Icon className="select-icon">
                                        <Icon icon="chevronDown" size={16} />
                                    </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content className="select-content">
                                        <Select.Viewport className="select-viewport">
                                            <Select.Item value="offering" className="select-item">
                                                <Select.ItemText>Offering - I have something to share</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="request" className="select-item">
                                                <Select.ItemText>Request - I need something</Select.ItemText>
                                            </Select.Item>
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </div>

                        <div className="form-field">
                            <label htmlFor="exchange-category" className="form-label">
                                Category *
                            </label>
                            <Select.Root value={category} onValueChange={(value: ExchangeCategory) => setCategory(value)}>
                                <Select.Trigger className="select-trigger" id="exchange-category">
                                    <Select.Value />
                                    <Select.Icon className="select-icon">
                                        <Icon icon="chevronDown" size={16} />
                                    </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content className="select-content">
                                        <Select.Viewport className="select-viewport">
                                            <Select.Item value="equipment" className="select-item">
                                                <Select.ItemText>Equipment</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="space" className="select-item">
                                                <Select.ItemText>Space</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="expertise" className="select-item">
                                                <Select.ItemText>Expertise</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="collaboration" className="select-item">
                                                <Select.ItemText>Collaboration</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="materials" className="select-item">
                                                <Select.ItemText>Materials</Select.ItemText>
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

                    <Input
                        id="exchange-title"
                        type="text"
                        label="Title"
                        placeholder={exchangeType === 'offering' ? 'E.g. 3D Printer Available for Projects' : 'E.g. Looking for UX Design Feedback'}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        fullWidth
                    />

                    <Textarea
                        id="exchange-excerpt"
                        label="Excerpt (Optional)"
                        placeholder="A brief summary (recommended 1-2 sentences)"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={2}
                        fullWidth
                    />

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="exchange-terms" className="form-label">
                                Terms *
                            </label>
                            <Select.Root value={terms} onValueChange={(value: ExchangeTerms) => setTerms(value)}>
                                <Select.Trigger className="select-trigger" id="exchange-terms">
                                    <Select.Value />
                                    <Select.Icon className="select-icon">
                                        <Icon icon="chevronDown" size={16} />
                                    </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content className="select-content">
                                        <Select.Viewport className="select-viewport">
                                            <Select.Item value="free" className="select-item">
                                                <Select.ItemText>Free</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="trade" className="select-item">
                                                <Select.ItemText>Trade</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="paid" className="select-item">
                                                <Select.ItemText>Paid</Select.ItemText>
                                            </Select.Item>
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </div>

                        {terms === 'paid' && (
                            <Input
                                id="exchange-price"
                                type="number"
                                label="Price"
                                placeholder="0.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                min="0"
                                step="0.01"
                                required
                                fullWidth
                            />
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="exchange-location-type" className="form-label">
                                Location Type
                            </label>
                            <Select.Root value={locationType} onValueChange={(value: LocationType) => setLocationType(value)}>
                                <Select.Trigger className="select-trigger" id="exchange-location-type">
                                    <Select.Value />
                                    <Select.Icon className="select-icon">
                                        <Icon icon="chevronDown" size={16} />
                                    </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content className="select-content">
                                        <Select.Viewport className="select-viewport">
                                            <Select.Item value="in-person" className="select-item">
                                                <Select.ItemText>In-person</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="remote" className="select-item">
                                                <Select.ItemText>Remote</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="hybrid" className="select-item">
                                                <Select.ItemText>Hybrid</Select.ItemText>
                                            </Select.Item>
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </div>

                        {locationType === 'in-person' && (
                            <Input
                                id="exchange-address"
                                type="text"
                                label="Address (Optional)"
                                placeholder="E.g. Innovation Hub, Building A"
                                value={locationAddress}
                                onChange={(e) => setLocationAddress(e.target.value)}
                                fullWidth
                            />
                        )}
                    </div>

                    <div className="form-row">
                        <Input
                            id="exchange-schedule"
                            type="text"
                            label="Schedule / Availability (Optional)"
                            placeholder="E.g. Weekdays 9am-5pm, By appointment"
                            value={schedule}
                            onChange={(e) => setSchedule(e.target.value)}
                            fullWidth
                        />
                        <Input
                            id="exchange-expires"
                            type="date"
                            label="Expires (Optional)"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            fullWidth
                        />
                    </div>

                    <Textarea
                        id="exchange-conditions"
                        label="Conditions & Requirements (Optional)"
                        placeholder="Any specific conditions, requirements, or expectations"
                        value={conditions}
                        onChange={(e) => setConditions(e.target.value)}
                        rows={3}
                        fullWidth
                    />

                    <div className="form-field">
                        <label htmlFor="exchange-content" className="form-label">
                            Description *
                        </label>
                        <LexicalEditor
                            value={content}
                            onChange={handleEditorChange}
                            mode="simple"
                            placeholder={exchangeType === 'offering'
                                ? "Describe what you're offering, its condition, specifications, and how people can access it. Type @ to mention collaborators."
                                : "Describe what you need, your requirements, timeline, and how others can help. Type @ to mention collaborators."}
                            users={mentionUsers}
                            onMention={(user) => console.log('Mentioned:', user.name)}
                        />
                    </div>

                    <div className="form-info-box">
                        <Icon icon="info" size={16} />
                        <div>
                            <strong>Note:</strong> Images and additional details can be added after creating the exchange.
                        </div>
                    </div>

                    {createMutation.isError && (
                        <div className="form-error-box">
                            {createMutation.error instanceof Error
                                ? createMutation.error.message
                                : 'Failed to create exchange. Please try again.'}
                        </div>
                    )}

                    <div className="new-exchange-actions">
                        <Link
                            href="/feed"
                            className="new-exchange-cancel"
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
                            {`Publish ${exchangeType === 'offering' ? 'Offering' : 'Request'}`}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
