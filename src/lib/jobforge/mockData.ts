// Mock data for JobForge
import { JobSpec, ApprovalRequest, Template, JobForgeStats } from '@/types/jobforge';

export const mockJobSpecs: JobSpec[] = [
  {
    id: 'job_1',
    status: 'draft',
    title: 'Senior Software Engineer',
    industry: 'Technology',
    location: {
      city: 'Manchester',
      country: 'UK',
      workType: 'hybrid',
    },
    salary: {
      min: 60000,
      max: 80000,
      currency: 'GBP',
      period: 'yearly',
      displayOnJD: true,
    },
    employmentType: 'permanent',
    seniorityLevel: 'senior',
    experienceYears: {
      min: 5,
      max: 10,
    },
    description: {
      overview: 'We are seeking an experienced Senior Software Engineer to join our growing team...',
      responsibilities: [
        'Lead development of React applications',
        'Mentor junior developers',
        'Architect cloud solutions',
      ],
      requirements: {
        required: [
          { text: '5+ years React experience', category: 'technical', priority: 'must-have' },
          { text: 'Leadership experience', category: 'soft-skill', priority: 'must-have' },
          { text: 'AWS/Azure knowledge', category: 'technical', priority: 'must-have' },
        ],
        desirable: [
          { text: 'TypeScript experience', category: 'technical', priority: 'nice-to-have' },
          { text: 'GraphQL knowledge', category: 'technical', priority: 'nice-to-have' },
        ],
      },
      benefits: ['Health insurance', 'Remote working', 'Professional development budget'],
      format: 'markdown',
    },
    crmFields: {},
    crmFieldMapping: [],
    validationStatus: {
      overall: 'incomplete',
      requiredFields: {
        total: 10,
        completed: 8,
        missing: ['certifications', 'department'],
      },
      optionalFields: {
        total: 15,
        completed: 3,
      },
      errors: [],
      warnings: [],
      lastValidated: new Date(),
    },
    qualityMetrics: {
      clarity: 87,
      readability: 92,
      completeness: 80,
      overallScore: 86,
      bias: {
        level: 'none',
      },
      issues: [],
      analyzedAt: new Date(),
      version: '1.0',
    },
    createdBy: 'user_1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 30 * 1000), // 30 seconds ago
    version: 1,
    tags: [],
  },
  {
    id: 'job_2',
    status: 'pending_approval',
    title: 'Marketing Manager',
    industry: 'Retail',
    location: {
      city: 'London',
      country: 'UK',
      workType: 'onsite',
    },
    salary: {
      min: 45000,
      max: 55000,
      currency: 'GBP',
      period: 'yearly',
      displayOnJD: true,
    },
    employmentType: 'permanent',
    seniorityLevel: 'mid',
    experienceYears: {
      min: 3,
      max: 5,
    },
    description: {
      overview: 'Exciting opportunity for a Marketing Manager to join our retail team...',
      responsibilities: [
        'Develop marketing strategies',
        'Manage social media campaigns',
        'Analyze market trends',
      ],
      requirements: {
        required: [
          { text: '3+ years marketing experience', category: 'experience', priority: 'must-have' },
          { text: 'Social media expertise', category: 'technical', priority: 'must-have' },
        ],
        desirable: [
          { text: 'Retail experience', category: 'experience', priority: 'nice-to-have' },
        ],
      },
      format: 'markdown',
    },
    crmFields: {},
    crmFieldMapping: [],
    validationStatus: {
      overall: 'valid',
      requiredFields: {
        total: 10,
        completed: 10,
        missing: [],
      },
      optionalFields: {
        total: 15,
        completed: 5,
      },
      errors: [],
      warnings: [],
      lastValidated: new Date(),
    },
    qualityMetrics: {
      clarity: 92,
      readability: 88,
      completeness: 100,
      overallScore: 93,
      bias: {
        level: 'none',
      },
      issues: [],
      analyzedAt: new Date(),
      version: '1.0',
    },
    createdBy: 'user_2',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    version: 1,
    tags: [],
  },
  {
    id: 'job_3',
    status: 'draft',
    title: 'Junior Designer',
    industry: 'Creative',
    location: {
      city: 'Remote',
      country: 'UK',
      workType: 'remote',
    },
    salary: {
      min: 25000,
      max: 30000,
      currency: 'GBP',
      period: 'yearly',
      displayOnJD: true,
    },
    employmentType: 'permanent',
    seniorityLevel: 'junior',
    experienceYears: {
      min: 0,
      max: 2,
    },
    description: {
      overview: 'Creative agency seeking a talented Junior Designer...',
      responsibilities: [
        'Create visual designs',
        'Collaborate with creative team',
        'Present design concepts',
      ],
      requirements: {
        required: [
          { text: 'Portfolio of work', category: 'experience', priority: 'must-have' },
          { text: 'Adobe Creative Suite', category: 'technical', priority: 'must-have' },
        ],
        desirable: [
          { text: 'Figma experience', category: 'technical', priority: 'nice-to-have' },
        ],
      },
      format: 'markdown',
    },
    crmFields: {},
    crmFieldMapping: [],
    validationStatus: {
      overall: 'incomplete',
      requiredFields: {
        total: 10,
        completed: 7,
        missing: ['department', 'certifications', 'reports_to'],
      },
      optionalFields: {
        total: 15,
        completed: 2,
      },
      errors: [],
      warnings: [
        {
          fieldId: 'salary',
          fieldName: 'Salary',
          message: 'Salary is 5% below market average',
          suggestion: '£28k-£35k',
          canIgnore: true,
        },
      ],
      lastValidated: new Date(),
    },
    qualityMetrics: {
      clarity: 78,
      readability: 85,
      completeness: 70,
      overallScore: 78,
      bias: {
        level: 'none',
      },
      issues: [],
      analyzedAt: new Date(),
      version: '1.0',
    },
    createdBy: 'user_1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    version: 1,
    tags: [],
  },
];

