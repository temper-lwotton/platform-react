'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Tags,
  Plus,
  Edit,
  Trash2,
  Search,
  List,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useTaxonomies, useDeleteTaxonomy } from '@/hooks/cms';
import styles from './TaxonomiesList.module.scss';

export function TaxonomiesList() {
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // Fetch taxonomies
  const { data: taxonomiesData, isLoading, error } = useTaxonomies({
    active: showInactive ? undefined : true,
  });

  const deleteTaxonomy = useDeleteTaxonomy();

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete the "${name}" taxonomy? This cannot be undone if terms exist.`)) {
      try {
        await deleteTaxonomy.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete taxonomy. Terms may exist.');
      }
    }
  };

  // Filter taxonomies by search
  const filteredTaxonomies = taxonomiesData?.data.filter((taxonomy) =>
    taxonomy.name.toLowerCase().includes(search.toLowerCase()) ||
    taxonomy.singularLabel.toLowerCase().includes(search.toLowerCase()) ||
    taxonomy.pluralLabel.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Taxonomies</h1>
          <p className={styles.subtitle}>Organize your content with categories, tags, and more</p>
        </div>
        <Link href="/admin/taxonomies/new" className={styles.createButton}>
          <Plus className={styles.buttonIcon} />
          Add New Taxonomy
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search taxonomies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

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

      {/* Taxonomies Grid */}
      {isLoading ? (
        <div className={styles.loading}>Loading taxonomies...</div>
      ) : error ? (
        <div className={styles.error}>Error loading taxonomies</div>
      ) : filteredTaxonomies.length === 0 ? (
        <div className={styles.empty}>
          <Tags className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No taxonomies found</h3>
          <p className={styles.emptyText}>Create your first taxonomy to organize content</p>
          <Link href="/admin/taxonomies/new" className={styles.emptyButton}>
            <Plus className={styles.buttonIcon} />
            Create Taxonomy
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredTaxonomies.map((taxonomy) => (
            <div key={taxonomy.id} className={styles.card}>
              {/* Header */}
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <Tags className={styles.cardIconSvg} />
                </div>
                <div className={styles.cardActions}>
                  <Link
                    href={`/admin/taxonomies/${taxonomy.id}/terms`}
                    className={styles.actionButton}
                    title="Manage Terms"
                  >
                    <List className={styles.actionIcon} />
                  </Link>
                  <Link
                    href={`/admin/taxonomies/${taxonomy.id}/edit`}
                    className={styles.actionButton}
                    title="Edit"
                  >
                    <Edit className={styles.actionIcon} />
                  </Link>
                  <button
                    onClick={() => handleDelete(taxonomy.id, taxonomy.name)}
                    className={`${styles.actionButton} ${styles.danger}`}
                    title="Delete"
                  >
                    <Trash2 className={styles.actionIcon} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{taxonomy.singularLabel}</h3>
                <p className={styles.cardSubtitle}>{taxonomy.pluralLabel}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.metaItem}>
                    <strong>Name:</strong> {taxonomy.name}
                  </span>
                  <span className={styles.metaItem}>
                    <strong>Slug:</strong> {taxonomy.slug}
                  </span>
                  <span className={styles.metaItem}>
                    <strong>Terms:</strong> {taxonomy.termsCount}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                <div className={styles.badges}>
                  {taxonomy.isActive ? (
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
                  {taxonomy.hierarchical && (
                    <span className={`${styles.badge} ${styles.hierarchical}`}>
                      Hierarchical
                    </span>
                  )}
                  {taxonomy.showInMenu && (
                    <span className={`${styles.badge} ${styles.menu}`}>
                      Show in Menu
                    </span>
                  )}
                </div>
                {taxonomy.postTypes && taxonomy.postTypes.length > 0 && (
                  <div className={styles.postTypes}>
                    <span className={styles.postTypesLabel}>Used by:</span>
                    <span className={styles.postTypesValue}>
                      {taxonomy.postTypes.slice(0, 2).map(pt => pt.singularLabel).join(', ')}
                      {taxonomy.postTypes.length > 2 && ` +${taxonomy.postTypes.length - 2}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
