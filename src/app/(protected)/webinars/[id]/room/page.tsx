'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockWebinars, mockChatMessages, mockQAQuestions, mockAttendees } from '@/lib/mock-webinars';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

type SidebarTab = 'chat' | 'qa' | 'attendees';

export default function WebinarRoomPage() {
    const params = useParams();
    const router = useRouter();
    const webinarId = params.id as string;

    const [activeTab, setActiveTab] = useState<SidebarTab>('chat');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [chatMessage, setChatMessage] = useState('');
    const [qaQuestion, setQaQuestion] = useState('');

    // Find the webinar
    const webinar = mockWebinars.find(w => w.id === webinarId);

    // Simulate leaving the room
    const handleLeave = () => {
        if (confirm('Are you sure you want to leave this webinar?')) {
            router.push('/webinars');
        }
    };

    if (!webinar) {
        return (
            <main className="webinar-room-page">
                <div className="webinar-room-not-found">
                    <Icon icon="video" size={64} />
                    <h1>Webinar Not Found</h1>
                    <p>The webinar you're trying to join doesn't exist.</p>
                    <Link href="/webinars">Back to Webinars</Link>
                </div>
            </main>
        );
    }

    const isHost = false; // In a real app, this would check current user

    return (
        <main className="webinar-room-page">
            {/* Header */}
            <header className="webinar-room-header">
                <div className="webinar-room-header-content">
                    <div className="webinar-room-header-info">
                        <h1 className="webinar-room-title">{webinar.title}</h1>
                        <div className="webinar-room-meta">
                            <span className="webinar-status-badge webinar-status-badge--live">
                                Live
                            </span>
                            <span className="webinar-room-viewers">
                                <Icon icon="users" size={16} />
                                {webinar.stats?.attendeeCount || 0} watching
                            </span>
                        </div>
                    </div>
                    <button onClick={handleLeave} className="webinar-room-leave">
                        <Icon icon="x" size={20} />
                        Leave
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="webinar-room-layout">
                {/* Video Area */}
                <div className="webinar-room-main">
                    <div className="webinar-room-video">
                        {/* Simulated Video */}
                        <div className="webinar-room-video-placeholder">
                            <div className="webinar-room-video-avatar">
                                {webinar.hostPhoto ? (
                                    <img src={webinar.hostPhoto} alt={webinar.hostName} />
                                ) : (
                                    <div className="webinar-room-video-avatar-placeholder">
                                        {webinar.hostName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="webinar-room-video-info">
                                <div className="webinar-room-video-name">{webinar.hostName}</div>
                                <div className="webinar-room-video-role">Host</div>
                            </div>
                        </div>

                        {/* Host Controls (shown only to host) */}
                        {isHost && (
                            <div className="webinar-room-controls">
                                <button className="webinar-room-control">
                                    <Icon icon="microphone" size={20} />
                                </button>
                                <button className="webinar-room-control">
                                    <Icon icon="video" size={20} />
                                </button>
                                <button className="webinar-room-control">
                                    <Icon icon="screenShare" size={20} />
                                </button>
                                <button className="webinar-room-control webinar-room-control--danger">
                                    <Icon icon="stop" size={20} />
                                    End Webinar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className={`webinar-room-sidebar ${!isSidebarOpen ? 'webinar-room-sidebar--collapsed' : ''}`}>
                    {/* Tabs */}
                    <div className="webinar-room-tabs">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`webinar-room-tab ${activeTab === 'chat' ? 'webinar-room-tab--active' : ''}`}
                        >
                            <Icon icon="chat" size={18} />
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveTab('qa')}
                            className={`webinar-room-tab ${activeTab === 'qa' ? 'webinar-room-tab--active' : ''}`}
                        >
                            <Icon icon="help" size={18} />
                            Q&A
                        </button>
                        <button
                            onClick={() => setActiveTab('attendees')}
                            className={`webinar-room-tab ${activeTab === 'attendees' ? 'webinar-room-tab--active' : ''}`}
                        >
                            <Icon icon="users" size={18} />
                            Attendees
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="webinar-room-tab-toggle"
                            aria-label="Toggle sidebar"
                        >
                            <Icon icon={isSidebarOpen ? 'chevronRight' : 'chevronLeft'} size={18} />
                        </button>
                    </div>

                    {/* Tab Content */}
                    {isSidebarOpen && (
                        <div className="webinar-room-tab-content">
                            {/* Chat Tab */}
                            {activeTab === 'chat' && (
                                <div className="webinar-room-chat">
                                    <div className="webinar-room-messages">
                                        {mockChatMessages.map((message) => (
                                            <div key={message.id} className="webinar-room-message">
                                                <div className="webinar-room-message-avatar">
                                                    {message.senderPhoto ? (
                                                        <img src={message.senderPhoto} alt={message.senderName} />
                                                    ) : (
                                                        message.senderName.charAt(0)
                                                    )}
                                                </div>
                                                <div className="webinar-room-message-content">
                                                    <div className="webinar-room-message-header">
                                                        <span className="webinar-room-message-name">
                                                            {message.senderName}
                                                        </span>
                                                        <span className="webinar-room-message-time">
                                                            {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="webinar-room-message-text">
                                                        {message.message}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <form className="webinar-room-input-form" onSubmit={(e) => {
                                        e.preventDefault();
                                        console.log('Send message:', chatMessage);
                                        setChatMessage('');
                                    }}>
                                        <input
                                            type="text"
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="webinar-room-input"
                                        />
                                        <button
                                            type="submit"
                                            className="webinar-room-send"
                                            disabled={!chatMessage.trim()}
                                        >
                                            <Icon icon="send" size={18} />
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Q&A Tab */}
                            {activeTab === 'qa' && (
                                <div className="webinar-room-qa">
                                    <div className="webinar-room-questions">
                                        {mockQAQuestions.map((question) => (
                                            <div key={question.id} className="webinar-room-question">
                                                <button className="webinar-room-question-vote">
                                                    <Icon icon="thumbsUp" size={16} />
                                                    <span>{question.upvotes}</span>
                                                </button>
                                                <div className="webinar-room-question-content">
                                                    <div className="webinar-room-question-header">
                                                        <span className="webinar-room-question-name">
                                                            {question.askerName}
                                                        </span>
                                                        {question.isAnswered && (
                                                            <span className="webinar-room-question-answered">
                                                                <Icon icon="checkCircle" size={14} />
                                                                Answered
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="webinar-room-question-text">
                                                        {question.question}
                                                    </div>
                                                    {question.answer && (
                                                        <div className="webinar-room-question-answer">
                                                            <strong>Answer:</strong> {question.answer}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <form className="webinar-room-input-form" onSubmit={(e) => {
                                        e.preventDefault();
                                        console.log('Ask question:', qaQuestion);
                                        setQaQuestion('');
                                    }}>
                                        <input
                                            type="text"
                                            value={qaQuestion}
                                            onChange={(e) => setQaQuestion(e.target.value)}
                                            placeholder="Ask a question..."
                                            className="webinar-room-input"
                                        />
                                        <button
                                            type="submit"
                                            className="webinar-room-send"
                                            disabled={!qaQuestion.trim()}
                                        >
                                            <Icon icon="send" size={18} />
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Attendees Tab */}
                            {activeTab === 'attendees' && (
                                <div className="webinar-room-attendees">
                                    <div className="webinar-room-attendees-list">
                                        {mockAttendees.map((attendee) => (
                                            <div key={attendee.id} className="webinar-room-attendee">
                                                <div className="webinar-room-attendee-avatar">
                                                    {attendee.photo ? (
                                                        <img src={attendee.photo} alt={attendee.name} />
                                                    ) : (
                                                        attendee.name.charAt(0)
                                                    )}
                                                </div>
                                                <div className="webinar-room-attendee-info">
                                                    <div className="webinar-room-attendee-name">
                                                        {attendee.name}
                                                    </div>
                                                    {attendee.role && (
                                                        <div className="webinar-room-attendee-role">
                                                            {attendee.role}
                                                        </div>
                                                    )}
                                                </div>
                                                {attendee.handRaised && (
                                                    <Icon icon="handRaised" size={16} className="webinar-room-attendee-hand" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </aside>
            </div>
        </main>
    );
}
