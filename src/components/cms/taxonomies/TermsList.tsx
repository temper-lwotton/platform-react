'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import { useTerms, useDeleteTerm, useTaxonomy } from '@/hooks/cms';
import styles from './TermsList.module.scss';

interface TermsListProps {
  taxonomyId: number;
}

export function TermsList({ taxonomyId }: TermsListProps) {
  const [search, setSearch] = useState('');

  // Fetch taxonomy and terms
  const { data: taxonomyData } = useTaxonomy(taxonomyId);
  const { data: termsData, isLoading, error } = useTerms(taxonomyId);
  const deleteTerm = useDeleteTerm();

  const taxonomy = taxonomyData?.data;

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete the "${name}" term?`)) {
      try {
        await deleteTerm.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete term');
      }
    }
  };

  // Filter terms by search
  const filteredTerms = termsData?.data.filter((term) =>
    term.name.toLowerCase().includes(search.toLowerCase()) ||
    term.slug.toLowerCase().includes(search.toLowerCase()) ||
    term.description?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/admin/taxonomies" className={styles.backButton}>
          <ArrowLeft className={styles.buttonIcon} />
          Back to Taxonomies
        </Link>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>
              {taxonomy?.pluralLabel || 'Terms'}
            </h1>
            <p className={styles.subtitle}>
              Manage terms for {taxonomy?.singularLabel || 'taxonomy'}
            </p>
          </div>
          <Link
            href={`/admin/taxonomies/${taxonomyId}/terms/new`}
            className={styles.createButton}
          >
            <Plus className={styles.buttonIcon} />
            Add New {taxonomy?.singularLabel || 'Term'}
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Terms Table */}
      {isLoading ? (
        <div className={styles.loading}>Loading terms...</div>
      ) : error ? (
        <div className={styles.error}>Error loading terms</div>
      ) : filteredTerms.length === 0 ? (
        <div className={styles.empty}>
          <Tag className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No terms found</h3>
          <p className={styles.emptyText}>
            Create your first {taxonomy?.singularLabel?.toLowerCase() || 'term'} to get started
          </p>
          <Link
            href={`/admin/taxonomies/${taxonomyId}/terms/new`}
            className={styles.emptyButton}
          >
            <Plus className={styles.buttonIcon} />
            Create {taxonomy?.singularLabel || 'Term'}
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                {taxonomy?.hierarchical && <th>Parent</th>}
                <th>Count</th>
                <th className={styles.actionsCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTerms.map((term) => {
                const parentTerm = term.parent
                  ? termsData?.data.find(t => t.id === term.parent)
                  : null;

                return (
                  <tr key={term.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.termName}>
                        <Tag className={styles.termIcon} />
                        {term.name}
                      </div>
                    </td>
                    <td className={styles.slug}>{term.slug}</td>
                    <td className={styles.description}>
                      {term.description || <span className={styles.emptyValue}>—</span>}
                    </td>
                    {taxonomy?.hierarchical && (
                      <td className={styles.parent}>
                        {parentTerm?.name || <span className={styles.emptyValue}>—</span>}
                      </td>
                    )}
                    <td>
                      <span className={styles.count}>
                        <FileText className={styles.countIcon} />
                        {term.count}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actions}>
                        <Link
                          href={`/admin/taxonomies/${taxonomyId}/terms/${term.id}/edit`}
                          className={styles.actionButton}
                          title="Edit"
                        >
                          <Edit className={styles.actionIcon} />
                        </Link>
                        <button
                          onClick={() => handleDelete(term.id, term.name)}
                          className={`${styles.actionButton} ${styles.danger}`}
                          title="Delete"
                        >
                          <Trash2 className={styles.actionIcon} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
