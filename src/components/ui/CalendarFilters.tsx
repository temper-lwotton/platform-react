'use client';

import { useState, useMemo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Event, Space, Tag } from '@/lib/events';
import { Icon } from './Icon';
import { RadioGroup } from './primitives';

interface CalendarFiltersProps {
  events: Event[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  spaceIds: number[];
  tagIds: number[];
  isOnline: boolean | null; // null = both, true = online only, false = in-person only
}

export function CalendarFilters({ events, onFilterChange }: CalendarFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    spaceIds: [],
    tagIds: [],
    isOnline: null,
  });

  // Get unique spaces from events
  const spaces = useMemo(() => {
    const uniqueSpaces = new Map<number, Space>();
    events.forEach(event => {
      if (!uniqueSpaces.has(event.space.id)) {
        uniqueSpaces.set(event.space.id, event.space);
      }
    });
    return Array.from(uniqueSpaces.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [events]);

  // Get unique tags from events
  const tags = useMemo(() => {
    const uniqueTags = new Map<number, Tag>();
    events.forEach(event => {
      event.tags?.forEach(tag => {
        if (!uniqueTags.has(tag.id)) {
          uniqueTags.set(tag.id, tag);
        }
      });
    });
    return Array.from(uniqueTags.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [events]);

  const handleSpaceToggle = (spaceId: number) => {
    const newSpaceIds = filters.spaceIds.includes(spaceId)
      ? filters.spaceIds.filter(id => id !== spaceId)
      : [...filters.spaceIds, spaceId];

    const newFilters = { ...filters, spaceIds: newSpaceIds };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagToggle = (tagId: number) => {
    const newTagIds = filters.tagIds.includes(tagId)
      ? filters.tagIds.filter(id => id !== tagId)
      : [...filters.tagIds, tagId];

    const newFilters = { ...filters, tagIds: newTagIds };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationFilter = (value: boolean | null) => {
    const newFilters = { ...filters, isOnline: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    const newFilters = { spaceIds: [], tagIds: [], isOnline: null };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFilterCount =
    filters.spaceIds.length +
    filters.tagIds.length +
    (filters.isOnline !== null ? 1 : 0);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button className="calendar-filter-button" aria-label="Filters">
          <Icon icon="zap" size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="calendar-filter-badge">{activeFilterCount}</span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className="calendar-filter-popover" align="end" sideOffset={8}>
          <div className="calendar-filter-header">
            <h3 className="calendar-filter-title">Filters</h3>
            {activeFilterCount > 0 && (
              <button
                className="calendar-filter-clear"
                onClick={handleClearAll}
              >
                Clear all
              </button>
            )}
          </div>

          <div className="calendar-filter-content">
            {/* Location Filter */}
            <div className="calendar-filter-section">
              <RadioGroup
                label="Location"
                value={filters.isOnline === null ? 'all' : filters.isOnline ? 'online' : 'inperson'}
                onValueChange={(value) => {
                  if (value === 'all') handleLocationFilter(null);
                  else if (value === 'online') handleLocationFilter(true);
                  else handleLocationFilter(false);
                }}
                options={[
                  { value: 'all', label: 'All events' },
                  { value: 'online', label: 'Online only' },
                  { value: 'inperson', label: 'In-person only' }
                ]}
              />
            </div>

            {/* Space Filter */}
            {spaces.length > 0 && (
              <div className="calendar-filter-section">
                <h4 className="calendar-filter-section-title">Spaces</h4>
                <div className="calendar-filter-options">
                  {spaces.map(space => (
                    <label key={space.id} className="calendar-filter-option">
                      <Checkbox.Root
                        className="calendar-filter-checkbox"
                        checked={filters.spaceIds.includes(space.id)}
                        onCheckedChange={() => handleSpaceToggle(space.id)}
                      >
                        <Checkbox.Indicator className="calendar-filter-checkbox-indicator">
                          ✓
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <span>{space.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Tag Filter */}
            {tags.length > 0 && (
              <div className="calendar-filter-section">
                <h4 className="calendar-filter-section-title">Tags</h4>
                <div className="calendar-filter-options">
                  {tags.map(tag => (
                    <label key={tag.id} className="calendar-filter-option">
                      <Checkbox.Root
                        className="calendar-filter-checkbox"
                        checked={filters.tagIds.includes(tag.id)}
                        onCheckedChange={() => handleTagToggle(tag.id)}
                      >
                        <Checkbox.Indicator className="calendar-filter-checkbox-indicator">
                          ✓
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <span>{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Popover.Arrow className="calendar-filter-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// Helper function to apply filters to events
export function applyEventFilters(events: Event[], filters: FilterState): Event[] {
  return events.filter(event => {
    // Filter by space
    if (filters.spaceIds.length > 0 && !filters.spaceIds.includes(event.space.id)) {
      return false;
    }

    // Filter by tags
    if (filters.tagIds.length > 0) {
      const eventTagIds = event.tags?.map(t => t.id) || [];
      const hasMatchingTag = filters.tagIds.some(tagId => eventTagIds.includes(tagId));
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Filter by location
    if (filters.isOnline !== null && event.isOnline !== filters.isOnline) {
      return false;
    }

    return true;
  });
}
