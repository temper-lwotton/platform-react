'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateJob, useAIGeneration } from '@/lib/jobforge/hooks';
import { JobSpec } from '@/types/jobforge';
import { QualityScoreCard, ValidationIndicator } from '@/components/ui/JobForge';
import { Icon } from '@/components/ui/Icon';
import styles from '../jobforge.module.scss';

export default function CreateJobPage() {
  const router = useRouter();
  const { createJob, isCreating } = useCreateJob();
  const { generateJobDescription, isGenerating } = useAIGeneration();

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
      format: 'markdown',
    },
  });

  const [notes, setNotes] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');

  const handleSaveDraft = async () => {
    try {
      const savedJob = await createJob(jobData);
      router.push(`/jobforge/edit/${savedJob.id}`);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const handleGenerateAI = async () => {
    if (!notes.trim()) {
      alert('Please enter some notes about the job first');
      return;
    }

    const generated = await generateJobDescription(notes);
    setGeneratedDescription(generated);

    // Update job description with generated content
    setJobData(prev => ({
      ...prev,
      description: {
        ...prev.description!,
        overview: generated,
      },
    }));
  };

  return (
    <div className={styles.composer}>
      <div className={styles.composerHeader}>
        <div>
          <h1 className={styles.composerTitle}>Create New Job</h1>
          <p className={styles.composerSubtitle}>Use AI to create professional job descriptions</p>
        </div>
        <div className={styles.composerActions}>
          <button
            onClick={() => router.back()}
            className={styles.buttonSecondary}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isCreating}
            className={styles.buttonPrimary}
          >
            {isCreating ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
      </div>

      <div className={styles.composerContent}>
        {/* Main Form */}
        <div className={styles.composerMain}>
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Basic Information</h3>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Job Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.formInput}
                value={jobData.title}
                onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Industry <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.formSelect}
                  value={jobData.industry}
                  onChange={(e) => setJobData({ ...jobData, industry: e.target.value })}
                >
                  <option value="">Select industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Retail">Retail</option>
                  <option value="Education">Education</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Creative">Creative</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Seniority Level
                </label>
                <select
                  className={styles.formSelect}
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
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Location</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={jobData.location?.city}
                  onChange={(e) => setJobData({
                    ...jobData,
                    location: { ...jobData.location!, city: e.target.value }
                  })}
                  placeholder="City"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Work Type</label>
                <select
                  className={styles.formSelect}
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
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Salary Range</label>
                <div className={styles.salaryRange}>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={jobData.salary?.min || ''}
                    onChange={(e) => setJobData({
                      ...jobData,
                      salary: { ...jobData.salary!, min: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="Min"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={jobData.salary?.max || ''}
                    onChange={(e) => setJobData({
                      ...jobData,
                      salary: { ...jobData.salary!, max: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="Max"
                  />
                  <select
                    className={styles.formSelect}
                    value={jobData.salary?.currency}
                    onChange={(e) => setJobData({
                      ...jobData,
                      salary: { ...jobData.salary!, currency: e.target.value }
                    })}
                  >
                    <option value="GBP">GBP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Job Description</h3>

            <div className={styles.tabs}>
              <button className={styles.tabActive}>Your Notes</button>
              <button className={styles.tab}>Generated</button>
            </div>

            <div className={styles.formGroup}>
              <textarea
                className={styles.formTextarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your job notes here... e.g., 'We need a senior developer who knows React, can lead a team, and has AWS experience'"
                rows={8}
              />
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={isGenerating || !notes.trim()}
              className={styles.buttonAI}
            >
              {isGenerating ? (
                <>
                  <Icon icon="loader" size={18} />
                  Generating...
                </>
              ) : (
                <>
                  <Icon icon="sparkles" size={18} />
                  Generate with AI
                </>
              )}
            </button>

            {generatedDescription && (
              <div className={styles.generatedPreview}>
                <h4>Generated Description:</h4>
                <div className={styles.markdownPreview}>
                  {generatedDescription}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.composerSidebar}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Status</h3>
            <div className={styles.statusItem}>
              <span>Required Fields</span>
              <ValidationIndicator status="warning" message="2/10" />
            </div>
            <div className={styles.statusItem}>
              <span>Optional Fields</span>
              <ValidationIndicator status="empty" message="0/15" />
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Actions</h3>
            <button
              onClick={handleSaveDraft}
              disabled={isCreating}
              className={styles.sidebarButton}
            >
              <Icon icon="save" size={16} />
              Save Draft
            </button>
            <button className={styles.sidebarButton} disabled>
              <Icon icon="send" size={16} />
              Send for Approval
            </button>
            <button className={styles.sidebarButton} disabled>
              <Icon icon="upload" size={16} />
              Push to CRM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
