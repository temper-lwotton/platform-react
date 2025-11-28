'use client';

import { useState, useRef } from 'react';
import { Icon } from './Icon';
import { COMMON_EMOJIS, type MediaAttachment } from '@/lib/status-updates';
import * as Popover from '@radix-ui/react-popover';
import { Textarea, Input, Button } from './primitives';

interface SpaceChatInputProps {
    spaceId: string;
    spaceTitle: string;
}

export function SpaceChatInput({ spaceId, spaceTitle }: SpaceChatInputProps) {
    const [statusText, setStatusText] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [mediaAttachments, setMediaAttachments] = useState<MediaAttachment[]>([]);
    const [linkUrl, setLinkUrl] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEmojiSelect = (emoji: string) => {
        setSelectedEmoji(emoji);
        setShowEmojiPicker(false);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

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
        console.log('Posting to space:', spaceId, {
            text: statusText,
            emoji: selectedEmoji,
            media: mediaAttachments,
            spaceId,
        });

        // Reset form
        setStatusText('');
        setSelectedEmoji('');
        setMediaAttachments([]);

        alert('Message posted! (This is a mock - no API connected yet)');
    };

    const canPost = statusText.trim().length > 0 && statusText.length <= 280;

    return (
        <div className="space-chat-input">
            {/* Text Input */}
            <div className="space-chat-input-container">
                <Textarea
                    placeholder={`Share an update in ${spaceTitle}...`}
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    maxLength={280}
                    rows={3}
                    fullWidth
                />
                <div className="space-chat-char-count">
                    {statusText.length}/280
                </div>
            </div>

            {/* Media Preview */}
            {mediaAttachments.length > 0 && (
                <div className="space-chat-media-preview">
                    {mediaAttachments.map((media) => (
                        <div key={media.id} className="space-chat-media-item">
                            {media.type === 'image' && (
                                <img src={media.url} alt={media.caption || ''} />
                            )}
                            {media.type === 'video' && (
                                <video src={media.url} controls />
                            )}
                            {media.type === 'link' && (
                                <div className="space-chat-link-preview">
                                    {media.thumbnail && (
                                        <img src={media.thumbnail} alt="" className="space-chat-link-thumb" />
                                    )}
                                    <div className="space-chat-link-info">
                                        <div className="space-chat-link-title">{media.title}</div>
                                        <div className="space-chat-link-url">{media.url}</div>
                                    </div>
                                </div>
                            )}
                            <button
                                className="space-chat-media-remove"
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
            {showLinkInput && (
                <div className="space-chat-link-input">
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

            {/* Controls */}
            <div className="space-chat-controls">
                <div className="space-chat-actions">
                    {/* Media Upload */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <button
                        className="space-chat-action-btn"
                        onClick={() => fileInputRef.current?.click()}
                        title="Add image or video"
                    >
                        <Icon icon="video" size={18} />
                    </button>

                    {/* Link */}
                    <button
                        className="space-chat-action-btn"
                        onClick={() => setShowLinkInput(!showLinkInput)}
                        title="Add link"
                    >
                        <Icon icon="link" size={18} />
                    </button>

                    {/* Emoji */}
                    <Popover.Root open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <Popover.Trigger asChild>
                            <button className="space-chat-action-btn" title="Add emoji">
                                {selectedEmoji || '😊'}
                            </button>
                        </Popover.Trigger>
                        <Popover.Portal>
                            <Popover.Content className="space-chat-emoji-picker" sideOffset={5}>
                                <div className="space-chat-emoji-grid">
                                    {COMMON_EMOJIS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            className="space-chat-emoji-btn"
                                            onClick={() => handleEmojiSelect(emoji)}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                <Popover.Arrow className="space-chat-emoji-arrow" />
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>
                </div>

                {/* Post Button */}
                <Button
                    onClick={handlePost}
                    disabled={!canPost}
                    variant="primary"
                >
                    Post
                </Button>
            </div>
        </div>
    );
}
