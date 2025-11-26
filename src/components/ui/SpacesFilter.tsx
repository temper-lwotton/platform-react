'use client';

import { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Label from '@radix-ui/react-label';
import * as Separator from '@radix-ui/react-separator';
import { MagnifyingGlassIcon, MixerHorizontalIcon, Cross2Icon, ChevronDownIcon } from '@radix-ui/react-icons';
import type { SpaceTag, SpacesQueryParams } from '@/lib/spaces';

interface SpacesFilterProps {
    tags: SpaceTag[];
    onFilterChange: (params: SpacesQueryParams) => void;
    isLoading?: boolean;
}

export function SpacesFilter({ tags, onFilterChange, isLoading }: SpacesFilterProps) {
    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [matchAllTags, setMatchAllTags] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            emitFilterChange();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, selectedTags, matchAllTags, sortOrder]);

    const emitFilterChange = () => {
        const params: SpacesQueryParams = {
            search: search || undefined,
            tags: selectedTags.length > 0 ? selectedTags : undefined,
            matchAllTags: selectedTags.length > 1 ? matchAllTags : undefined,
            sort: sortOrder,
        };
        onFilterChange(params);
    };

    const handleTagToggle = (tagId: number) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedTags([]);
        setMatchAllTags(false);
        setSortOrder('asc');
    };

    const hasActiveFilters = search || selectedTags.length > 0 || sortOrder !== 'asc';
    const activeFilterCount = (search ? 1 : 0) + (selectedTags.length > 0 ? 1 : 0);

    return (
        <div className="spaces-filter">
            {/* Search Bar */}
            <div className="spaces-filter-search">
                <MagnifyingGlassIcon className="spaces-filter-search-icon" />
                <input
                    type="text"
                    className="spaces-filter-search-input"
                    placeholder="Search spaces..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    disabled={isLoading}
                />
                {search && (
                    <button
                        type="button"
                        className="spaces-filter-search-clear"
                        onClick={() => setSearch('')}
                        aria-label="Clear search"
                    >
                        <Cross2Icon />
                    </button>
                )}
            </div>

            <div className="spaces-filter-actions">
                {/* Sort Select */}
                <Select.Root value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                    <Select.Trigger className="spaces-filter-sort-trigger" disabled={isLoading}>
                        <Select.Value placeholder="Sort by..." />
                        <Select.Icon className="spaces-filter-sort-icon">
                            <ChevronDownIcon />
                        </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                        <Select.Content className="spaces-filter-sort-content">
                            <Select.Viewport>
                                <Select.Item value="asc" className="spaces-filter-sort-item">
                                    <Select.ItemText>A → Z</Select.ItemText>
                                    <Select.ItemIndicator className="spaces-filter-sort-indicator">
                                        ✓
                                    </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item value="desc" className="spaces-filter-sort-item">
                                    <Select.ItemText>Z → A</Select.ItemText>
                                    <Select.ItemIndicator className="spaces-filter-sort-indicator">
                                        ✓
                                    </Select.ItemIndicator>
                                </Select.Item>
                            </Select.Viewport>
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>

                {/* Filter Popover */}
                <Popover.Root open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <Popover.Trigger asChild>
                        <button
                            type="button"
                            className="spaces-filter-button"
                            disabled={isLoading}
                            aria-label="Open filters"
                        >
                            <MixerHorizontalIcon />
                            <span>Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="spaces-filter-badge">{activeFilterCount}</span>
                            )}
                        </button>
                    </Popover.Trigger>

                    <Popover.Portal>
                        <Popover.Content
                            className="spaces-filter-popover"
                            align="end"
                            sideOffset={8}
                        >
                            <div className="spaces-filter-popover-header">
                                <h3 className="spaces-filter-popover-title">Filter Spaces</h3>
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        className="spaces-filter-clear-button"
                                        onClick={handleClearFilters}
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <Separator.Root className="spaces-filter-separator" />

                            {/* Tags Filter */}
                            {tags.length > 0 && (
                                <div className="spaces-filter-section">
                                    <Label.Root className="spaces-filter-section-label">
                                        Tags
                                    </Label.Root>

                                    <div className="spaces-filter-tags">
                                        {tags.map((tag) => (
                                            <label
                                                key={tag.id}
                                                className="spaces-filter-tag-item"
                                            >
                                                <Checkbox.Root
                                                    className="spaces-filter-checkbox"
                                                    checked={selectedTags.includes(tag.id)}
                                                    onCheckedChange={() => handleTagToggle(tag.id)}
                                                >
                                                    <Checkbox.Indicator className="spaces-filter-checkbox-indicator">
                                                        ✓
                                                    </Checkbox.Indicator>
                                                </Checkbox.Root>
                                                <span className="spaces-filter-tag-label">{tag.name}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Match All Tags Option */}
                                    {selectedTags.length > 1 && (
                                        <>
                                            <Separator.Root className="spaces-filter-separator" />
                                            <div className="spaces-filter-match-mode">
                                                <Label.Root className="spaces-filter-section-label">
                                                    Match Mode
                                                </Label.Root>
                                                <RadioGroup.Root
                                                    value={matchAllTags ? 'all' : 'any'}
                                                    onValueChange={(value) => setMatchAllTags(value === 'all')}
                                                >
                                                    <label className="spaces-filter-radio-item">
                                                        <RadioGroup.Item value="any" className="spaces-filter-radio">
                                                            <RadioGroup.Indicator className="spaces-filter-radio-indicator" />
                                                        </RadioGroup.Item>
                                                        <span className="spaces-filter-radio-label">
                                                            Match <strong>any</strong> tag (OR)
                                                        </span>
                                                    </label>
                                                    <label className="spaces-filter-radio-item">
                                                        <RadioGroup.Item value="all" className="spaces-filter-radio">
                                                            <RadioGroup.Indicator className="spaces-filter-radio-indicator" />
                                                        </RadioGroup.Item>
                                                        <span className="spaces-filter-radio-label">
                                                            Match <strong>all</strong> tags (AND)
                                                        </span>
                                                    </label>
                                                </RadioGroup.Root>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {tags.length === 0 && (
                                <div className="spaces-filter-empty">
                                    <p>No tags available</p>
                                </div>
                            )}

                            <Popover.Arrow className="spaces-filter-popover-arrow" />
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
            </div>
        </div>
    );
}
