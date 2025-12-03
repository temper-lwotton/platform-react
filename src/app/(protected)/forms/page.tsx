'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { getForms, deleteForm, duplicateForm, type FormListParams } from '@/lib/forms';
import { getCurrentUserId } from '@/lib/auth';
import { Icon } from '@/components/ui/Icon';
import { FileText, Plus, Trash2, Copy, Edit, Search, Calendar, MoreVertical } from 'lucide-react';
import './forms.scss';

export default function FormsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'title'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    setCurrentUserId(getCurrentUserId());
  }, []);

  const params: FormListParams = {
    page: currentPage,
    limit: 20,
    sort: sortBy,
    order: sortOrder,
    search: searchQuery || undefined,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['forms', params],
    queryFn: () => getForms(params),
    enabled: isClient && !!currentUserId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      setActiveMenu(null);
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: ({ id, title }: { id: number; title?: string }) => duplicateForm(id, title),
    onSuccess: (newForm) => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      setActiveMenu(null);
      router.push(`/form-builder/${newForm.id}`);
    },
  });

  const handleDelete = (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleDuplicate = (id: number, title: string) => {
    duplicateMutation.mutate({ id, title: `Copy of ${title}` });
  };

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (!isClient || !currentUserId) {
    return null;
  }

  return (
    <div className="forms-page">
      <div className="forms-page-container">
        <header className="forms-page-header">
          <div className="forms-page-header-content">
            <h1 className="forms-page-title">Forms</h1>
            <p className="forms-page-subtitle">
              Create, manage, and customize forms with our drag-and-drop builder
            </p>
          </div>
          <Link href="/form-builder/new" className="forms-create-button">
            <Plus size={16} />
            New Form
          </Link>
        </header>

        {/* Search and Sort Controls */}
        <div className="forms-controls">
          <div className="forms-search">
            <Search size={20} className="forms-search-icon" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="forms-search-input"
            />
          </div>

          <div className="forms-sort-group">
            <label className="forms-sort-label">Sort by</label>
            <div className="forms-sort-buttons">
              <button
                onClick={() => handleSort('updatedAt')}
                className={`forms-sort-btn ${sortBy === 'updatedAt' ? 'forms-sort-btn--active' : ''}`}
              >
                <Calendar size={14} />
                Updated
                {sortBy === 'updatedAt' && (
                  <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
              <button
                onClick={() => handleSort('createdAt')}
                className={`forms-sort-btn ${sortBy === 'createdAt' ? 'forms-sort-btn--active' : ''}`}
              >
                <Calendar size={14} />
                Created
                {sortBy === 'createdAt' && (
                  <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
              <button
                onClick={() => handleSort('title')}
                className={`forms-sort-btn ${sortBy === 'title' ? 'forms-sort-btn--active' : ''}`}
              >
                <FileText size={14} />
                Name
                {sortBy === 'title' && (
                  <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Forms List */}
        {isLoading ? (
          <div className="forms-loading">
            <div className="forms-loading-spinner" />
            <p>Loading forms...</p>
          </div>
        ) : error ? (
          <div className="forms-error">
            <p>Failed to load forms. Please try again.</p>
          </div>
        ) : !data?.data || data.data.length === 0 ? (
          <div className="forms-empty">
            <FileText size={48} />
            <h3 className="forms-empty-title">No forms yet</h3>
            <p className="forms-empty-description">
              {searchQuery
                ? 'No forms match your search. Try a different query.'
                : 'Get started by creating your first form with our drag-and-drop builder.'}
            </p>
            {!searchQuery && (
              <Link href="/form-builder/new" className="forms-create-button">
                <Plus size={16} />
                Create Your First Form
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="forms-grid">
              {data.data.map((form) => (
                <div key={form.id} className="form-card">
                  <div className="form-card-header">
                    <Link href={`/form-builder/${form.id}`} className="form-card-title-link">
                      <h3 className="form-card-title">{form.title}</h3>
                    </Link>
                    <div className="form-card-menu">
                      <button
                        className="form-card-menu-trigger"
                        onClick={() => setActiveMenu(activeMenu === form.id ? null : form.id)}
                        aria-label="Form actions"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {activeMenu === form.id && (
                        <>
                          <div
                            className="form-card-menu-backdrop"
                            onClick={() => setActiveMenu(null)}
                          />
                          <div className="form-card-menu-dropdown">
                            <Link
                              href={`/form-builder/${form.id}`}
                              className="form-card-menu-item"
                              onClick={() => setActiveMenu(null)}
                            >
                              <Edit size={16} />
                              Edit
                            </Link>
                            <button
                              className="form-card-menu-item"
                              onClick={() => handleDuplicate(form.id, form.title)}
                              disabled={duplicateMutation.isPending}
                            >
                              <Copy size={16} />
                              Duplicate
                            </button>
                            <button
                              className="form-card-menu-item form-card-menu-item--danger"
                              onClick={() => handleDelete(form.id, form.title)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {form.description && (
                    <p className="form-card-description">{form.description}</p>
                  )}

                  <div className="form-card-stats">
                    <div className="form-card-stat">
                      <FileText size={14} />
                      <span>{form.fieldCount} {form.fieldCount === 1 ? 'field' : 'fields'}</span>
                    </div>
                    {form.sectionCount > 0 && (
                      <div className="form-card-stat">
                        <Icon icon="layers" size={14} />
                        <span>{form.sectionCount} {form.sectionCount === 1 ? 'section' : 'sections'}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-card-footer">
                    <div className="form-card-date">
                      <Calendar size={14} />
                      <span>Updated {formatDate(form.updatedAt)}</span>
                    </div>
                    <Link
                      href={`/form-builder/${form.id}`}
                      className="form-card-edit-button"
                    >
                      <Edit size={14} />
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.meta.totalPages > 1 && (
              <div className="forms-pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="forms-pagination-button"
                >
                  Previous
                </button>
                <span className="forms-pagination-info">
                  Page {currentPage} of {data.meta.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(data.meta.totalPages, prev + 1))}
                  disabled={currentPage === data.meta.totalPages}
                  className="forms-pagination-button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
