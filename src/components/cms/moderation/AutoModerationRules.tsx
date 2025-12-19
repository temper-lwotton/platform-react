'use client';

import { useState } from 'react';
import {
  Shield,
  Plus,
  Zap,
  TrendingUp,
  TrendingDown,
  Settings,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import styles from './AutoModerationRules.module.scss';

type TriggerType = 'content_keywords' | 'user_behavior' | 'external_links' | 'spam_pattern' | 'toxicity_score' | 'new_user';
type ActionType = 'auto_approve' | 'auto_reject' | 'flag_for_review' | 'warn_user' | 'rate_limit';
type ContentType = 'post' | 'comment' | 'all';

interface Rule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  contentType: ContentType;
  trigger: {
    type: TriggerType;
    config: Record<string, any>;
  };
  action: {
    type: ActionType;
    config: Record<string, any>;
  };
  performance: {
    triggered: number;
    falsePositives: number;
    accuracy: number;
  };
  createdAt: string;
}

// Dummy data
const rules: Rule[] = [
  {
    id: '1',
    name: 'Block Obvious Spam',
    description: 'Auto-reject posts with excessive caps, multiple links, and get-rich-quick keywords',
    isActive: true,
    contentType: 'all',
    trigger: {
      type: 'spam_pattern',
      config: {
        keywords: ['make money', 'click here', 'limited time'],
        externalLinksMin: 2,
        capsPercentage: 50,
      },
    },
    action: {
      type: 'auto_reject',
      config: {
        notifyUser: true,
        message: 'Your post appears to be spam and has been automatically removed.',
      },
    },
    performance: {
      triggered: 47,
      falsePositives: 2,
      accuracy: 95.7,
    },
    createdAt: '2025-11-01',
  },
  {
    id: '2',
    name: 'Review High Toxicity',
    description: 'Flag content with high toxicity scores for manual review',
    isActive: true,
    contentType: 'all',
    trigger: {
      type: 'toxicity_score',
      config: {
        threshold: 0.7,
      },
    },
    action: {
      type: 'flag_for_review',
      config: {
        priority: 'high',
        assignTo: 'moderation_team',
      },
    },
    performance: {
      triggered: 23,
      falsePositives: 5,
      accuracy: 78.3,
    },
    createdAt: '2025-11-05',
  },
  {
    id: '3',
    name: 'New User Link Protection',
    description: 'Auto-flag posts from new users (< 7 days) containing external links',
    isActive: true,
    contentType: 'post',
    trigger: {
      type: 'new_user',
      config: {
        accountAgeDays: 7,
        hasExternalLinks: true,
      },
    },
    action: {
      type: 'flag_for_review',
      config: {
        priority: 'medium',
        reason: 'New user with external link',
      },
    },
    performance: {
      triggered: 15,
      falsePositives: 3,
      accuracy: 80.0,
    },
    createdAt: '2025-10-20',
  },
  {
    id: '4',
    name: 'Rate Limit Rapid Posting',
    description: 'Slow down users posting more than 5 times in 10 minutes',
    isActive: true,
    contentType: 'all',
    trigger: {
      type: 'user_behavior',
      config: {
        postsPerTimeframe: 5,
        timeframeMinutes: 10,
      },
    },
    action: {
      type: 'rate_limit',
      config: {
        cooldownMinutes: 30,
        message: 'You\'re posting too quickly. Please wait before posting again.',
      },
    },
    performance: {
      triggered: 8,
      falsePositives: 1,
      accuracy: 87.5,
    },
    createdAt: '2025-11-10',
  },
  {
    id: '5',
    name: 'Auto-Approve Trusted Users',
    description: 'Auto-approve content from users with high reputation (>500)',
    isActive: false,
    contentType: 'all',
    trigger: {
      type: 'user_behavior',
      config: {
        reputationMin: 500,
        previousFlags: 0,
      },
    },
    action: {
      type: 'auto_approve',
      config: {
        skipModeration: true,
      },
    },
    performance: {
      triggered: 234,
      falsePositives: 0,
      accuracy: 100,
    },
    createdAt: '2025-09-15',
  },
];

