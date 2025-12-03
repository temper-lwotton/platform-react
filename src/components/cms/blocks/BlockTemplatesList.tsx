'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Blocks,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Copy,
} from 'lucide-react';
import { useBlockTemplates, useDeleteBlockTemplate } from '@/hooks/cms';
import { formatDistanceToNow } from 'date-fns';
import styles from './BlockTemplatesList.module.scss';

export function BlockTemplatesList() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // Fetch block templates
  const { data: templatesData, isLoading, error } = useBlockTemplates({
    category: categoryFilter || undefined,
  });

  const deleteTemplate = useDeleteBlockTemplate();

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete the "${name}" block template? This cannot be undone.`)) {
      try {
        await deleteTemplate.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete block template');
      }
    }
  };

  // Filter templates by search and active status
  const filteredTemplates = templatesData?.data.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = showInactive ? true : template.isActive;
    return matchesSearch && matchesStatus;
  }) || [];

  // Get unique categories for filter
  const categories = Array.from(
    new Set(
      templatesData?.data
        .map((t) => t.category)
        .filter((c): c is string => !!c) || []
    )
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Block Templates</h1>
          <p className={styles.subtitle}>Create and manage reusable content blocks</p>
        </div>
        <Link href="/admin/block-templates/new" className={styles.createButton}>
          <Plus className={styles.buttonIcon} />
          Add New Template
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search block templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        )}

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className={styles.checkbox}
          />
          Show inactive
        </label>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className={styles.loading}>Loading block templates...</div>
      ) : error ? (
        <div className={styles.error}>Error loading block templates</div>
      ) : filteredTemplates.length === 0 ? (
        <div className={styles.empty}>
          <Blocks className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No block templates found</h3>
          <p className={styles.emptyText}>Create your first block template to get started</p>
          <Link href="/admin/block-templates/new" className={styles.emptyButton}>
            <Plus className={styles.buttonIcon} />
            Create Block Template
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredTemplates.map((template) => (
            <div key={template.id} className={styles.card}>
              {/* Header */}
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <Blocks className={styles.cardIconSvg} />
                </div>
                <div className={styles.cardActions}>
                  <Link
                    href={`/admin/block-templates/${template.id}/edit`}
                    className={styles.actionButton}
                    title="Edit"
                  >
                    <Edit className={styles.actionIcon} />
                  </Link>
                  <button
                    onClick={() => handleDelete(template.id, template.name)}
                    className={`${styles.actionButton} ${styles.danger}`}
                    title="Delete"
                  >
                    <Trash2 className={styles.actionIcon} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{template.name}</h3>
                {template.description && (
                  <p className={styles.cardDescription}>{template.description}</p>
                )}

                <div className={styles.cardMeta}>
                  {template.category && (
                    <span className={styles.category}>{template.category}</span>
                  )}
                  <span className={styles.metaItem}>
                    <strong>By:</strong> {template.author.name}
                  </span>
                  <span className={styles.metaItem}>
                    <strong>Updated:</strong>{' '}
                    {formatDistanceToNow(new Date(template.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                {template.isActive ? (
                  <span className={`${styles.badge} ${styles.active}`}>
                    <CheckCircle className={styles.badgeIcon} />
                    Active
                  </span>
                ) : (
                  <span className={`${styles.badge} ${styles.inactive}`}>
                    <XCircle className={styles.badgeIcon} />
                    Inactive
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
