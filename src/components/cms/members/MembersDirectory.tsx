'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Award,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  MessageSquare,
  Heart,
  Calendar,
  MoreVertical,
  UserPlus,
  Target,
  Zap,
  Shield,
  LayoutGrid,
  List,
} from 'lucide-react';
import styles from './MembersDirectory.module.scss';

type LifecycleStage = 'new' | 'active' | 'power_user' | 'at_risk' | 'inactive' | 'champion';
type MemberRole = 'admin' | 'moderator' | 'contributor' | 'member';

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: MemberRole;
  lifecycleStage: LifecycleStage;
  joinedDate: string;
  lastActive: string;
  stats: {
    posts: number;
    comments: number;
    likes: number;
    reputation: number;
  };
  engagementScore: number;
  onboardingProgress: number;
  tags: string[];
}

interface Segment {
  id: string;
  name: string;
  count: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// Dummy data
const members: Member[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'contributor',
    lifecycleStage: 'power_user',
    joinedDate: '2024-03-15',
    lastActive: '2 hours ago',
    stats: {
      posts: 127,
      comments: 453,
      likes: 892,
      reputation: 1247,
    },
    engagementScore: 94,
    onboardingProgress: 100,
    tags: ['active', 'helpful'],
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'moderator',
    lifecycleStage: 'champion',
    joinedDate: '2024-01-10',
    lastActive: '1 hour ago',
    stats: {
      posts: 89,
      comments: 678,
      likes: 1234,
      reputation: 1856,
    },
    engagementScore: 98,
    onboardingProgress: 100,
    tags: ['moderator', 'top_contributor'],
  },
  {
    id: '3',
    name: 'Emma Williams',
    email: 'emma@example.com',
    role: 'member',
    lifecycleStage: 'active',
    joinedDate: '2024-09-22',
    lastActive: '1 day ago',
    stats: {
      posts: 23,
      comments: 87,
      likes: 156,
      reputation: 342,
    },
    engagementScore: 72,
    onboardingProgress: 100,
    tags: ['regular'],
  },
  {
    id: '4',
    name: 'Alex Thompson',
    email: 'alex@example.com',
    role: 'member',
    lifecycleStage: 'new',
    joinedDate: '2025-12-17',
    lastActive: '3 hours ago',
    stats: {
      posts: 2,
      comments: 5,
      likes: 8,
      reputation: 15,
    },
    engagementScore: 45,
    onboardingProgress: 60,
    tags: ['new_user'],
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    email: 'jessica@example.com',
    role: 'member',
    lifecycleStage: 'at_risk',
    joinedDate: '2024-06-05',
    lastActive: '12 days ago',
    stats: {
      posts: 34,
      comments: 112,
      likes: 203,
      reputation: 456,
    },
    engagementScore: 38,
    onboardingProgress: 100,
    tags: ['declining'],
  },
  {
    id: '6',
    name: 'David Park',
    email: 'david@example.com',
    role: 'member',
    lifecycleStage: 'inactive',
    joinedDate: '2024-04-20',
    lastActive: '45 days ago',
    stats: {
      posts: 12,
      comments: 34,
      likes: 67,
      reputation: 123,
    },
    engagementScore: 12,
    onboardingProgress: 80,
    tags: ['inactive'],
  },
  {
    id: '7',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    role: 'contributor',
    lifecycleStage: 'power_user',
    joinedDate: '2024-02-28',
    lastActive: '5 hours ago',
    stats: {
      posts: 98,
      comments: 321,
      likes: 654,
      reputation: 987,
    },
    engagementScore: 89,
    onboardingProgress: 100,
    tags: ['active', 'content_creator'],
  },
  {
    id: '8',
    name: 'James Wilson',
    email: 'james@example.com',
    role: 'member',
    lifecycleStage: 'new',
    joinedDate: '2025-12-18',
    lastActive: '1 hour ago',
    stats: {
      posts: 0,
      comments: 3,
      likes: 5,
      reputation: 8,
    },
    engagementScore: 25,
    onboardingProgress: 40,
    tags: ['new_user', 'needs_onboarding'],
  },
];

