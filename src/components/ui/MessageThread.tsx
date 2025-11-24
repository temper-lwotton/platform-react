'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/lib/conversations';
import { User } from '@/lib/users';
import { TypingIndicator } from './TypingIndicator';

interface MessageThreadProps {
    messages: Message[];
    participants: User[];
    currentUserId: string;
    onDeleteMessage?: (messageId: string) => void;
    typingUsers?: string[]; // Names of users currently typing
}

export function MessageThread({
    messages,
    participants,
    currentUserId,
    onDeleteMessage,
    typingUsers = [],
}: MessageThreadProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const otherParticipants = participants.filter(p => p.id !== currentUserId);
    const displayName = otherParticipants.length > 0
        ? otherParticipants.map(p =>
            p.profile?.fullName ||
            `${p.profile?.firstName || ''} ${p.profile?.lastName || ''}`.trim() ||
            'Unknown'
        ).join(', ')
        : 'Conversation';

    return (
        <div className="message-thread">
            <header className="message-thread-header">
                <h2 className="message-thread-title">{displayName}</h2>
                <span className="message-thread-participants">
                    {participants.length} participant{participants.length !== 1 ? 's' : ''}
                </span>
            </header>

            <div className="message-thread-messages">
                {messages.length === 0 ? (
                    <div className="message-thread-empty">
                        <p>No messages yet</p>
                        <p className="message-thread-empty-hint">Send a message to start the conversation</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => {
                            const isOwn = message.sender?.id === currentUserId;
                            const showAvatar = !isOwn && (
                                index === 0 ||
                                messages[index - 1]?.sender?.id !== message.sender?.id
                            );

                            const senderName = message.sender?.profile?.fullName ||
                                `${message.sender?.profile?.firstName || ''} ${message.sender?.profile?.lastName || ''}`.trim() ||
                                'Unknown';

                            const initials = senderName
                                .split(' ')
                                .map(part => part.charAt(0))
                                .join('')
                                .toUpperCase()
                                .slice(0, 2);

                            const formattedTime = new Date(message.lastUpdated).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                            });

                            return (
                                <div
                                    key={message.id}
                                    className={`message ${isOwn ? 'message--own' : 'message--other'}`}
                                >
                                    {!isOwn && showAvatar && (
                                        message.sender?.profile?.photo ? (
                                            <img
                                                src={message.sender.profile.photo}
                                                alt={senderName}
                                                className="message-avatar"
                                            />
                                        ) : (
                                            <div className="message-avatar message-avatar--placeholder">
                                                {initials}
                                            </div>
                                        )
                                    )}
                                    {!isOwn && !showAvatar && <div className="message-avatar-spacer" />}

                                    <div className="message-content-wrapper">
                                        {!isOwn && showAvatar && (
                                            <span className="message-sender">{senderName}</span>
                                        )}
                                        <div className="message-bubble">
                                            <p className="message-text">{message.content}</p>
                                            {message.attachments && message.attachments.length > 0 && (
                                                <div className="message-attachments">
                                                    {message.attachments.map((url, i) => (
                                                        <a
                                                            key={i}
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="message-attachment"
                                                        >
                                                            Attachment {i + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="message-time">{formattedTime}</span>
                                    </div>

                                    {isOwn && onDeleteMessage && (
                                        <button
                                            className="message-delete"
                                            onClick={() => onDeleteMessage(message.id)}
                                            title="Delete message"
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        {typingUsers.length > 0 && (
                            <TypingIndicator names={typingUsers} />
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
        </div>
    );
}
