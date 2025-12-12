// JobForge Hooks - using mock data
import { useState, useEffect, useCallback } from 'react';
import { JobSpec, ApprovalRequest, Template, JobForgeStats } from '@/types/jobforge';
import { mockJobSpecs, mockApprovalRequests, mockTemplates, mockStats } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage keys
const STORAGE_KEYS = {
  JOBS: 'jobforge_jobs',
  APPROVALS: 'jobforge_approvals',
  TEMPLATES: 'jobforge_templates',
};

// Helper to get from localStorage with fallback to mock data
const getStoredJobs = (): JobSpec[] => {
  if (typeof window === 'undefined') return mockJobSpecs;
  const stored = localStorage.getItem(STORAGE_KEYS.JOBS);
  return stored ? JSON.parse(stored, (key, value) => {
    // Parse dates
    if (key.endsWith('At') || key.endsWith('Date')) {
      return value ? new Date(value) : value;
    }
    return value;
  }) : mockJobSpecs;
};

const setStoredJobs = (jobs: JobSpec[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }
};

// Get stats based on current jobs
export const useJobForgeStats = () => {
  const [stats, setStats] = useState<JobForgeStats>(mockStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      await delay(300);
      const jobs = getStoredJobs();

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const newStats: JobForgeStats = {
        jobsCreated: jobs.length,
        draftsCount: jobs.filter(j => j.status === 'draft').length,
        awaitingApprovalCount: jobs.filter(j => j.status === 'pending_approval').length,
        approvedCount: jobs.filter(j => j.status === 'approved').length,
        thisWeek: jobs.filter(j => new Date(j.createdAt) > oneWeekAgo).length,
        averageQualityScore: Math.round(
          jobs.reduce((acc, j) => acc + j.qualityMetrics.overallScore, 0) / jobs.length
        ),
      };

      setStats(newStats);
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
};

// Get all jobs
export const useJobs = () => {
  const [jobs, setJobs] = useState<JobSpec[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await delay(300);
    const storedJobs = getStoredJobs();
    setJobs(storedJobs);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { jobs, isLoading, refetch };
};

// Get single job
export const useJob = (jobId: string | undefined) => {
  const [job, setJob] = useState<JobSpec | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setJob(null);
        setIsLoading(false);
        return;
      }

      await delay(200);
      const jobs = getStoredJobs();
      const found = jobs.find(j => j.id === jobId);
      setJob(found || null);
      setIsLoading(false);
    };

    fetchJob();
  }, [jobId]);

  return { job, isLoading };
};

// Create job
export const useCreateJob = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createJob = useCallback(async (jobData: Partial<JobSpec>): Promise<JobSpec> => {
    setIsCreating(true);
    await delay(500);

    const newJob: JobSpec = {
      id: `job_${Date.now()}`,
      status: 'draft',
      title: jobData.title || 'Untitled Job',
      industry: jobData.industry || '',
      location: jobData.location || {
        city: '',
        country: '',
        workType: 'hybrid',
      },
      salary: jobData.salary || {
        min: 0,
        max: 0,
        currency: 'GBP',
        period: 'yearly',
        displayOnJD: true,
      },
      employmentType: jobData.employmentType || 'permanent',
      seniorityLevel: jobData.seniorityLevel || 'mid',
      experienceYears: jobData.experienceYears || {
        min: 0,
      },
      description: jobData.description || {
        overview: '',
        responsibilities: [],
        requirements: {
          required: [],
          desirable: [],
        },
        format: 'markdown',
      },
      crmFields: {},
      crmFieldMapping: [],
      validationStatus: {
        overall: 'incomplete',
        requiredFields: {
          total: 10,
          completed: 0,
          missing: [],
        },
        optionalFields: {
          total: 15,
          completed: 0,
        },
        errors: [],
        warnings: [],
        lastValidated: new Date(),
      },
      qualityMetrics: {
        clarity: 0,
        readability: 0,
        completeness: 0,
        overallScore: 0,
        bias: {
          level: 'none',
        },
        issues: [],
        analyzedAt: new Date(),
        version: '1.0',
      },
      createdBy: 'current_user',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      tags: [],
      ...jobData,
    };

    const jobs = getStoredJobs();
    const updatedJobs = [...jobs, newJob];
    setStoredJobs(updatedJobs);

    setIsCreating(false);
    return newJob;
  }, []);

  return { createJob, isCreating };
};

// Update job
export const useUpdateJob = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateJob = useCallback(async (jobId: string, updates: Partial<JobSpec>): Promise<JobSpec> => {
    setIsUpdating(true);
    await delay(300);

    const jobs = getStoredJobs();
    const index = jobs.findIndex(j => j.id === jobId);

    if (index === -1) {
      setIsUpdating(false);
      throw new Error('Job not found');
    }

    const updatedJob: JobSpec = {
      ...jobs[index],
      ...updates,
      updatedAt: new Date(),
    };

    jobs[index] = updatedJob;
    setStoredJobs(jobs);

    setIsUpdating(false);
    return updatedJob;
  }, []);

  return { updateJob, isUpdating };
};

