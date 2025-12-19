'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Save,
  Sparkles,
  Zap,
} from 'lucide-react';
import { TemplateSelector } from './wizard/TemplateSelector';
import { SpaceBrandingForm } from './wizard/SpaceBrandingForm';
import { SpacePrivacySettings } from './wizard/SpacePrivacySettings';
import { SpaceStructureBuilder } from './wizard/SpaceStructureBuilder';
import { SpaceInviteFlow } from './wizard/SpaceInviteFlow';
import { SpacePreview } from './wizard/SpacePreview';
import styles from './SpaceCreationWizard.module.scss';

type Step = 'template' | 'branding' | 'privacy' | 'structure' | 'invite' | 'review';

interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
  isDefault?: boolean;
}

interface SpaceTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  channels: Channel[];
  tags: string[];
  recommendedPrivacy: 'public' | 'private' | 'unlisted';
  recommendedJoinSetting: 'open' | 'request' | 'invite';
}

export interface SpaceData {
  // Step 1: Template
  templateId: string;

  // Step 2: Branding
  name: string;
  subtitle: string;
  description: string;
  handle: string;
  icon: string;
  coverImage: string;
  colorPalette: string[];

  // Step 3: Privacy
  visibility: 'public' | 'private' | 'unlisted';
  joinSetting: 'open' | 'request' | 'invite';
  inDirectory: boolean;
  tags: string[];
  searchIndexing: boolean;

  // Step 4: Structure
  channels: Channel[];
  categories: string[];

  // Step 5: Invite
  invites: {
    email: string;
    role: 'admin' | 'moderator' | 'member';
    name?: string;
    avatar?: string;
    userId?: string;
  }[];
  welcomeMessage: string;

  // Meta
  createdAt: string;
  isDraft: boolean;
}

export function SpaceCreationWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('template');
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);
  const [useAIDefaults, setUseAIDefaults] = useState(false);

  const [spaceData, setSpaceData] = useState<SpaceData>({
    templateId: '',
    name: '',
    subtitle: '',
    description: '',
    handle: '',
    icon: '',
    coverImage: '',
    colorPalette: ['#667eea', '#764ba2'],
    visibility: 'private',
    joinSetting: 'request',
    inDirectory: true,
    tags: [],
    searchIndexing: true,
    channels: [],
    categories: [],
    invites: [],
    welcomeMessage: '',
    createdAt: new Date().toISOString(),
    isDraft: true,
  });

  const steps: { id: Step; label: string; description: string }[] = [
    { id: 'template', label: 'Template', description: 'Choose your starting point' },
    { id: 'branding', label: 'Branding', description: 'Name and identity' },
    { id: 'privacy', label: 'Privacy', description: 'Who can access' },
    { id: 'structure', label: 'Structure', description: 'Organize your space' },
    { id: 'invite', label: 'Invite', description: 'Add your team' },
    { id: 'review', label: 'Review', description: 'Launch your space' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  // Auto-save draft
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (spaceData.name) {
        localStorage.setItem('space-draft', JSON.stringify(spaceData));
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(saveInterval);
  }, [spaceData]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('space-draft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        // Only load if less than 7 days old
        const draftAge = Date.now() - new Date(parsedDraft.createdAt).getTime();
        if (draftAge < 7 * 24 * 60 * 60 * 1000) {
          setSpaceData(parsedDraft);
        }
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('space-draft', JSON.stringify(spaceData));
    alert('Draft saved! You can return to complete this later.');
  };

  const handleCreateSpace = async () => {
    // Create space logic
    console.log('Creating space:', spaceData);
    localStorage.removeItem('space-draft');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to new space
    router.push(`/spaces/${spaceData.handle}`);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'template':
        return !!spaceData.templateId;
      case 'branding':
        return !!spaceData.name && !!spaceData.description;
      case 'privacy':
        return true; // Always has defaults
      case 'structure':
        return spaceData.channels.length > 0;
      case 'invite':
        return true; // Optional step
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const getStepStatus = (stepId: Step) => {
    if (stepId === currentStep) return 'active';
    if (completedSteps.includes(stepId)) return 'completed';
    return 'upcoming';
  };

  return (
    <div className={styles.wizard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={() => router.back()} className={styles.backButton}>
            <ArrowLeft />
            Back
          </button>

          <div className={styles.headerInfo}>
            <h1>Create Your Space</h1>
            <p>Set up a new space in just a few steps</p>
          </div>

          <div className={styles.headerActions}>
            <button onClick={handleSaveDraft} className={styles.saveDraftButton}>
              <Save />
              Save Draft
            </button>

            {!useAIDefaults && (
              <button
                onClick={() => setUseAIDefaults(true)}
                className={styles.aiDefaultsButton}
              >
                <Zap />
                Use AI Defaults
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className={styles.stepper}>
        <div className={styles.stepperContent}>
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            return (
              <div key={step.id} className={styles.stepperItem}>
                <div
                  className={`${styles.stepperCircle} ${styles[status]}`}
                  onClick={() => {
                    if (completedSteps.includes(step.id) || step.id === currentStep) {
                      setCurrentStep(step.id);
                    }
                  }}
                >
                  {status === 'completed' ? (
                    <Check />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className={styles.stepperLabel}>
                  <span className={styles.stepperName}>{step.label}</span>
                  <span className={styles.stepperDescription}>{step.description}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`${styles.stepperLine} ${
                    completedSteps.includes(step.id) ? styles.completed : ''
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className={styles.content}>
        <div className={styles.contentInner}>
          {currentStep === 'template' && (
            <TemplateSelector
              spaceData={spaceData}
              setSpaceData={setSpaceData}
              useAIDefaults={useAIDefaults}
            />
          )}

          {currentStep === 'branding' && (
            <SpaceBrandingForm
              spaceData={spaceData}
              setSpaceData={setSpaceData}
              useAIDefaults={useAIDefaults}
            />
          )}

          {currentStep === 'privacy' && (
            <SpacePrivacySettings
              spaceData={spaceData}
              setSpaceData={setSpaceData}
              useAIDefaults={useAIDefaults}
            />
          )}

          {currentStep === 'structure' && (
            <SpaceStructureBuilder
              spaceData={spaceData}
              setSpaceData={setSpaceData}
              useAIDefaults={useAIDefaults}
            />
          )}

          {currentStep === 'invite' && (
            <SpaceInviteFlow
              spaceData={spaceData}
              setSpaceData={setSpaceData}
              useAIDefaults={useAIDefaults}
            />
          )}

          {currentStep === 'review' && (
            <SpacePreview
              spaceData={spaceData}
              onEdit={(step) => setCurrentStep(step)}
              onCreate={handleCreateSpace}
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className={styles.previousButton}
          >
            <ArrowLeft />
            Previous
          </button>

          <div className={styles.footerProgress}>
            Step {currentStepIndex + 1} of {steps.length}
          </div>

          {currentStep === 'review' ? (
            <button
              onClick={handleCreateSpace}
              className={styles.createButton}
            >
              <Sparkles />
              Create Space
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={styles.nextButton}
            >
              Next
              <ArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
