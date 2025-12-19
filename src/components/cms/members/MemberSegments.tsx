'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Plus,
  TrendingUp,
  Clock,
  Target,
  AlertCircle,
  Sparkles,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
} from 'lucide-react';
import styles from './MemberSegments.module.scss';

interface SegmentRule {
  field: string;
  operator: string;
  value: string | number;
}

interface Segment {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  memberCount: number;
  rules: SegmentRule[];
  isAuto: boolean;
  createdAt: string;
  updatedAt: string;
  performance: {
    engagementRate: number;
    retentionRate: number;
    growthRate: number;
  };
}

interface SuggestedSegment {
  name: string;
  description: string;
  reason: string;
  potentialMembers: number;
  confidence: 'high' | 'medium';
  rules: SegmentRule[];
}

// Dummy data
const segments: Segment[] = [
  {
    id: '1',
    name: 'Power Users',
    description: 'Highly active members who post regularly and engage with the community',
    color: '#8b5cf6',
    icon: 'award',
    memberCount: 47,
    rules: [
      { field: 'posts', operator: 'greater_than', value: 20 },
      { field: 'engagement_score', operator: 'greater_than', value: 75 },
      { field: 'days_active', operator: 'greater_than', value: 30 },
    ],
    isAuto: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-03-15',
    performance: {
      engagementRate: 92,
      retentionRate: 95,
      growthRate: 12,
    },
  },
  {
    id: '2',
    name: 'New Members',
    description: 'Recently joined members in their first 30 days',
    color: '#22c55e',
    icon: 'user-plus',
    memberCount: 124,
    rules: [
      { field: 'days_since_joined', operator: 'less_than', value: 30 },
    ],
    isAuto: true,
    createdAt: '2024-01-05',
    updatedAt: '2024-03-18',
    performance: {
      engagementRate: 68,
      retentionRate: 72,
      growthRate: 45,
    },
  },
  {
    id: '3',
    name: 'At Risk',
    description: 'Previously active members showing declining engagement',
    color: '#f97316',
    icon: 'alert-circle',
    memberCount: 32,
    rules: [
      { field: 'engagement_score', operator: 'less_than', value: 40 },
      { field: 'days_since_last_post', operator: 'greater_than', value: 14 },
      { field: 'previous_engagement_score', operator: 'greater_than', value: 60 },
    ],
    isAuto: true,
    createdAt: '2024-01-12',
    updatedAt: '2024-03-18',
    performance: {
      engagementRate: 28,
      retentionRate: 45,
      growthRate: -8,
    },
  },
  {
    id: '4',
    name: 'Content Creators',
    description: 'Members who primarily create original content',
    color: '#06b6d4',
    icon: 'pen-tool',
    memberCount: 89,
    rules: [
      { field: 'posts', operator: 'greater_than', value: 10 },
      { field: 'post_to_comment_ratio', operator: 'greater_than', value: 0.5 },
    ],
    isAuto: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-03-17',
    performance: {
      engagementRate: 85,
      retentionRate: 88,
      growthRate: 18,
    },
  },
  {
    id: '5',
    name: 'Champions',
    description: 'Top contributors with exceptional community impact',
    color: '#eab308',
    icon: 'trophy',
    memberCount: 18,
    rules: [
      { field: 'reputation', operator: 'greater_than', value: 2500 },
      { field: 'engagement_score', operator: 'greater_than', value: 85 },
      { field: 'helpful_count', operator: 'greater_than', value: 50 },
    ],
    isAuto: true,
    createdAt: '2024-01-08',
    updatedAt: '2024-03-16',
    performance: {
      engagementRate: 96,
      retentionRate: 98,
      growthRate: 5,
    },
  },
];

