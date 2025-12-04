'use client';

import { useState, useEffect } from 'react';
import { useTaxonomies, useTerms } from '@/hooks/cms';
import styles from './CategoriesPanel.module.scss';

interface CategoriesPanelProps {
  selectedTerms: number[];
  onChange: (terms: number[]) => void;
}

export function CategoriesPanel({ selectedTerms, onChange }: CategoriesPanelProps) {
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<number | null>(null);

  // Fetch taxonomies
  const { data: taxonomiesData, isLoading: taxonomiesLoading } = useTaxonomies({ active: true });

  // Fetch terms for selected taxonomy
  const { data: termsData, isLoading: termsLoading } = useTerms(selectedTaxonomy || 0);

  // Auto-select first taxonomy
  useEffect(() => {
    if (taxonomiesData?.data && taxonomiesData.data.length > 0 && !selectedTaxonomy) {
      setSelectedTaxonomy(taxonomiesData.data[0].id);
    }
  }, [taxonomiesData, selectedTaxonomy]);

  const handleTermToggle = (termId: number) => {
    if (selectedTerms.includes(termId)) {
      onChange(selectedTerms.filter((id) => id !== termId));
    } else {
      onChange([...selectedTerms, termId]);
    }
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Categories & Tags</h3>

      {/* Taxonomy Selector */}
      {taxonomiesData?.data && taxonomiesData.data.length > 0 && (
        <select
          value={selectedTaxonomy || ''}
          onChange={(e) => setSelectedTaxonomy(Number(e.target.value))}
          className={styles.select}
        >
          {taxonomiesData.data.map((taxonomy) => (
            <option key={taxonomy.id} value={taxonomy.id}>
              {taxonomy.pluralLabel}
            </option>
          ))}
        </select>
      )}

      {/* Terms List */}
      {termsLoading ? (
        <p className={styles.emptyText}>Loading terms...</p>
      ) : termsData?.data && termsData.data.length > 0 ? (
        <div className={styles.termsList}>
          {termsData.data.map((term) => (
            <label key={term.id} className={styles.termItem}>
              <input
                type="checkbox"
                checked={selectedTerms.includes(term.id)}
                onChange={() => handleTermToggle(term.id)}
                className={styles.checkbox}
              />
              <span className={styles.termName}>{term.name}</span>
              <span className={styles.termCount}>({term.count})</span>
            </label>
          ))}
        </div>
      ) : selectedTaxonomy ? (
        <p className={styles.emptyText}>No terms available</p>
      ) : (
        <p className={styles.emptyText}>Select a taxonomy</p>
      )}
    </div>
  );
}
