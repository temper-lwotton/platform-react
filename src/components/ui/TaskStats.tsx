'use client';

import { TaskStats as TaskStatsType } from '@/lib/tasks';
import { Icon } from './Icon';

interface TaskStatsProps {
  stats: TaskStatsType;
}

export function TaskStats({ stats }: TaskStatsProps) {
  return (
    <div className="task-stats">
      <div className="task-stats-card task-stats-card--points">
        <div className="task-stats-icon">
          <Icon icon="zap" size={24} />
        </div>
        <div className="task-stats-content">
          <div className="task-stats-value">{stats.totalPoints.toLocaleString()}</div>
          <div className="task-stats-label">Points Earned</div>
        </div>
      </div>

      <div className="task-stats-card">
        <div className="task-stats-icon task-stats-icon--success">
          <Icon icon="calendar" size={24} />
        </div>
        <div className="task-stats-content">
          <div className="task-stats-value">{stats.completedTasks}</div>
          <div className="task-stats-label">Completed</div>
        </div>
      </div>

      <div className="task-stats-card">
        <div className="task-stats-icon task-stats-icon--pending">
          <Icon icon="clipboard" size={24} />
        </div>
        <div className="task-stats-content">
          <div className="task-stats-value">{stats.pendingTasks}</div>
          <div className="task-stats-label">Pending</div>
        </div>
      </div>

      <div className="task-stats-card">
        <div className="task-stats-icon task-stats-icon--rate">
          <Icon icon="rocket" size={24} />
        </div>
        <div className="task-stats-content">
          <div className="task-stats-value">{stats.completionRate}%</div>
          <div className="task-stats-label">Completion Rate</div>
        </div>
        <div className="task-stats-progress">
          <div
            className="task-stats-progress-fill"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
