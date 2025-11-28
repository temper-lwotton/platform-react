'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockDocuments } from '@/lib/mock-documents';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { Icon } from '@/components/ui/Icon';
import { DocumentStatus } from '@/lib/documents';

type FilterType = 'all' | DocumentStatus;
type SortType = 'updated' | 'created' | 'title' | 'views';
type ViewType = 'grid' | 'list';

export default function DocumentsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [sortBy, setSortBy] = useState<SortType>('updated');
    const [viewType, setViewType] = useState<ViewType>('grid');

    // Filter documents
    let filteredDocuments = mockDocuments;

    if (activeFilter !== 'all') {
        filteredDocuments = filteredDocuments.filter(d => d.status === activeFilter);
    }

    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredDocuments = filteredDocuments.filter(d =>
            d.title.toLowerCase().includes(query) ||
            d.content.toLowerCase().includes(query) ||
            d.tags?.some(tag => tag.toLowerCase().includes(query))
        );
    }

    // Sort documents
    filteredDocuments = [...filteredDocuments].sort((a, b) => {
        switch (sortBy) {
            case 'updated':
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            case 'created':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'title':
                return a.title.localeCompare(b.title);
            case 'views':
                return (b.stats?.views || 0) - (a.stats?.views || 0);
            default:
                return 0;
        }
    });

    const handleCreateDocument = () => {
        router.push('/documents/new');
    };

    return (
        <main className="documents-page">
            <div className="documents-container">
                {/* Header */}
                <header className="documents-header">
                    <div className="documents-header-content">
                        <div className="documents-header-main">
                            <h1 className="documents-title">Documents</h1>
                            <p className="documents-subtitle">
                                Collaborate on documents with your team
                            </p>
                        </div>
                        <button
                            onClick={handleCreateDocument}
                            className="documents-create-button"
                        >
                            <Icon icon="plus" size={20} />
                            New Document
                        </button>
                    </div>
                </header>

                {/* Filters and Search */}
                <div className="documents-controls">
                    <div className="documents-search">
                        <Icon icon="search" size={18} />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="documents-search-input"
                        />
                    </div>

                    <div className="documents-filters">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`documents-filter ${activeFilter === 'all' ? 'documents-filter--active' : ''}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveFilter('published')}
                            className={`documents-filter ${activeFilter === 'published' ? 'documents-filter--active' : ''}`}
                        >
                            Published
                        </button>
                        <button
                            onClick={() => setActiveFilter('draft')}
                            className={`documents-filter ${activeFilter === 'draft' ? 'documents-filter--active' : ''}`}
                        >
                            Drafts
                        </button>
                        <button
                            onClick={() => setActiveFilter('archived')}
                            className={`documents-filter ${activeFilter === 'archived' ? 'documents-filter--active' : ''}`}
                        >
                            Archived
                        </button>
                    </div>

                    <div className="documents-sort">
                        <label htmlFor="sort-select" className="documents-sort-label">
                            <Icon icon="arrowUpDown" size={16} />
                            Sort by:
                        </label>
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortType)}
                            className="documents-sort-select"
                        >
                            <option value="updated">Last Updated</option>
                            <option value="created">Date Created</option>
                            <option value="title">Title</option>
                            <option value="views">Most Viewed</option>
                        </select>
                    </div>

                    {/* View Toggle */}
                    <div className="documents-view-toggle">
                        <button
                            onClick={() => setViewType('grid')}
                            className={`documents-view-button ${viewType === 'grid' ? 'documents-view-button--active' : ''}`}
                            aria-label="Grid view"
                            title="Grid view"
                        >
                            <Icon icon="grid" size={18} />
                        </button>
                        <button
                            onClick={() => setViewType('list')}
                            className={`documents-view-button ${viewType === 'list' ? 'documents-view-button--active' : ''}`}
                            aria-label="List view"
                            title="List view"
                        >
                            <Icon icon="list" size={18} />
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="documents-results">
                    {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
                </div>

                {/* Documents Grid/List */}
                {filteredDocuments.length > 0 ? (
                    <div className={viewType === 'grid' ? 'documents-grid' : 'documents-list'}>
                        {filteredDocuments.map((document) => (
                            <DocumentCard key={document.id} document={document} viewType={viewType} />
                        ))}
                    </div>
                ) : (
                    <div className="documents-empty">
                        <Icon icon="fileText" size={64} />
                        <h2>No documents found</h2>
                        <p>
                            {searchQuery
                                ? `No documents match "${searchQuery}"`
                                : 'Create your first document to get started'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={handleCreateDocument}
                                className="documents-empty-button"
                            >
                                <Icon icon="plus" size={20} />
                                Create Document
                            </button>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