const segments: Segment[] = [
  {
    id: 'all',
    name: 'All Members',
    count: 89,
    description: 'Everyone in the community',
    icon: Users,
    color: '#6b7280',
  },
  {
    id: 'new',
    name: 'New Members',
    count: 8,
    description: 'Joined within last 7 days',
    icon: UserPlus,
    color: '#3b82f6',
  },
  {
    id: 'active',
    name: 'Active',
    count: 45,
    description: 'Regular contributors',
    icon: TrendingUp,
    color: '#10b981',
  },
  {
    id: 'power_user',
    name: 'Power Users',
    count: 12,
    description: 'High engagement & quality',
    icon: Star,
    color: '#f59e0b',
  },
  {
    id: 'champion',
    name: 'Champions',
    count: 5,
    description: 'Community leaders',
    icon: Award,
    color: '#8b5cf6',
  },
  {
    id: 'at_risk',
    name: 'At Risk',
    count: 14,
    description: 'Declining activity',
    icon: AlertCircle,
    color: '#f59e0b',
  },
  {
    id: 'inactive',
    name: 'Inactive',
    count: 5,
    description: 'No activity > 30 days',
    icon: Clock,
    color: '#ef4444',
  },
];

function MemberRow({ member, isSelected, onSelect, onViewProfile }: {
  member: Member;
  isSelected: boolean;
  onSelect: () => void;
  onViewProfile: () => void;
}) {
  const getLifecycleBadge = () => {
    const badges = {
      new: { label: 'New', color: '#3b82f6' },
      active: { label: 'Active', color: '#10b981' },
      power_user: { label: 'Power User', color: '#f59e0b' },
      champion: { label: 'Champion', color: '#8b5cf6' },
      at_risk: { label: 'At Risk', color: '#f59e0b' },
      inactive: { label: 'Inactive', color: '#ef4444' },
    };
    return badges[member.lifecycleStage];
  };

  const badge = getLifecycleBadge();
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className={`${styles.memberRow} ${isSelected ? styles.selected : ''}`}>
      <div className={styles.rowCheckbox}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className={styles.checkbox}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className={styles.rowMember}>
        <div className={styles.memberAvatar}>
          {member.avatar ? (
            <img src={member.avatar} alt={member.name} />
          ) : (
            <div className={styles.avatarFallback}>{initials}</div>
          )}
        </div>
        <div className={styles.rowMemberInfo}>
          <h3 className={styles.memberName}>{member.name}</h3>
          <p className={styles.memberEmail}>{member.email}</p>
        </div>
      </div>

      <div className={styles.rowStatus}>
        <span
          className={styles.lifecycleBadge}
          style={{ background: `${badge.color}20`, color: badge.color }}
        >
          {badge.label}
        </span>
      </div>

      <div className={styles.rowStats}>
        <div className={styles.rowStat}>
          <span className={styles.rowStatValue}>{member.stats.posts}</span>
          <span className={styles.rowStatLabel}>Posts</span>
        </div>
        <div className={styles.rowStat}>
          <span className={styles.rowStatValue}>{member.stats.comments}</span>
          <span className={styles.rowStatLabel}>Comments</span>
        </div>
        <div className={styles.rowStat}>
          <span className={styles.rowStatValue}>{member.stats.reputation}</span>
          <span className={styles.rowStatLabel}>Rep</span>
        </div>
      </div>

      <div className={styles.rowEngagement}>
        <div className={styles.engagementBar}>
          <div
            className={styles.engagementFill}
            style={{ width: `${member.engagementScore}%` }}
          />
        </div>
        <span className={styles.engagementValue}>{member.engagementScore}%</span>
      </div>

      <div className={styles.rowActivity}>
        <Clock className={styles.activityIcon} />
        <span>{member.lastActive}</span>
      </div>

      <div className={styles.rowActions}>
        <button className={styles.rowActionButton} onClick={onViewProfile}>
          View Profile
        </button>
        <button className={styles.menuButton}>
          <MoreVertical />
        </button>
      </div>
    </div>
  );
}

