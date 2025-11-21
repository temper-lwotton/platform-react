'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface MessageInputProps {
    onSend: (content: string, attachments?: File[]) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function MessageInput({
    onSend,
    disabled = false,
    placeholder = 'Type a message...',
}: MessageInputProps) {
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = () => {
        if (content.trim() || attachments.length > 0) {
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

                <textarea
                    className="message-input-field"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={1}
                />

                <button
                    type="button"
                    className="message-input-send"
                    onClick={handleSend}
                    disabled={disabled || (!content.trim() && attachments.length === 0)}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
