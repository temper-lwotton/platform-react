'use client';

import { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  Clock,
  Sparkles,
  Edit,
  Trash2,
  Copy,
  ChevronRight,
  BarChart3,
  Award,
} from 'lucide-react';
import styles from './OnboardingFlows.module.scss';

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  order: number;
  isRequired: boolean;
  estimatedTime?: string;
  completionRate: number;
  avgTimeToComplete?: string;
}

interface OnboardingFlow {
  id: string;
  name: string;
  description: string;
  targetSegment: string;
  tasks: OnboardingTask[];
  stats: {
    totalMembers: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    avgCompletionTime: string;
    completionRate: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FlowInsight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  flowId: string;
}

// Dummy data
const onboardingFlows: OnboardingFlow[] = [
  {
    id: '1',
    name: 'New Member Welcome',
    description: 'Essential steps for all new community members',
    targetSegment: 'New Members',
    tasks: [
      {
        id: '1',
        title: 'Complete your profile',
        description: 'Add a bio, avatar, and location to help others get to know you',
        order: 1,
        isRequired: true,
        estimatedTime: '5 min',
        completionRate: 87,
        avgTimeToComplete: '6 min',
      },
      {
        id: '2',
        title: 'Introduce yourself',
        description: 'Create a post in the Introductions category',
        order: 2,
        isRequired: true,
        estimatedTime: '10 min',
        completionRate: 72,
        avgTimeToComplete: '12 min',
      },
      {
        id: '3',
        title: 'Explore the community',
        description: 'Browse at least 5 posts and like ones you find interesting',
        order: 3,
        isRequired: false,
        estimatedTime: '15 min',
        completionRate: 68,
        avgTimeToComplete: '18 min',
      },
      {
        id: '4',
        title: 'Join a discussion',
        description: 'Comment on 3 posts from other members',
        order: 4,
        isRequired: false,
        estimatedTime: '15 min',
        completionRate: 54,
        avgTimeToComplete: '22 min',
      },
      {
        id: '5',
        title: 'Follow members',
        description: 'Follow 5 members whose content interests you',
        order: 5,
        isRequired: false,
        estimatedTime: '5 min',
        completionRate: 61,
        avgTimeToComplete: '8 min',
      },
    ],
    stats: {
      totalMembers: 847,
      completed: 412,
      inProgress: 298,
      notStarted: 137,
      avgCompletionTime: '4.2 days',
      completionRate: 48.6,
    },
    isActive: true,
    createdAt: '2024-01-05',
    updatedAt: '2024-03-10',
  },
  {
    id: '2',
    name: 'Content Creator Path',
    description: 'Guide members toward becoming regular content contributors',
    targetSegment: 'Active Members',
    tasks: [
      {
        id: '1',
        title: 'Create your first post',
        description: 'Share your knowledge or experience with the community',
        order: 1,
        isRequired: true,
        estimatedTime: '20 min',
        completionRate: 92,
        avgTimeToComplete: '2 days',
      },
      {
        id: '2',
        title: 'Receive 5 likes',
        description: 'Get positive feedback on your content',
        order: 2,
        isRequired: false,
        completionRate: 78,
        avgTimeToComplete: '3 days',
      },
      {
        id: '3',
        title: 'Create 5 posts',
        description: 'Build a track record of contributions',
        order: 3,
        isRequired: true,
        estimatedTime: '2 hours',
        completionRate: 64,
        avgTimeToComplete: '12 days',
      },
      {
        id: '4',
        title: 'Earn 100 reputation',
        description: 'Build credibility through quality contributions',
        order: 4,
        isRequired: false,
        completionRate: 52,
        avgTimeToComplete: '18 days',
      },
    ],
    stats: {
      totalMembers: 423,
      completed: 187,
      inProgress: 189,
      notStarted: 47,
      avgCompletionTime: '18.5 days',
      completionRate: 44.2,
    },
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-12',
  },
  {
    id: '3',
    name: 'Community Helper',
    description: 'Encourage members to help others and build social connections',
    targetSegment: 'Power Users',
    tasks: [
      {
        id: '1',
        title: 'Help 10 members',
        description: 'Answer questions or provide helpful comments',
        order: 1,
        isRequired: true,
        completionRate: 85,
        avgTimeToComplete: '8 days',
      },
      {
        id: '2',
        title: 'Receive 5 "helpful" marks',
        description: 'Get recognized for quality assistance',
        order: 2,
        isRequired: false,
        completionRate: 71,
        avgTimeToComplete: '12 days',
      },
      {
        id: '3',
        title: 'Mentor a new member',
        description: 'Guide someone through their onboarding',
        order: 3,
        isRequired: false,
        completionRate: 43,
        avgTimeToComplete: '15 days',
      },
    ],
    stats: {
      totalMembers: 89,
      completed: 42,
      inProgress: 35,
      notStarted: 12,
      avgCompletionTime: '22.3 days',
      completionRate: 47.2,
    },
    isActive: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-03-14',
  },
];

const insights: FlowInsight[] = [
  {
    type: 'warning',
    title: 'Task Drop-off Detected',
    description: 'Only 54% of members complete "Join a discussion" in the New Member Welcome flow. Consider simplifying this task or providing better guidance.',
    flowId: '1',
  },
  {
    type: 'success',
    title: 'High Completion Rate',
    description: 'Content Creator Path has a 92% completion rate for "Create your first post". This task is resonating well with members.',
    flowId: '2',
  },
  {
    type: 'info',
    title: 'Engagement Opportunity',
    description: 'Members who complete the Community Helper flow have 3x higher retention rates. Consider promoting this flow more actively.',
    flowId: '3',
  },
];

export function OnboardingFlows() {
  const [flows] = useState<OnboardingFlow[]>(onboardingFlows);
  const [aiInsights] = useState<FlowInsight[]>(insights);
  const [expandedFlow, setExpandedFlow] = useState<string | null>(flows[0].id);

  const handleCreateFlow = () => {
    console.log('Creating new onboarding flow');
  };

  const handleDuplicateFlow = (flowId: string) => {
    console.log('Duplicating flow:', flowId);
  };

  const handleEditFlow = (flowId: string) => {
    console.log('Editing flow:', flowId);
  };

  const handleDeleteFlow = (flowId: string) => {
    console.log('Deleting flow:', flowId);
  };

  const toggleFlowExpansion = (flowId: string) => {
    setExpandedFlow(expandedFlow === flowId ? null : flowId);
  };

  return (
    <div className={styles.onboarding}>
      <div className={styles.header}>
        <div>
          <h1>Onboarding Flows</h1>
          <p>Guide new members through their journey with task checklists</p>
        </div>
        <button onClick={handleCreateFlow} className={styles.createButton}>
          <Plus />
          Create Flow
        </button>
      </div>

      {/* Stats Overview */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Target />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{flows.length}</div>
            <div className={styles.statLabel}>Active Flows</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {flows.reduce((sum, f) => sum + f.stats.totalMembers, 0)}
            </div>
            <div className={styles.statLabel}>Members in Flows</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle2 />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {flows.reduce((sum, f) => sum + f.stats.completed, 0)}
            </div>
            <div className={styles.statLabel}>Completed Flows</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {Math.round(
                flows.reduce((sum, f) => sum + f.stats.completionRate, 0) / flows.length
              )}
              %
            </div>
            <div className={styles.statLabel}>Avg Completion</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <div className={styles.insightsSection}>
          <div className={styles.sectionHeader}>
            <Sparkles />
            <h2>AI Insights</h2>
          </div>
          <div className={styles.insights}>
            {aiInsights.map((insight, index) => (
              <div key={index} className={`${styles.insight} ${styles[insight.type]}`}>
                <div className={styles.insightIcon}>
                  {insight.type === 'success' && <CheckCircle2 />}
                  {insight.type === 'warning' && <AlertCircle />}
                  {insight.type === 'info' && <Sparkles />}
                </div>
                <div className={styles.insightContent}>
                  <div className={styles.insightTitle}>{insight.title}</div>
                  <div className={styles.insightDescription}>{insight.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flows List */}
      <div className={styles.flowsSection}>
        <div className={styles.sectionHeader}>
          <h2>Your Flows</h2>
        </div>

        <div className={styles.flowsList}>
          {flows.map((flow) => (
            <div key={flow.id} className={styles.flowCard}>
              {/* Flow Header */}
              <div className={styles.flowHeader}>
                <div className={styles.flowInfo}>
                  <h3>{flow.name}</h3>
                  <p>{flow.description}</p>
                  <div className={styles.flowMeta}>
                    <span className={styles.segment}>
                      <Target />
                      {flow.targetSegment}
                    </span>
                    <span className={styles.taskCount}>
                      {flow.tasks.length} tasks
                    </span>
                  </div>
                </div>
                <div className={styles.flowActions}>
                  <button onClick={() => handleDuplicateFlow(flow.id)} title="Duplicate">
                    <Copy />
                  </button>
                  <button onClick={() => handleEditFlow(flow.id)} title="Edit">
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDeleteFlow(flow.id)}
                    className={styles.danger}
                    title="Delete"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>

              {/* Flow Stats */}
              <div className={styles.flowStats}>
                <div className={styles.flowStat}>
                  <Users />
                  <div>
                    <div className={styles.statValue}>{flow.stats.totalMembers}</div>
                    <div className={styles.statLabel}>Total Members</div>
                  </div>
                </div>
                <div className={styles.flowStat}>
                  <CheckCircle2 />
                  <div>
                    <div className={styles.statValue}>{flow.stats.completed}</div>
                    <div className={styles.statLabel}>Completed</div>
                  </div>
                </div>
                <div className={styles.flowStat}>
                  <Clock />
                  <div>
                    <div className={styles.statValue}>{flow.stats.inProgress}</div>
                    <div className={styles.statLabel}>In Progress</div>
                  </div>
                </div>
                <div className={styles.flowStat}>
                  <BarChart3 />
                  <div>
                    <div className={styles.statValue}>{flow.stats.completionRate}%</div>
                    <div className={styles.statLabel}>Completion</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span>Overall Completion</span>
                  <span className={styles.progressValue}>{flow.stats.completionRate}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${flow.stats.completionRate}%` }}
                  />
                </div>
                <div className={styles.progressDetails}>
                  <span>Avg completion time: {flow.stats.avgCompletionTime}</span>
                </div>
              </div>

              {/* Tasks (Expandable) */}
              <div className={styles.tasksSection}>
                <button
                  onClick={() => toggleFlowExpansion(flow.id)}
                  className={styles.tasksToggle}
                >
                  <span>View Tasks ({flow.tasks.length})</span>
                  <ChevronRight
                    className={expandedFlow === flow.id ? styles.expanded : ''}
                  />
                </button>

                {expandedFlow === flow.id && (
                  <div className={styles.tasksList}>
                    {flow.tasks.map((task, index) => (
                      <div key={task.id} className={styles.task}>
                        <div className={styles.taskNumber}>{index + 1}</div>
                        <div className={styles.taskContent}>
                          <div className={styles.taskHeader}>
                            <div className={styles.taskTitle}>
                              {task.title}
                              {task.isRequired && (
                                <span className={styles.required}>Required</span>
                              )}
                            </div>
                            {task.estimatedTime && (
                              <div className={styles.taskTime}>
                                <Clock />
                                {task.estimatedTime}
                              </div>
                            )}
                          </div>
                          <p className={styles.taskDescription}>{task.description}</p>
                          <div className={styles.taskMetrics}>
                            <div className={styles.taskMetric}>
                              <span className={styles.metricLabel}>Completion Rate</span>
                              <div className={styles.metricBar}>
                                <div
                                  className={styles.metricFill}
                                  style={{ width: `${task.completionRate}%` }}
                                />
                              </div>
                              <span className={styles.metricValue}>{task.completionRate}%</span>
                            </div>
                            {task.avgTimeToComplete && (
                              <div className={styles.taskStat}>
                                <Award />
                                <span>Avg: {task.avgTimeToComplete}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
