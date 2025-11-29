'use client';

import { useState, useMemo } from 'react';
import { Task, TaskType, TaskStatus } from '@/lib/tasks';
import { TaskItem } from '../TaskItem';
import { Icon } from '../Icon';
import styles from './TaskList.module.scss';

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
    <div className={styles.list}>
      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Type</label>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${filterType === 'all' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilterType('all')}
            >
              All ({taskCounts.all})
            </button>
            <button
              className={`${styles.filterBtn} ${filterType === 'platform_engagement' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilterType('platform_engagement')}
            >
              <Icon icon="zap" size={14} />
              Platform ({taskCounts.platform})
            </button>
            <button
              className={`${styles.filterBtn} ${filterType === 'admin_assigned' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilterType('admin_assigned')}
            >
              <Icon icon="clipboard" size={14} />
              Assigned ({taskCounts.admin})
            </button>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${filterStatus === 'all' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button
              className={`${styles.filterBtn} ${filterStatus === 'pending' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              To Do ({taskCounts.pending})
            </button>
            <button
              className={`${styles.filterBtn} ${filterStatus === 'in_progress' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilterStatus('in_progress')}
            >
              In Progress ({taskCounts.inProgress})
            </button>
            <button
              className={`${styles.filterBtn} ${filterStatus === 'completed' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Done ({taskCounts.completed})
            </button>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Sort by</label>
          <select
            className={styles.sortSelect}
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
      <div className={styles.items}>
        {filteredTasks.length === 0 ? (
          <div className={styles.empty}>
            <Icon icon="clipboard" size={48} />
            <h3 className={styles.emptyTitle}>No tasks found</h3>
            <p className={styles.emptyDescription}>
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
