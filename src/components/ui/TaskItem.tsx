'use client';

import { Task } from '@/lib/tasks';
import { Icon } from './Icon';
import * as Avatar from '@radix-ui/react-avatar';
import * as Checkbox from '@radix-ui/react-checkbox';

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
    <div className={`task-item ${isCompleted ? 'task-item--completed' : ''} ${isOverdue ? 'task-item--overdue' : ''}`}>
      <div className="task-item-checkbox">
        <Checkbox.Root
          className="task-checkbox"
          checked={isCompleted}
          onCheckedChange={handleCheckboxChange}
          disabled={!task.requiresAction}
        >
          <Checkbox.Indicator className="task-checkbox-indicator">
            <Icon icon="calendar" size={14} />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>

      <div className="task-item-content">
        <div className="task-item-header">
          <div className="task-item-title-row">
            <h3 className="task-item-title">{task.title}</h3>
            {task.points && (
              <span className="task-item-points">
                <Icon icon="zap" size={14} />
                {task.points} pts
              </span>
            )}
          </div>
          <p className="task-item-description">{task.description}</p>
        </div>

        {task.progress !== undefined && task.progress > 0 && !isCompleted && (
          <div className="task-item-progress">
            <div className="task-item-progress-bar">
              <div
                className="task-item-progress-fill"
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <span className="task-item-progress-text">{task.progress}%</span>
          </div>
        )}

        <div className="task-item-footer">
          <div className="task-item-meta">
            <span className={`task-item-type ${task.type === 'admin_assigned' ? 'task-item-type--admin' : ''}`}>
              <Icon icon={getCategoryIcon(task.category)} size={14} />
              {task.type === 'platform_engagement' ? 'Platform Task' : 'Assigned Task'}
            </span>

            {task.dueDate && (
              <span className={`task-item-due ${isOverdue ? 'task-item-due--overdue' : ''}`}>
                <Icon icon="calendar" size={14} />
                {formatDueDate(task.dueDate)}
              </span>
            )}

            {isInProgress && (
              <span className="task-item-status task-item-status--in-progress">
                In Progress
              </span>
            )}

            {isCompleted && task.completedAt && (
              <span className="task-item-completed-date">
                Completed {new Date(task.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>

          {task.assignedBy && (
            <div className="task-item-assigned-by">
              <span className="task-item-assigned-label">Assigned by</span>
              <Avatar.Root className="task-item-assigned-avatar">
                {task.assignedBy.avatar && (
                  <Avatar.Image src={task.assignedBy.avatar} alt={task.assignedBy.name} />
                )}
                <Avatar.Fallback className="task-item-assigned-avatar-fallback">
                  {task.assignedBy.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
              <span className="task-item-assigned-name">{task.assignedBy.name}</span>
            </div>
          )}
        </div>

        {task.link && !isCompleted && (
          <a href={task.link} className="task-item-action">
            Take action
            <Icon icon="chevronRight" size={16} />
          </a>
        )}
      </div>
    </div>
  );
}
