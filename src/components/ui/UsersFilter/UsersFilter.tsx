'use client';

import { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Popover from '@radix-ui/react-popover';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Label from '@radix-ui/react-label';
import * as Separator from '@radix-ui/react-separator';
import { MagnifyingGlassIcon, MixerHorizontalIcon, Cross2Icon, ChevronDownIcon } from '@radix-ui/react-icons';
import type { UsersQueryParams } from '@/lib/users';
import { Input, Button } from '../primitives';
import styles from './UsersFilter.module.scss';

interface UsersFilterProps {
    companyTypes: string[];
    transportModes: string[];
    onFilterChange: (params: UsersQueryParams) => void;
    isLoading?: boolean;
}

export function UsersFilter({ companyTypes, transportModes, onFilterChange, isLoading }: UsersFilterProps) {
    const [search, setSearch] = useState('');
    const [selectedCompanyType, setSelectedCompanyType] = useState<string>('');
    const [selectedTransportMode, setSelectedTransportMode] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'name' | 'newest' | 'oldest'>('name');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            emitFilterChange();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, selectedCompanyType, selectedTransportMode, sortOrder]);

    const emitFilterChange = () => {
        const params: UsersQueryParams = {
            search: search || undefined,
            companyType: selectedCompanyType || undefined,
            transportMode: selectedTransportMode || undefined,
            sort: sortOrder,
        };
        onFilterChange(params);
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedCompanyType('');
        setSelectedTransportMode('');
        setSortOrder('name');
    };

    const hasActiveFilters = search || selectedCompanyType || selectedTransportMode || sortOrder !== 'name';
    const activeFilterCount = (search ? 1 : 0) + (selectedCompanyType ? 1 : 0) + (selectedTransportMode ? 1 : 0);

    return (
        <div className={styles.filter}>
            {/* Search Bar */}
            <div className={styles.search}>
                <MagnifyingGlassIcon className={styles.searchIcon} />
                <Input
                    type="text"
                    placeholder="Search by name, company, or job title..."
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
                <Select.Root value={sortOrder} onValueChange={(value) => setSortOrder(value as 'name' | 'newest' | 'oldest')}>
                    <Select.Trigger className={styles.sortTrigger} disabled={isLoading}>
                        <Select.Value placeholder="Sort by..." />
                        <Select.Icon className={styles.sortIcon}>
                            <ChevronDownIcon />
                        </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                        <Select.Content className={styles.sortContent}>
                            <Select.Viewport>
                                <Select.Item value="name" className={styles.sortItem}>
                                    <Select.ItemText>Name (A → Z)</Select.ItemText>
                                    <Select.ItemIndicator className={styles.sortIndicator}>
                                        ✓
                                    </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item value="newest" className={styles.sortItem}>
                                    <Select.ItemText>Newest First</Select.ItemText>
                                    <Select.ItemIndicator className={styles.sortIndicator}>
                                        ✓
                                    </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item value="oldest" className={styles.sortItem}>
                                    <Select.ItemText>Oldest First</Select.ItemText>
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
                                <h3 className={styles.popoverTitle}>Filter Users</h3>
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

                            {/* Company Type Filter */}
                            {companyTypes.length > 0 && (
                                <>
                                    <div className={styles.section}>
                                        <Label.Root className={styles.sectionLabel}>
                                            Company Type
                                        </Label.Root>

                                        <RadioGroup.Root
                                            value={selectedCompanyType}
                                            onValueChange={setSelectedCompanyType}
                                        >
                                            <label className={styles.radioItem}>
                                                <RadioGroup.Item value="" className={styles.radio}>
                                                    <RadioGroup.Indicator className={styles.radioIndicator} />
                                                </RadioGroup.Item>
                                                <span className={styles.radioLabel}>All Types</span>
                                            </label>
                                            {companyTypes.map((type) => (
                                                <label key={type} className={styles.radioItem}>
                                                    <RadioGroup.Item value={type} className={styles.radio}>
                                                        <RadioGroup.Indicator className={styles.radioIndicator} />
                                                    </RadioGroup.Item>
                                                    <span className={styles.radioLabel}>{type}</span>
                                                </label>
                                            ))}
                                        </RadioGroup.Root>
                                    </div>
                                    <Separator.Root className={styles.separator} />
                                </>
                            )}

                            {/* Transport Mode Filter */}
                            {transportModes.length > 0 && (
                                <div className={styles.section}>
                                    <Label.Root className={styles.sectionLabel}>
                                        Transport Mode of Interest
                                    </Label.Root>

                                    <RadioGroup.Root
                                        value={selectedTransportMode}
                                        onValueChange={setSelectedTransportMode}
                                    >
                                        <label className={styles.radioItem}>
                                            <RadioGroup.Item value="" className={styles.radio}>
                                                <RadioGroup.Indicator className={styles.radioIndicator} />
                                            </RadioGroup.Item>
                                            <span className={styles.radioLabel}>All Modes</span>
                                        </label>
                                        {transportModes.map((mode) => (
                                            <label key={mode} className={styles.radioItem}>
                                                <RadioGroup.Item value={mode} className={styles.radio}>
                                                    <RadioGroup.Indicator className={styles.radioIndicator} />
                                                </RadioGroup.Item>
                                                <span className={styles.radioLabel}>{mode}</span>
                                            </label>
                                        ))}
                                    </RadioGroup.Root>
                                </div>
                            )}

                            {companyTypes.length === 0 && transportModes.length === 0 && (
                                <div className={styles.empty}>
                                    <p>No filters available</p>
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
