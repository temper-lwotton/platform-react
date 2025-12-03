'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, Clock, ExternalLink } from 'lucide-react';
import { OpenCall, OpenCallStatus, OpenCallType } from '@/types/open-calls';
import SummaryTab from '@/components/open-calls/tabs/SummaryTab';
import EligibilityTab from '@/components/open-calls/tabs/EligibilityTab';
import DatesTab from '@/components/open-calls/tabs/DatesTab';
import HowToApplyTab from '@/components/open-calls/tabs/HowToApplyTab';
import SupportingInfoTab from '@/components/open-calls/tabs/SupportingInfoTab';
import styles from './page.module.scss';

// Mock data - will be replaced with API call
const mockOpenCall: OpenCall = {
  id: 1,
  title: 'EU Innovation Fund 2025 - Clean Technology Projects',
  slug: 'eu-innovation-fund-2025',
  type: 'funding',
  status: 'open',
  shortDescription: 'Support for innovative clean technology projects that demonstrate significant potential for emission reductions.',
  fullDescription: `
    <p>The EU Innovation Fund is one of the world's largest funding programmes for the demonstration of innovative low-carbon technologies. It aims to bring to the market industrial solutions to decarbonise Europe and support its transition to climate neutrality while strengthening its economic growth and competitiveness.</p>
    <p>The Fund supports projects in energy-intensive industries, hydrogen, renewable energy, energy storage, and carbon capture, use and storage (CCUS). Projects should be innovative, demonstrate mature technologies, have significant emission reduction potential, and be located in EU Member States or specific associated countries.</p>
  `,
  coverImage: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200&h=600&fit=crop',
  organization: 'European Commission',
  organizationLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/320px-Flag_of_Europe.svg.png',
  publishDate: '2025-01-15T09:00:00Z',
  openDate: '2025-02-01T09:00:00Z',
  closeDate: '2025-06-30T17:00:00Z',
  notificationDate: '2025-10-15T09:00:00Z',
  projectStartDate: '2026-01-01T00:00:00Z',
  keyDates: [
    { label: 'Information webinar', date: '2025-02-15T14:00:00Z', description: 'Online information session for applicants' },
    { label: 'Q&A deadline', date: '2025-05-15T17:00:00Z', description: 'Last day to submit questions' },
    { label: 'Final submissions', date: '2025-06-30T17:00:00Z', description: 'All applications must be submitted' },
  ],
  fundingAmount: '€10M - €100M',
  totalBudget: '€3 billion',
  numberOfAwards: 25,
  eligibilityCriteria: [
    { id: '1', criterion: 'Legal entity established in an EU Member State or associated country', required: true },
    { id: '2', criterion: 'Project demonstrates innovative low-carbon technology', required: true },
    { id: '3', criterion: 'Technology at or beyond TRL 7 (technology readiness level)', required: true },
    { id: '4', criterion: 'Significant greenhouse gas emission reduction potential', required: true },
    { id: '5', criterion: 'Project scalability and replication potential', required: true },
    { id: '6', criterion: 'Sound financial and technical capacity', required: true },
    { id: '7', criterion: 'Previous EU funding experience', required: false },
  ],
  eligibilitySummary: 'This call is open to legal entities from EU Member States and associated countries with mature clean technology projects (TRL 7+) that can demonstrate significant emission reduction potential.',
  applicationUrl: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal',
  applicationSteps: [
    {
      id: '1',
      stepNumber: 1,
      title: 'Register on the Funding & Tenders Portal',
      description: 'Create an account and register your organization on the EC Funding & Tenders portal if you haven\'t already done so.',
    },
    {
      id: '2',
      stepNumber: 2,
      title: 'Prepare your project documentation',
      description: 'Gather all required documents including technical specifications, financial plans, emission reduction calculations, and supporting evidence.',
    },
    {
      id: '3',
      stepNumber: 3,
      title: 'Complete the online application form',
      description: 'Fill in all sections of the application form thoroughly, ensuring all mandatory fields are completed and documentation is attached.',
    },
    {
      id: '4',
      stepNumber: 4,
      title: 'Submit your application',
      description: 'Review your application carefully and submit before the deadline. You will receive a confirmation email upon successful submission.',
    },
  ],
  applicationGuidelines: '<p>All applications must be submitted through the EU Funding & Tenders Portal. Applications submitted by other means will not be considered. Please ensure you read the full Programme Guide before applying.</p>',
  supportingDocuments: [
    {
      id: '1',
      title: 'Programme Guide 2025',
      description: 'Complete guide to the Innovation Fund programme',
      url: '#',
      fileType: 'pdf',
      fileSize: '2.5 MB',
    },
    {
      id: '2',
      title: 'Application Template',
      description: 'Template for project application',
      url: '#',
      fileType: 'docx',
      fileSize: '1.2 MB',
    },
    {
      id: '3',
      title: 'Financial Plan Template',
      description: 'Template for financial planning and budget',
      url: '#',
      fileType: 'xlsx',
      fileSize: '850 KB',
    },
  ],
  contactEmail: 'innovation-fund@ec.europa.eu',
  contactPhone: '+32 2 299 11 11',
  faqUrl: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/support/faq',
  tabs: [
    { id: 'summary', label: 'Summary', sections: [] },
    { id: 'eligibility', label: 'Eligibility', sections: [] },
    { id: 'dates', label: 'Dates', sections: [] },
    { id: 'how-to-apply', label: 'How to Apply', sections: [] },
    { id: 'supporting-info', label: 'Supporting Info', sections: [] },
  ],
  tags: ['Clean Technology', 'Climate', 'Innovation', 'EU Funding', 'Decarbonisation'],
  categories: ['Environment', 'Technology', 'Research'],
  featured: true,
  viewCount: 1247,
  createdAt: '2025-01-15T09:00:00Z',
  updatedAt: '2025-01-15T09:00:00Z',
};

