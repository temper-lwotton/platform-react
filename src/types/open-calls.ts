// Open Calls Type Definitions

export type OpenCallStatus = 'upcoming' | 'open' | 'closing-soon' | 'closed';
export type OpenCallType = 'funding' | 'collaboration' | 'research' | 'innovation' | 'training' | 'other';

export interface OpenCallDate {
  label: string;
  date: string; // ISO date string
  description?: string;
}

export interface OpenCallSection {
  id: string;
  title: string;
  content: string; // Rich text/markdown content
  order: number;
}

export interface OpenCallTab {
  id: string;
  label: string;
  sections: OpenCallSection[];
}

export interface EligibilityCriteria {
  id: string;
  criterion: string;
  required: boolean;
}

export interface ApplicationStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
}

export interface SupportingDocument {
  id: string;
  title: string;
  description?: string;
  url: string;
  fileType?: string;
  fileSize?: string;
}

export interface OpenCall {
  id: number;
  title: string;
  slug: string;
  type: OpenCallType;
  status: OpenCallStatus;

  // Summary information
  shortDescription: string;
  fullDescription: string;
  coverImage?: string;
  organization: string;
  organizationLogo?: string;

  // Key dates
  publishDate: string; // ISO date string
  openDate: string;
  closeDate: string;
  notificationDate?: string;
  projectStartDate?: string;
  keyDates: OpenCallDate[];

  // Funding details (if applicable)
  fundingAmount?: string; // e.g., "€50,000 - €200,000"
  totalBudget?: string;
  numberOfAwards?: number;

  // Eligibility
  eligibilityCriteria: EligibilityCriteria[];
  eligibilitySummary?: string;

  // Application process
  applicationUrl: string;
  applicationSteps: ApplicationStep[];
  applicationGuidelines?: string;

  // Supporting information
  supportingDocuments: SupportingDocument[];
  contactEmail?: string;
  contactPhone?: string;
  faqUrl?: string;

  // Tabs structure (flexible content)
  tabs: OpenCallTab[];

  // Metadata
  tags: string[];
  categories: string[];
  featured?: boolean;
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OpenCallListItem {
  id: number;
  title: string;
  slug: string;
  type: OpenCallType;
  status: OpenCallStatus;
  shortDescription: string;
  coverImage?: string;
  organization: string;
  organizationLogo?: string;
  openDate: string;
  closeDate: string;
  fundingAmount?: string;
  tags: string[];
  featured?: boolean;
}

export interface OpenCallListResponse {
  data: OpenCallListItem[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