const ruleTemplates = [
  {
    id: 't1',
    name: 'Block Profanity',
    description: 'Auto-flag or reject content containing profanity',
    category: 'Content Safety',
  },
  {
    id: 't2',
    name: 'Prevent Link Spam',
    description: 'Flag posts with multiple external links',
    category: 'Spam Prevention',
  },
  {
    id: 't3',
    name: 'Duplicate Content',
    description: 'Detect and flag duplicate posts',
    category: 'Content Quality',
  },
  {
    id: 't4',
    name: 'Suspicious Images',
    description: 'Flag images detected as potentially inappropriate',
    category: 'Media Moderation',
  },
];

function RuleCard({ rule, onToggle, onEdit, onDelete }: { rule: Rule; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  const getTriggerLabel = (type: TriggerType): string => {
    const labels: Record<TriggerType, string> = {
      content_keywords: 'Content Keywords',
      user_behavior: 'User Behavior',
      external_links: 'External Links',
      spam_pattern: 'Spam Pattern',
      toxicity_score: 'Toxicity Score',
      new_user: 'New User',
    };
    return labels[type];
  };

  const getActionLabel = (type: ActionType): string => {
    const labels: Record<ActionType, string> = {
      auto_approve: 'Auto Approve',
      auto_reject: 'Auto Reject',
      flag_for_review: 'Flag for Review',
      warn_user: 'Warn User',
      rate_limit: 'Rate Limit',
    };
    return labels[type];
  };

  return (
    <div className={`${styles.ruleCard} ${!rule.isActive ? styles.inactive : ''}`}>
      <div className={styles.ruleHeader}>
        <div className={styles.ruleInfo}>
          <div className={styles.ruleTitleRow}>
            <h3 className={styles.ruleTitle}>{rule.name}</h3>
            <button
              className={`${styles.toggleButton} ${rule.isActive ? styles.active : ''}`}
              onClick={onToggle}
              title={rule.isActive ? 'Disable rule' : 'Enable rule'}
            >
              {rule.isActive ? <Eye /> : <EyeOff />}
              <span>{rule.isActive ? 'Active' : 'Inactive'}</span>
            </button>
          </div>
          <p className={styles.ruleDescription}>{rule.description}</p>
        </div>
      </div>

      <div className={styles.ruleDetails}>
        <div className={styles.ruleFlow}>
          <div className={styles.flowStep}>
            <div className={styles.flowLabel}>When</div>
            <div className={styles.flowValue}>
              <Filter className={styles.flowIcon} />
              {getTriggerLabel(rule.trigger.type)}
            </div>
          </div>
          <div className={styles.flowArrow}>→</div>
          <div className={styles.flowStep}>
            <div className={styles.flowLabel}>Then</div>
            <div className={styles.flowValue}>
              <Zap className={styles.flowIcon} />
              {getActionLabel(rule.action.type)}
            </div>
          </div>
          <div className={styles.flowArrow}>→</div>
          <div className={styles.flowStep}>
            <div className={styles.flowLabel}>Applies to</div>
            <div className={styles.flowValue}>
              <Shield className={styles.flowIcon} />
              {rule.contentType === 'all' ? 'All Content' : rule.contentType}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rulePerformance}>
        <div className={styles.performanceStats}>
          <div className={styles.performanceStat}>
            <span className={styles.statLabel}>Triggered</span>
            <span className={styles.statValue}>{rule.performance.triggered}</span>
          </div>
          <div className={styles.performanceStat}>
            <span className={styles.statLabel}>False Positives</span>
            <span className={styles.statValue}>{rule.performance.falsePositives}</span>
          </div>
          <div className={styles.performanceStat}>
            <span className={styles.statLabel}>Accuracy</span>
            <span className={`${styles.statValue} ${styles.accuracy}`}>
              {rule.performance.accuracy}%
              {rule.performance.accuracy >= 90 ? (
                <TrendingUp className={styles.trendUp} />
              ) : rule.performance.accuracy < 80 ? (
                <TrendingDown className={styles.trendDown} />
              ) : null}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.ruleActions}>
        <button className={styles.ruleActionButton} onClick={onEdit}>
          <Settings />
          Edit Rule
        </button>
        <button className={styles.ruleActionButton}>
          <Copy />
          Duplicate
        </button>
        <button className={`${styles.ruleActionButton} ${styles.danger}`} onClick={onDelete}>
          <Trash2 />
          Delete
        </button>
      </div>
    </div>
  );
}