function MemberCard({ member, isSelected, onSelect, onViewProfile }: {
  member: Member;
  isSelected: boolean;
  onSelect: () => void;
  onViewProfile: () => void;
}) {
  const getLifecycleBadge = () => {
    const badges = {
      new: { label: 'New', color: '#3b82f6' },
      active: { label: 'Active', color: '#10b981' },
      power_user: { label: 'Power User', color: '#f59e0b' },
      champion: { label: 'Champion', color: '#8b5cf6' },
      at_risk: { label: 'At Risk', color: '#f59e0b' },
      inactive: { label: 'Inactive', color: '#ef4444' },
    };
    return badges[member.lifecycleStage];
  };

  const badge = getLifecycleBadge();
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className={`${styles.memberCard} ${isSelected ? styles.selected : ''}`}>
      <div className={styles.cardHeader}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className={styles.checkbox}
          onClick={(e) => e.stopPropagation()}
        />
        <div className={styles.memberAvatar}>
          {member.avatar ? (
            <img src={member.avatar} alt={member.name} />
          ) : (
            <div className={styles.avatarFallback}>{initials}</div>
          )}
        </div>
        <div className={styles.memberInfo}>
          <h3 className={styles.memberName}>{member.name}</h3>
          <p className={styles.memberEmail}>{member.email}</p>
        </div>
        <button className={styles.menuButton}>
          <MoreVertical />
        </button>
      </div>

      <div className={styles.cardBadges}>
        <span
          className={styles.lifecycleBadge}
          style={{ background: `${badge.color}20`, color: badge.color }}
        >
          {badge.label}
        </span>
        <span className={styles.roleBadge}>{member.role}</span>
      </div>

      <div className={styles.cardStats}>
        <div className={styles.stat}>
          <MessageSquare className={styles.statIcon} />
          <span className={styles.statValue}>{member.stats.posts}</span>
          <span className={styles.statLabel}>Posts</span>
        </div>
        <div className={styles.stat}>
          <MessageSquare className={styles.statIcon} />
          <span className={styles.statValue}>{member.stats.comments}</span>
          <span className={styles.statLabel}>Comments</span>
        </div>
        <div className={styles.stat}>
          <Heart className={styles.statIcon} />
          <span className={styles.statValue}>{member.stats.likes}</span>
          <span className={styles.statLabel}>Likes</span>
        </div>
      </div>

      <div className={styles.cardMetrics}>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Engagement Score</div>
          <div className={styles.metricBar}>
            <div
              className={styles.metricProgress}
              style={{ width: `${member.engagementScore}%` }}
            />
          </div>
          <div className={styles.metricValue}>{member.engagementScore}%</div>
        </div>

        {member.lifecycleStage === 'new' && member.onboardingProgress < 100 && (
          <div className={styles.metric}>
            <div className={styles.metricLabel}>Onboarding</div>
            <div className={styles.metricBar}>
              <div
                className={`${styles.metricProgress} ${styles.onboarding}`}
                style={{ width: `${member.onboardingProgress}%` }}
              />
            </div>
            <div className={styles.metricValue}>{member.onboardingProgress}%</div>
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.footerInfo}>
          <Calendar className={styles.footerIcon} />
          <span>Joined {new Date(member.joinedDate).toLocaleDateString()}</span>
        </div>
        <div className={styles.footerInfo}>
          <Clock className={styles.footerIcon} />
          <span>Active {member.lastActive}</span>
        </div>
      </div>

      <button className={styles.viewProfileButton} onClick={onViewProfile}>
        View Profile
      </button>
    </div>
  );
}

