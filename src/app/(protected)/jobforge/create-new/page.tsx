'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateJob, useJobAnalysis } from '@/lib/jobforge/hooks';
import { JobSpec } from '@/types/jobforge';
import { JobSpecAnalysis } from '@/components/ui/JobForge';
import { Icon } from '@/components/ui/Icon';
import styles from '../jobforge.module.scss';

type WizardStep = 'input' | 'analysis' | 'review';

interface ProposedChange {
  field: string;
  fieldLabel: string;
  original: string;
  improved: string;
  reasoning: string;
  accepted: boolean;
}

export default function CreateJobWizardPage() {
  const router = useRouter();
  const { createJob, isCreating } = useCreateJob();
  const { analyzeJobSpec, isAnalyzing } = useJobAnalysis();

  const [currentStep, setCurrentStep] = useState<WizardStep>('input');
  const [analysis, setAnalysis] = useState<any>(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [proposedChanges, setProposedChanges] = useState<ProposedChange[]>([]);
  const [originalJobData, setOriginalJobData] = useState<Partial<JobSpec> | null>(null);

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [jobData, setJobData] = useState<Partial<JobSpec>>({
    title: '',
    industry: '',
    location: {
      city: '',
      country: 'UK',
      workType: 'hybrid',
    },
    salary: {
      min: 0,
      max: 0,
      currency: 'GBP',
      period: 'yearly',
      displayOnJD: true,
    },
    employmentType: 'permanent',
    seniorityLevel: 'mid',
    experienceYears: {
      min: 0,
    },
    description: {
      overview: '',
      responsibilities: [],
      requirements: {
        required: [],
        desirable: [],
      },
      benefits: [],
      format: 'markdown',
    },
  });

  // Parse text input into responsibilities and requirements
  const parseDescriptionText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const responsibilities: string[] = [];
    const requiredSkills: Array<{ text: string }> = [];
    const desirableSkills: Array<{ text: string }> = [];
    const benefits: string[] = [];

    let currentSection: 'none' | 'responsibilities' | 'required' | 'desirable' | 'benefits' = 'none';

    for (const line of lines) {
      const lowerLine = line.toLowerCase();

      if (lowerLine.includes('responsibilit') || lowerLine.includes('duties')) {
        currentSection = 'responsibilities';
        continue;
      } else if (lowerLine.includes('required') || lowerLine.includes('must have')) {
        currentSection = 'required';
        continue;
      } else if (lowerLine.includes('desirable') || lowerLine.includes('nice to have')) {
        currentSection = 'desirable';
        continue;
      } else if (lowerLine.includes('benefit') || lowerLine.includes('perks')) {
        currentSection = 'benefits';
        continue;
      }

      const cleanedLine = line.replace(/^[-*•]\s*/, '').trim();
      if (!cleanedLine) continue;

      switch (currentSection) {
        case 'responsibilities':
          responsibilities.push(cleanedLine);
          break;
        case 'required':
          requiredSkills.push({ text: cleanedLine });
          break;
        case 'desirable':
          desirableSkills.push({ text: cleanedLine });
          break;
        case 'benefits':
          benefits.push(cleanedLine);
          break;
      }
    }

    return { responsibilities, requiredSkills, desirableSkills, benefits };
  };

  const handleAnalyze = async () => {
    // Extract structured fields from title and description
    const extractedFields = extractFieldsFromText(jobTitle, jobDescription);
    const parsed = parseDescriptionText(jobDescription);

    const updatedJobData = {
      ...jobData,
      title: jobTitle,
      industry: extractedFields.industry,
      seniorityLevel: extractedFields.seniorityLevel,
      location: {
        ...jobData.location!,
        city: extractedFields.location,
        workType: extractedFields.workType,
      },
      salary: extractedFields.salary.min > 0 ? extractedFields.salary : jobData.salary,
      description: {
        ...jobData.description!,
        overview: jobDescription.split('\n\n')[0] || jobDescription,
        responsibilities: parsed.responsibilities,
        requirements: {
          required: parsed.requiredSkills,
          desirable: parsed.desirableSkills,
        },
        benefits: parsed.benefits,
      },
    };

    setJobData(updatedJobData);

    // Save the original job data BEFORE any AI suggestions are applied
    setOriginalJobData(JSON.parse(JSON.stringify(updatedJobData)));

    const result = await analyzeJobSpec(updatedJobData);
    setAnalysis(result);
    setCurrentStep('analysis');
  };

  // Extract structured fields from free-form text
  const extractFieldsFromText = (title: string, description: string) => {
    const text = `${title} ${description}`.toLowerCase();

    // Extract industry
    let industry = 'Technology';
    if (text.includes('finance') || text.includes('banking') || text.includes('fintech')) industry = 'Finance';
    else if (text.includes('healthcare') || text.includes('medical') || text.includes('hospital')) industry = 'Healthcare';
    else if (text.includes('retail') || text.includes('ecommerce') || text.includes('shop')) industry = 'Retail';
    else if (text.includes('education') || text.includes('teaching') || text.includes('university')) industry = 'Education';
    else if (text.includes('marketing') || text.includes('advertising') || text.includes('brand')) industry = 'Marketing';
    else if (text.includes('design') || text.includes('creative') || text.includes('art')) industry = 'Creative';

    // Extract seniority
    let seniorityLevel: any = 'mid';
    if (text.includes('junior') || text.includes('graduate') || text.includes('entry')) seniorityLevel = 'junior';
    else if (text.includes('senior') || text.includes('lead')) seniorityLevel = 'senior';
    else if (text.includes('principal') || text.includes('staff') || text.includes('director')) seniorityLevel = 'lead';
    else if (text.includes('executive') || text.includes('vp') || text.includes('cto') || text.includes('ceo')) seniorityLevel = 'executive';

    // Extract location
    let location = '';
    if (text.includes('london')) location = 'London';
    else if (text.includes('manchester')) location = 'Manchester';
    else if (text.includes('birmingham')) location = 'Birmingham';
    else if (text.includes('leeds')) location = 'Leeds';
    else if (text.includes('glasgow')) location = 'Glasgow';
    else if (text.includes('new york')) location = 'New York';
    else if (text.includes('san francisco')) location = 'San Francisco';

    // Extract work type
    let workType: any = 'hybrid';
    if (text.includes('remote') || text.includes('work from home')) workType = 'remote';
    else if (text.includes('on-site') || text.includes('onsite') || text.includes('office')) workType = 'onsite';

    // Extract salary (basic pattern matching)
    let salary = { min: 0, max: 0, currency: 'GBP', period: 'yearly' as const, displayOnJD: true };
    const salaryMatch = text.match(/£?([\d,]+)k?\s*-\s*£?([\d,]+)k?/);
    if (salaryMatch) {
      const min = parseInt(salaryMatch[1].replace(/,/g, ''), 10);
      const max = parseInt(salaryMatch[2].replace(/,/g, ''), 10);
      // If numbers are small (e.g., 40-60), assume they're in thousands
      salary.min = min < 1000 ? min * 1000 : min;
      salary.max = max < 1000 ? max * 1000 : max;
    }

    return { industry, seniorityLevel, location, workType, salary };
  };

  const handleGoBack = () => {
    setCurrentStep('input');
  };

  const handleFinalize = async () => {
    try {
      const savedJob = await createJob(jobData);
      router.push(`/jobforge/drafts`);
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  // Helper function to set nested object values
  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((acc, key) => acc[key] = acc[key] || {}, obj);
    target[lastKey] = value;
    return obj;
  };

  const handleApplySuggestion = (tipId: string, fieldPath: string, value: string) => {
    // Create a deep clone of jobData
    const updatedJobData = JSON.parse(JSON.stringify(jobData));

    // Convert value to appropriate type based on field path
    let convertedValue: any = value;
    if (fieldPath.includes('salary.min') || fieldPath.includes('salary.max') || fieldPath.includes('experienceYears')) {
      convertedValue = parseInt(value, 10);
    }

    // Update the nested field
    setNestedValue(updatedJobData, fieldPath, convertedValue);

    // Update state
    setJobData(updatedJobData);

    // Track that this suggestion was applied
    setAppliedSuggestions(prev => new Set(prev).add(tipId));

    // Show visual feedback (you could add a toast notification here)
    console.log(`Applied suggestion ${tipId}: ${fieldPath} = ${convertedValue}`);
  };

  const handleProceedToReview = () => {
    // Generate proposed changes based on applied suggestions
    const changes: ProposedChange[] = [];

    if (!originalJobData) return;

    // Generate AI-improved content for each applied suggestion
    if (appliedSuggestions.size > 0) {
      // Title improvement
      if (appliedSuggestions.has('tip_0')) {
        const original = originalJobData.title || '';
        const improved = jobData.title || '';
        changes.push({
          field: 'title',
          fieldLabel: 'Job Title',
          original,
          improved,
          reasoning: 'Made the title more specific by adding seniority level and industry context. This helps candidates quickly understand the role level and domain.',
          accepted: true,
        });
      }

      // Overview improvement
      if (appliedSuggestions.has('tip_3')) {
        const original = originalJobData.description?.overview || '';
        const improved = jobData.description?.overview || '';
        changes.push({
          field: 'description.overview',
          fieldLabel: 'Job Overview',
          original,
          improved,
          reasoning: 'Expanded the overview to provide more context about the role, team, and company culture. Added compelling language to attract qualified candidates.',
          accepted: true,
        });
      }

      // Salary improvements
      if (appliedSuggestions.has('tip_4a') || appliedSuggestions.has('tip_4b')) {
        const originalMin = originalJobData?.salary?.min || 0;
        const originalMax = originalJobData?.salary?.max || 0;
        const improvedMin = jobData.salary?.min || 0;
        const improvedMax = jobData.salary?.max || 0;

        changes.push({
          field: 'salary',
          fieldLabel: 'Salary Range',
          original: `£${originalMin.toLocaleString()} - £${originalMax.toLocaleString()}`,
          improved: `£${improvedMin.toLocaleString()} - £${improvedMax.toLocaleString()}`,
          reasoning: 'Increased salary range by 15% to align with current market rates for this role and seniority level. This makes the position more competitive and attractive to top talent.',
          accepted: true,
        });
      }
    }

    setProposedChanges(changes);
    setCurrentStep('review');
  };

  const handleToggleChange = (index: number) => {
    const updated = [...proposedChanges];
    updated[index].accepted = !updated[index].accepted;
    setProposedChanges(updated);
  };

  const handleAcceptAll = () => {
    const updated = proposedChanges.map(change => ({ ...change, accepted: true }));
    setProposedChanges(updated);
  };

  const handleRejectAll = () => {
    const updated = proposedChanges.map(change => ({ ...change, accepted: false }));
    setProposedChanges(updated);
  };

  const handleApplyAcceptedChanges = async () => {
    // Apply only the accepted changes
    const updatedJobData = JSON.parse(JSON.stringify(originalJobData));

    proposedChanges.forEach(change => {
      if (change.accepted) {
        if (change.field === 'salary') {
          // Parse the improved salary string
          const match = change.improved.match(/£([\d,]+)\s*-\s*£([\d,]+)/);
          if (match) {
            const min = parseInt(match[1].replace(/,/g, ''), 10);
            const max = parseInt(match[2].replace(/,/g, ''), 10);
            updatedJobData.salary = { ...updatedJobData.salary, min, max };
          }
        } else {
          setNestedValue(updatedJobData, change.field, change.improved);
        }
      }
    });

    // Save the job with the updated data
    try {
      const savedJob = await createJob(updatedJobData);
      router.push(`/jobforge/drafts`);
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  return (
    <div className={styles.wizardContainer}>
      {/* Progress Steps */}
      <div className={styles.wizardSteps}>
        <div className={`${styles.wizardStep} ${currentStep === 'input' ? styles.active : ''} ${(currentStep === 'analysis' || currentStep === 'review') ? styles.completed : ''}`}>
          <div className={styles.stepNumber}>
            {(currentStep === 'analysis' || currentStep === 'review') ? <Icon icon="check" size={16} /> : '1'}
          </div>
          <div className={styles.stepLabel}>
            <div className={styles.stepTitle}>Input Details</div>
            <div className={styles.stepDescription}>Add job information</div>
          </div>
        </div>

        <div className={styles.stepConnector} />

        <div className={`${styles.wizardStep} ${currentStep === 'analysis' ? styles.active : ''} ${currentStep === 'review' ? styles.completed : ''}`}>
          <div className={styles.stepNumber}>
            {currentStep === 'review' ? <Icon icon="check" size={16} /> : '2'}
          </div>
          <div className={styles.stepLabel}>
            <div className={styles.stepTitle}>AI Analysis</div>
            <div className={styles.stepDescription}>Get feedback</div>
          </div>
        </div>

        <div className={styles.stepConnector} />

        <div className={`${styles.wizardStep} ${currentStep === 'review' ? styles.active : ''}`}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepLabel}>
            <div className={styles.stepTitle}>Review Changes</div>
            <div className={styles.stepDescription}>Accept or adjust</div>
          </div>
        </div>
      </div>

      {/* Step 1: Input Form */}
      {currentStep === 'input' && (
        <div className={styles.wizardContent}>
          <div className={styles.wizardHeader}>
            <h1 className={styles.wizardTitle}>Create Job Specification</h1>
            <p className={styles.wizardSubtitle}>
              Enter the job title and description. Our AI will extract details and structure the information for you.
            </p>
          </div>

          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Job Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.formInput}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Job Description <span className={styles.required}>*</span>
              </label>
              <p className={styles.formHelp}>
                Paste or type the full job description. Include responsibilities, requirements, salary, location, and any other details. Our AI will extract and organize everything.
              </p>
              <textarea
                className={styles.formTextarea}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Example:

We are seeking an experienced Senior Software Engineer to join our growing technology team in London. This is a hybrid role offering £60,000 - £80,000.

Responsibilities:
- Lead development of React applications
- Mentor junior developers
- Design scalable architectures

Required Skills:
- 5+ years React experience
- Strong communication skills
- Leadership experience

Benefits:
- Health insurance
- Remote work options
- Professional development budget"
                rows={20}
              />
            </div>
          </div>

          <div className={styles.wizardActions}>
            <button onClick={() => router.back()} className={styles.buttonSecondary}>
              Cancel
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!jobTitle.trim() || !jobDescription.trim() || isAnalyzing}
              className={styles.buttonPrimary}
            >
              {isAnalyzing ? (
                <>
                  <div className={styles.buttonSpinner} />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  Analyze with AI →
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: AI Analysis & Review */}
      {currentStep === 'analysis' && (
        <div className={styles.wizardContent}>
          <div className={styles.wizardHeader}>
            <h1 className={styles.wizardTitle}>AI Analysis & Feedback</h1>
            <p className={styles.wizardSubtitle}>
              Review the extracted details and AI analysis. Edit any fields as needed.
            </p>
          </div>

          {/* Extracted Fields - Editable */}
          <div className={styles.extractedFields}>
            <h3 className={styles.extractedTitle}>Extracted Details</h3>
            <p className={styles.extractedSubtitle}>Our AI extracted these details from your description. Feel free to adjust them.</p>

            <div className={styles.fieldGrid}>
              <div className={styles.fieldItem}>
                <label className={styles.fieldLabel}>Industry</label>
                <select
                  className={styles.fieldInput}
                  value={jobData.industry}
                  onChange={(e) => setJobData({ ...jobData, industry: e.target.value })}
                >
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Retail">Retail</option>
                  <option value="Education">Education</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Creative">Creative</option>
                </select>
              </div>

              <div className={styles.fieldItem}>
                <label className={styles.fieldLabel}>Seniority</label>
                <select
                  className={styles.fieldInput}
                  value={jobData.seniorityLevel}
                  onChange={(e) => setJobData({ ...jobData, seniorityLevel: e.target.value as any })}
                >
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div className={styles.fieldItem}>
                <label className={styles.fieldLabel}>Location</label>
                <input
                  type="text"
                  className={styles.fieldInput}
                  value={jobData.location?.city}
                  onChange={(e) => setJobData({
                    ...jobData,
                    location: { ...jobData.location!, city: e.target.value }
                  })}
                  placeholder="City"
                />
              </div>

              <div className={styles.fieldItem}>
                <label className={styles.fieldLabel}>Work Type</label>
                <select
                  className={styles.fieldInput}
                  value={jobData.location?.workType}
                  onChange={(e) => setJobData({
                    ...jobData,
                    location: { ...jobData.location!, workType: e.target.value as any }
                  })}
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>

              <div className={styles.fieldItem}>
                <label className={styles.fieldLabel}>Salary Min</label>
                <input
                  type="number"
                  className={styles.fieldInput}
                  value={jobData.salary?.min || ''}
                  onChange={(e) => setJobData({
                    ...jobData,
                    salary: { ...jobData.salary!, min: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="Min"
                />
              </div>

              <div className={styles.fieldItem}>
                <label className={styles.fieldLabel}>Salary Max</label>
                <input
                  type="number"
                  className={styles.fieldInput}
                  value={jobData.salary?.max || ''}
                  onChange={(e) => setJobData({
                    ...jobData,
                    salary: { ...jobData.salary!, max: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          <JobSpecAnalysis
            analysis={analysis}
            isLoading={isAnalyzing}
            onRetry={handleAnalyze}
            onApplySuggestion={handleApplySuggestion}
            appliedSuggestions={appliedSuggestions}
          />

          <div className={styles.wizardActions}>
            <button onClick={handleGoBack} className={styles.buttonSecondary}>
              ← Go Back & Edit
            </button>
            {appliedSuggestions.size > 0 ? (
              <button
                onClick={handleProceedToReview}
                className={styles.buttonPrimary}
              >
                Proceed to Review Changes →
              </button>
            ) : (
              <button
                onClick={handleFinalize}
                disabled={isCreating}
                className={styles.buttonPrimary}
              >
                {isCreating ? (
                  <>
                    <div className={styles.buttonSpinner} />
                    Saving...
                  </>
                ) : (
                  'Skip & Save Draft'
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Review AI Changes */}
      {currentStep === 'review' && (
        <div className={styles.wizardContent}>
          <div className={styles.wizardHeader}>
            <h1 className={styles.wizardTitle}>Review AI Improvements</h1>
            <p className={styles.wizardSubtitle}>
              Review the changes suggested by our AI. Accept or reject each change, then finalize your job spec.
            </p>
          </div>

          {proposedChanges.length > 0 && (
            <div className={styles.reviewActions}>
              <button onClick={handleAcceptAll} className={styles.buttonSecondary}>
                <Icon icon="check" size={16} />
                Accept All
              </button>
              <button onClick={handleRejectAll} className={styles.buttonSecondary}>
                <Icon icon="x" size={16} />
                Reject All
              </button>
            </div>
          )}

          <div className={styles.changesContainer}>
            {proposedChanges.map((change, index) => (
              <div key={index} className={`${styles.changeCard} ${change.accepted ? styles.accepted : styles.rejected}`}>
                <div className={styles.changeHeader}>
                  <h3 className={styles.changeTitle}>{change.fieldLabel}</h3>
                  <button
                    onClick={() => handleToggleChange(index)}
                    className={change.accepted ? styles.acceptButton : styles.rejectButton}
                  >
                    <Icon icon={change.accepted ? 'check' : 'x'} size={16} />
                    {change.accepted ? 'Accepted' : 'Rejected'}
                  </button>
                </div>

                <div className={styles.changeReasoning}>
                  <Icon icon="lightbulb" size={16} />
                  <span>{change.reasoning}</span>
                </div>

                <div className={styles.changeComparison}>
                  <div className={styles.comparisonSide}>
                    <div className={styles.comparisonLabel}>Original</div>
                    <div className={styles.comparisonContent}>
                      {change.original || '(empty)'}
                    </div>
                  </div>

                  <div className={styles.comparisonArrow}>
                    <Icon icon="arrowRight" size={24} />
                  </div>

                  <div className={styles.comparisonSide}>
                    <div className={styles.comparisonLabel}>AI Improved</div>
                    <div className={`${styles.comparisonContent} ${styles.improved}`}>
                      {change.improved}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {proposedChanges.length === 0 && (
            <div className={styles.empty}>
              <Icon icon="info" size={48} />
              <p>No changes to review. You can go back to apply suggestions or save your job spec as is.</p>
            </div>
          )}

          <div className={styles.wizardActions}>
            <button onClick={() => setCurrentStep('analysis')} className={styles.buttonSecondary}>
              ← Back to Analysis
            </button>
            <button
              onClick={handleApplyAcceptedChanges}
              disabled={isCreating}
              className={styles.buttonPrimary}
            >
              {isCreating ? (
                <>
                  <div className={styles.buttonSpinner} />
                  Saving...
                </>
              ) : (
                `Apply ${proposedChanges.filter(c => c.accepted).length} Changes & Save Draft`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
