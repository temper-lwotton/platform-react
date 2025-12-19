'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  MoreVertical,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Activity,
  Users,
  Heart,
  MessageCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Ban,
  Edit,
  Trash2,
} from 'lucide-react';
import styles from './MemberProfile.module.scss';

interface MemberProfileProps {
  memberId: string;
}

type LifecycleStage = 'new' | 'active' | 'power_user' | 'champion' | 'at_risk' | 'inactive';
type MemberRole = 'admin' | 'moderator' | 'member';

interface ActivityItem {
  id: string;
  type: 'post' | 'comment' | 'like' | 'join' | 'achievement' | 'milestone';
  title: string;
  description?: string;
  timestamp: string;
  metadata?: {
    postTitle?: string;
    commentCount?: number;
    achievementName?: string;
  };
}

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: MemberRole;
  lifecycleStage: LifecycleStage;
  joinedDate: string;
  lastActive: string;
  bio?: string;
  location?: string;
  website?: string;
  stats: {
    posts: number;
    comments: number;
    likes: number;
    likesReceived: number;
    followers: number;
    following: number;
    reputation: number;
  };
  engagementScore: number;
  onboardingProgress: number;
  onboardingTasks?: OnboardingTask[];
  tags: string[];
  activityTimeline: ActivityItem[];
}

// Dummy data - replace with API call
const getMemberData = (id: string): Member => {
  return {
    id,
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: undefined,
    role: 'member',
    lifecycleStage: 'power_user',
    joinedDate: '2024-01-15',
    lastActive: '2 hours ago',
    bio: 'Product designer passionate about building delightful user experiences. Always learning, always creating.',
    location: 'San Francisco, CA',
    website: 'sarahchen.design',
    stats: {
      posts: 47,
      comments: 234,
      likes: 156,
      likesReceived: 892,
      followers: 89,
      following: 124,
      reputation: 2847,
    },
    engagementScore: 87,
    onboardingProgress: 100,
    onboardingTasks: [
      {
        id: '1',
        title: 'Complete your profile',
        description: 'Add a bio, avatar, and location',
        completed: true,
        completedAt: '2024-01-15',
      },
      {
        id: '2',
        title: 'Make your first post',
        description: 'Share something with the community',
        completed: true,
        completedAt: '2024-01-16',
      },
      {
        id: '3',
        title: 'Join 3 discussions',
        description: 'Comment on posts from other members',
        completed: true,
        completedAt: '2024-01-18',
      },
      {
        id: '4',
        title: 'Follow 5 members',
        description: 'Build your network',
        completed: true,
        completedAt: '2024-01-20',
      },
    ],
    tags: ['Design', 'Product', 'UX Research', 'Active Contributor'],
    activityTimeline: [
      {
        id: '1',
        type: 'post',
        title: 'Created a new post',
        description: 'Sharing my design process for mobile-first experiences',
        timestamp: '2 hours ago',
        metadata: { postTitle: 'Mobile-First Design Principles' },
      },
      {
        id: '2',
        type: 'comment',
        title: 'Commented on a discussion',
        description: 'Great insights on user research!',
        timestamp: '5 hours ago',
        metadata: { postTitle: 'User Research Best Practices' },
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Earned an achievement',
        description: 'Reached 50 posts milestone',
        timestamp: '1 day ago',
        metadata: { achievementName: 'Prolific Creator' },
      },
      {
        id: '4',
        type: 'like',
        title: 'Liked 5 posts',
        timestamp: '1 day ago',
      },
      {
        id: '5',
        type: 'post',
        title: 'Created a new post',
        description: 'My experience with design systems',
        timestamp: '2 days ago',
        metadata: { postTitle: 'Building Scalable Design Systems' },
      },
      {
        id: '6',
        type: 'milestone',
        title: 'Reached 2,500 reputation',
        description: 'Recognized as a trusted community member',
        timestamp: '3 days ago',
      },
      {
        id: '7',
        type: 'comment',
        title: 'Commented on 3 discussions',
        timestamp: '3 days ago',
      },
      {
        id: '8',
        type: 'post',
        title: 'Created a new post',
        description: 'Exploring AI in design workflows',
        timestamp: '5 days ago',
        metadata: { postTitle: 'AI-Powered Design Tools' },
      },
    ],
  };
};

const lifecycleLabels: Record<LifecycleStage, string> = {
  new: 'New Member',
  active: 'Active',
  power_user: 'Power User',
  champion: 'Champion',
  at_risk: 'At Risk',
  inactive: 'Inactive',
};