const suggestedSegments: SuggestedSegment[] = [
  {
    name: 'Weekend Warriors',
    description: 'Members who are most active on weekends',
    reason: 'I noticed 156 members show peak activity on Saturdays and Sundays. Targeting them with weekend-specific content could boost engagement.',
    potentialMembers: 156,
    confidence: 'high',
    rules: [
      { field: 'weekend_activity_percentage', operator: 'greater_than', value: 60 },
      { field: 'posts', operator: 'greater_than', value: 5 },
    ],
  },
  {
    name: 'Question Askers',
    description: 'Members who frequently ask questions but rarely answer',
    reason: 'There are 89 members who ask questions but could be encouraged to help others. This could create a mentorship opportunity.',
    potentialMembers: 89,
    confidence: 'high',
    rules: [
      { field: 'questions_asked', operator: 'greater_than', value: 10 },
      { field: 'answers_given', operator: 'less_than', value: 3 },
    ],
  },
  {
    name: 'Silent Observers',
    description: 'Active readers who rarely post or comment',
    reason: 'These 234 members visit regularly but don\'t contribute. They might need encouragement or simpler ways to participate.',
    potentialMembers: 234,
    confidence: 'medium',
    rules: [
      { field: 'days_active', operator: 'greater_than', value: 30 },
      { field: 'page_views', operator: 'greater_than', value: 100 },
      { field: 'posts', operator: 'less_than', value: 3 },
    ],
  },
];

const fieldOptions = [
  { value: 'posts', label: 'Posts Created' },
  { value: 'comments', label: 'Comments' },
  { value: 'engagement_score', label: 'Engagement Score' },
  { value: 'days_since_joined', label: 'Days Since Joined' },
  { value: 'days_since_last_post', label: 'Days Since Last Post' },
  { value: 'reputation', label: 'Reputation' },
  { value: 'page_views', label: 'Page Views' },
  { value: 'weekend_activity_percentage', label: 'Weekend Activity %' },
  { value: 'post_to_comment_ratio', label: 'Post to Comment Ratio' },
  { value: 'helpful_count', label: 'Helpful Marks' },
];

const operatorOptions = [
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
  { value: 'equal_to', label: 'Equal to' },
  { value: 'between', label: 'Between' },
];

