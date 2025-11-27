'use client';

import Link from 'next/link';
import { Task } from '@/lib/tasks';
import { Icon } from './Icon';

interface UrgentTasksSidebarProps {
  tasks: Task[];
}

export function UrgentTasksSidebar({ tasks }: UrgentTasksSidebarProps) {
  // Get 5 most urgent tasks (pending or in_progress, sorted by due date)
  const urgentTasks = tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => {
      // Prioritize tasks with due dates
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5);

  if (urgentTasks.length === 0) {
    return null;
  }

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Due today', isOverdue: false };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', isOverdue: false };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} days`, isOverdue: false };
    } else {
      return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), isOverdue: false };
    }
  };

  return (
    <div className="urgent-tasks-sidebar">
      <div className="urgent-tasks-sidebar-header">
        <div className="urgent-tasks-sidebar-title-row">
          <Icon icon="clipboard" size={20} />
          <h2 className="urgent-tasks-sidebar-title">Urgent Tasks</h2>
        </div>
        <Link href="/tasks" className="urgent-tasks-sidebar-view-all">
          View all
        </Link>
      </div>

      <div className="urgent-tasks-sidebar-list">
        {urgentTasks.map((task) => {
          const dueInfo = task.dueDate ? formatDueDate(task.dueDate) : null;

          return (
            <div key={task.id} className="urgent-task-item">
              <div className="urgent-task-content">
                <h3 className="urgent-task-title">{task.title}</h3>

                <div className="urgent-task-meta">
                  {task.points && (
                    <span className="urgent-task-points">
                      <Icon icon="zap" size={12} />
                      {task.points} pts
                    </span>
                  )}

                  {dueInfo && (
                    <span className={`urgent-task-due ${dueInfo.isOverdue ? 'urgent-task-due--overdue' : ''}`}>
                      <Icon icon="calendar" size={12} />
                      {dueInfo.text}
                    </span>
                  )}
                </div>

                {task.progress !== undefined && task.progress > 0 && (
                  <div className="urgent-task-progress">
                    <div className="urgent-task-progress-bar">
                      <div
                        className="urgent-task-progress-fill"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="urgent-task-progress-text">{task.progress}%</span>
                  </div>
                )}
              </div>

              {task.link ? (
                <a href={task.link} className="urgent-task-cta">
                  <Icon icon="chevronRight" size={16} />
                </a>
              ) : (
                <Link href="/tasks" className="urgent-task-cta">
                  <Icon icon="chevronRight" size={16} />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <Link href="/tasks" className="urgent-tasks-sidebar-footer">
        <span>View all tasks</span>
        <Icon icon="chevronRight" size={16} />
      </Link>
    </div>
  );
}
