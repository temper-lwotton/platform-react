'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { getToken } from '@/lib/auth';
import { Textarea, Button } from './primitives';

interface MessageInputProps {
    onSend: (content: string, attachments?: File[]) => void;
    disabled?: boolean;
    placeholder?: string;
    conversationId?: string;
    currentUserId?: string;
}

export function MessageInput({
    onSend,
    disabled = false,
    placeholder = 'Type a message...',
    conversationId,
    currentUserId,
}: MessageInputProps) {
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup typing timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const sendTypingStatus = async (isTyping: boolean) => {
        if (!conversationId || !currentUserId) return;

        const token = getToken();
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

        try {
            await fetch(`${apiBaseUrl}/api/conversations/typing/${conversationId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    userId: Number(currentUserId),
                    isTyping,
                }),
            });
        } catch (error) {
            // Silently fail - typing indicator is not critical
            console.debug('Failed to send typing status:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);

        // Send typing status
        if (conversationId && currentUserId) {
            sendTypingStatus(true);

            // Clear previous timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Set timeout to stop typing after 3s of inactivity
            typingTimeoutRef.current = setTimeout(() => {
                sendTypingStatus(false);
            }, 3000);
        }
    };

    const handleSend = () => {
        if (content.trim() || attachments.length > 0) {
            // Clear typing status when sending
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            sendTypingStatus(false);

            onSend(content.trim(), attachments.length > 0 ? attachments : undefined);
            setContent('');
            setAttachments([]);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="message-input">
            {attachments.length > 0 && (
                <div className="message-input-attachments">
                    {attachments.map((file, index) => (
                        <div key={index} className="message-input-attachment">
                            <span className="message-input-attachment-name">{file.name}</span>
                            <button
                                type="button"
                                className="message-input-attachment-remove"
                                onClick={() => removeAttachment(index)}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="message-input-row">
                <button
                    type="button"
                    className="message-input-attach"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    title="Attach file"
                >
                    <span className="message-input-attach-icon">+</span>
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                <Textarea
                    value={content}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={1}
                    fullWidth
                />

                <Button
                    type="button"
                    onClick={handleSend}
                    disabled={disabled || (!content.trim() && attachments.length === 0)}
                    variant="primary"
                >
                    Send
                </Button>
            </div>
        </div>
    );
}
