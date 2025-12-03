'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, TrendingUp, Clock, DollarSign, FileSearch, ChevronDown, X } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import * as Select from '@radix-ui/react-select';
import * as Separator from '@radix-ui/react-separator';
import { OpenCallListItem, OpenCallStatus, OpenCallType } from '@/types/open-calls';
import OpenCallCard from '@/components/ui/OpenCallCard';
import styles from './page.module.scss';

// Mock data - will be replaced with API call
const mockOpenCalls: OpenCallListItem[] = [
  {
    id: 1,
    title: 'EU Innovation Fund 2025 - Clean Technology Projects',
    slug: 'eu-innovation-fund-2025',
    type: 'funding',
    status: 'open',
    shortDescription: 'Support for innovative clean technology projects that demonstrate significant potential for emission reductions.',
    coverImage: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&h=400&fit=crop',
    organization: 'European Commission',
    organizationLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/320px-Flag_of_Europe.svg.png',
    openDate: '2025-02-01T09:00:00Z',
    closeDate: '2025-06-30T17:00:00Z',
    fundingAmount: '€10M - €100M',
    tags: ['Clean Technology', 'Climate', 'Innovation'],
    featured: true,
  },
  {
    id: 2,
    title: 'Horizon Europe - Research Infrastructure Partnerships',
    slug: 'horizon-europe-research-infrastructure',
    type: 'collaboration',
    status: 'open',
    shortDescription: 'Build partnerships for developing and upgrading research infrastructures across Europe.',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
    organization: 'Horizon Europe',
    openDate: '2025-01-15T09:00:00Z',
    closeDate: '2025-05-15T17:00:00Z',
    fundingAmount: '€5M - €20M',
    tags: ['Research', 'Infrastructure', 'Collaboration'],
    featured: false,
  },
  {
    id: 3,
    title: 'Digital Europe Programme - AI Innovation Projects',
    slug: 'digital-europe-ai-innovation',
    type: 'innovation',
    status: 'closing-soon',
    shortDescription: 'Funding for AI-driven innovation projects that address societal challenges.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    organization: 'European Commission',
    organizationLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/320px-Flag_of_Europe.svg.png',
    openDate: '2024-11-01T09:00:00Z',
    closeDate: '2025-03-15T17:00:00Z',
    fundingAmount: '€2M - €10M',
    tags: ['AI', 'Digital', 'Innovation'],
    featured: true,
  },
  {
    id: 4,
    title: 'ERC Starting Grants 2025',
    slug: 'erc-starting-grants-2025',
    type: 'research',
    status: 'upcoming',
    shortDescription: 'Support for early-career researchers to establish their independent research teams.',
    coverImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=400&fit=crop',
    organization: 'European Research Council',
    openDate: '2025-04-01T09:00:00Z',
    closeDate: '2025-08-31T17:00:00Z',
    fundingAmount: '€1.5M',
    tags: ['Research', 'Early Career', 'ERC'],
    featured: false,
  },
  {
    id: 5,
    title: 'Marie Skłodowska-Curie Actions - Postdoctoral Fellowships',
    slug: 'msca-postdoc-fellowships',
    type: 'training',
    status: 'open',
    shortDescription: 'Postdoctoral fellowships to enhance creative and innovative potential of researchers.',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop',
    organization: 'European Commission',
    organizationLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/320px-Flag_of_Europe.svg.png',
    openDate: '2025-01-01T09:00:00Z',
    closeDate: '2025-09-15T17:00:00Z',
    fundingAmount: '€175K - €200K',
    tags: ['Training', 'Postdoc', 'Mobility'],
    featured: false,
  },
];

const statusFilters: { label: string; value: OpenCallStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Closing Soon', value: 'closing-soon' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Closed', value: 'closed' },
];

const typeFilters: { label: string; value: OpenCallType | 'all' }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Funding', value: 'funding' },
  { label: 'Collaboration', value: 'collaboration' },
  { label: 'Research', value: 'research' },
  { label: 'Innovation', value: 'innovation' },
  { label: 'Training', value: 'training' },
];