export function MembersDirectory() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredMembers = members.filter(member => {
    // Search filter
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Segment filter
    const matchesSegment = selectedSegment === 'all' || member.lifecycleStage === selectedSegment;

    return matchesSearch && matchesSegment;
  });

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(m => m.id));
    }
  };

  const handleSelectMember = (id: string) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleViewProfile = (id: string) => {
    router.push(`/admin/members/${id}`);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on ${selectedMembers.length} members`);
    alert(`${action} action on ${selectedMembers.length} members`);
  };

  return (
    <div className={styles.directory}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Member Directory</h1>
          <p>Manage and engage with your community members</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryButton}>
            <Download />
            Export
          </button>
          <button className={styles.primaryButton}>
            <UserPlus />
            Invite Members
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Users className={styles.statIcon} />
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Members</div>
            <div className={styles.statValue}>89</div>
            <div className={styles.statTrend}>
              <TrendingUp className={styles.trendIconUp} />
              <span>+7% this month</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <TrendingUp className={styles.statIcon} />
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Active Members</div>
            <div className={styles.statValue}>67</div>
            <div className={styles.statTrend}>
              <TrendingUp className={styles.trendIconUp} />
              <span>+11% this week</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <UserPlus className={styles.statIcon} />
          <div className={styles.statContent}>
            <div className={styles.statLabel}>New This Week</div>
            <div className={styles.statValue}>8</div>
            <div className={styles.statTrend}>
              <TrendingUp className={styles.trendIconUp} />
              <span>+33% vs last week</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <Target className={styles.statIcon} />
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Avg Engagement</div>
            <div className={styles.statValue}>72%</div>
            <div className={styles.statTrend}>
              <TrendingUp className={styles.trendIconUp} />
              <span>+5% improvement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Segments */}
      <div className={styles.segmentsSection}>
        <h2>Member Segments</h2>
        <div className={styles.segmentsGrid}>
          {segments.map(segment => {
            const Icon = segment.icon;
            return (
              <div
                key={segment.id}
                className={`${styles.segmentCard} ${selectedSegment === segment.id ? styles.active : ''}`}
                onClick={() => setSelectedSegment(segment.id)}
              >
                <div className={styles.segmentIcon} style={{ color: segment.color }}>
                  <Icon />
                </div>
                <div className={styles.segmentInfo}>
                  <h3 className={styles.segmentName}>{segment.name}</h3>
                  <p className={styles.segmentDescription}>{segment.description}</p>
                </div>
                <div className={styles.segmentCount} style={{ color: segment.color }}>
                  {segment.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filters */}
      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search members by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <LayoutGrid />
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <List />
          </button>
        </div>
        <button
          className={styles.filterButton}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter />
          Filters
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <div className={styles.bulkActions}>
          <div className={styles.bulkInfo}>
            <input
              type="checkbox"
              checked={selectedMembers.length === filteredMembers.length}
              onChange={handleSelectAll}
              className={styles.checkbox}
            />
            <span>{selectedMembers.length} members selected</span>
          </div>
          <div className={styles.bulkButtons}>
            <button onClick={() => handleBulkAction('Send Email')}>
              <Mail />
              Send Email
            </button>
            <button onClick={() => handleBulkAction('Assign Role')}>
              <Award />
              Assign Role
            </button>
            <button onClick={() => handleBulkAction('Add Tag')}>
              <Zap />
              Add Tag
            </button>
            <button onClick={() => handleBulkAction('Export')}>
              <Download />
              Export
            </button>
          </div>
        </div>
      )}

      {/* Members Grid/List */}
      {filteredMembers.length === 0 ? (
        <div className={styles.emptyState}>
          <Users className={styles.emptyIcon} />
          <h3>No members found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className={styles.membersGrid}>
          {filteredMembers.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              isSelected={selectedMembers.includes(member.id)}
              onSelect={() => handleSelectMember(member.id)}
              onViewProfile={() => handleViewProfile(member.id)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.membersList}>
          <div className={styles.listHeader}>
            <div className={styles.headerCheckbox}>
              <input
                type="checkbox"
                checked={selectedMembers.length === filteredMembers.length}
                onChange={handleSelectAll}
                className={styles.checkbox}
              />
            </div>
            <div className={styles.headerMember}>Member</div>
            <div className={styles.headerStatus}>Status</div>
            <div className={styles.headerStats}>Activity</div>
            <div className={styles.headerEngagement}>Engagement</div>
            <div className={styles.headerActivity}>Last Active</div>
            <div className={styles.headerActions}>Actions</div>
          </div>
          {filteredMembers.map(member => (
            <MemberRow
              key={member.id}
              member={member}
              isSelected={selectedMembers.includes(member.id)}
              onSelect={() => handleSelectMember(member.id)}
              onViewProfile={() => handleViewProfile(member.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
