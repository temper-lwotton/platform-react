'use client';

import { TaskStats as TaskStatsType } from '@/lib/tasks';
import { Icon } from '../Icon';
import styles from './TaskStats.module.scss';

interface TaskStatsProps {
  stats: TaskStatsType;
}

export function TaskStats({ stats }: TaskStatsProps) {
  return (
    <div className={styles.stats}>
      <div className={`${styles.card} ${styles.cardPoints}`}>
        <div className={styles.icon}>
          <Icon icon="zap" size={24} />
        </div>
        <div className={styles.content}>
          <div className={styles.value}>{stats.totalPoints.toLocaleString()}</div>
          <div className={styles.label}>Points Earned</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.iconSuccess}`}>
          <Icon icon="calendar" size={24} />
        </div>
        <div className={styles.content}>
          <div className={styles.value}>{stats.completedTasks}</div>
          <div className={styles.label}>Completed</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.iconPending}`}>
          <Icon icon="clipboard" size={24} />
        </div>
        <div className={styles.content}>
          <div className={styles.value}>{stats.pendingTasks}</div>
          <div className={styles.label}>Pending</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.iconRate}`}>
          <Icon icon="rocket" size={24} />
        </div>
        <div className={styles.content}>
          <div className={styles.value}>{stats.completionRate}%</div>
          <div className={styles.label}>Completion Rate</div>
        </div>
        <div className={styles.progress}>
          <div
            className={styles.progressFill}
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
