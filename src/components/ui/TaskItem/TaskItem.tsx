'use client';

import { Task } from '@/lib/tasks';
import { Icon } from '../Icon';
import * as Avatar from '@radix-ui/react-avatar';
import * as Checkbox from '@radix-ui/react-checkbox';
import styles from './TaskItem.module.scss';

interface TaskItemProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: 'pending' | 'in_progress' | 'completed') => void;
}

export function TaskItem({ task, onComplete, onStatusChange }: TaskItemProps) {
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  const handleCheckboxChange = (checked: boolean) => {
    if (checked && onComplete) {
      onComplete(task.id);
    } else if (onStatusChange) {
      onStatusChange(task.id, checked ? 'completed' : 'pending');
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Overdue';
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'profile':
        return 'user';
      case 'engagement':
        return 'comment';
      case 'community':
        return 'rocket';
      case 'learning':
        return 'lightbulb';
      case 'admin':
        return 'clipboard';
      default:
        return 'clipboard';
    }
  };

  return (
    <div className={`${styles.item} ${isCompleted ? styles.itemCompleted : ''} ${isOverdue ? styles.itemOverdue : ''}`}>
      <div className={styles.checkbox}>
        <Checkbox.Root
          className={styles.checkboxInput}
          checked={isCompleted}
          onCheckedChange={handleCheckboxChange}
          disabled={!task.requiresAction}
        >
          <Checkbox.Indicator className={styles.checkboxIndicator}>
            <Icon icon="calendar" size={14} />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{task.title}</h3>
            {task.points && (
              <span className={styles.points}>
                <Icon icon="zap" size={14} />
                {task.points} pts
              </span>
            )}
          </div>
          <p className={styles.description}>{task.description}</p>
        </div>

        {task.progress !== undefined && task.progress > 0 && !isCompleted && (
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

        <div className={styles.footer}>
          <div className={styles.meta}>
            <span className={`${styles.type} ${task.type === 'admin_assigned' ? styles.typeAdmin : ''}`}>
              <Icon icon={getCategoryIcon(task.category)} size={14} />
              {task.type === 'platform_engagement' ? 'Platform Task' : 'Assigned Task'}
            </span>

            {task.dueDate && (
              <span className={`${styles.due} ${isOverdue ? styles.dueOverdue : ''}`}>
                <Icon icon="calendar" size={14} />
                {formatDueDate(task.dueDate)}
              </span>
            )}

            {isInProgress && (
              <span className={`${styles.status} ${styles.statusInProgress}`}>
                In Progress
              </span>
            )}

            {isCompleted && task.completedAt && (
              <span className={styles.completedDate}>
                Completed {new Date(task.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>

          {task.assignedBy && (
            <div className={styles.assignedBy}>
              <span className={styles.assignedLabel}>Assigned by</span>
              <Avatar.Root className={styles.assignedAvatar}>
                {task.assignedBy.avatar && (
                  <Avatar.Image src={task.assignedBy.avatar} alt={task.assignedBy.name} />
                )}
                <Avatar.Fallback className={styles.assignedAvatarFallback}>
                  {task.assignedBy.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
              <span className={styles.assignedName}>{task.assignedBy.name}</span>
            </div>
          )}
        </div>

        {task.link && !isCompleted && (
          <a href={task.link} className={styles.action}>
            Take action
            <Icon icon="chevronRight" size={16} />
          </a>
        )}
      </div>
    </div>
  );
}
