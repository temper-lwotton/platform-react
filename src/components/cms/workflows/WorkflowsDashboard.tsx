'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Plus,
  Play,
  Pause,
  Settings,
  Copy,
  Trash2,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Brain,
  Users,
  FileText,
  Flag,
  Bell,
  Target,
  ArrowRight,
} from 'lucide-react';
import styles from './WorkflowsDashboard.module.scss';

type TriggerType = 'post_created' | 'user_joined' | 'post_liked' | 'comment_flagged' | 'user_inactive' | 'time_based';
type ConditionType = 'like_count' | 'user_role' | 'content_quality' | 'time_elapsed' | 'flag_count';
type ActionType = 'send_notification' | 'feature_content' | 'assign_role' | 'auto_moderate' | 'send_email' | 'create_task';

interface WorkflowStep {
  type: 'trigger' | 'condition' | 'action';
  config: any;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: {
    type: TriggerType;
    label: string;
  };
  conditions: {
    type: ConditionType;
    label: string;
  }[];
  actions: {
    type: ActionType;
    label: string;
  }[];
  stats: {
    totalExecutions: number;
    successRate: number;
    lastRun?: string;
    avgExecutionTime: string;
  };
  createdAt: string;
  category: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  estimatedImpact: string;
}

interface RecentExecution {
  id: string;
  workflowName: string;
  status: 'success' | 'failed' | 'running';
  timestamp: string;
  details: string;
}

interface AIsuggestion {
  id: string;
  title: string;
  description: string;
  rationale: string;
  confidence: 'high' | 'medium';
  template?: string;
}

// Dummy data
const workflows: Workflow[] = [
  {
    id: 'wf1',
    name: 'Auto-Feature Quality Content',
    description: 'Automatically feature posts that receive 10+ likes within 24 hours',
    isActive: true,
    trigger: {
      type: 'post_liked',
      label: 'Post receives a like',
    },
    conditions: [
      {
        type: 'like_count',
        label: 'Like count ≥ 10',
      },
      {
        type: 'time_elapsed',
        label: 'Posted within 24 hours',
      },
    ],
    actions: [
      {
        type: 'feature_content',
        label: 'Feature on homepage',
      },
      {
        type: 'send_notification',
        label: 'Notify author',
      },
    ],
    stats: {
      totalExecutions: 47,
      successRate: 97.8,
      lastRun: '2 hours ago',
      avgExecutionTime: '0.3s',
    },
    createdAt: '2025-11-01',
    category: 'Content Curation',
  },
  {
    id: 'wf2',
    name: 'New Member Welcome Journey',
    description: 'Send personalized welcome tasks to new members after 1 day if they haven\'t posted',
    isActive: true,
    trigger: {
      type: 'user_joined',
      label: 'User joins community',
    },
    conditions: [
      {
        type: 'time_elapsed',
        label: 'Wait 1 day',
      },
      {
        type: 'like_count',
        label: 'Post count = 0',
      },
    ],
    actions: [
      {
        type: 'send_email',
        label: 'Send welcome email',
      },
      {
        type: 'create_task',
        label: 'Create onboarding tasks',
      },
    ],
    stats: {
      totalExecutions: 23,
      successRate: 91.3,
      lastRun: '5 hours ago',
      avgExecutionTime: '1.2s',
    },
    createdAt: '2025-10-15',
    category: 'Onboarding',
  },
  {
    id: 'wf3',
    name: 'Moderation Escalation',
    description: 'Auto-escalate content flagged 3+ times to senior moderators',
    isActive: true,
    trigger: {
      type: 'comment_flagged',
      label: 'Content is flagged',
    },
    conditions: [
      {
        type: 'flag_count',
        label: 'Flag count ≥ 3',
      },
    ],
    actions: [
      {
        type: 'auto_moderate',
        label: 'Hide content',
      },
      {
        type: 'send_notification',
        label: 'Notify senior mods',
      },
      {
        type: 'create_task',
        label: 'Create review task',
      },
    ],
    stats: {
      totalExecutions: 15,
      successRate: 100,
      lastRun: '1 day ago',
      avgExecutionTime: '0.5s',
    },
    createdAt: '2025-11-10',
    category: 'Moderation',
  },
  {
    id: 'wf4',
    name: 'Re-engage Inactive Members',
    description: 'Send personalized engagement nudge to members inactive for 7+ days',
    isActive: false,
    trigger: {
      type: 'user_inactive',
      label: 'User inactive',
    },
    conditions: [
      {
        type: 'time_elapsed',
        label: 'Inactive for 7 days',
      },
      {
        type: 'user_role',
        label: 'Role = Member',
      },
    ],
    actions: [
      {
        type: 'send_email',
        label: 'Send re-engagement email',
      },
      {
        type: 'send_notification',
        label: 'Send in-app notification',
      },
    ],
    stats: {
      totalExecutions: 89,
      successRate: 67.4,
      lastRun: '3 days ago',
      avgExecutionTime: '0.8s',
    },
    createdAt: '2025-09-20',
    category: 'Engagement',
  },
  {
    id: 'wf5',
    name: 'Weekly Content Digest',
    description: 'Compile and send weekly digest of top content every Monday at 9am',
    isActive: true,
    trigger: {
      type: 'time_based',
      label: 'Every Monday at 9:00 AM',
    },
    conditions: [],
    actions: [
      {
        type: 'send_email',
        label: 'Send digest email',
      },
    ],
    stats: {
      totalExecutions: 12,
      successRate: 100,
      lastRun: '2 days ago',
      avgExecutionTime: '2.1s',
    },
    createdAt: '2025-10-01',
    category: 'Engagement',
  },
];

