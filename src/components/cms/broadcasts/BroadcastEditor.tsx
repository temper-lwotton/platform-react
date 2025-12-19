'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { BroadcastSetup } from './steps/BroadcastSetup';
import { BroadcastRecipients } from './steps/BroadcastRecipients';
import { BroadcastDesign } from './steps/BroadcastDesign';
import { BroadcastReview } from './steps/BroadcastReview';
import styles from './BroadcastEditor.module.scss';

interface BroadcastEditorProps {
  broadcastId?: string;
}

interface BroadcastData {
  name: string;
  subject: string;
  preheader: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  recipientType: 'all' | 'segment' | 'custom';
  recipientSegment?: string;
  recipientList?: string[];
  recipientCount: number;
  emailContent: any; // Will store the email builder JSON
  sendType: 'now' | 'scheduled';
  scheduledDate?: Date;
}

const steps = [
  { id: 1, name: 'Setup', component: BroadcastSetup },
  { id: 2, name: 'Recipients', component: BroadcastRecipients },
  { id: 3, name: 'Design', component: BroadcastDesign },
  { id: 4, name: 'Review', component: BroadcastReview },
];

export function BroadcastEditor({ broadcastId }: BroadcastEditorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [broadcastData, setBroadcastData] = useState<BroadcastData>({
    name: '',
    subject: '',
    preheader: '',
    fromName: '',
    fromEmail: '',
    replyTo: '',
    recipientType: 'all',
    recipientCount: 0,
    emailContent: null,
    sendType: 'now',
  });

  const isEditing = !!broadcastId;

  // Load template from localStorage if coming from event or discussion
  useEffect(() => {
    const source = searchParams.get('source');
    if ((source === 'event' || source === 'discussion') && typeof window !== 'undefined') {
      const templateJson = localStorage.getItem('broadcast_template');
      if (templateJson) {
        try {
          const template = JSON.parse(templateJson);
          setBroadcastData((prev) => ({
            ...prev,
            name: template.name || prev.name,
            subject: template.subject || prev.subject,
            preheader: template.preheader || prev.preheader,
            emailContent: template.emailContent || prev.emailContent,
          }));
          // Clear the template from localStorage after loading
          localStorage.removeItem('broadcast_template');
        } catch (error) {
          console.error('Failed to load broadcast template:', error);
        }
      }
    }
  }, [searchParams]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    // Only allow going to previous steps or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleUpdateData = (data: Partial<BroadcastData>) => {
    setBroadcastData((prev) => ({ ...prev, ...data }));
  };

  const handleSaveDraft = () => {
    console.log('Saving draft...', broadcastData);
    // TODO: Implement save draft API call
    router.push('/admin/broadcasts');
  };

  const handleSend = () => {
    console.log('Sending broadcast...', broadcastData);
    // TODO: Implement send API call
    router.push('/admin/broadcasts');
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => router.push('/admin/broadcasts')} className={styles.backButton}>
          <ChevronLeft className={styles.backIcon} />
          Back to Broadcasts
        </button>
        <h1 className={styles.title}>
          {isEditing ? 'Edit Broadcast' : 'Create New Broadcast'}
        </h1>
        <button onClick={handleSaveDraft} className={styles.saveButton}>
          Save Draft
        </button>
      </div>

      {/* Stepper */}
      <div className={styles.stepperWrapper}>
        <div className={styles.stepper}>
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isAccessible = step.id <= currentStep;

            return (
              <div key={step.id} className={styles.stepContainer}>
                <button
                  onClick={() => handleStepClick(step.id)}
                  className={`
                    ${styles.step}
                    ${isActive ? styles.active : ''}
                    ${isCompleted ? styles.completed : ''}
                    ${!isAccessible ? styles.disabled : ''}
                  `}
                  disabled={!isAccessible}
                >
                  <div className={styles.stepNumber}>
                    {isCompleted ? (
                      <Check className={styles.checkIcon} />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <div className={styles.stepInfo}>
                    <div className={styles.stepName}>{step.name}</div>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`${styles.stepConnector} ${
                      isCompleted ? styles.completed : ''
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className={styles.content}>
        <CurrentStepComponent
          data={broadcastData}
          onUpdate={handleUpdateData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>

      {/* Footer Navigation */}
      <div className={styles.footer}>
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={styles.footerButton}
        >
          <ChevronLeft className={styles.footerButtonIcon} />
          Previous
        </button>

        <div className={styles.footerCenter}>
          Step {currentStep} of {steps.length}
        </div>

        {currentStep < steps.length ? (
          <button onClick={handleNext} className={styles.footerButtonPrimary}>
            Next
            <ChevronRight className={styles.footerButtonIcon} />
          </button>
        ) : (
          <button onClick={handleSend} className={styles.footerButtonPrimary}>
            {broadcastData.sendType === 'scheduled' ? 'Schedule Broadcast' : 'Send Now'}
          </button>
        )}
      </div>
    </div>
  );
}
