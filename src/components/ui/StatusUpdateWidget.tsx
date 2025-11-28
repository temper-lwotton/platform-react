'use client';

import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/lib/auth';
import { getCurrentUserStatus, QUICK_TEMPLATES, COMMON_EMOJIS, formatTimeAgo, type QuickTemplate, type MediaAttachment } from '@/lib/status-updates';
import { getSpace } from '@/lib/spaces';
import { Icon } from './Icon';
import * as Popover from '@radix-ui/react-popover';
import { Textarea, Input, Button } from './primitives';

export function StatusUpdateWidget() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState<string>('');
    const [selectedTemplate, setSelectedTemplate] = useState<QuickTemplate | null>(null);
    const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [mediaAttachments, setMediaAttachments] = useState<MediaAttachment[]>([]);
    const [linkUrl, setLinkUrl] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch current user data
    const { data: userData } = useQuery({
        queryKey: ['current-user'],
        queryFn: fetchCurrentUser,
    });

    // Get user's spaces
    const userSpaces = userData
        ? [...userData.adminSpaces, ...userData.memberSpaces]
        : [];

    // Get current status
    const currentStatus = getCurrentUserStatus();

    const handleFocus = () => {
        setIsExpanded(true);
    };

    const handleTemplateSelect = (template: QuickTemplate) => {
        setSelectedTemplate(template);
        setSelectedEmoji(template.emoji);
        setIsExpanded(true);
    };

    const handleEmojiSelect = (emoji: string) => {
        setSelectedEmoji(emoji);
        setShowEmojiPicker(false);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        // Mock file upload - in real implementation, upload to cloud storage
        Array.from(files).forEach((file) => {
            const isVideo = file.type.startsWith('video/');
            const mockUrl = URL.createObjectURL(file);

            const newMedia: MediaAttachment = {
                id: `media-${Date.now()}-${Math.random()}`,
                type: isVideo ? 'video' : 'image',
                url: mockUrl,
                thumbnail: mockUrl
            };

            setMediaAttachments(prev => [...prev, newMedia]);
        });
    };

    const handleAddLink = () => {
        if (!linkUrl.trim()) return;

        // Mock link preview - in real implementation, fetch metadata from URL
        const newLink: MediaAttachment = {
            id: `link-${Date.now()}`,
            type: 'link',
            url: linkUrl,
            title: 'Link Preview',
            description: linkUrl,
            thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop'
        };

        setMediaAttachments(prev => [...prev, newLink]);
        setLinkUrl('');
        setShowLinkInput(false);
    };

    const handleRemoveMedia = (mediaId: string) => {
        setMediaAttachments(prev => prev.filter(m => m.id !== mediaId));
    };

    const handlePost = () => {
        // In real implementation, this would POST to /api/status-updates
        console.log('Posting status update:', {
            text: statusText,
            emoji: selectedEmoji,
            template: selectedTemplate?.id,
            spaceId: selectedSpaceId,
            media: mediaAttachments
        });

        // Reset form
        setStatusText('');
        setSelectedEmoji('');
        setSelectedTemplate(null);
        setMediaAttachments([]);
        setIsExpanded(false);

        // Show success message (in real app)
        alert('Status updated! (This is a mock - no API connected yet)');
    };

    const handleCancel = () => {
        setStatusText('');
        setSelectedEmoji('');
        setSelectedTemplate(null);
        setMediaAttachments([]);
        setLinkUrl('');
        setShowLinkInput(false);
        setIsExpanded(false);
    };

    const canPost = statusText.trim().length > 0 && statusText.length <= 280 && selectedSpaceId;

    const userPhoto = userData?.profile?.photo;
    const userName = userData?.profile?.fullName || userData?.email || 'User';
    const firstName = userName.split(' ')[0];

    return (
        <div className="status-update-widget">
            {/* User Avatar and Input */}
            <div className="status-update-header">
                <div className="status-update-avatar">
                    {userPhoto ? (
                        <img src={userPhoto} alt={userName} />
                    ) : (
                        <span>{userName.charAt(0).toUpperCase()}</span>
                    )}
                </div>

                <div className="status-update-input-container">
                    {!isExpanded ? (
                        <button
                            className="status-update-placeholder"
                            onClick={handleFocus}
                        >
                            What are you working on, {firstName}?
                        </button>
                    ) : (
                        <div className="status-update-input-expanded">
                            <Textarea
                                placeholder={selectedTemplate?.placeholder || "Share what you're working on..."}
                                value={statusText}
                                onChange={(e) => setStatusText(e.target.value)}
                                maxLength={280}
                                rows={3}
                                autoFocus
                                fullWidth
                            />
                            <div className="status-update-char-count">
                                {statusText.length}/280
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Current Status Display (when collapsed) */}
            {!isExpanded && currentStatus && (
                <div className="status-update-current">
                    <div className="status-update-current-content">
                        {currentStatus.emoji && (
                            <span className="status-update-current-emoji">{currentStatus.emoji}</span>
                        )}
                        <span className="status-update-current-text">{currentStatus.text}</span>
                    </div>
                    <div className="status-update-current-meta">
                        Last updated {formatTimeAgo(currentStatus.updatedAt)} · <button onClick={handleFocus}>Edit</button>
                    </div>
                </div>
            )}

            {/* Quick Templates (when collapsed) */}
            {!isExpanded && (
                <div className="status-update-templates">
                    {QUICK_TEMPLATES.slice(0, 6).map((template) => (
                        <button
                            key={template.id}
                            className="status-update-template-btn"
                            onClick={() => handleTemplateSelect(template)}
                            title={template.label}
                        >
                            <span className="status-update-template-emoji">{template.emoji}</span>
                            <span className="status-update-template-label">{template.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Media Preview */}
            {isExpanded && mediaAttachments.length > 0 && (
                <div className="status-update-media-preview">
                    {mediaAttachments.map((media) => (
                        <div key={media.id} className="status-media-preview-item">
                            {media.type === 'image' && (
                                <img src={media.url} alt={media.caption || ''} />
                            )}
                            {media.type === 'video' && (
                                <video src={media.url} controls />
                            )}
                            {media.type === 'link' && (
                                <div className="status-media-link-preview">
                                    {media.thumbnail && (
                                        <img src={media.thumbnail} alt="" className="status-media-link-thumb" />
                                    )}
                                    <div className="status-media-link-info">
                                        <div className="status-media-link-title">{media.title}</div>
                                        <div className="status-media-link-desc">{media.description}</div>
                                        <div className="status-media-link-url">{media.url}</div>
                                    </div>
                                </div>
                            )}
                            <button
                                className="status-media-remove"
                                onClick={() => handleRemoveMedia(media.id)}
                                title="Remove"
                            >
                                <Icon icon="x" size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Link Input */}
            {isExpanded && showLinkInput && (
                <div className="status-update-link-input">
                    <Input
                        type="url"
                        placeholder="Paste a link..."
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                        autoFocus
                        fullWidth
                    />
                    <Button onClick={handleAddLink} variant="primary" size="sm">
                        Add
                    </Button>
                    <Button onClick={() => setShowLinkInput(false)} variant="outline" size="sm">
                        Cancel
                    </Button>
                </div>
            )}

            {/* Expanded Controls */}
            {isExpanded && (
                <div className="status-update-controls">
                    {/* Media Controls */}
                    <div className="status-update-media-controls">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                        <button
                            className="status-update-control-btn"
                            onClick={() => fileInputRef.current?.click()}
                            title="Add image or video"
                        >
                            <Icon icon="video" size={18} />
                        </button>
                        <button
                            className="status-update-control-btn"
                            onClick={() => setShowLinkInput(!showLinkInput)}
                            title="Add link"
                        >
                            <Icon icon="link" size={18} />
                        </button>
                    </div>

                    {/* Emoji Picker */}
                    <Popover.Root open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <Popover.Trigger asChild>
                            <button className="status-update-control-btn" title="Add emoji">
                                {selectedEmoji || '😊'}
                            </button>
                        </Popover.Trigger>
                        <Popover.Portal>
                            <Popover.Content className="status-emoji-picker" sideOffset={5}>
                                <div className="status-emoji-grid">
                                    {COMMON_EMOJIS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            className="status-emoji-btn"
                                            onClick={() => handleEmojiSelect(emoji)}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                <Popover.Arrow className="status-emoji-arrow" />
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>

                    {/* Space Selector */}
                    <div className="status-update-space-selector">
                        <Icon icon="users" size={16} />
                        <select
                            value={selectedSpaceId}
                            onChange={(e) => setSelectedSpaceId(e.target.value)}
                            className="status-update-space-select"
                        >
                            <option value="">Share with...</option>
                            {userSpaces.map((space) => (
                                <option key={space.id} value={space.id}>
                                    {space.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="status-update-actions">
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePost}
                            disabled={!canPost}
                            variant="primary"
                        >
                            Share
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