const statusLabels: Record<OpenCallStatus, string> = {
  upcoming: 'Upcoming',
  open: 'Open Now',
  'closing-soon': 'Closing Soon',
  closed: 'Closed',
};

const typeLabels: Record<OpenCallType, string> = {
  funding: 'Funding Opportunity',
  collaboration: 'Collaboration',
  research: 'Research',
  innovation: 'Innovation',
  training: 'Training',
  other: 'Other',
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const getTimeRemaining = (closeDate: string): string => {
  const now = new Date();
  const close = new Date(closeDate);
  const diff = close.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return 'Closed';
  if (days === 0) return 'Closes today';
  if (days === 1) return '1 day remaining';
  return `${days} days remaining`;
};

export default function OpenCallDetailPage() {
  const [activeTab, setActiveTab] = useState('summary');
  const openCall = mockOpenCall;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <SummaryTab openCall={openCall} />;
      case 'eligibility':
        return <EligibilityTab openCall={openCall} />;
      case 'dates':
        return <DatesTab openCall={openCall} />;
      case 'how-to-apply':
        return <HowToApplyTab openCall={openCall} />;
      case 'supporting-info':
        return <SupportingInfoTab openCall={openCall} />;
      default:
        return <SummaryTab openCall={openCall} />;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        {openCall.coverImage && (
          <img src={openCall.coverImage} alt={openCall.title} className={styles.heroImage} />
        )}
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/home">Home</Link>
            <ChevronRight size={16} />
            <Link href="/open-calls">Open Calls</Link>
            <ChevronRight size={16} />
            <span>{openCall.title}</span>
          </div>

          <div className={styles.heroHeader}>
            <span className={styles.statusBadge}>{statusLabels[openCall.status]}</span>
            <span className={styles.typeBadge}>{typeLabels[openCall.type]}</span>
          </div>

          <h1 className={styles.heroTitle}>{openCall.title}</h1>

          <div className={styles.heroOrg}>
            {openCall.organizationLogo && (
              <img src={openCall.organizationLogo} alt={openCall.organization} />
            )}
            <span>{openCall.organization}</span>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.mainContent}>
            <div className={styles.tabs}>
              {openCall.tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={styles.tabPanel}>
              {renderTabContent()}
            </div>
          </div>

          <div className={styles.sidebar}>
            {(openCall.status === 'open' || openCall.status === 'closing-soon') && (
              <div className={`${styles.sidebarCard} ${styles.ctaCard}`}>
                <h3 className={styles.ctaTitle}>Apply Now</h3>
                <p className={styles.ctaText}>
                  Submit your application before the deadline
                </p>
                <a
                  href={openCall.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaButton}
                >
                  Start Application
                  <ExternalLink />
                </a>
                <div className={styles.countdown}>
                  <div className={styles.countdownLabel}>Time Remaining</div>
                  <div className={styles.countdownValue}>{getTimeRemaining(openCall.closeDate)}</div>
                </div>
              </div>
            )}

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Key Dates</h3>
              <div className={styles.datesList}>
                <div className={styles.dateItem}>
                  <Calendar />
                  <div className={styles.dateContent}>
                    <div className={styles.dateLabel}>Opening Date</div>
                    <div className={styles.dateValue}>{formatDate(openCall.openDate)}</div>
                  </div>
                </div>
                <div className={styles.dateItem}>
                  <Clock />
                  <div className={styles.dateContent}>
                    <div className={styles.dateLabel}>Closing Date</div>
                    <div className={styles.dateValue}>{formatDate(openCall.closeDate)}</div>
                  </div>
                </div>
                {openCall.notificationDate && (
                  <div className={styles.dateItem}>
                    <Calendar />
                    <div className={styles.dateContent}>
                      <div className={styles.dateLabel}>Notification Date</div>
                      <div className={styles.dateValue}>{formatDate(openCall.notificationDate)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Quick Info</h3>
              <div className={styles.quickInfo}>
                {openCall.fundingAmount && (
                  <div className={styles.quickInfoItem}>
                    <span className={styles.quickInfoLabel}>Funding Amount</span>
                    <span className={styles.quickInfoValue}>{openCall.fundingAmount}</span>
                  </div>
                )}
                {openCall.totalBudget && (
                  <div className={styles.quickInfoItem}>
                    <span className={styles.quickInfoLabel}>Total Budget</span>
                    <span className={styles.quickInfoValue}>{openCall.totalBudget}</span>
                  </div>
                )}
                {openCall.numberOfAwards && (
                  <div className={styles.quickInfoItem}>
                    <span className={styles.quickInfoLabel}>Number of Awards</span>
                    <span className={styles.quickInfoValue}>{openCall.numberOfAwards}</span>
                  </div>
                )}
              </div>
            </div>

            {openCall.tags.length > 0 && (
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Tags</h3>
                <div className={styles.tagsList}>
                  {openCall.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
