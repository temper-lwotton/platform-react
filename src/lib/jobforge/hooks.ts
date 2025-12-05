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

  const analyzeJobSpec = useCallback(async (jobData: Partial<JobSpec>): Promise<any> => {
    setIsAnalyzing(true);
    await delay(2500); // Simulate AI analysis time

    // Calculate basic metrics
    const overview = jobData.description?.overview || '';
    const responsibilities = jobData.description?.responsibilities || [];
    const requiredSkills = jobData.description?.requirements?.required || [];
    const desirableSkills = jobData.description?.requirements?.desirable || [];
    const benefits = jobData.description?.benefits || [];

    const wordCount = overview.split(' ').length;
    const hasResponsibilities = responsibilities.length > 0;
    const hasRequirements = requiredSkills.length > 0;
    const hasBenefits = benefits.length > 0;
    const hasSalary = jobData.salary && jobData.salary.min > 0;

    // Calculate scores
    let clarityScore = 50;
    if (wordCount > 50) clarityScore += 20;
    if (wordCount > 100) clarityScore += 10;
    if (overview.includes('We are seeking') || overview.includes('Join our team')) clarityScore += 20;

    let completenessScore = 0;
    if (jobData.title) completenessScore += 15;
    if (hasResponsibilities) completenessScore += 25;
    if (hasRequirements) completenessScore += 25;
    if (hasBenefits) completenessScore += 15;
    if (hasSalary) completenessScore += 20;

    let appealScore = 60;
    if (hasBenefits) appealScore += 20;
    if (wordCount > 100) appealScore += 10;
    if (benefits.length > 3) appealScore += 10;

    // Salary competitiveness
    const salaryMid = jobData.salary ? (jobData.salary.min + jobData.salary.max) / 2 : 0;
    let competitivenessScore = 70;
    let salaryRecommendation: 'increase' | 'decrease' | 'good' = 'good';
    let salaryNotes = 'Salary range is competitive for the market.';

    if (salaryMid < 40000) {
      competitivenessScore = 45;
      salaryRecommendation = 'increase';
      salaryNotes = 'Salary is below market average. Consider increasing to attract top talent.';
    } else if (salaryMid > 100000) {
      competitivenessScore = 95;
      salaryNotes = 'Salary is above market average - excellent for attracting top candidates.';
    }

    const overallScore = Math.round(
      (clarityScore + completenessScore + appealScore + competitivenessScore) / 4
    );

    // Generate tips based on analysis
    const tips = [];

    // Check if title is too generic
    const genericTitles = ['developer', 'engineer', 'manager', 'designer', 'analyst'];
    const titleLower = (jobData.title || '').toLowerCase().trim();
    if (genericTitles.includes(titleLower)) {
      const seniorityPrefix = jobData.seniorityLevel === 'senior' ? 'Senior ' : jobData.seniorityLevel === 'junior' ? 'Junior ' : '';
      const suggestedTitle = `${seniorityPrefix}${jobData.title} - ${jobData.industry || 'Technology'}`;
      tips.push({
        id: 'tip_0',
        category: 'clarity' as const,
        priority: 'medium' as const,
        title: 'Make Job Title More Specific',
        description: 'Your job title is quite generic. Adding context helps candidates understand the role better.',
        impact: 10,
        actionable: true,
        currentValue: jobData.title,
        suggestedValue: suggestedTitle,
        suggestion: `Consider: "${suggestedTitle}"`,
        fieldPath: 'title',
      });
    }

    if (!hasResponsibilities) {
      tips.push({
        id: 'tip_1',
        category: 'completeness' as const,
        priority: 'high' as const,
        title: 'Add Key Responsibilities',
        description: 'Your job spec is missing a responsibilities section. Candidates want to know what they\'ll be doing day-to-day.',
        impact: 25,
        actionable: true,
        suggestion: 'Add 3-5 bullet points describing the main duties of this role.',
      });
    }

    if (!hasBenefits) {
      tips.push({
        id: 'tip_2',
        category: 'appeal' as const,
        priority: 'medium' as const,
        title: 'Highlight Benefits & Perks',
        description: 'Including benefits makes the role more attractive to candidates.',
        impact: 15,
        actionable: true,
        suggestion: 'Add benefits like health insurance, remote work options, professional development, etc.',
      });
    }

    if (wordCount < 50) {
      const suggestedOverview = overview + `\n\nWe are looking for a talented ${jobData.title} to join our growing ${jobData.industry} team. In this role, you'll have the opportunity to work on exciting projects, collaborate with skilled professionals, and make a meaningful impact on our organization's success. We offer a dynamic work environment with opportunities for professional growth and development.`;
      tips.push({
        id: 'tip_3',
        category: 'clarity' as const,
        priority: 'high' as const,
        title: 'Expand Job Overview',
        description: 'Your job overview is quite brief. Candidates need more context about the role and company.',
        impact: 20,
        actionable: true,
        currentValue: overview || '(empty)',
        suggestedValue: suggestedOverview,
        suggestion: 'Aim for 100-200 words describing the role, team, and what makes it exciting.',
        fieldPath: 'description.overview',
      });
    }

    if (salaryMid < 40000) {
      const suggestedMin = Math.round((jobData.salary?.min || 0) * 1.15);
      const suggestedMax = Math.round((jobData.salary?.max || 0) * 1.15);

      // Tip for minimum salary
      tips.push({
        id: 'tip_4a',
        category: 'competitiveness' as const,
        priority: 'high' as const,
        title: 'Increase Minimum Salary',
        description: 'The minimum salary is below market average for this role.',
        impact: 15,
        actionable: true,
        currentValue: `£${jobData.salary?.min.toLocaleString()}`,
        suggestedValue: `${suggestedMin}`,
        suggestion: 'Increase minimum salary by 15% to match market rates.',
        fieldPath: 'salary.min',
      });

      // Tip for maximum salary
      tips.push({
        id: 'tip_4b',
        category: 'competitiveness' as const,
        priority: 'high' as const,
        title: 'Increase Maximum Salary',
        description: 'The maximum salary is below market average for this role.',
        impact: 15,
        actionable: true,
        currentValue: `£${jobData.salary?.max.toLocaleString()}`,
        suggestedValue: `${suggestedMax}`,
        suggestion: 'Increase maximum salary by 15% to match market rates.',
        fieldPath: 'salary.max',
      });
    }

    if (responsibilities.length < 3) {
      tips.push({
        id: 'tip_5',
        category: 'structure' as const,
        priority: 'medium' as const,
        title: 'Add More Responsibilities',
        description: 'Most effective job specs list 4-6 key responsibilities.',
        impact: 10,
        actionable: true,
        suggestion: 'Add 2-3 more responsibilities to give candidates a clearer picture.',
      });
    }

    // Bias detection (simple mock)
    const biasTypes = [];
    const overviewLower = overview.toLowerCase();

    if (overviewLower.includes('young') || overviewLower.includes('energetic')) {
      biasTypes.push({
        type: 'age' as const,
        text: overviewLower.includes('young') ? 'young' : 'energetic',
        location: 'Job Overview',
        suggestion: 'Use "dynamic" or "motivated" instead',
        severity: 'medium' as const,
      });
    }

    if (overviewLower.includes('he ') || overviewLower.includes('his ')) {
      biasTypes.push({
        type: 'gender' as const,
        text: overviewLower.includes('he ') ? 'he' : 'his',
        location: 'Job Overview',
        suggestion: 'Use "they" or "the candidate" instead',
        severity: 'high' as const,
      });
    }

    const analysis = {
      scores: {
        overall: overallScore,
        clarity: clarityScore,
        completeness: completenessScore,
        appeal: appealScore,
        competitiveness: competitivenessScore,
      },
      sentiment: {
        tone: 'professional' as const,
        inclusivity: biasTypes.length === 0 ? ('inclusive' as const) : ('needs-improvement' as const),
        confidence: 0.85,
      },
      metrics: {
        wordCount,
        hasResponsibilities,
        hasRequirements,
        hasBenefits,
        hasSalary,
        responsibilitiesCount: responsibilities.length,
        requirementsCount: requiredSkills.length + desirableSkills.length,
        benefitsCount: benefits.length,
      },
      tips,
      predictions: {
        expectedApplications: overallScore >= 80 ? ('high' as const) : overallScore >= 60 ? ('medium' as const) : ('low' as const),
        expectedQualifiedCandidates: completenessScore >= 80 ? ('high' as const) : ('medium' as const),
        timeToFill: competitivenessScore >= 80 ? '2-4 weeks' : '4-8 weeks',
        competitivenessLevel: salaryRecommendation === 'increase' ? ('below-market' as const) : salaryRecommendation === 'decrease' ? ('above-market' as const) : ('market-rate' as const),
      },
      biasDetection: {
        hasBias: biasTypes.length > 0,
        biasTypes,
        overallSeverity: biasTypes.length === 0 ? ('none' as const) : biasTypes.some(b => b.severity === 'high') ? ('high' as const) : ('medium' as const),
      },
      salaryBenchmark: jobData.salary ? {
        providedRange: {
          min: jobData.salary.min,
          max: jobData.salary.max,
          currency: jobData.salary.currency,
        },
        marketRange: {
          min: Math.round((jobData.salary.min || 0) * 1.1),
          max: Math.round((jobData.salary.max || 0) * 1.2),
          percentile: competitivenessScore,
        },
        recommendation: salaryRecommendation,
        notes: salaryNotes,
      } : undefined,
      generatedAt: new Date(),
    };

    setIsAnalyzing(false);
    return analysis;
  }, []);

  return { analyzeJobSpec, isAnalyzing };
};
