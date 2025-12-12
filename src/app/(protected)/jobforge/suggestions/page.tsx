'use client';

import { useState, useMemo } from 'react';
import { useJobs } from '@/lib/jobforge/hooks';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';
import styles from '../jobforge.module.scss';

type SuggestionFilter = 'all' | 'high' | 'medium' | 'low';
type SuggestionCategory = 'all' | 'clarity' | 'completeness' | 'appeal' | 'competitiveness' | 'bias' | 'salary';

interface AIsuggestion {
  id: string;
  jobId: string;
  jobTitle: string;
  tipId: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  suggestion?: string;
  impact: number;
  currentValue?: string;
  suggestedValue?: string;
  fieldPath?: string;
  createdAt: Date;
  applied: boolean;
}

export default function AllSuggestionsPage() {
  const { jobs, isLoading } = useJobs();
  const [priorityFilter, setPriorityFilter] = useState<SuggestionFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<SuggestionCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showApplied, setShowApplied] = useState(false);

  // Extract all suggestions from all jobs
  const allSuggestions = useMemo(() => {
    if (!jobs) return [];

    const suggestions: AIsuggestion[] = [];

    jobs.forEach(job => {
      if (job.analysis?.tips) {
        job.analysis.tips.forEach(tip => {
          // Determine category from tip properties
          let category = 'general';
          if (tip.title.toLowerCase().includes('clarity') || tip.title.toLowerCase().includes('clear')) {
            category = 'clarity';
          } else if (tip.title.toLowerCase().includes('complete') || tip.title.toLowerCase().includes('add')) {
            category = 'completeness';
          } else if (tip.title.toLowerCase().includes('appeal') || tip.title.toLowerCase().includes('attract')) {
            category = 'appeal';
          } else if (tip.title.toLowerCase().includes('competitive') || tip.title.toLowerCase().includes('market')) {
            category = 'competitiveness';
          } else if (tip.title.toLowerCase().includes('salary') || tip.title.toLowerCase().includes('compensation')) {
            category = 'salary';
          } else if (tip.title.toLowerCase().includes('bias') || tip.title.toLowerCase().includes('inclusive')) {
            category = 'bias';
          }

          suggestions.push({
            id: `${job.id}-${tip.id}`,
            jobId: job.id,
            jobTitle: job.title,
            tipId: tip.id,
            priority: tip.priority,
            category,
            title: tip.title,
            description: tip.description,
            suggestion: tip.suggestion,
            impact: tip.impact,
            currentValue: tip.currentValue,
            suggestedValue: tip.suggestedValue,
            fieldPath: tip.fieldPath,
            createdAt: job.createdAt,
            applied: false, // TODO: Track applied suggestions
          });
        });
      }
    });

    // Sort by priority (high first) and then by impact (highest first)
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.impact - a.impact;
    });
  }, [jobs]);

  // Filter suggestions
  const filteredSuggestions = useMemo(() => {
    return allSuggestions.filter(suggestion => {
      // Priority filter
      if (priorityFilter !== 'all' && suggestion.priority !== priorityFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && suggestion.category !== categoryFilter) {
        return false;
      }

      // Applied filter
      if (!showApplied && suggestion.applied) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          suggestion.title.toLowerCase().includes(query) ||
          suggestion.description.toLowerCase().includes(query) ||
          suggestion.jobTitle.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [allSuggestions, priorityFilter, categoryFilter, showApplied, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: allSuggestions.length,
      high: allSuggestions.filter(s => s.priority === 'high').length,
      medium: allSuggestions.filter(s => s.priority === 'medium').length,
      low: allSuggestions.filter(s => s.priority === 'low').length,
      applied: allSuggestions.filter(s => s.applied).length,
    };
  }, [allSuggestions]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading suggestions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>All AI Suggestions</h1>
          <p className={styles.pageDescription}>
            Review and apply AI-powered improvements across all your job specifications
          </p>
        </div>
        <Link href="/jobforge" className={styles.buttonSecondary}>
          <Icon icon="arrowLeft" size={16} />
          Back to JobForge
        </Link>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icon icon="lightbulb" size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Suggestions</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.high}`}>
            <Icon icon="arrowUp" size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.high}</div>
            <div className={styles.statLabel}>High Priority</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.medium}`}>
            <Icon icon="minus" size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.medium}</div>
            <div className={styles.statLabel}>Medium Priority</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.low}`}>
            <Icon icon="arrowDown" size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.low}</div>
            <div className={styles.statLabel}>Low Priority</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersContainer}>
        <div className={styles.searchBox}>
          <Icon icon="search" size={18} />
          <input
            type="text"
            placeholder="Search suggestions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Priority:</label>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${priorityFilter === 'all' ? styles.active : ''}`}
              onClick={() => setPriorityFilter('all')}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${priorityFilter === 'high' ? styles.active : ''}`}
              onClick={() => setPriorityFilter('high')}
            >
              High
            </button>
            <button
              className={`${styles.filterButton} ${priorityFilter === 'medium' ? styles.active : ''}`}
              onClick={() => setPriorityFilter('medium')}
            >
              Medium
            </button>
            <button
              className={`${styles.filterButton} ${priorityFilter === 'low' ? styles.active : ''}`}
              onClick={() => setPriorityFilter('low')}
            >
              Low
            </button>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Category:</label>
          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as SuggestionCategory)}
          >
            <option value="all">All Categories</option>
            <option value="clarity">Clarity</option>
            <option value="completeness">Completeness</option>
            <option value="appeal">Appeal</option>
            <option value="competitiveness">Competitiveness</option>
            <option value="salary">Salary</option>
            <option value="bias">Bias</option>
          </select>
        </div>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showApplied}
            onChange={(e) => setShowApplied(e.target.checked)}
          />
          <span>Show applied</span>
        </label>
      </div>

      {/* Results Count */}
      <div className={styles.resultsCount}>
        Showing {filteredSuggestions.length} of {allSuggestions.length} suggestions
      </div>

      {/* Suggestions List */}
      <div className={styles.suggestionsList}>
        {filteredSuggestions.length === 0 ? (
          <div className={styles.empty}>
            <Icon icon="lightbulb" size={64} />
            <h3>No suggestions found</h3>
            <p>Try adjusting your filters or create more job specs to get AI suggestions</p>
            <Link href="/jobforge/create-new" className={styles.buttonPrimary}>
              Create New Job Spec
            </Link>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`${styles.suggestionCard} ${styles[`priority-${suggestion.priority}`]} ${
                suggestion.applied ? styles.applied : ''
              }`}
            >
              <div className={styles.suggestionHeader}>
                <div className={styles.suggestionMeta}>
                  <span className={`${styles.priorityBadge} ${styles[suggestion.priority]}`}>
                    {suggestion.priority}
                  </span>
                  <span className={styles.categoryBadge}>{suggestion.category}</span>
                  <span className={styles.impactBadge}>+{suggestion.impact} pts</span>
                </div>
                {suggestion.applied && (
                  <span className={styles.appliedBadge}>
                    <Icon icon="check" size={14} />
                    Applied
                  </span>
                )}
              </div>

              <div className={styles.suggestionContent}>
                <h3 className={styles.suggestionTitle}>{suggestion.title}</h3>
                <p className={styles.suggestionDescription}>{suggestion.description}</p>

                {suggestion.suggestion && (
                  <div className={styles.suggestionTip}>
                    <Icon icon="lightbulb" size={16} />
                    <span>{suggestion.suggestion}</span>
                  </div>
                )}

                {suggestion.currentValue && suggestion.suggestedValue && (
                  <div className={styles.suggestionComparison}>
                    <div className={styles.comparisonSide}>
                      <span className={styles.comparisonLabel}>Current:</span>
                      <span className={styles.comparisonValue}>{suggestion.currentValue}</span>
                    </div>
                    <Icon icon="arrowRight" size={16} />
                    <div className={styles.comparisonSide}>
                      <span className={styles.comparisonLabel}>Suggested:</span>
                      <span className={`${styles.comparisonValue} ${styles.suggested}`}>
                        {suggestion.suggestedValue}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.suggestionFooter}>
                <Link href={`/jobforge/edit/${suggestion.jobId}`} className={styles.jobLink}>
                  <Icon icon="briefcase" size={14} />
                  {suggestion.jobTitle}
                </Link>
                <div className={styles.suggestionActions}>
                  <Link
                    href={`/jobforge/edit/${suggestion.jobId}?suggestion=${suggestion.tipId}`}
                    className={styles.buttonSecondary}
                  >
                    View in Job
                  </Link>
                  {!suggestion.applied && (
                    <button className={styles.buttonPrimary}>
                      <Icon icon="check" size={14} />
                      Apply
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
