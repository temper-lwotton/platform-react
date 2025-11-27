'use client';

import { useState } from 'react';
import { MOCK_TASKS, MOCK_TASK_STATS, Task, TaskStatus } from '@/lib/tasks';
import { TaskList } from '@/components/ui/TaskList';
import { TaskStats } from '@/components/ui/TaskStats';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [stats, setStats] = useState(MOCK_TASK_STATS);

  const handleCompleteTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: 'completed' as TaskStatus,
              completedAt: new Date().toISOString(),
              progress: 100,
            }
          : task
      )
    );

    // Update stats
    const completedTask = tasks.find(t => t.id === taskId);
    if (completedTask && completedTask.status !== 'completed') {
      setStats(prevStats => ({
        totalPoints: prevStats.totalPoints + (completedTask.points || 0),
        completedTasks: prevStats.completedTasks + 1,
        pendingTasks: prevStats.pendingTasks - 1,
        completionRate: Math.round(
          ((prevStats.completedTasks + 1) / tasks.length) * 100
        ),
      }));
    }
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status,
              completedAt: status === 'completed' ? new Date().toISOString() : undefined,
              progress: status === 'completed' ? 100 : task.progress,
            }
          : task
      )
    );

    // Update stats
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const wasCompleted = task.status === 'completed';
      const isNowCompleted = status === 'completed';

      if (!wasCompleted && isNowCompleted) {
        setStats(prevStats => ({
          totalPoints: prevStats.totalPoints + (task.points || 0),
          completedTasks: prevStats.completedTasks + 1,
          pendingTasks: prevStats.pendingTasks - 1,
          completionRate: Math.round(
            ((prevStats.completedTasks + 1) / tasks.length) * 100
          ),
        }));
      } else if (wasCompleted && !isNowCompleted) {
        setStats(prevStats => ({
          totalPoints: prevStats.totalPoints - (task.points || 0),
          completedTasks: prevStats.completedTasks - 1,
          pendingTasks: prevStats.pendingTasks + 1,
          completionRate: Math.round(
            ((prevStats.completedTasks - 1) / tasks.length) * 100
          ),
        }));
      }
    }
  };

  return (
    <main className="tasks-page">
      <header className="tasks-header">
        <div>
          <h1 className="tasks-title">My Tasks</h1>
          <p className="tasks-subtitle">
            Complete tasks to earn points and engage with the platform
          </p>
        </div>
      </header>

      <TaskStats stats={stats} />

      <div className="tasks-content">
        <TaskList
          tasks={tasks}
          onComplete={handleCompleteTask}
          onStatusChange={handleStatusChange}
        />
      </div>
    </main>
  );
}
