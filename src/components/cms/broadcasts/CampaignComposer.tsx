'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  Clock,
  Users,
  Mail,
  FileText,
  Sparkles,
  Eye,
  Calendar,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import styles from './CampaignComposer.module.scss';
import { BlockEmailEditor } from './BlockEmailEditor';

type Step = 'details' | 'audience' | 'content' | 'preview';

interface CampaignData {
  title: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  preheader: string;
  segment: string;
  content: string;
  sendOption: 'now' | 'schedule' | 'draft';
  scheduledFor?: string;
}

interface Segment {
  id: string;
  name: string;
  count: number;
  description: string;
}

interface SubjectSuggestion {
  text: string;
  reason: string;
  score: number;
}

// Dummy data
const segments: Segment[] = [
  { id: 'all', name: 'All Members', count: 2847, description: 'Everyone in your community' },
  { id: 'new', name: 'New Members', count: 324, description: 'Joined in the last 7 days' },
  { id: 'active', name: 'Active Members', count: 1456, description: 'Engaged regularly' },
  { id: 'power_user', name: 'Power Users', count: 289, description: 'High engagement & quality' },
  { id: 'champion', name: 'Champions', count: 47, description: 'Community leaders' },
  { id: 'at_risk', name: 'At Risk', count: 198, description: 'Declining activity' },
  { id: 'inactive', name: 'Inactive', count: 833, description: 'No activity > 30 days' },
];

const subjectSuggestions: SubjectSuggestion[] = [
  { text: '🌟 Your weekly community digest is here!', reason: 'Emojis increase open rates by 23%', score: 92 },
  { text: 'What did you miss this week?', reason: 'Questions engage curiosity', score: 88 },
  { text: 'Top discussions from this week', reason: 'Clear value proposition', score: 85 },
];

interface EmailBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'button' | 'image' | 'divider' | 'spacer';
  content: {
    text?: string;
    url?: string;
    alt?: string;
    level?: 'h1' | 'h2' | 'h3';
    buttonText?: string;
    buttonUrl?: string;
    height?: number;
  };
}

interface Template {
  name: string;
  description: string;
  blocks: EmailBlock[];
}