export function MemberSegments() {
  const router = useRouter();
  const [activeSegments] = useState<Segment[]>(segments);
  const [suggestions] = useState<SuggestedSegment[]>(suggestedSegments);
  const [showBuilder, setShowBuilder] = useState(false);

  const handleCreateSegment = () => {
    setShowBuilder(true);
  };

  const handleViewSegment = (segmentId: string) => {
    router.push(`/admin/members?segment=${segmentId}`);
  };

  const handleCreateFromSuggestion = (suggestion: SuggestedSegment) => {
    console.log('Creating segment from suggestion:', suggestion);
    alert(`Creating segment "${suggestion.name}" with ${suggestion.potentialMembers} potential members`);
  };

  return (
    <div className={styles.segments}>
      <div className={styles.header}>
        <div>
          <h1>Member Segments</h1>
          <p>Auto-group members based on behavior, engagement, and lifecycle stage</p>
        </div>
        <button onClick={handleCreateSegment} className={styles.createButton}>
          <Plus />
          Create Segment
        </button>
      </div>

      {/* Stats Overview */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{activeSegments.length}</div>
            <div className={styles.statLabel}>Active Segments</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Target />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {activeSegments.reduce((sum, s) => sum + s.memberCount, 0)}
            </div>
            <div className={styles.statLabel}>Total Members Segmented</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {Math.round(
                activeSegments.reduce((sum, s) => sum + s.performance.engagementRate, 0) /
                  activeSegments.length
              )}
              %
            </div>
            <div className={styles.statLabel}>Avg Engagement Rate</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Sparkles />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{suggestions.length}</div>
            <div className={styles.statLabel}>AI Suggestions</div>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className={styles.suggestionsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Sparkles />
              <h2>AI-Suggested Segments</h2>
            </div>
            <p className={styles.sectionSubtitle}>
              I analyzed member behavior patterns and found these opportunities
            </p>
          </div>

          <div className={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <div key={index} className={styles.suggestion}>
                <div className={styles.suggestionHeader}>
                  <div>
                    <h3>{suggestion.name}</h3>
                    <p className={styles.suggestionDescription}>{suggestion.description}</p>
                  </div>
                  <div className={`${styles.confidence} ${styles[suggestion.confidence]}`}>
                    {suggestion.confidence} confidence
                  </div>
                </div>

                <div className={styles.suggestionReason}>
                  <Sparkles />
                  <p>{suggestion.reason}</p>
                </div>

                <div className={styles.suggestionMeta}>
                  <div className={styles.memberCount}>
                    <Users />
                    <span>{suggestion.potentialMembers} potential members</span>
                  </div>
                  <button
                    onClick={() => handleCreateFromSuggestion(suggestion)}
                    className={styles.createFromSuggestion}
                  >
                    Create Segment
                    <ChevronRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Segments */}
      <div className={styles.segmentsSection}>
        <div className={styles.sectionHeader}>
          <h2>Active Segments</h2>
          <p className={styles.sectionSubtitle}>
            {activeSegments.length} segments automatically grouping members
          </p>
        </div>

        <div className={styles.segmentsList}>
          {activeSegments.map((segment) => (
            <div key={segment.id} className={styles.segmentCard}>
              <div className={styles.segmentHeader}>
                <div className={styles.segmentIcon} style={{ background: segment.color }}>
                  {segment.icon === 'award' && <Target />}
                  {segment.icon === 'user-plus' && <Users />}
                  {segment.icon === 'alert-circle' && <AlertCircle />}
                  {segment.icon === 'pen-tool' && <Edit />}
                  {segment.icon === 'trophy' && <TrendingUp />}
                </div>
                <div className={styles.segmentInfo}>
                  <div className={styles.segmentName}>
                    {segment.name}
                    {segment.isAuto && (
                      <span className={styles.autoBadge}>
                        <Sparkles />
                        Auto
                      </span>
                    )}
                  </div>
                  <p className={styles.segmentDescription}>{segment.description}</p>
                </div>
                <div className={styles.segmentActions}>
                  <button onClick={() => handleViewSegment(segment.id)}>
                    <Eye />
                  </button>
                  <button>
                    <Edit />
                  </button>
                  <button className={styles.danger}>
                    <Trash2 />
                  </button>
                </div>
              </div>

              <div className={styles.segmentRules}>
                <div className={styles.rulesHeader}>
                  <span>Rules ({segment.rules.length})</span>
                </div>
                <div className={styles.rulesList}>
                  {segment.rules.map((rule, index) => (
                    <div key={index} className={styles.rule}>
                      <span className={styles.ruleField}>
                        {fieldOptions.find((f) => f.value === rule.field)?.label || rule.field}
                      </span>
                      <span className={styles.ruleOperator}>
                        {operatorOptions.find((o) => o.value === rule.operator)?.label ||
                          rule.operator}
                      </span>
                      <span className={styles.ruleValue}>{rule.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.segmentStats}>
                <div className={styles.segmentStat}>
                  <Users />
                  <div>
                    <div className={styles.statValue}>{segment.memberCount}</div>
                    <div className={styles.statLabel}>Members</div>
                  </div>
                </div>
                <div className={styles.segmentStat}>
                  <TrendingUp />
                  <div>
                    <div className={styles.statValue}>{segment.performance.engagementRate}%</div>
                    <div className={styles.statLabel}>Engagement</div>
                  </div>
                </div>
                <div className={styles.segmentStat}>
                  <Target />
                  <div>
                    <div className={styles.statValue}>{segment.performance.retentionRate}%</div>
                    <div className={styles.statLabel}>Retention</div>
                  </div>
                </div>
                <div className={styles.segmentStat}>
                  <Clock />
                  <div>
                    <div
                      className={styles.statValue}
                      style={{
                        color:
                          segment.performance.growthRate > 0
                            ? '#22c55e'
                            : segment.performance.growthRate < 0
                            ? '#ef4444'
                            : '#64748b',
                      }}
                    >
                      {segment.performance.growthRate > 0 ? '+' : ''}
                      {segment.performance.growthRate}%
                    </div>
                    <div className={styles.statLabel}>Growth</div>
                  </div>
                </div>
              </div>

              <div className={styles.segmentFooter}>
                <div className={styles.segmentMeta}>
                  <Clock />
                  <span>Updated {segment.updatedAt}</span>
                </div>
                <button
                  onClick={() => handleViewSegment(segment.id)}
                  className={styles.viewMembers}
                >
                  View Members
                  <ChevronRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