const templates: WorkflowTemplate[] = [
  {
    id: 't1',
    name: 'Auto-Promote Power Users',
    description: 'Automatically upgrade members to "Contributor" role after 50 quality posts',
    category: 'User Management',
    icon: Users,
    estimatedImpact: 'High - Encourages quality contributions',
  },
  {
    id: 't2',
    name: 'Content Cleanup',
    description: 'Archive posts with no engagement after 90 days',
    category: 'Content Management',
    icon: FileText,
    estimatedImpact: 'Medium - Keeps content fresh',
  },
  {
    id: 't3',
    name: 'Flag Pattern Detection',
    description: 'Alert admins when a user receives 3 flags within 7 days',
    category: 'Moderation',
    icon: Flag,
    estimatedImpact: 'High - Prevents repeat violations',
  },
  {
    id: 't4',
    name: 'Event Reminder',
    description: 'Send reminder notification 1 hour before events to RSVPed users',
    category: 'Engagement',
    icon: Bell,
    estimatedImpact: 'High - Increases attendance',
  },
];

const recentExecutions: RecentExecution[] = [
  {
    id: 'e1',
    workflowName: 'Auto-Feature Quality Content',
    status: 'success',
    timestamp: '2 hours ago',
    details: 'Featured post "How to Build Better Communities" (12 likes)',
  },
  {
    id: 'e2',
    workflowName: 'New Member Welcome Journey',
    status: 'success',
    timestamp: '5 hours ago',
    details: 'Sent welcome email to @new_member_2024',
  },
  {
    id: 'e3',
    workflowName: 'Moderation Escalation',
    status: 'success',
    timestamp: '1 day ago',
    details: 'Escalated flagged comment to senior moderators',
  },
  {
    id: 'e4',
    workflowName: 'Re-engage Inactive Members',
    status: 'failed',
    timestamp: '2 days ago',
    details: 'Failed to send email - invalid email address',
  },
];

const aiSuggestions: AIsuggestion[] = [
  {
    id: 's1',
    title: 'Create "Feature Trending Discussions" Workflow',
    description: 'Your analytics show discussions get 3x more engagement than posts. Create a workflow to auto-feature discussions with 5+ comments.',
    rationale: 'Based on your Content Analytics, discussions drive the most engagement. Featuring trending discussions could increase overall community activity by ~25%.',
    confidence: 'high',
    template: 't1',
  },
  {
    id: 's2',
    title: 'Improve "Re-engage Inactive Members" Success Rate',
    description: 'This workflow has a 67% success rate. Consider adding a condition to only target users who were previously active.',
    rationale: 'Users who never engaged are less likely to respond. Focusing on previously-active members could improve success rate to ~85%.',
    confidence: 'medium',
  },
];

