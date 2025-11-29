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
import { Input, Button } from '../primitives';
import styles from './SpacesFilter.module.scss';

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
        <div className={styles.filter}>
            {/* Search Bar */}
            <div className={styles.search}>
                <MagnifyingGlassIcon className={styles.searchIcon} />
                <Input
                    type="text"
                    placeholder="Search spaces..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    disabled={isLoading}
                    fullWidth
                />
                {search && (
                    <Button
                        type="button"
                        onClick={() => setSearch('')}
                        aria-label="Clear search"
                        variant="ghost"
                        size="sm"
                    >
                        <Cross2Icon />
                    </Button>
                )}
            </div>

            <div className={styles.actions}>
                {/* Sort Select */}
                <Select.Root value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                    <Select.Trigger className={styles.sortTrigger} disabled={isLoading}>
                        <Select.Value placeholder="Sort by..." />
                        <Select.Icon className={styles.sortIcon}>
                            <ChevronDownIcon />
                        </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                        <Select.Content className={styles.sortContent}>
                            <Select.Viewport>
                                <Select.Item value="asc" className={styles.sortItem}>
                                    <Select.ItemText>A → Z</Select.ItemText>
                                    <Select.ItemIndicator className={styles.sortIndicator}>
                                        ✓
                                    </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item value="desc" className={styles.sortItem}>
                                    <Select.ItemText>Z → A</Select.ItemText>
                                    <Select.ItemIndicator className={styles.sortIndicator}>
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
                            className={styles.button}
                            disabled={isLoading}
                            aria-label="Open filters"
                        >
                            <MixerHorizontalIcon />
                            <span>Filters</span>
                            {activeFilterCount > 0 && (
                                <span className={styles.badge}>{activeFilterCount}</span>
                            )}
                        </button>
                    </Popover.Trigger>

                    <Popover.Portal>
                        <Popover.Content
                            className={styles.popover}
                            align="end"
                            sideOffset={8}
                        >
                            <div className={styles.popoverHeader}>
                                <h3 className={styles.popoverTitle}>Filter Spaces</h3>
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        className={styles.clearButton}
                                        onClick={handleClearFilters}
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <Separator.Root className={styles.separator} />

                            {/* Tags Filter */}
                            {tags.length > 0 && (
                                <div className={styles.section}>
                                    <Label.Root className={styles.sectionLabel}>
                                        Tags
                                    </Label.Root>

                                    <div className={styles.tags}>
                                        {tags.map((tag) => (
                                            <label
                                                key={tag.id}
                                                className={styles.tagItem}
                                            >
                                                <Checkbox.Root
                                                    className={styles.checkbox}
                                                    checked={selectedTags.includes(tag.id)}
                                                    onCheckedChange={() => handleTagToggle(tag.id)}
                                                >
                                                    <Checkbox.Indicator className={styles.checkboxIndicator}>
                                                        ✓
                                                    </Checkbox.Indicator>
                                                </Checkbox.Root>
                                                <span className={styles.tagLabel}>{tag.name}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Match All Tags Option */}
                                    {selectedTags.length > 1 && (
                                        <>
                                            <Separator.Root className={styles.separator} />
                                            <div className={styles.matchMode}>
                                                <Label.Root className={styles.sectionLabel}>
                                                    Match Mode
                                                </Label.Root>
                                                <RadioGroup.Root
                                                    value={matchAllTags ? 'all' : 'any'}
                                                    onValueChange={(value) => setMatchAllTags(value === 'all')}
                                                >
                                                    <label className={styles.radioItem}>
                                                        <RadioGroup.Item value="any" className={styles.radio}>
                                                            <RadioGroup.Indicator className={styles.radioIndicator} />
                                                        </RadioGroup.Item>
                                                        <span className={styles.radioLabel}>
                                                            Match <strong>any</strong> tag (OR)
                                                        </span>
                                                    </label>
                                                    <label className={styles.radioItem}>
                                                        <RadioGroup.Item value="all" className={styles.radio}>
                                                            <RadioGroup.Indicator className={styles.radioIndicator} />
                                                        </RadioGroup.Item>
                                                        <span className={styles.radioLabel}>
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
                                <div className={styles.empty}>
                                    <p>No tags available</p>
                                </div>
                            )}

                            <Popover.Arrow className={styles.popoverArrow} />
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
            </div>
        </div>
    );
}
