'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Icon } from '@/components/ui/Icon';
import { Input, Textarea, RadioGroup, Checkbox, Button } from '@/components/ui/primitives';
import { Document } from '@/lib/documents';

interface PublishDocumentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: Document;
}

export function PublishDocumentModal({ open, onOpenChange, document }: PublishDocumentModalProps) {
    const router = useRouter();
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishData, setPublishData] = useState({
        spaceId: document.spaceId || '',
        visibility: document.visibility || 'members' as 'public' | 'members' | 'private',
        notifyCollaborators: true,
        notifySpace: true,
        publishToFeed: true,
        schedulePublish: false,
        scheduledDate: '',
        scheduledTime: '',
        customMessage: '',
    });

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsPublishing(true);

        // Simulate publishing
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('Publishing document:', {
            documentId: document.id,
            ...publishData,
        });

        // In a real app, this would publish via API
        // Then redirect or show success message
        onOpenChange(false);
        setIsPublishing(false);

        // Optionally redirect to the space or show a success toast
        // router.push(`/spaces/${publishData.spaceId}`);
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="publish-modal-overlay" />
                <Dialog.Content className="publish-modal-content">
                    <div className="publish-modal-header">
                        <div className="publish-modal-header-main">
                            <Dialog.Title className="publish-modal-title">
                                Publish Document
                            </Dialog.Title>
                            <Dialog.Description className="publish-modal-description">
                                Share "{document.title}" with your space community
                            </Dialog.Description>
                        </div>
                        <Dialog.Close asChild>
                            <button className="publish-modal-close" aria-label="Close">
                                <Icon icon="x" size={20} />
                            </button>
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handlePublish} className="publish-modal-form">
                        {/* Document Preview */}
                        <div className="publish-modal-preview">
                            <div className="publish-modal-preview-icon">
                                <Icon icon="fileText" size={24} />
                            </div>
                            <div className="publish-modal-preview-info">
                                <div className="publish-modal-preview-title">{document.title}</div>
                                <div className="publish-modal-preview-meta">
                                    {document.wordCount} words • {document.collaborators.length} collaborator{document.collaborators.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>

                        {/* Space Selection */}
                        <div className="publish-modal-field">
                            <label htmlFor="publish-space" className="publish-modal-label">
                                Publish to Space *
                            </label>
                            <select
                                id="publish-space"
                                value={publishData.spaceId}
                                onChange={(e) => setPublishData({ ...publishData, spaceId: e.target.value })}
                                className="publish-modal-select"
                                required
                            >
                                <option value="">Select a space...</option>
                                <option value="23">Tech Community</option>
                                <option value="28">Innovation Hub</option>
                                <option value="45">Green Transport Initiative</option>
                            </select>
                            <div className="publish-modal-hint">
                                The space where this document will be published
                            </div>
                        </div>

                        {/* Visibility */}
                        <RadioGroup
                            label="Visibility"
                            value={publishData.visibility}
                            onValueChange={(value) => setPublishData({ ...publishData, visibility: value as any })}
                            required
                            options={[
                                {
                                    value: 'public',
                                    label: 'Public',
                                    helperText: 'Anyone can view this document'
                                },
                                {
                                    value: 'members',
                                    label: 'Space Members',
                                    helperText: 'Only space members can view'
                                },
                                {
                                    value: 'private',
                                    label: 'Private',
                                    helperText: 'Only collaborators can view'
                                }
                            ]}
                        />

                        {/* Schedule Publishing */}
                        <Checkbox
                            checked={publishData.schedulePublish}
                            onCheckedChange={(checked) => setPublishData({ ...publishData, schedulePublish: checked as boolean })}
                            label="Schedule for later"
                        />

                        {publishData.schedulePublish && (
                            <div className="publish-modal-schedule">
                                <div className="publish-modal-schedule-fields">
                                    <Input
                                        type="date"
                                        id="publish-date"
                                        label="Date"
                                        value={publishData.scheduledDate}
                                        onChange={(e) => setPublishData({ ...publishData, scheduledDate: e.target.value })}
                                        required={publishData.schedulePublish}
                                        min={new Date().toISOString().split('T')[0]}
                                        fullWidth
                                    />
                                    <Input
                                        type="time"
                                        id="publish-time"
                                        label="Time"
                                        value={publishData.scheduledTime}
                                        onChange={(e) => setPublishData({ ...publishData, scheduledTime: e.target.value })}
                                        required={publishData.schedulePublish}
                                        fullWidth
                                    />
                                </div>
                            </div>
                        )}

                        {/* Notification Options */}
                        <div className="publish-modal-section">
                            <div className="publish-modal-section-title">Notifications</div>
                            <div className="publish-modal-options">
                                <Checkbox
                                    name="notifyCollaborators"
                                    checked={publishData.notifyCollaborators}
                                    onCheckedChange={(checked) => setPublishData({ ...publishData, notifyCollaborators: checked as boolean })}
                                    label={
                                        <div className="publish-modal-option-content">
                                            <div className="publish-modal-option-title">
                                                <Icon icon="users" size={16} />
                                                Notify collaborators
                                            </div>
                                            <div className="publish-modal-option-description">
                                                Send notification to all {document.collaborators.length} collaborator{document.collaborators.length !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    }
                                />

                                <Checkbox
                                    name="notifySpace"
                                    checked={publishData.notifySpace}
                                    onCheckedChange={(checked) => setPublishData({ ...publishData, notifySpace: checked as boolean })}
                                    label={
                                        <div className="publish-modal-option-content">
                                            <div className="publish-modal-option-title">
                                                <Icon icon="bell" size={16} />
                                                Notify space members
                                            </div>
                                            <div className="publish-modal-option-description">
                                                Send notification to space members about this new document
                                            </div>
                                        </div>
                                    }
                                />

                                <Checkbox
                                    name="publishToFeed"
                                    checked={publishData.publishToFeed}
                                    onCheckedChange={(checked) => setPublishData({ ...publishData, publishToFeed: checked as boolean })}
                                    label={
                                        <div className="publish-modal-option-content">
                                            <div className="publish-modal-option-title">
                                                <Icon icon="rss" size={16} />
                                                Publish to space feed
                                            </div>
                                            <div className="publish-modal-option-description">
                                                Share this document in the space activity feed
                                            </div>
                                        </div>
                                    }
                                />
                            </div>
                        </div>

                        {/* Custom Message */}
                        <Textarea
                            id="publish-message"
                            label="Message (optional)"
                            value={publishData.customMessage}
                            onChange={(e) => setPublishData({ ...publishData, customMessage: e.target.value })}
                            placeholder="Add a message to accompany this document..."
                            rows={3}
                            helperText="This message will be shown in notifications and the feed"
                            fullWidth
                        />

                        {/* Actions */}
                        <div className="publish-modal-actions">
                            <Button
                                type="button"
                                onClick={handleCancel}
                                variant="outline"
                                disabled={isPublishing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isPublishing || !publishData.spaceId}
                                loading={isPublishing}
                            >
                                <Icon icon="send" size={18} />
                                {publishData.schedulePublish ? 'Schedule Publish' : 'Publish Now'}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
