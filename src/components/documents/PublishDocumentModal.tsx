'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Icon } from '@/components/ui/Icon';
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
                        <div className="publish-modal-field">
                            <label className="publish-modal-label">
                                Visibility *
                            </label>
                            <div className="publish-modal-visibility-options">
                                <label className={`publish-modal-visibility-option ${publishData.visibility === 'public' ? 'publish-modal-visibility-option--active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="public"
                                        checked={publishData.visibility === 'public'}
                                        onChange={(e) => setPublishData({ ...publishData, visibility: e.target.value as any })}
                                    />
                                    <div className="publish-modal-visibility-content">
                                        <Icon icon="globe" size={20} />
                                        <div>
                                            <div className="publish-modal-visibility-title">Public</div>
                                            <div className="publish-modal-visibility-description">
                                                Anyone can view this document
                                            </div>
                                        </div>
                                    </div>
                                </label>

                                <label className={`publish-modal-visibility-option ${publishData.visibility === 'members' ? 'publish-modal-visibility-option--active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="members"
                                        checked={publishData.visibility === 'members'}
                                        onChange={(e) => setPublishData({ ...publishData, visibility: e.target.value as any })}
                                    />
                                    <div className="publish-modal-visibility-content">
                                        <Icon icon="users" size={20} />
                                        <div>
                                            <div className="publish-modal-visibility-title">Space Members</div>
                                            <div className="publish-modal-visibility-description">
                                                Only space members can view
                                            </div>
                                        </div>
                                    </div>
                                </label>

                                <label className={`publish-modal-visibility-option ${publishData.visibility === 'private' ? 'publish-modal-visibility-option--active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="private"
                                        checked={publishData.visibility === 'private'}
                                        onChange={(e) => setPublishData({ ...publishData, visibility: e.target.value as any })}
                                    />
                                    <div className="publish-modal-visibility-content">
                                        <Icon icon="lock" size={20} />
                                        <div>
                                            <div className="publish-modal-visibility-title">Private</div>
                                            <div className="publish-modal-visibility-description">
                                                Only collaborators can view
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Schedule Publishing */}
                        <div className="publish-modal-field">
                            <label className="publish-modal-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={publishData.schedulePublish}
                                    onChange={(e) => setPublishData({ ...publishData, schedulePublish: e.target.checked })}
                                    className="publish-modal-checkbox"
                                />
                                <span>Schedule for later</span>
                            </label>
                        </div>

                        {publishData.schedulePublish && (
                            <div className="publish-modal-schedule">
                                <div className="publish-modal-schedule-fields">
                                    <div className="publish-modal-field">
                                        <label htmlFor="publish-date" className="publish-modal-label">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            id="publish-date"
                                            value={publishData.scheduledDate}
                                            onChange={(e) => setPublishData({ ...publishData, scheduledDate: e.target.value })}
                                            className="publish-modal-input"
                                            required={publishData.schedulePublish}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div className="publish-modal-field">
                                        <label htmlFor="publish-time" className="publish-modal-label">
                                            Time
                                        </label>
                                        <input
                                            type="time"
                                            id="publish-time"
                                            value={publishData.scheduledTime}
                                            onChange={(e) => setPublishData({ ...publishData, scheduledTime: e.target.value })}
                                            className="publish-modal-input"
                                            required={publishData.schedulePublish}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notification Options */}
                        <div className="publish-modal-section">
                            <div className="publish-modal-section-title">Notifications</div>
                            <div className="publish-modal-options">
                                <label className="publish-modal-option">
                                    <input
                                        type="checkbox"
                                        checked={publishData.notifyCollaborators}
                                        onChange={(e) => setPublishData({ ...publishData, notifyCollaborators: e.target.checked })}
                                        className="publish-modal-checkbox"
                                    />
                                    <div className="publish-modal-option-content">
                                        <div className="publish-modal-option-title">
                                            <Icon icon="users" size={16} />
                                            Notify collaborators
                                        </div>
                                        <div className="publish-modal-option-description">
                                            Send notification to all {document.collaborators.length} collaborator{document.collaborators.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </label>

                                <label className="publish-modal-option">
                                    <input
                                        type="checkbox"
                                        checked={publishData.notifySpace}
                                        onChange={(e) => setPublishData({ ...publishData, notifySpace: e.target.checked })}
                                        className="publish-modal-checkbox"
                                    />
                                    <div className="publish-modal-option-content">
                                        <div className="publish-modal-option-title">
                                            <Icon icon="bell" size={16} />
                                            Notify space members
                                        </div>
                                        <div className="publish-modal-option-description">
                                            Send notification to space members about this new document
                                        </div>
                                    </div>
                                </label>

                                <label className="publish-modal-option">
                                    <input
                                        type="checkbox"
                                        checked={publishData.publishToFeed}
                                        onChange={(e) => setPublishData({ ...publishData, publishToFeed: e.target.checked })}
                                        className="publish-modal-checkbox"
                                    />
                                    <div className="publish-modal-option-content">
                                        <div className="publish-modal-option-title">
                                            <Icon icon="rss" size={16} />
                                            Publish to space feed
                                        </div>
                                        <div className="publish-modal-option-description">
                                            Share this document in the space activity feed
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Custom Message */}
                        <div className="publish-modal-field">
                            <label htmlFor="publish-message" className="publish-modal-label">
                                Message (optional)
                            </label>
                            <textarea
                                id="publish-message"
                                value={publishData.customMessage}
                                onChange={(e) => setPublishData({ ...publishData, customMessage: e.target.value })}
                                placeholder="Add a message to accompany this document..."
                                className="publish-modal-textarea"
                                rows={3}
                            />
                            <div className="publish-modal-hint">
                                This message will be shown in notifications and the feed
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="publish-modal-actions">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="publish-modal-cancel"
                                disabled={isPublishing}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="publish-modal-submit"
                                disabled={isPublishing || !publishData.spaceId}
                            >
                                {isPublishing ? (
                                    <>
                                        <div className="publish-modal-spinner" />
                                        {publishData.schedulePublish ? 'Scheduling...' : 'Publishing...'}
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="send" size={18} />
                                        {publishData.schedulePublish ? 'Schedule Publish' : 'Publish Now'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