const roleLabels: Record<MemberRole, string> = {
  admin: 'Admin',
  moderator: 'Moderator',
  member: 'Member',
};

const activityIcons = {
  post: FileText,
  comment: MessageCircle,
  like: Heart,
  join: Users,
  achievement: Award,
  milestone: Target,
};

export function MemberProfile({ memberId }: MemberProfileProps) {
  const router = useRouter();
  const [member] = useState<Member>(getMemberData(memberId));
  const [showActions, setShowActions] = useState(false);

  const handleBack = () => {
    router.push('/admin/members');
  };

  const handleSendEmail = () => {
    console.log('Send email to', member.email);
  };

  const handleSendMessage = () => {
    console.log('Send message to', member.name);
  };

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className={styles.profile}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          <ArrowLeft />
          <span>Back to Members</span>
        </button>

        <div className={styles.headerActions}>
          <button onClick={handleSendEmail} className={styles.actionButton}>
            <Mail />
            <span>Send Email</span>
          </button>
          <button onClick={handleSendMessage} className={styles.actionButton}>
            <MessageSquare />
            <span>Message</span>
          </button>
          <div className={styles.moreActions}>
            <button
              onClick={() => setShowActions(!showActions)}
              className={styles.moreButton}
            >
              <MoreVertical />
            </button>
            {showActions && (
              <div className={styles.actionsMenu}>
                <button>
                  <Edit />
                  Edit Member
                </button>
                <button>
                  <Ban />
                  Suspend Account
                </button>
                <button className={styles.danger}>
                  <Trash2 />
                  Delete Member
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Left Column */}
        <div className={styles.mainColumn}>
          {/* Profile Card */}
          <div className={styles.card}>
            <div className={styles.profileHeader}>
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className={styles.avatar} />
              ) : (
                <div className={styles.initials}>{initials}</div>
              )}
              <div className={styles.profileInfo}>
                <h1>{member.name}</h1>
                <p className={styles.email}>{member.email}</p>
                {member.bio && <p className={styles.bio}>{member.bio}</p>}
                {(member.location || member.website) && (
                  <div className={styles.metadata}>
                    {member.location && <span>{member.location}</span>}
                    {member.website && (
                      <a href={`https://${member.website}`} target="_blank" rel="noopener noreferrer">
                        {member.website}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.badges}>
              <div className={`${styles.badge} ${styles[`lifecycle${member.lifecycleStage.replace('_', '')}`]}`}>
                {lifecycleLabels[member.lifecycleStage]}
              </div>
              <div className={`${styles.badge} ${styles[`role${member.role}`]}`}>
                {roleLabels[member.role]}
              </div>
            </div>

            <div className={styles.tags}>
              {member.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Activity />
              Member Statistics
            </h2>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <FileText />
                <div>
                  <div className={styles.statValue}>{member.stats.posts}</div>
                  <div className={styles.statLabel}>Posts</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <MessageCircle />
                <div>
                  <div className={styles.statValue}>{member.stats.comments}</div>
                  <div className={styles.statLabel}>Comments</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <Heart />
                <div>
                  <div className={styles.statValue}>{member.stats.likes}</div>
                  <div className={styles.statLabel}>Likes Given</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <Heart />
                <div>
                  <div className={styles.statValue}>{member.stats.likesReceived}</div>
                  <div className={styles.statLabel}>Likes Received</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <Users />
                <div>
                  <div className={styles.statValue}>{member.stats.followers}</div>
                  <div className={styles.statLabel}>Followers</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <Users />
                <div>
                  <div className={styles.statValue}>{member.stats.following}</div>
                  <div className={styles.statLabel}>Following</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <Award />
                <div>
                  <div className={styles.statValue}>{member.stats.reputation}</div>
                  <div className={styles.statLabel}>Reputation</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <TrendingUp />
                <div>
                  <div className={styles.statValue}>{member.engagementScore}%</div>
                  <div className={styles.statLabel}>Engagement</div>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Score */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <TrendingUp />
              Engagement Score
            </h2>
            <div className={styles.engagementViz}>
              <div className={styles.scoreCircle}>
                <svg viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(member.engagementScore / 100) * 534} 534`}
                    transform="rotate(-90 100 100)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className={styles.scoreValue}>{member.engagementScore}%</div>
              </div>
              <div className={styles.scoreBreakdown}>
                <div className={styles.scoreItem}>
                  <div className={styles.scoreItemLabel}>Activity Frequency</div>
                  <div className={styles.scoreItemBar}>
                    <div className={styles.scoreItemFill} style={{ width: '92%' }} />
                  </div>
                  <div className={styles.scoreItemValue}>92%</div>
                </div>
                <div className={styles.scoreItem}>
                  <div className={styles.scoreItemLabel}>Content Quality</div>
                  <div className={styles.scoreItemBar}>
                    <div className={styles.scoreItemFill} style={{ width: '88%' }} />
                  </div>
                  <div className={styles.scoreItemValue}>88%</div>
                </div>
                <div className={styles.scoreItem}>
                  <div className={styles.scoreItemLabel}>Community Interaction</div>
                  <div className={styles.scoreItemBar}>
                    <div className={styles.scoreItemFill} style={{ width: '85%' }} />
                  </div>
                  <div className={styles.scoreItemValue}>85%</div>
                </div>
                <div className={styles.scoreItem}>
                  <div className={styles.scoreItemLabel}>Consistency</div>
                  <div className={styles.scoreItemBar}>
                    <div className={styles.scoreItemFill} style={{ width: '83%' }} />
                  </div>
                  <div className={styles.scoreItemValue}>83%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Clock />
              Activity Timeline
            </h2>
            <div className={styles.timeline}>
              {member.activityTimeline.map((item) => {
                const Icon = activityIcons[item.type];
                return (
                  <div key={item.id} className={styles.timelineItem}>
                    <div className={styles.timelineIcon}>
                      <Icon />
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineTitle}>{item.title}</div>
                      {item.description && (
                        <div className={styles.timelineDescription}>{item.description}</div>
                      )}
                      {item.metadata?.postTitle && (
                        <div className={styles.timelineMetadata}>
                          Post: {item.metadata.postTitle}
                        </div>
                      )}
                      {item.metadata?.achievementName && (
                        <div className={styles.timelineMetadata}>
                          Achievement: {item.metadata.achievementName}
                        </div>
                      )}
                      <div className={styles.timelineTimestamp}>{item.timestamp}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={styles.sidebar}>
          {/* Quick Info */}
          <div className={styles.card}>
            <h3 className={styles.sidebarTitle}>Quick Info</h3>
            <div className={styles.quickInfo}>
              <div className={styles.infoItem}>
                <Calendar />
                <div>
                  <div className={styles.infoLabel}>Joined</div>
                  <div className={styles.infoValue}>{member.joinedDate}</div>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Activity />
                <div>
                  <div className={styles.infoLabel}>Last Active</div>
                  <div className={styles.infoValue}>{member.lastActive}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Onboarding Progress */}
          {member.onboardingTasks && (
            <div className={styles.card}>
              <h3 className={styles.sidebarTitle}>Onboarding Progress</h3>
              <div className={styles.progressHeader}>
                <span>{member.onboardingProgress}% Complete</span>
                <span className={styles.taskCount}>
                  {member.onboardingTasks.filter((t) => t.completed).length}/
                  {member.onboardingTasks.length}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${member.onboardingProgress}%` }}
                />
              </div>
              <div className={styles.onboardingTasks}>
                {member.onboardingTasks.map((task) => (
                  <div key={task.id} className={styles.task}>
                    {task.completed ? (
                      <CheckCircle2 className={styles.taskComplete} />
                    ) : (
                      <AlertCircle className={styles.taskIncomplete} />
                    )}
                    <div className={styles.taskInfo}>
                      <div className={styles.taskTitle}>{task.title}</div>
                      <div className={styles.taskDescription}>{task.description}</div>
                      {task.completedAt && (
                        <div className={styles.taskCompleted}>
                          Completed {task.completedAt}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          <div className={styles.card}>
            <h3 className={styles.sidebarTitle}>AI Insights</h3>
            <div className={styles.insights}>
              <div className={styles.insight}>
                <div className={styles.insightIcon}>
                  <TrendingUp />
                </div>
                <div className={styles.insightContent}>
                  <div className={styles.insightTitle}>High Engagement</div>
                  <div className={styles.insightDescription}>
                    Posts regularly and receives positive community feedback
                  </div>
                </div>
              </div>
              <div className={styles.insight}>
                <div className={styles.insightIcon}>
                  <Award />
                </div>
                <div className={styles.insightContent}>
                  <div className={styles.insightTitle}>Quality Contributor</div>
                  <div className={styles.insightDescription}>
                    Content consistently receives high engagement rates
                  </div>
                </div>
              </div>
              <div className={styles.insight}>
                <div className={styles.insightIcon}>
                  <Users />
                </div>
                <div className={styles.insightContent}>
                  <div className={styles.insightTitle}>Community Builder</div>
                  <div className={styles.insightDescription}>
                    Actively engages with and supports other members
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
