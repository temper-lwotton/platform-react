// JobSpec Analysis Types - Similar to Engagement Analysis

export interface JobSpecScores {
  overall: number;        // 0-100: Overall job spec quality
  clarity: number;        // 0-100: How clear the description is
  completeness: number;   // 0-100: How complete the information is
  appeal: number;         // 0-100: How attractive to candidates
  competitiveness: number; // 0-100: Market competitiveness
}

export interface JobSpecSentiment {
  tone: 'professional' | 'casual' | 'mixed' | 'corporate';
  inclusivity: 'inclusive' | 'somewhat-inclusive' | 'needs-improvement';
  confidence: number;     // 0-1: AI confidence
}

export interface JobSpecMetrics {
  wordCount: number;
  hasResponsibilities: boolean;
  hasRequirements: boolean;
  hasBenefits: boolean;
  hasSalary: boolean;
  responsibilitiesCount: number;
  requirementsCount: number;
  benefitsCount: number;
}

export interface JobSpecTip {
  id: string;
  category: 'clarity' | 'completeness' | 'bias' | 'competitiveness' | 'structure';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: number;           // 0-100: potential score improvement
  actionable: boolean;
  suggestion?: string;      // Specific suggestion
  currentValue?: string;    // What they have now
  suggestedValue?: string;  // What AI suggests
  fieldPath?: string;       // Path to field in jobData (e.g., 'title', 'description.overview', 'salary.min')
  appliedAction?: () => void; // Optional callback for complex updates
}

export interface JobSpecPredictions {
  expectedApplications: 'low' | 'medium' | 'high';
  expectedQualifiedCandidates: 'low' | 'medium' | 'high';
  timeToFill: string;       // e.g., "2-4 weeks"
  competitivenessLevel: 'below-market' | 'market-rate' | 'above-market';
}

export interface BiasDetection {
  hasBias: boolean;
  biasTypes: Array<{
    type: 'gender' | 'age' | 'cultural' | 'disability';
    text: string;            // The problematic text
    location: string;        // Where it appears
    suggestion: string;      // Better alternative
    severity: 'low' | 'medium' | 'high';
  }>;
  overallSeverity: 'none' | 'low' | 'medium' | 'high';
}

export interface SalaryBenchmark {
  providedRange: {
    min: number;
    max: number;
    currency: string;
  };
  marketRange: {
    min: number;
    max: number;
    percentile: number;      // Where their range falls (0-100)
  };
  recommendation: 'increase' | 'decrease' | 'good';
  notes: string;
}

export interface JobSpecAnalysis {
  scores: JobSpecScores;
  sentiment: JobSpecSentiment;
  metrics: JobSpecMetrics;
  tips: JobSpecTip[];
  predictions: JobSpecPredictions;
  biasDetection: BiasDetection;
  salaryBenchmark?: SalaryBenchmark;
  generatedAt: Date;
}

export interface AnalyzeJobSpecRequest {
  title: string;
  industry: string;
  seniorityLevel: string;
  location: {
    city: string;
    country: string;
    workType: string;
  };
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: {
    overview: string;
    responsibilities: string[];
    requirements: {
      required: Array<{ text: string }>;
      desirable: Array<{ text: string }>;
    };
    benefits?: string[];
  };
}

export interface AnalyzeJobSpecResponse {
  analysis: JobSpecAnalysis;
}