export default function OpenCallsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OpenCallStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<OpenCallType | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Get all unique tags from all open calls
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    mockOpenCalls.forEach((call) => {
      call.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  const clearTagFilters = () => {
    setSelectedTags(new Set());
  };

  // Filter open calls based on search and filters
  const filteredCalls = mockOpenCalls.filter((call) => {
    const matchesSearch =
      searchQuery === '' ||
      call.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    const matchesType = typeFilter === 'all' || call.type === typeFilter;
    const matchesTags = selectedTags.size === 0 || call.tags.some((tag) => selectedTags.has(tag));

    return matchesSearch && matchesStatus && matchesType && matchesTags;
  });

  // Calculate statistics
  const stats = {
    open: mockOpenCalls.filter((c) => c.status === 'open').length,
    closingSoon: mockOpenCalls.filter((c) => c.status === 'closing-soon').length,
    totalFunding: mockOpenCalls.length,
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Open Calls</h1>
          <p className={styles.subtitle}>
            Discover funding opportunities, collaboration calls, and other opportunities for your research and innovation projects.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <TrendingUp />
            <div>
              <span className={styles.statValue}>{stats.open}</span>
              <span className={styles.statLabel}>Open Now</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <Clock />
            <div>
              <span className={styles.statValue}>{stats.closingSoon}</span>
              <span className={styles.statLabel}>Closing Soon</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <DollarSign />
            <div>
              <span className={styles.statValue}>{stats.totalFunding}</span>
              <span className={styles.statLabel}>Total Opportunities</span>
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search />
            <input
              type="text"
              placeholder="Search open calls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filters}>
            {/* Status Filter - Radix Select */}
            <Select.Root value={statusFilter} onValueChange={(value) => setStatusFilter(value as OpenCallStatus | 'all')}>
              <Select.Trigger className={styles.filterButton}>
                <Select.Value />
                <Select.Icon>
                  <ChevronDown size={16} />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className={styles.selectContent}>
                  <Select.Viewport className={styles.selectViewport}>
                    {statusFilters.map((filter) => (
                      <Select.Item key={filter.value} value={filter.value} className={styles.selectItem}>
                        <Select.ItemText>{filter.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            {/* Type Filter - Radix Select */}
            <Select.Root value={typeFilter} onValueChange={(value) => setTypeFilter(value as OpenCallType | 'all')}>
              <Select.Trigger className={styles.filterButton}>
                <Select.Value />
                <Select.Icon>
                  <ChevronDown size={16} />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className={styles.selectContent}>
                  <Select.Viewport className={styles.selectViewport}>
                    {typeFilters.map((filter) => (
                      <Select.Item key={filter.value} value={filter.value} className={styles.selectItem}>
                        <Select.ItemText>{filter.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            {/* Tags Filter - Radix Popover */}
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className={styles.filterButton}>
                  <Filter size={16} />
                  <span>
                    {selectedTags.size === 0 ? 'All Tags' : `${selectedTags.size} Tag${selectedTags.size > 1 ? 's' : ''}`}
                  </span>
                  <ChevronDown size={16} />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className={styles.popoverContent} sideOffset={8}>
                  {selectedTags.size > 0 && (
                    <>
                      <button onClick={clearTagFilters} className={styles.clearTagsButton}>
                        Clear all tags
                      </button>
                      <Separator.Root className={styles.separator} />
                    </>
                  )}
                  <div className={styles.tagFilterList}>
                    {allTags.map((tag) => (
                      <label key={tag} className={styles.tagFilterItem}>
                        <input
                          type="checkbox"
                          checked={selectedTags.has(tag)}
                          onChange={() => toggleTag(tag)}
                          className={styles.tagFilterCheckbox}
                        />
                        <span className={styles.tagFilterLabel}>{tag}</span>
                      </label>
                    ))}
                  </div>
                  <Popover.Arrow className={styles.popoverArrow} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>

        {/* Active tag filters display */}
        {selectedTags.size > 0 && (
          <div className={styles.activeFilters}>
            <span className={styles.activeFiltersLabel}>Active tags:</span>
            <div className={styles.activeTagsList}>
              {Array.from(selectedTags).map((tag) => (
                <button
                  key={tag}
                  className={styles.activeTag}
                  onClick={() => toggleTag(tag)}
                  title="Click to remove"
                >
                  {tag}
                  <X size={14} className={styles.activeTagRemove} />
                </button>
              ))}
            </div>
            <button onClick={clearTagFilters} className={styles.clearAllButton}>
              Clear all
            </button>
          </div>
        )}

        {filteredCalls.length > 0 ? (
          <div className={styles.grid}>
            {filteredCalls.map((openCall) => (
              <OpenCallCard key={openCall.id} openCall={openCall} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FileSearch />
            <h3>No Open Calls Found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
