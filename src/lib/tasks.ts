import { apiFetch } from './api-client';

export type TaskType = 'platform_engagement' | 'admin_assigned';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskCategory = 'profile' | 'engagement' | 'community' | 'learning' | 'admin';

export interface Task {
  id: string;
  type: TaskType;
  category: TaskCategory;
  title: string;
  description: string;
  points?: number; // Points awarded for platform engagement tasks
  status: TaskStatus;
  progress?: number; // 0-100 for tasks with measurable progress
  dueDate?: string; // ISO date string
  completedAt?: string; // ISO date string
  createdAt: string;
  assignedBy?: {
    id: string;
    name: string;
    avatar?: string;
  }; // For admin-assigned tasks
  link?: string; // Optional deep link to relevant page
  requiresAction: boolean; // Whether the task needs user action vs auto-completion
}

export interface TasksQueryParams {
  type?: TaskType;
  status?: TaskStatus;
  category?: TaskCategory;
  limit?: number;
  offset?: number;
}

export interface TaskStats {
  totalPoints: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number; // 0-100
}

/**
 * Get all tasks for the current user
 */
export function getTasks(params?: TasksQueryParams): Promise<Task[]> {
  const queryParams = new URLSearchParams();

  if (params?.type) {
    queryParams.append('type', params.type);
  }

  if (params?.status) {
    queryParams.append('status', params.status);
  }

  if (params?.category) {
    queryParams.append('category', params.category);
  }

  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  if (params?.offset) {
    queryParams.append('offset', params.offset.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/api/tasks?${queryString}` : '/api/tasks';

  return apiFetch<Task[]>(url);
}

/**
 * Get task statistics for the current user
 */
export function getTaskStats(): Promise<TaskStats> {
  return apiFetch<TaskStats>('/api/tasks/stats');
}

/**
 * Mark a task as completed
 */
export function completeTask(taskId: string): Promise<Task> {
  return apiFetch<Task>(`/api/tasks/${taskId}/complete`, {
    method: 'POST',
  });
}

/**
 * Update task status
 */
export function updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
  return apiFetch<Task>(`/api/tasks/${taskId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ==========================================
// MOCK DATA - Remove when API is implemented
// ==========================================

export const MOCK_TASKS: Task[] = [
  // Platform Engagement Tasks
  {
    id: '1',
    type: 'platform_engagement',
    category: 'profile',
    title: 'Complete your profile',
    description: 'Add your job title, company, and bio to help others connect with you',
    points: 50,
    status: 'in_progress',
    progress: 60,
    createdAt: new Date().toISOString(),
    requiresAction: true,
    link: '/settings/profile',
  },
  {
    id: '2',
    type: 'platform_engagement',
    category: 'profile',
    title: 'Upload a profile photo',
    description: 'Add a professional photo to make your profile stand out',
    points: 25,
    status: 'pending',
    createdAt: new Date().toISOString(),
    requiresAction: true,
    link: '/settings/profile',
  },
  {
    id: '3',
    type: 'platform_engagement',
    category: 'engagement',
    title: 'Start your first discussion',
    description: 'Share your thoughts and start a conversation with the community',
    points: 100,
    status: 'pending',
    createdAt: new Date().toISOString(),
    requiresAction: true,
    link: '/discussions/new',
  },
  {
    id: '4',
    type: 'platform_engagement',
    category: 'engagement',
    title: 'Reply to 3 discussions',
    description: 'Engage with the community by contributing to ongoing discussions',
    points: 75,
    status: 'in_progress',
    progress: 33,
    createdAt: new Date().toISOString(),
    requiresAction: true,
  },
  {
    id: '5',
    type: 'platform_engagement',
    category: 'community',
    title: 'RSVP to an event',
    description: 'Join your first community event and network with others',
    points: 50,
    status: 'completed',
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    requiresAction: true,
    link: '/events',
  },
  {
    id: '6',
    type: 'platform_engagement',
    category: 'community',
    title: 'Join 2 spaces',
    description: 'Explore and join spaces that align with your interests',
    points: 50,
    status: 'in_progress',
    progress: 50,
    createdAt: new Date().toISOString(),
    requiresAction: true,
    link: '/spaces',
  },
  {
    id: '7',
    type: 'platform_engagement',
    category: 'engagement',
    title: 'Create your first post',
    description: 'Share an update, article, or insight with your network',
    points: 75,
    status: 'pending',
    createdAt: new Date().toISOString(),
    requiresAction: true,
  },
  {
    id: '8',
    type: 'platform_engagement',
    category: 'engagement',
    title: 'Bookmark 5 pieces of content',
    description: 'Save valuable content to revisit later',
    points: 25,
    status: 'in_progress',
    progress: 40,
    createdAt: new Date().toISOString(),
    requiresAction: true,
  },
  {
    id: '9',
    type: 'platform_engagement',
    category: 'community',
    title: 'Invite a colleague',
    description: 'Help grow the community by inviting someone to join',
    points: 100,
    status: 'pending',
    createdAt: new Date().toISOString(),
    requiresAction: true,
  },
  {
    id: '10',
    type: 'platform_engagement',
    category: 'learning',
    title: 'Watch 3 video resources',
    description: 'Explore educational content in the learning hub',
    points: 50,
    status: 'pending',
    createdAt: new Date().toISOString(),
    requiresAction: true,
    link: '/learning',
  },

  // Admin Assigned Tasks
  {
    id: '11',
    type: 'admin_assigned',
    category: 'admin',
    title: 'Submit Q1 project proposal',
    description: 'Prepare and submit your project proposal for Q1 2025. Include objectives, timeline, budget, and expected outcomes.',
    status: 'pending',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days from now
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    assignedBy: {
      id: 'admin-1',
      name: 'Sarah Johnson',
      avatar: undefined,
    },
    requiresAction: true,
  },
  {
    id: '12',
    type: 'admin_assigned',
    category: 'admin',
    title: 'Review transport innovation meeting notes',
    description: 'Please review the meeting notes from yesterday\'s transport innovation session and provide your feedback by end of week.',
    status: 'in_progress',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), // 3 days from now
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    assignedBy: {
      id: 'admin-2',
      name: 'Michael Chen',
      avatar: undefined,
    },
    requiresAction: true,
  },
  {
    id: '13',
    type: 'admin_assigned',
    category: 'admin',
    title: 'Complete onboarding survey',
    description: 'Help us improve by sharing your onboarding experience. This should take about 5 minutes.',
    status: 'pending',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(), // 2 days from now
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    assignedBy: {
      id: 'admin-3',
      name: 'Emma Williams',
      avatar: undefined,
    },
    requiresAction: true,
    link: '/surveys/onboarding',
  },
  {
    id: '14',
    type: 'admin_assigned',
    category: 'admin',
    title: 'Update team directory information',
    description: 'Please verify and update your contact information, reporting structure, and team details in the directory.',
    status: 'completed',
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    assignedBy: {
      id: 'admin-1',
      name: 'Sarah Johnson',
      avatar: undefined,
    },
    requiresAction: true,
  },
  {
    id: '15',
    type: 'admin_assigned',
    category: 'admin',
    title: 'Attend monthly all-hands meeting',
    description: 'Join us for the monthly all-hands meeting to hear updates and Q&A with leadership.',
    status: 'pending',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), // 5 days from now
    createdAt: new Date().toISOString(),
    assignedBy: {
      id: 'admin-2',
      name: 'Michael Chen',
      avatar: undefined,
    },
    requiresAction: true,
    link: '/events/123',
  },
];

export const MOCK_TASK_STATS: TaskStats = {
  totalPoints: 325, // Sum of completed task points
  completedTasks: 2,
  pendingTasks: 13,
  completionRate: 13, // (2 / 15) * 100
};
