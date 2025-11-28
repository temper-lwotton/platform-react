'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

export default function NewDocumentPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        spaceId: '',
        visibility: 'members' as 'public' | 'members' | 'private',
        tags: '',
        publishNow: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // In a real app, this would create the document via API
        console.log('Creating document:', formData);

        // Redirect to the documents page
        router.push('/documents');
    };

    const handleSaveDraft = () => {
        console.log('Saving draft:', formData);
        router.push('/documents');
    };

    return (
        <main className="document-new-page">
            <div className="document-new-container">
                {/* Header */}
                <header className="document-new-header">
                    <Link href="/documents" className="document-new-back">
                        <Icon icon="arrowLeft" size={20} />
                        Back to Documents
                    </Link>
                    <h1 className="document-new-title">Create New Document</h1>
                </header>

                {/* Form */}
                <form onSubmit={handleSubmit} className="document-new-form">
                    {/* Title */}
                    <div className="document-new-field">
                        <label htmlFor="title" className="document-new-label">
                            Document Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter document title..."
                            className="document-new-input"
                            required
                        />
                    </div>

                    {/* Space Selection */}
                    <div className="document-new-field">
                        <label htmlFor="space" className="document-new-label">
                            Space *
                        </label>
                        <select
                            id="space"
                            value={formData.spaceId}
                            onChange={(e) => setFormData({ ...formData, spaceId: e.target.value })}
                            className="document-new-select"
                            required
                        >
                            <option value="">Select a space...</option>
                            <option value="23">Tech Community</option>
                            <option value="28">Innovation Hub</option>
                            <option value="45">Green Transport Initiative</option>
                        </select>
                    </div>

                    {/* Visibility */}
                    <div className="document-new-field">
                        <label className="document-new-label">
                            Visibility *
                        </label>
                        <div className="document-new-visibility-options">
                            <label className={`document-new-visibility-option ${formData.visibility === 'public' ? 'document-new-visibility-option--active' : ''}`}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="public"
                                    checked={formData.visibility === 'public'}
                                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                                />
                                <div className="document-new-visibility-content">
                                    <Icon icon="globe" size={20} />
                                    <div>
                                        <div className="document-new-visibility-title">Public</div>
                                        <div className="document-new-visibility-description">
                                            Anyone on the internet can view
                                        </div>
                                    </div>
                                </div>
                            </label>

                            <label className={`document-new-visibility-option ${formData.visibility === 'members' ? 'document-new-visibility-option--active' : ''}`}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="members"
                                    checked={formData.visibility === 'members'}
                                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                                />
                                <div className="document-new-visibility-content">
                                    <Icon icon="users" size={20} />
                                    <div>
                                        <div className="document-new-visibility-title">Space Members</div>
                                        <div className="document-new-visibility-description">
                                            Only members of the space can view
                                        </div>
                                    </div>
                                </div>
                            </label>

                            <label className={`document-new-visibility-option ${formData.visibility === 'private' ? 'document-new-visibility-option--active' : ''}`}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="private"
                                    checked={formData.visibility === 'private'}
                                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                                />
                                <div className="document-new-visibility-content">
                                    <Icon icon="lock" size={20} />
                                    <div>
                                        <div className="document-new-visibility-title">Private</div>
                                        <div className="document-new-visibility-description">
                                            Only you and invited collaborators
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="document-new-field">
                        <label htmlFor="content" className="document-new-label">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Start writing... (You can also add content later in the editor)"
                            className="document-new-textarea"
                            rows={12}
                        />
                        <div className="document-new-hint">
                            Supports Markdown formatting
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="document-new-field">
                        <label htmlFor="tags" className="document-new-label">
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="e.g., research, planning, strategy (comma-separated)"
                            className="document-new-input"
                        />
                    </div>

                    {/* Publish Option */}
                    <div className="document-new-field">
                        <label className="document-new-checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.publishNow}
                                onChange={(e) => setFormData({ ...formData, publishNow: e.target.checked })}
                                className="document-new-checkbox"
                            />
                            <span>Publish immediately</span>
                        </label>
                        <div className="document-new-hint">
                            If unchecked, document will be saved as a draft
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="document-new-actions">
                        <button
                            type="button"
                            onClick={() => router.push('/documents')}
                            className="document-new-cancel"
                        >
                            Cancel
                        </button>
                        <div className="document-new-actions-right">
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                className="document-new-draft"
                            >
                                <Icon icon="bookmark" size={18} />
                                Save as Draft
                            </button>
                            <button
                                type="submit"
                                className="document-new-submit"
                            >
                                <Icon icon="check" size={18} />
                                {formData.publishNow ? 'Create & Publish' : 'Create Document'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
