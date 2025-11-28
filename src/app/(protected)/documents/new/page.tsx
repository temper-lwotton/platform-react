'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Input, Textarea, Checkbox, RadioGroup, Button } from '@/components/ui/primitives';
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
                    <Input
                        type="text"
                        id="title"
                        label="Document Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter document title..."
                        required
                        fullWidth
                    />

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
                    <RadioGroup
                        label="Visibility"
                        value={formData.visibility}
                        onValueChange={(value) => setFormData({ ...formData, visibility: value as any })}
                        required
                        options={[
                            {
                                value: 'public',
                                label: 'Public',
                                helperText: 'Anyone on the internet can view'
                            },
                            {
                                value: 'members',
                                label: 'Space Members',
                                helperText: 'Only members of the space can view'
                            },
                            {
                                value: 'private',
                                label: 'Private',
                                helperText: 'Only you and invited collaborators'
                            }
                        ]}
                    />

                    {/* Content */}
                    <Textarea
                        id="content"
                        label="Content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Start writing... (You can also add content later in the editor)"
                        rows={12}
                        helperText="Supports Markdown formatting"
                        fullWidth
                    />

                    {/* Tags */}
                    <Input
                        type="text"
                        id="tags"
                        label="Tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="e.g., research, planning, strategy (comma-separated)"
                        fullWidth
                    />

                    {/* Publish Option */}
                    <Checkbox
                        checked={formData.publishNow}
                        onCheckedChange={(checked) => setFormData({ ...formData, publishNow: checked as boolean })}
                        label="Publish immediately"
                        helperText="If unchecked, document will be saved as a draft"
                    />

                    {/* Actions */}
                    <div className="document-new-actions">
                        <Button
                            type="button"
                            onClick={() => router.push('/documents')}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <div className="document-new-actions-right">
                            <Button
                                type="button"
                                onClick={handleSaveDraft}
                                variant="secondary"
                            >
                                <Icon icon="bookmark" size={18} />
                                Save as Draft
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                            >
                                <Icon icon="check" size={18} />
                                {formData.publishNow ? 'Create & Publish' : 'Create Document'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