export const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: 'approval_1',
    jobSpecId: 'job_2',
    jobSpec: mockJobSpecs[1],
    status: 'pending',
    urgency: 'urgent',
    submittedBy: 'user_2',
    assignedTo: 'manager_1',
    submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    submissionNotes: 'Client needs urgent response. High-profile role.',
    comments: [],
    changeRequests: [],
    insights: [
      {
        id: 'insight_1',
        type: 'salary_benchmark',
        severity: 'info',
        title: 'Salary is within market range',
        description: 'The salary range of £45k-£55k is competitive for Marketing Manager roles in London.',
        actionable: false,
      },
    ],
  },
];

export const mockTemplates: Template[] = [
  {
    id: 'template_1',
    name: 'Senior Developer Template',
    description: 'Standard template for senior developer roles across tech stack',
    industry: 'Technology',
    role: 'Software Engineer',
    seniorityLevel: 'senior',
    tags: ['tech', 'development', 'senior'],
    jobSpec: {
      title: 'Senior [Technology] Developer',
      industry: 'Technology',
      employmentType: 'permanent',
      seniorityLevel: 'senior',
      experienceYears: {
        min: 5,
        max: 10,
      },
      description: {
        overview: 'We are seeking an experienced Senior Developer...',
        responsibilities: [
          'Lead development projects',
          'Mentor junior developers',
          'Contribute to technical strategy',
        ],
        requirements: {
          required: [
            { text: '5+ years development experience', category: 'experience', priority: 'must-have' },
            { text: 'Strong communication skills', category: 'soft-skill', priority: 'must-have' },
          ],
          desirable: [],
        },
        format: 'markdown',
      },
    } as Partial<JobSpec>,
    createdBy: 'user_1',
    visibility: 'team',
    useCount: 15,
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
];

export const mockStats: JobForgeStats = {
  jobsCreated: 24,
  draftsCount: 3,
  awaitingApprovalCount: 2,
  approvedCount: 19,
  thisWeek: 8,
  averageQualityScore: 87,
};
