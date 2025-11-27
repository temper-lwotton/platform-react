'use client';

import { useState, useMemo } from 'react';
import { Task, TaskType, TaskStatus } from '@/lib/tasks';
import { TaskItem } from './TaskItem';
import { Icon } from './Icon';

interface TaskListProps {
  tasks: Task[];
  onComplete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

export function TaskList({ tasks, onComplete, onStatusChange }: TaskListProps) {
  const [filterType, setFilterType] = useState<TaskType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'points' | 'recent'>('dueDate');

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(task => task.type === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Sort tasks
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'dueDate') {
        // Tasks with due dates first, then by date
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'points') {
        // Highest points first
        return (b.points || 0) - (a.points || 0);
      } else {
        // Most recent first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    // Always show pending/in-progress before completed
    return sorted.sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return 0;
    });
  }, [tasks, filterType, filterStatus, sortBy]);

  const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      platform: tasks.filter(t => t.type === 'platform_engagement').length,
      admin: tasks.filter(t => t.type === 'admin_assigned').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };
  }, [tasks]);

  return (
    <div className="task-list">
      {/* Filters */}
      <div className="task-list-filters">
        <div className="task-list-filter-group">
          <label className="task-list-filter-label">Type</label>
          <div className="task-list-filter-buttons">
            <button
              className={`task-list-filter-btn ${filterType === 'all' ? 'task-list-filter-btn--active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All ({taskCounts.all})
            </button>
            <button
              className={`task-list-filter-btn ${filterType === 'platform_engagement' ? 'task-list-filter-btn--active' : ''}`}
              onClick={() => setFilterType('platform_engagement')}
            >
              <Icon icon="zap" size={14} />
              Platform ({taskCounts.platform})
            </button>
            <button
              className={`task-list-filter-btn ${filterType === 'admin_assigned' ? 'task-list-filter-btn--active' : ''}`}
              onClick={() => setFilterType('admin_assigned')}
            >
              <Icon icon="clipboard" size={14} />
              Assigned ({taskCounts.admin})
            </button>
          </div>
        </div>

        <div className="task-list-filter-group">
          <label className="task-list-filter-label">Status</label>
          <div className="task-list-filter-buttons">
            <button
              className={`task-list-filter-btn ${filterStatus === 'all' ? 'task-list-filter-btn--active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button
              className={`task-list-filter-btn ${filterStatus === 'pending' ? 'task-list-filter-btn--active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              To Do ({taskCounts.pending})
            </button>
            <button
              className={`task-list-filter-btn ${filterStatus === 'in_progress' ? 'task-list-filter-btn--active' : ''}`}
              onClick={() => setFilterStatus('in_progress')}
            >
              In Progress ({taskCounts.inProgress})
            </button>
            <button
              className={`task-list-filter-btn ${filterStatus === 'completed' ? 'task-list-filter-btn--active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Done ({taskCounts.completed})
            </button>
          </div>
        </div>

        <div className="task-list-filter-group">
          <label className="task-list-filter-label">Sort by</label>
          <select
            className="task-list-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="dueDate">Due date</option>
            <option value="points">Points</option>
            <option value="recent">Recently added</option>
          </select>
        </div>
      </div>

      {/* Task Items */}
      <div className="task-list-items">
        {filteredTasks.length === 0 ? (
          <div className="task-list-empty">
            <Icon icon="clipboard" size={48} />
            <h3 className="task-list-empty-title">No tasks found</h3>
            <p className="task-list-empty-description">
              {filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters to see more tasks.'
                : 'You\'re all caught up! New tasks will appear here.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={onComplete}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