function WorkflowCard({ workflow, onToggle, onEdit, onDelete }: { workflow: Workflow; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className={`${styles.workflowCard} ${!workflow.isActive ? styles.inactive : ''}`}>
      <div className={styles.workflowHeader}>
        <div className={styles.workflowInfo}>
          <div className={styles.workflowTitleRow}>
            <h3 className={styles.workflowTitle}>{workflow.name}</h3>
            <button
              className={`${styles.toggleButton} ${workflow.isActive ? styles.active : ''}`}
              onClick={onToggle}
            >
              {workflow.isActive ? <Play /> : <Pause />}
              <span>{workflow.isActive ? 'Active' : 'Paused'}</span>
            </button>
          </div>
          <p className={styles.workflowDescription}>{workflow.description}</p>
          <span className={styles.workflowCategory}>{workflow.category}</span>
        </div>
      </div>

      {/* Visual Flow */}
      <div className={styles.workflowFlow}>
        <div className={styles.flowStep}>
          <div className={styles.flowIcon}>
            <Zap />
          </div>
          <div className={styles.flowContent}>
            <div className={styles.flowLabel}>When</div>
            <div className={styles.flowValue}>{workflow.trigger.label}</div>
          </div>
        </div>

        <ArrowRight className={styles.flowArrow} />

        {workflow.conditions.length > 0 && (
          <>
            <div className={styles.flowStep}>
              <div className={styles.flowIcon}>
                <Target />
              </div>
              <div className={styles.flowContent}>
                <div className={styles.flowLabel}>If</div>
                <div className={styles.flowConditions}>
                  {workflow.conditions.map((cond, idx) => (
                    <div key={idx} className={styles.flowValue}>{cond.label}</div>
                  ))}
                </div>
              </div>
            </div>
            <ArrowRight className={styles.flowArrow} />
          </>
        )}

        <div className={styles.flowStep}>
          <div className={styles.flowIcon}>
            <CheckCircle2 />
          </div>
          <div className={styles.flowContent}>
            <div className={styles.flowLabel}>Then</div>
            <div className={styles.flowActions}>
              {workflow.actions.map((action, idx) => (
                <div key={idx} className={styles.flowValue}>{action.label}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.workflowStats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Executions</span>
          <span className={styles.statValue}>{workflow.stats.totalExecutions}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Success Rate</span>
          <span className={`${styles.statValue} ${workflow.stats.successRate >= 90 ? styles.success : ''}`}>
            {workflow.stats.successRate}%
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Last Run</span>
          <span className={styles.statValue}>{workflow.stats.lastRun || 'Never'}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Avg Time</span>
          <span className={styles.statValue}>{workflow.stats.avgExecutionTime}</span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.workflowActions}>
        <button className={styles.actionButton} onClick={onEdit}>
          <Settings />
          Edit
        </button>
        <button className={styles.actionButton}>
          <Copy />
          Duplicate
        </button>
        <button className={`${styles.actionButton} ${styles.danger}`} onClick={onDelete}>
          <Trash2 />
          Delete
        </button>
      </div>
    </div>
  );
}

export function WorkflowsDashboard() {
  const router = useRouter();
  const [activeWorkflows, setActiveWorkflows] = useState(workflows);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleToggleWorkflow = (id: string) => {
    setActiveWorkflows(prev =>
      prev.map(wf => wf.id === id ? { ...wf, isActive: !wf.isActive } : wf)
    );
  };

  const handleEditWorkflow = (id: string) => {
    console.log('Edit workflow:', id);
    // Navigate to builder
  };

  const handleDeleteWorkflow = (id: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      setActiveWorkflows(prev => prev.filter(wf => wf.id !== id));
    }
  };

  const activeCount = activeWorkflows.filter(wf => wf.isActive).length;
  const totalExecutions = activeWorkflows.reduce((sum, wf) => sum + wf.stats.totalExecutions, 0);
  const avgSuccessRate = activeWorkflows.reduce((sum, wf) => sum + wf.stats.successRate, 0) / activeWorkflows.length;

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Automation & Workflows</h1>
          <p>Create automated workflows to manage your community intelligently</p>
        </div>
        <button className={styles.createButton} onClick={() => router.push('/admin/workflows/new')}>
          <Plus />
          Create Workflow
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Zap className={styles.statIcon} />
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Active Workflows</div>
            <div className={styles.statValue}>{activeCount}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <TrendingUp className={styles.statIcon} />
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Executions</div>
            <div className={styles.statValue}>{totalExecutions}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <CheckCircle2 className={styles.statIcon} />
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Avg Success Rate</div>
            <div className={styles.statValue}>{avgSuccessRate.toFixed(1)}%</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <Clock className={styles.statIcon} />
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Time Saved</div>
            <div className={styles.statValue}>~12 hrs/wk</div>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      {showSuggestions && aiSuggestions.length > 0 && (
        <div className={styles.suggestionsSection}>
          <div className={styles.suggestionBanner}>
            <Brain className={styles.suggestionIcon} />
            <h2>AI-Powered Suggestions</h2>
            <button
              className={styles.dismissButton}
              onClick={() => setShowSuggestions(false)}
            >
              ×
            </button>
          </div>
          <div className={styles.suggestionsGrid}>
            {aiSuggestions.map(suggestion => (
              <div key={suggestion.id} className={styles.suggestionCard}>
                <div className={styles.suggestionHeader}>
                  <Sparkles className={styles.sparkleIcon} />
                  <span className={`${styles.confidenceBadge} ${styles[suggestion.confidence]}`}>
                    {suggestion.confidence} confidence
                  </span>
                </div>
                <h3 className={styles.suggestionTitle}>{suggestion.title}</h3>
                <p className={styles.suggestionDescription}>{suggestion.description}</p>
                <div className={styles.suggestionRationale}>
                  <strong>Why:</strong> {suggestion.rationale}
                </div>
                <button className={styles.suggestionButton}>
                  <Plus />
                  Create This Workflow
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates */}
      <div className={styles.templatesSection}>
        <button
          className={styles.templatesToggle}
          onClick={() => setShowTemplates(!showTemplates)}
        >
          <Sparkles />
          <span>Workflow Templates</span>
          <span className={styles.templateCount}>{templates.length} templates</span>
          <ChevronRight className={`${styles.chevron} ${showTemplates ? styles.open : ''}`} />
        </button>

        {showTemplates && (
          <div className={styles.templatesGrid}>
            {templates.map(template => {
              const Icon = template.icon;
              return (
                <div key={template.id} className={styles.templateCard}>
                  <div className={styles.templateIcon}>
                    <Icon />
                  </div>
                  <h4 className={styles.templateName}>{template.name}</h4>
                  <p className={styles.templateDescription}>{template.description}</p>
                  <div className={styles.templateImpact}>{template.estimatedImpact}</div>
                  <button className={styles.templateButton}>
                    <Plus />
                    Use Template
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className={styles.activitySection}>
        <h2>Recent Executions</h2>
        <div className={styles.executionsList}>
          {recentExecutions.map(exec => (
            <div key={exec.id} className={`${styles.executionItem} ${styles[exec.status]}`}>
              <div className={styles.executionStatus}>
                {exec.status === 'success' && <CheckCircle2 />}
                {exec.status === 'failed' && <XCircle />}
                {exec.status === 'running' && <Clock />}
              </div>
              <div className={styles.executionContent}>
                <div className={styles.executionHeader}>
                  <span className={styles.executionName}>{exec.workflowName}</span>
                  <span className={styles.executionTime}>{exec.timestamp}</span>
                </div>
                <p className={styles.executionDetails}>{exec.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflows List */}
      <div className={styles.workflowsSection}>
        <h2>Your Workflows</h2>
        <div className={styles.workflowsList}>
          {activeWorkflows.map(workflow => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onToggle={() => handleToggleWorkflow(workflow.id)}
              onEdit={() => handleEditWorkflow(workflow.id)}
              onDelete={() => handleDeleteWorkflow(workflow.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