const contentTemplates: Template[] = [
  {
    name: 'Weekly Digest',
    description: 'Curated highlights from the past week',
    blocks: [
      {
        id: '1',
        type: 'heading',
        content: { text: "This Week's Highlights", level: 'h1' },
      },
      {
        id: '2',
        type: 'paragraph',
        content: { text: 'Here are the most popular discussions and updates from your community this week:' },
      },
      {
        id: '3',
        type: 'spacer',
        content: { height: 16 },
      },
      {
        id: '4',
        type: 'heading',
        content: { text: '🔥 Top Discussion', level: 'h3' },
      },
      {
        id: '5',
        type: 'paragraph',
        content: { text: '[Discussion title] - This conversation sparked great engagement with over 100 comments and insights from the community.' },
      },
      {
        id: '6',
        type: 'heading',
        content: { text: '✨ New Feature', level: 'h3' },
      },
      {
        id: '7',
        type: 'paragraph',
        content: { text: '[Feature name] - Check out our latest update that makes it easier than ever to connect with other members.' },
      },
      {
        id: '8',
        type: 'heading',
        content: { text: '🎉 Community Achievement', level: 'h3' },
      },
      {
        id: '9',
        type: 'paragraph',
        content: { text: 'We just hit [milestone]! Thank you for being part of this amazing community.' },
      },
      {
        id: '10',
        type: 'divider',
        content: {},
      },
      {
        id: '11',
        type: 'button',
        content: { buttonText: 'View All Discussions', buttonUrl: '#' },
      },
    ],
  },
  {
    name: 'Re-engagement',
    description: 'Win back inactive members',
    blocks: [
      {
        id: '1',
        type: 'heading',
        content: { text: 'We Miss You! 👋', level: 'h1' },
      },
      {
        id: '2',
        type: 'paragraph',
        content: { text: "Hey there! We noticed you haven't been around lately, and we wanted to share what you've been missing:" },
      },
      {
        id: '3',
        type: 'spacer',
        content: { height: 24 },
      },
      {
        id: '4',
        type: 'heading',
        content: { text: '🎉 Exciting New Features', level: 'h3' },
      },
      {
        id: '5',
        type: 'paragraph',
        content: { text: 'We recently launched [feature name] that makes it easier to stay connected with your interests.' },
      },
      {
        id: '6',
        type: 'heading',
        content: { text: '💬 Discussions You Might Like', level: 'h3' },
      },
      {
        id: '7',
        type: 'paragraph',
        content: { text: 'The community has been talking about [topic] - a conversation we think you\'d enjoy joining.' },
      },
      {
        id: '8',
        type: 'heading',
        content: { text: '👥 New Members', level: 'h3' },
      },
      {
        id: '9',
        type: 'paragraph',
        content: { text: 'Several new members who share your interests have joined. Come back and say hello!' },
      },
      {
        id: '10',
        type: 'divider',
        content: {},
      },
      {
        id: '11',
        type: 'button',
        content: { buttonText: 'Come Back & Join the Conversation', buttonUrl: '#' },
      },
      {
        id: '12',
        type: 'spacer',
        content: { height: 16 },
      },
      {
        id: '13',
        type: 'paragraph',
        content: { text: 'Your community is waiting for you!' },
      },
    ],
  },
  {
    name: 'Announcement',
    description: 'Share important news or updates',
    blocks: [
      {
        id: '1',
        type: 'heading',
        content: { text: 'Important Update 📢', level: 'h1' },
      },
      {
        id: '2',
        type: 'paragraph',
        content: { text: "We're excited to announce [your news here]!" },
      },
      {
        id: '3',
        type: 'spacer',
        content: { height: 24 },
      },
      {
        id: '4',
        type: 'paragraph',
        content: { text: '[Explain what this means for your community members and why it matters. Share the context and benefits.]' },
      },
      {
        id: '5',
        type: 'divider',
        content: {},
      },
      {
        id: '6',
        type: 'heading',
        content: { text: "What's Changing", level: 'h2' },
      },
      {
        id: '7',
        type: 'paragraph',
        content: { text: '✓ [Change or benefit 1]' },
      },
      {
        id: '8',
        type: 'paragraph',
        content: { text: '✓ [Change or benefit 2]' },
      },
      {
        id: '9',
        type: 'paragraph',
        content: { text: '✓ [Change or benefit 3]' },
      },
      {
        id: '10',
        type: 'divider',
        content: {},
      },
      {
        id: '11',
        type: 'button',
        content: { buttonText: 'Learn More', buttonUrl: '#' },
      },
      {
        id: '12',
        type: 'spacer',
        content: { height: 16 },
      },
      {
        id: '13',
        type: 'paragraph',
        content: { text: "We can't wait to hear what you think!" },
      },
    ],
  },
  {
    name: 'Welcome Series',
    description: 'Onboard new members',
    blocks: [
      {
        id: '1',
        type: 'heading',
        content: { text: 'Welcome to the Community! 🎉', level: 'h1' },
      },
      {
        id: '2',
        type: 'paragraph',
        content: { text: "We're thrilled to have you here! This community is a place where [describe your community's purpose and value]." },
      },
      {
        id: '3',
        type: 'spacer',
        content: { height: 24 },
      },
      {
        id: '4',
        type: 'heading',
        content: { text: 'Get Started', level: 'h2' },
      },
      {
        id: '5',
        type: 'paragraph',
        content: { text: 'Here are a few things to help you get started:' },
      },
      {
        id: '6',
        type: 'paragraph',
        content: { text: '1️⃣ Complete your profile - Let others know who you are' },
      },
      {
        id: '7',
        type: 'paragraph',
        content: { text: '2️⃣ Introduce yourself - Say hi in our introductions section' },
      },
      {
        id: '8',
        type: 'paragraph',
        content: { text: '3️⃣ Explore discussions - Find conversations that interest you' },
      },
      {
        id: '9',
        type: 'divider',
        content: {},
      },
      {
        id: '10',
        type: 'button',
        content: { buttonText: 'Complete Your Profile', buttonUrl: '#' },
      },
      {
        id: '11',
        type: 'spacer',
        content: { height: 16 },
      },
      {
        id: '12',
        type: 'paragraph',
        content: { text: 'Need help? Reply to this email and our team will be happy to assist you.' },
      },
    ],
  },
];