// Delete job
export const useDeleteJob = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteJob = useCallback(async (jobId: string): Promise<void> => {
    setIsDeleting(true);
    await delay(300);

    const jobs = getStoredJobs();
    const filtered = jobs.filter(j => j.id !== jobId);
    setStoredJobs(filtered);

    setIsDeleting(false);
  }, []);

  return { deleteJob, isDeleting };
};

// Auto-save hook
export const useAutoSave = (job: JobSpec | null, interval: number = 30000) => {
  const { updateJob } = useUpdateJob();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!job) return;

    const timer = setInterval(async () => {
      try {
        await updateJob(job.id, job);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [job, interval, updateJob]);

  return { lastSaved };
};

// Get approval requests
export const useApprovalRequests = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      await delay(300);
      setRequests(mockApprovalRequests);
      setIsLoading(false);
    };

    fetchRequests();
  }, []);

  return { requests, isLoading };
};

// Get templates
export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      await delay(300);
      setTemplates(mockTemplates);
      setIsLoading(false);
    };

    fetchTemplates();
  }, []);

  return { templates, isLoading };
};

// Simulate AI generation
export const useAIGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateJobDescription = useCallback(async (prompt: string): Promise<string> => {
    setIsGenerating(true);
    await delay(2000); // Simulate AI processing time

    // Mock AI generation
    const generated = `# Job Overview

Based on your input, here's a professional job description:

We are seeking an experienced professional to join our dynamic team. This role offers an exciting opportunity to make a significant impact in a growing organization.

## Key Responsibilities
- Lead and coordinate major project initiatives
- Collaborate with cross-functional teams to drive results
- Develop and implement strategic plans
- Monitor progress and ensure quality deliverables

## Required Qualifications
- Proven track record in a similar role
- Strong communication and leadership skills
- Excellent problem-solving abilities
- Ability to work in a fast-paced environment

This is a great opportunity for someone looking to advance their career in a supportive and innovative environment.`;

    setIsGenerating(false);
    return generated;
  }, []);

  return { generateJobDescription, isGenerating };
};

// Simulate AI job spec analysis
export const useJobAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeJobSpec = useCallback(async (jobData: Partial<JobSpec>): Promise<any> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Call the real API endpoint
      const response = await fetch('/api/jobforge/analyze-job-spec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Check if there's a warning (fallback analysis was used)
      if (data.warning) {
        console.warn('[JobForge]', data.warning);
      }

      setIsAnalyzing(false);
      return data.analysis;

    } catch (err: any) {
      console.error('[JobForge] Analysis error:', err);
      setError(err.message || 'Failed to analyze job specification');
      setIsAnalyzing(false);

      // Return a basic fallback analysis if API fails completely
      return {
        scores: {
          overall: 50,
          clarity: 50,
          completeness: 50,
          appeal: 50,
          competitiveness: 50,
        },
        sentiment: {
          tone: 'professional' as const,
          inclusivity: 'inclusive' as const,
          confidence: 0.5,
        },
        metrics: {
          wordCount: jobData.description?.overview?.split(' ').length || 0,
          hasResponsibilities: (jobData.description?.responsibilities?.length || 0) > 0,
          hasRequirements: (jobData.description?.requirements?.required?.length || 0) > 0,
          hasBenefits: (jobData.description?.benefits?.length || 0) > 0,
          hasSalary: !!jobData.salary && jobData.salary.min > 0,
          responsibilitiesCount: jobData.description?.responsibilities?.length || 0,
          requirementsCount: (jobData.description?.requirements?.required?.length || 0) + (jobData.description?.requirements?.desirable?.length || 0),
          benefitsCount: jobData.description?.benefits?.length || 0,
        },
        tips: [
          {
            id: 'error_tip',
            category: 'completeness' as const,
            priority: 'high' as const,
            title: 'Analysis Unavailable',
            description: 'Unable to perform AI analysis at this time. Please try again later.',
            impact: 0,
            actionable: false,
          }
        ],
        predictions: {
          expectedApplications: 'medium' as const,
          expectedQualifiedCandidates: 'medium' as const,
          timeToFill: '4-6 weeks',
          competitivenessLevel: 'market-rate' as const,
        },
        biasDetection: {
          hasBias: false,
          biasTypes: [],
          overallSeverity: 'none' as const,
        },
        generatedAt: new Date(),
      };
    }
  }, []);

  return { analyzeJobSpec, isAnalyzing, error };
};
