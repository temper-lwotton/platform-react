'use client';

import Link from 'next/link';
import { Task } from '@/lib/tasks';
import { Icon } from '../Icon';
import styles from './UrgentTasksSidebar.module.scss';

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
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Icon icon="clipboard" size={20} />
          <h2 className={styles.title}>Urgent Tasks</h2>
        </div>
        <Link href="/tasks" className={styles.viewAll}>
          View all
        </Link>
      </div>

      <div className={styles.list}>
        {urgentTasks.map((task) => {
          const dueInfo = task.dueDate ? formatDueDate(task.dueDate) : null;

          return (
            <div key={task.id} className={styles.item}>
              <div className={styles.content}>
                <h3 className={styles.taskTitle}>{task.title}</h3>

                <div className={styles.meta}>
                  {task.points && (
                    <span className={styles.points}>
                      <Icon icon="zap" size={12} />
                      {task.points} pts
                    </span>
                  )}

                  {dueInfo && (
                    <span className={`${styles.due} ${dueInfo.isOverdue ? styles.dueOverdue : ''}`}>
                      <Icon icon="calendar" size={12} />
                      {dueInfo.text}
                    </span>
                  )}
                </div>

                {task.progress !== undefined && task.progress > 0 && (
                  <div className={styles.progress}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className={styles.progressText}>{task.progress}%</span>
                  </div>
                )}
              </div>

              {task.link ? (
                <a href={task.link} className={styles.cta}>
                  <Icon icon="chevronRight" size={16} />
                </a>
              ) : (
                <Link href="/tasks" className={styles.cta}>
                  <Icon icon="chevronRight" size={16} />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <Link href="/tasks" className={styles.footer}>
        <span>View all tasks</span>
        <Icon icon="chevronRight" size={16} />
      </Link>
    </div>
  );
}
