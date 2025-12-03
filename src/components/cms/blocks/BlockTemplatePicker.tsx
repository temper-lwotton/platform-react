'use client';

import { useState } from 'react';
import { X, Search, Blocks, Plus } from 'lucide-react';
import { useBlockTemplates } from '@/hooks/cms';
import styles from './BlockTemplatePicker.module.scss';

interface BlockTemplatePickerProps {
  onSelect: (blockJson: string) => void;
  onClose: () => void;
}

export function BlockTemplatePicker({ onSelect, onClose }: BlockTemplatePickerProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: templatesData, isLoading } = useBlockTemplates({
    category: categoryFilter || undefined,
  });

  // Filter active templates by search
  const filteredTemplates = templatesData?.data
    .filter((t) => t.isActive)
    .filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.description?.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    }) || [];

  // Get unique categories
  const categories = Array.from(
    new Set(
      templatesData?.data
        .filter((t) => t.isActive)
        .map((t) => t.category)
        .filter((c): c is string => !!c) || []
    )
  );

  const handleSelect = (template: any) => {
    onSelect(template.blockJson);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Blocks className={styles.headerIcon} />
            <h2 className={styles.title}>Insert Block Template</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              autoFocus
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
        </div>

        {/* Content */}
        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>Loading templates...</div>
          ) : filteredTemplates.length === 0 ? (
            <div className={styles.empty}>
              <Blocks className={styles.emptyIcon} />
              <p className={styles.emptyText}>
                {search || categoryFilter
                  ? 'No templates match your search'
                  : 'No active templates available'}
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  className={styles.templateCard}
                  onClick={() => handleSelect(template)}
                >
                  <div className={styles.cardIcon}>
                    <Blocks className={styles.cardIconSvg} />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{template.name}</h3>
                    {template.description && (
                      <p className={styles.cardDescription}>{template.description}</p>
                    )}
                    {template.category && (
                      <span className={styles.category}>{template.category}</span>
                    )}
                  </div>
                  <div className={styles.cardAction}>
                    <Plus className={styles.actionIcon} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