export function AutoModerationRules() {
  const [activeRules, setActiveRules] = useState(rules);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleToggleRule = (ruleId: string) => {
    setActiveRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const handleEditRule = (ruleId: string) => {
    console.log('Edit rule:', ruleId);
    // In real implementation, open rule editor modal
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      setActiveRules(prev => prev.filter(rule => rule.id !== ruleId));
    }
  };

  const totalTriggered = activeRules.reduce((sum, rule) => sum + rule.performance.triggered, 0);
  const avgAccuracy = activeRules.reduce((sum, rule) => sum + rule.performance.accuracy, 0) / activeRules.length;

  return (
    <div className={styles.autoModeration}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Auto-Moderation Rules</h1>
          <p>Create automated rules to handle common moderation tasks</p>
        </div>
        <button className={styles.createButton}>
          <Plus />
          Create Rule
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Shield />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Active Rules</div>
            <div className={styles.statValue}>{activeRules.filter(r => r.isActive).length}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Zap />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Actions This Week</div>
            <div className={styles.statValue}>{totalTriggered}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Avg Accuracy</div>
            <div className={styles.statValue}>{avgAccuracy.toFixed(1)}%</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <AlertCircle />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Needs Review</div>
            <div className={styles.statValue}>3</div>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className={styles.templatesSection}>
        <button
          className={styles.templatesToggle}
          onClick={() => setShowTemplates(!showTemplates)}
        >
          <Zap className={styles.templateIcon} />
          <span>Use a Rule Template</span>
          <span className={styles.templateBadge}>{ruleTemplates.length} templates</span>
        </button>

        {showTemplates && (
          <div className={styles.templatesGrid}>
            {ruleTemplates.map(template => (
              <div key={template.id} className={styles.templateCard}>
                <div className={styles.templateHeader}>
                  <h4>{template.name}</h4>
                  <span className={styles.templateCategory}>{template.category}</span>
                </div>
                <p className={styles.templateDesc}>{template.description}</p>
                <button className={styles.templateButton}>
                  <Plus />
                  Use Template
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rules List */}
      <div className={styles.rulesSection}>
        <div className={styles.sectionHeader}>
          <h2>Your Rules</h2>
          <div className={styles.filters}>
            <button className={styles.filterButton}>All ({activeRules.length})</button>
            <button className={styles.filterButton}>Active ({activeRules.filter(r => r.isActive).length})</button>
            <button className={styles.filterButton}>Inactive ({activeRules.filter(r => !r.isActive).length})</button>
          </div>
        </div>

        <div className={styles.rulesList}>
          {activeRules.map(rule => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onToggle={() => handleToggleRule(rule.id)}
              onEdit={() => handleEditRule(rule.id)}
              onDelete={() => handleDeleteRule(rule.id)}
            />
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className={styles.infoBanner}>
        <CheckCircle2 className={styles.infoIcon} />
        <div className={styles.infoContent}>
          <h3>How Auto-Moderation Works</h3>
          <p>
            Rules are evaluated in order. When content matches a rule's trigger conditions, the specified action is taken automatically.
            You can monitor rule performance and adjust thresholds to improve accuracy over time.
          </p>
        </div>
      </div>
    </div>
  );
}