export function CampaignComposer() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [campaignData, setCampaignData] = useState<CampaignData>({
    title: '',
    subject: '',
    fromName: 'Community Team',
    fromEmail: 'team@community.com',
    preheader: '',
    segment: 'all',
    content: '',
    sendOption: 'draft',
  });
  const [selectedTemplate, setSelectedTemplate] = useState<EmailBlock[] | null>(null);

  const handleBack = () => {
    router.push('/admin/broadcasts');
  };

  const handleNext = () => {
    const steps: Step[] = ['details', 'audience', 'content', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: Step[] = ['details', 'audience', 'content', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSave = () => {
    console.log('Saving campaign:', campaignData);
    alert('Campaign saved as draft');
    router.push('/admin/broadcasts');
  };

  const handleSend = () => {
    console.log('Sending campaign:', campaignData);
    alert(campaignData.sendOption === 'now' ? 'Campaign sent!' : 'Campaign scheduled!');
    router.push('/admin/broadcasts');
  };

  const handleContentChange = (html: string) => {
    setCampaignData({ ...campaignData, content: html });
  };

  const handleUseSuggestion = (suggestion: SubjectSuggestion) => {
    setCampaignData({ ...campaignData, subject: suggestion.text });
  };

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template.blocks);
  };

  const steps = [
    { id: 'details' as Step, label: 'Campaign Details', icon: FileText },
    { id: 'audience' as Step, label: 'Select Audience', icon: Users },
    { id: 'content' as Step, label: 'Create Content', icon: Mail },
    { id: 'preview' as Step, label: 'Review & Send', icon: Send },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const selectedSegment = segments.find(s => s.id === campaignData.segment);

  return (
    <div className={styles.composer}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          <ArrowLeft />
          Back to Broadcasts
        </button>
        <h1>Create Campaign</h1>
      </div>

      {/* Progress Steps */}
      <div className={styles.progressSteps}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = index < currentStepIndex;

          return (
            <div
              key={step.id}
              className={`${styles.progressStep} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
            >
              <div className={styles.stepIcon}>
                {isCompleted ? <CheckCircle2 /> : <Icon />}
              </div>
              <div className={styles.stepLabel}>{step.label}</div>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className={styles.stepContent}>
        {/* Step 1: Campaign Details */}
        {currentStep === 'details' && (
          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <h2>Campaign Details</h2>
              <p>Give your campaign a name and craft the perfect subject line</p>
            </div>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Campaign Title (Internal)</label>
                <input
                  type="text"
                  value={campaignData.title}
                  onChange={(e) => setCampaignData({ ...campaignData, title: e.target.value })}
                  placeholder="e.g., Weekly Community Digest - March 2024"
                />
                <span className={styles.hint}>This is only visible to you and your team</span>
              </div>

              <div className={styles.formGroup}>
                <label>Email Subject Line</label>
                <input
                  type="text"
                  value={campaignData.subject}
                  onChange={(e) => setCampaignData({ ...campaignData, subject: e.target.value })}
                  placeholder="e.g., This week's top discussions"
                />
                <span className={styles.hint}>Keep it under 60 characters for best results</span>
              </div>

              {/* AI Suggestions */}
              <div className={styles.suggestions}>
                <div className={styles.suggestionsHeader}>
                  <Sparkles />
                  <h3>AI-Generated Subject Lines</h3>
                </div>
                <div className={styles.suggestionsList}>
                  {subjectSuggestions.map((suggestion, index) => (
                    <div key={index} className={styles.suggestion}>
                      <div className={styles.suggestionContent}>
                        <div className={styles.suggestionText}>{suggestion.text}</div>
                        <div className={styles.suggestionReason}>{suggestion.reason}</div>
                      </div>
                      <div className={styles.suggestionScore}>{suggestion.score}%</div>
                      <button
                        onClick={() => handleUseSuggestion(suggestion)}
                        className={styles.useButton}
                      >
                        Use This
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Preheader Text (Optional)</label>
                <input
                  type="text"
                  value={campaignData.preheader}
                  onChange={(e) => setCampaignData({ ...campaignData, preheader: e.target.value })}
                  placeholder="Preview text that appears after the subject line"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>From Name</label>
                  <input
                    type="text"
                    value={campaignData.fromName}
                    onChange={(e) => setCampaignData({ ...campaignData, fromName: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>From Email</label>
                  <input
                    type="email"
                    value={campaignData.fromEmail}
                    onChange={(e) => setCampaignData({ ...campaignData, fromEmail: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Audience Selection */}
        {currentStep === 'audience' && (
          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <h2>Select Your Audience</h2>
              <p>Choose which members will receive this campaign</p>
            </div>

            <div className={styles.segmentsGrid}>
              {segments.map((segment) => (
                <div
                  key={segment.id}
                  className={`${styles.segmentCard} ${campaignData.segment === segment.id ? styles.selected : ''}`}
                  onClick={() => setCampaignData({ ...campaignData, segment: segment.id })}
                >
                  <div className={styles.segmentHeader}>
                    <input
                      type="radio"
                      checked={campaignData.segment === segment.id}
                      onChange={() => setCampaignData({ ...campaignData, segment: segment.id })}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <h3>{segment.name}</h3>
                  </div>
                  <p className={styles.segmentDescription}>{segment.description}</p>
                  <div className={styles.segmentCount}>
                    <Users />
                    <span>{segment.count.toLocaleString()} members</span>
                  </div>
                </div>
              ))}
            </div>

            {selectedSegment && (
              <div className={styles.audienceSummary}>
                <Sparkles />
                <div>
                  <strong>Estimated Reach:</strong> Your campaign will be sent to{' '}
                  <strong>{selectedSegment.count.toLocaleString()} members</strong> in the{' '}
                  <strong>{selectedSegment.name}</strong> segment.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Content Creation */}
        {currentStep === 'content' && (
          <div className={styles.stepFullWidth}>
            <div className={styles.stepHeader}>
              <h2>Create Your Content</h2>
              <p>Build your email using drag-and-drop blocks</p>
            </div>

            {/* Templates */}
            <div className={styles.templates}>
              <div className={styles.templatesHeader}>
                <Zap />
                <h3>Start from a Template</h3>
              </div>
              <div className={styles.templatesList}>
                {contentTemplates.map((template, index) => (
                  <div key={index} className={styles.template}>
                    <div className={styles.templateInfo}>
                      <h4>{template.name}</h4>
                      <p>{template.description}</p>
                    </div>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className={styles.templateButton}
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <BlockEmailEditor
              initialContent={campaignData.content}
              initialBlocks={selectedTemplate}
              onChange={handleContentChange}
            />
          </div>
        )}

        {/* Step 4: Preview & Send */}
        {currentStep === 'preview' && (
          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <h2>Review & Send</h2>
              <p>Double-check everything before sending to your audience</p>
            </div>

            <div className={styles.preview}>
              <div className={styles.previewHeader}>
                <Eye />
                <h3>Campaign Preview</h3>
              </div>

              <div className={styles.previewDetails}>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Campaign Title:</span>
                  <span className={styles.previewValue}>{campaignData.title || 'Untitled Campaign'}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Subject:</span>
                  <span className={styles.previewValue}>{campaignData.subject || 'No subject'}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>From:</span>
                  <span className={styles.previewValue}>
                    {campaignData.fromName} &lt;{campaignData.fromEmail}&gt;
                  </span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Audience:</span>
                  <span className={styles.previewValue}>
                    {selectedSegment?.name} ({selectedSegment?.count.toLocaleString()} members)
                  </span>
                </div>
              </div>

              <div className={styles.previewEmail}>
                <div className={styles.emailHeader}>
                  <div className={styles.emailFrom}>
                    From: {campaignData.fromName} &lt;{campaignData.fromEmail}&gt;
                  </div>
                  <div className={styles.emailSubject}>Subject: {campaignData.subject}</div>
                </div>
                <div className={styles.emailBody} dangerouslySetInnerHTML={{ __html: campaignData.content || '<p>No content yet</p>' }} />
              </div>
            </div>

            <div className={styles.sendOptions}>
              <div className={styles.sendOptionsHeader}>
                <h3>Send Options</h3>
              </div>
              <div className={styles.sendOptionsGrid}>
                <label className={`${styles.sendOption} ${campaignData.sendOption === 'now' ? styles.selected : ''}`}>
                  <input
                    type="radio"
                    name="sendOption"
                    value="now"
                    checked={campaignData.sendOption === 'now'}
                    onChange={(e) => setCampaignData({ ...campaignData, sendOption: 'now' })}
                  />
                  <Send />
                  <div>
                    <h4>Send Now</h4>
                    <p>Campaign will be sent immediately</p>
                  </div>
                </label>

                <label className={`${styles.sendOption} ${campaignData.sendOption === 'schedule' ? styles.selected : ''}`}>
                  <input
                    type="radio"
                    name="sendOption"
                    value="schedule"
                    checked={campaignData.sendOption === 'schedule'}
                    onChange={(e) => setCampaignData({ ...campaignData, sendOption: 'schedule' })}
                  />
                  <Clock />
                  <div>
                    <h4>Schedule for Later</h4>
                    <p>Choose when to send this campaign</p>
                  </div>
                </label>

                <label className={`${styles.sendOption} ${campaignData.sendOption === 'draft' ? styles.selected : ''}`}>
                  <input
                    type="radio"
                    name="sendOption"
                    value="draft"
                    checked={campaignData.sendOption === 'draft'}
                    onChange={(e) => setCampaignData({ ...campaignData, sendOption: 'draft' })}
                  />
                  <FileText />
                  <div>
                    <h4>Save as Draft</h4>
                    <p>Save and send later</p>
                  </div>
                </label>
              </div>

              {campaignData.sendOption === 'schedule' && (
                <div className={styles.scheduleInput}>
                  <Calendar />
                  <input
                    type="datetime-local"
                    value={campaignData.scheduledFor}
                    onChange={(e) => setCampaignData({ ...campaignData, scheduledFor: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <div className={styles.navLeft}>
          {currentStepIndex > 0 && (
            <button onClick={handlePrevious} className={styles.secondaryButton}>
              <ArrowLeft />
              Previous
            </button>
          )}
        </div>
        <div className={styles.navRight}>
          <button onClick={handleSave} className={styles.secondaryButton}>
            <Save />
            Save Draft
          </button>
          {currentStepIndex < steps.length - 1 ? (
            <button onClick={handleNext} className={styles.primaryButton}>
              Next
              <ArrowRight />
            </button>
          ) : (
            <button onClick={handleSend} className={styles.primaryButton}>
              {campaignData.sendOption === 'now' ? <Send /> : <Clock />}
              {campaignData.sendOption === 'now' ? 'Send Campaign' : campaignData.sendOption === 'schedule' ? 'Schedule Campaign' : 'Save Draft'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
