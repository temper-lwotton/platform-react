'use client';

import Link from 'next/link';
import { FileText, FolderOpen, Tags, Blocks, Plus, TrendingUp } from 'lucide-react';
import styles from './Dashboard.module.scss';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  href?: string;
}

function StatCard({ title, value, icon: Icon, trend, href }: StatCardProps) {
  const card = (
    <div className={styles.statCard}>
      <div className={styles.statCardTop}>
        <div className={styles.statIcon}>
          <Icon className={styles.statIconSvg} />
        </div>
        {trend && (
          <div className={`${styles.statTrend} ${trend.isPositive ? styles.positive : styles.negative}`}>
            <TrendingUp className={styles.trendIcon} />
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <h3 className={styles.statTitle}>{title}</h3>
      <p className={styles.statValue}>{value}</p>
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

function QuickAction({ title, description, icon: Icon, href }: QuickActionProps) {
  return (
    <Link href={href} className={styles.quickAction}>
      <div className={styles.actionIcon}>
        <Icon className={styles.actionIconSvg} />
      </div>
      <div className={styles.actionContent}>
        <h3 className={styles.actionTitle}>{title}</h3>
        <p className={styles.actionDescription}>{description}</p>
      </div>
      <Plus className={styles.actionPlus} />
    </Link>
  );
}

export function Dashboard() {
  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.headerSection}>
        <h1>Dashboard</h1>
        <p>Welcome to your CMS admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Total Posts"
          value={142}
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
          href="/admin/posts"
        />
        <StatCard
          title="Post Types"
          value={8}
          icon={FolderOpen}
          href="/admin/post-types"
        />
        <StatCard
          title="Taxonomies"
          value={15}
          icon={Tags}
          href="/admin/taxonomies"
        />
        <StatCard
          title="Block Templates"
          value={23}
          icon={Blocks}
          href="/admin/blocks"
        />
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2>Quick Actions</h2>
        <div className={styles.quickActionsGrid}>
          <QuickAction
            title="Create New Post"
            description="Start writing a new post with the Lexical editor"
            icon={FileText}
            href="/admin/posts/new"
          />
          <QuickAction
            title="Create Post Type"
            description="Define a new content type for your CMS"
            icon={FolderOpen}
            href="/admin/post-types/new"
          />
          <QuickAction
            title="Create Taxonomy"
            description="Add a new taxonomy to organize your content"
            icon={Tags}
            href="/admin/taxonomies/new"
          />
          <QuickAction
            title="Create Block Template"
            description="Design reusable content blocks"
            icon={Blocks}
            href="/admin/blocks/new"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.section}>
        <h2>Recent Activity</h2>
        <div className={styles.activityCard}>
          <div className={styles.activityContent}>
            <div className={styles.activityList}>
              {[
                { action: 'Created', item: 'About Us Page', time: '2 hours ago', user: 'John Doe' },
                { action: 'Updated', item: 'Homepage', time: '5 hours ago', user: 'Jane Smith' },
                { action: 'Published', item: 'Blog Post: New Features', time: '1 day ago', user: 'John Doe' },
                { action: 'Created', item: 'Product Taxonomy', time: '2 days ago', user: 'Admin' },
              ].map((activity, index) => (
                <div key={index} className={styles.activityItem}>
                  <div className={styles.activityInfo}>
                    <p className={styles.activityText}>
                      <span className={styles.user}>{activity.user}</span>{' '}
                      <span className={styles.action}>{activity.action.toLowerCase()}</span>{' '}
                      <span className={styles.item}>{activity.item}</span>
                    </p>
                    <p className={styles.activityTime}>{activity.time}</p>
                  </div>
                  <span className={`
                    ${styles.activityBadge}
                    ${activity.action === 'Created' ? styles.created : ''}
                    ${activity.action === 'Updated' ? styles.updated : ''}
                    ${activity.action === 'Published' ? styles.published : ''}
                  `}>
                    {activity.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
