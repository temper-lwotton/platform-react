'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockDocuments, mockComments } from '@/lib/mock-documents';
import { Icon } from '@/components/ui/Icon';
import { PublishDocumentModal } from '@/components/documents/PublishDocumentModal';
import Link from 'next/link';

type SidebarTab = 'comments' | 'collaborators' | 'versions';

export default function DocumentEditorPage() {
    const params = useParams();
    const router = useRouter();
    const documentId = params.id as string;

    const [document, setDocument] = useState(() => mockDocuments.find(d => d.id === documentId));
    const [content, setContent] = useState(document?.content || '');
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<SidebarTab>('comments');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

    if (!document) {
        return (
            <main className="document-editor-page">
                <div className="document-editor-not-found">
                    <Icon icon="fileText" size={64} />
                    <h1>Document Not Found</h1>
                    <p>The document you're looking for doesn't exist.</p>
                    <Link href="/documents">Back to Documents</Link>
                </div>
            </main>
        );
    }

    const handleSave = () => {
        console.log('Saving document:', content);
        setIsEditing(false);
        // In a real app, this would save via API
    };

    const handlePublish = () => {
        setIsPublishModalOpen(true);
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        console.log('Adding comment:', newComment);
        setNewComment('');
    };

    const isHost = document.authorId === '1'; // In real app, check current user

    return (
        <main className="document-editor-page">
            {/* Header */}
            <header className="document-editor-header">
                <div className="document-editor-header-left">
                    <Link href="/documents" className="document-editor-back">
                        <Icon icon="arrowLeft" size={20} />
                    </Link>
                    <div className="document-editor-header-info">
                        <h1 className="document-editor-title">{document.title}</h1>
                        <div className="document-editor-meta">
                            <span className={`document-status-badge document-status-badge--${document.status}`}>
                                {document.status}
                            </span>
                            <span className="document-editor-meta-item">
                                <Icon icon="users" size={14} />
                                {document.collaborators.filter(c => {
                                    const lastActive = new Date(c.lastActive || 0);
                                    return Date.now() - lastActive.getTime() < 1000 * 60 * 5;
                                }).length} active
                            </span>
                            <span className="document-editor-meta-item">
                                {document.wordCount} words
                            </span>
                        </div>
                    </div>
                </div>

                <div className="document-editor-header-right">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="document-editor-action document-editor-action--secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="document-editor-action document-editor-action--primary"
                            >
                                <Icon icon="check" size={18} />
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <>
                            {document.status === 'draft' && isHost && (
                                <button
                                    onClick={handlePublish}
                                    className="document-editor-action document-editor-action--secondary"
                                >
                                    <Icon icon="send" size={18} />
                                    Publish
                                </button>
                            )}
                            <button
                                onClick={() => setIsEditing(true)}
                                className="document-editor-action document-editor-action--primary"
                            >
                                <Icon icon="pencil" size={18} />
                                Edit
                            </button>
                            <button className="document-editor-action document-editor-action--icon">
                                <Icon icon="moreVertical" size={18} />
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Layout */}
            <div className="document-editor-layout">
                {/* Main Content */}
                <div className="document-editor-main">
                    <div className="document-editor-content">
                        {isEditing ? (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="document-editor-textarea"
                                placeholder="Start writing..."
                                autoFocus
                            />
                        ) : (
                            <div className="document-editor-preview">
                                {content.split('\n').map((line, index) => {
                                    // Simple markdown rendering
                                    if (line.startsWith('# ')) {
                                        return <h1 key={index}>{line.substring(2)}</h1>;
                                    } else if (line.startsWith('## ')) {
                                        return <h2 key={index}>{line.substring(3)}</h2>;
                                    } else if (line.startsWith('### ')) {
                                        return <h3 key={index}>{line.substring(4)}</h3>;
                                    } else if (line.startsWith('- ') || line.startsWith('* ')) {
                                        return <li key={index}>{line.substring(2)}</li>;
                                    } else if (line.trim() === '') {
                                        return <br key={index} />;
                                    } else {
                                        return <p key={index}>{line}</p>;
                                    }
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className={`document-editor-sidebar ${!isSidebarOpen ? 'document-editor-sidebar--collapsed' : ''}`}>
                    {/* Tabs */}
                    <div className="document-editor-tabs">
                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`document-editor-tab ${activeTab === 'comments' ? 'document-editor-tab--active' : ''}`}
                        >
                            <Icon icon="comment" size={18} />
                            <span>Comments</span>
                            {document.comments && document.comments.length > 0 && (
                                <span className="document-editor-tab-badge">
                                    {document.comments.filter(c => !c.resolved).length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('collaborators')}
                            className={`document-editor-tab ${activeTab === 'collaborators' ? 'document-editor-tab--active' : ''}`}
                        >
                            <Icon icon="users" size={18} />
                            <span>Collaborators</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('versions')}
                            className={`document-editor-tab ${activeTab === 'versions' ? 'document-editor-tab--active' : ''}`}
                        >
                            <Icon icon="clock" size={18} />
                            <span>History</span>
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="document-editor-tab-toggle"
                            aria-label="Toggle sidebar"
                        >
                            <Icon icon={isSidebarOpen ? 'chevronRight' : 'chevronLeft'} size={18} />
                        </button>
                    </div>

                    {/* Tab Content */}
                    {isSidebarOpen && (
                        <div className="document-editor-tab-content">
                            {/* Comments Tab */}
                            {activeTab === 'comments' && (
                                <div className="document-editor-comments">
                                    <div className="document-editor-comments-list">
                                        {mockComments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className={`document-editor-comment ${comment.resolved ? 'document-editor-comment--resolved' : ''}`}
                                            >
                                                <div className="document-editor-comment-header">
                                                    <div className="document-editor-comment-avatar">
                                                        {comment.authorPhoto ? (
                                                            <img src={comment.authorPhoto} alt={comment.authorName} />
                                                        ) : (
                                                            comment.authorName.charAt(0)
                                                        )}
                                                    </div>
                                                    <div className="document-editor-comment-meta">
                                                        <div className="document-editor-comment-author">
                                                            {comment.authorName}
                                                        </div>
                                                        <div className="document-editor-comment-time">
                                                            {new Date(comment.timestamp).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    {comment.resolved && (
                                                        <Icon icon="checkCircle" size={16} className="document-editor-comment-resolved-icon" />
                                                    )}
                                                </div>
                                                <div className="document-editor-comment-content">
                                                    {comment.content}
                                                </div>
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div className="document-editor-comment-replies">
                                                        {comment.replies.map((reply) => (
                                                            <div key={reply.id} className="document-editor-comment-reply">
                                                                <div className="document-editor-comment-avatar">
                                                                    {reply.authorPhoto ? (
                                                                        <img src={reply.authorPhoto} alt={reply.authorName} />
                                                                    ) : (
                                                                        reply.authorName.charAt(0)
                                                                    )}
                                                                </div>
                                                                <div className="document-editor-comment-reply-content">
                                                                    <div className="document-editor-comment-author">
                                                                        {reply.authorName}
                                                                    </div>
                                                                    <div className="document-editor-comment-text">
                                                                        {reply.content}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="document-editor-comment-actions">
                                                    <button className="document-editor-comment-action">
                                                        <Icon icon="repeat" size={14} />
                                                        Reply
                                                    </button>
                                                    {!comment.resolved && (
                                                        <button className="document-editor-comment-action">
                                                            <Icon icon="check" size={14} />
                                                            Resolve
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={handleAddComment} className="document-editor-comment-form">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="document-editor-comment-input"
                                            rows={3}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim()}
                                            className="document-editor-comment-submit"
                                        >
                                            <Icon icon="send" size={16} />
                                            Comment
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Collaborators Tab */}
                            {activeTab === 'collaborators' && (
                                <div className="document-editor-collaborators">
                                    <div className="document-editor-collaborators-header">
                                        <h3>Collaborators</h3>
                                        <button className="document-editor-collaborators-add">
                                            <Icon icon="plus" size={16} />
                                            Invite
                                        </button>
                                    </div>
                                    <div className="document-editor-collaborators-list">
                                        {/* Author */}
                                        <div className="document-editor-collaborator">
                                            <div className="document-editor-collaborator-avatar">
                                                {document.authorPhoto ? (
                                                    <img src={document.authorPhoto} alt={document.authorName} />
                                                ) : (
                                                    document.authorName.charAt(0)
                                                )}
                                            </div>
                                            <div className="document-editor-collaborator-info">
                                                <div className="document-editor-collaborator-name">
                                                    {document.authorName}
                                                </div>
                                                <div className="document-editor-collaborator-role">
                                                    Owner
                                                </div>
                                            </div>
                                        </div>

                                        {/* Collaborators */}
                                        {document.collaborators.map((collab) => {
                                            const isActive = collab.lastActive &&
                                                Date.now() - new Date(collab.lastActive).getTime() < 1000 * 60 * 5;

                                            return (
                                                <div key={collab.id} className="document-editor-collaborator">
                                                    <div className="document-editor-collaborator-avatar">
                                                        {collab.photo ? (
                                                            <img src={collab.photo} alt={collab.name} />
                                                        ) : (
                                                            collab.name.charAt(0)
                                                        )}
                                                        {isActive && (
                                                            <div className="document-editor-collaborator-status" />
                                                        )}
                                                    </div>
                                                    <div className="document-editor-collaborator-info">
                                                        <div className="document-editor-collaborator-name">
                                                            {collab.name}
                                                        </div>
                                                        <div className="document-editor-collaborator-role">
                                                            {collab.role}
                                                            {isActive && ' • Active now'}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Versions Tab */}
                            {activeTab === 'versions' && (
                                <div className="document-editor-versions">
                                    <h3>Version History</h3>
                                    <div className="document-editor-versions-list">
                                        {document.versions.map((version) => (
                                            <div key={version.id} className="document-editor-version">
                                                <div className="document-editor-version-header">
                                                    <div className="document-editor-version-number">
                                                        v{version.version}
                                                    </div>
                                                    <div className="document-editor-version-date">
                                                        {new Date(version.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="document-editor-version-author">
                                                    <div className="document-editor-version-avatar">
                                                        {version.createdBy.photo ? (
                                                            <img src={version.createdBy.photo} alt={version.createdBy.name} />
                                                        ) : (
                                                            version.createdBy.name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div className="document-editor-version-name">
                                                        {version.createdBy.name}
                                                    </div>
                                                </div>
                                                <div className="document-editor-version-changes">
                                                    {version.changes}
                                                </div>
                                                <button className="document-editor-version-restore">
                                                    <Icon icon="history" size={14} />
                                                    Restore
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </aside>
            </div>

            {/* Publish Modal */}
            <PublishDocumentModal
                open={isPublishModalOpen}
                onOpenChange={setIsPublishModalOpen}
                document={document}
            />
        </main>
    );
}
