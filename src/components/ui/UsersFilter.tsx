'use client';

import { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Popover from '@radix-ui/react-popover';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Label from '@radix-ui/react-label';
import * as Separator from '@radix-ui/react-separator';
import { MagnifyingGlassIcon, MixerHorizontalIcon, Cross2Icon, ChevronDownIcon } from '@radix-ui/react-icons';
import type { UsersQueryParams } from '@/lib/users';
import { Input, Button } from './primitives';

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
        <div className="users-filter">
            {/* Search Bar */}
            <div className="users-filter-search">
                <MagnifyingGlassIcon className="users-filter-search-icon" />
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

            <div className="users-filter-actions">
                {/* Sort Select */}
                <Select.Root value={sortOrder} onValueChange={(value) => setSortOrder(value as 'name' | 'newest' | 'oldest')}>
                    <Select.Trigger className="users-filter-sort-trigger" disabled={isLoading}>
                        <Select.Value placeholder="Sort by..." />
                        <Select.Icon className="users-filter-sort-icon">
                            <ChevronDownIcon />
                        </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                        <Select.Content className="users-filter-sort-content">
                            <Select.Viewport>
                                <Select.Item value="name" className="users-filter-sort-item">
                                    <Select.ItemText>Name (A → Z)</Select.ItemText>
                                    <Select.ItemIndicator className="users-filter-sort-indicator">
                                        ✓
                                    </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item value="newest" className="users-filter-sort-item">
                                    <Select.ItemText>Newest First</Select.ItemText>
                                    <Select.ItemIndicator className="users-filter-sort-indicator">
                                        ✓
                                    </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item value="oldest" className="users-filter-sort-item">
                                    <Select.ItemText>Oldest First</Select.ItemText>
                                    <Select.ItemIndicator className="users-filter-sort-indicator">
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
                            className="users-filter-button"
                            disabled={isLoading}
                            aria-label="Open filters"
                        >
                            <MixerHorizontalIcon />
                            <span>Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="users-filter-badge">{activeFilterCount}</span>
                            )}
                        </button>
                    </Popover.Trigger>

                    <Popover.Portal>
                        <Popover.Content
                            className="users-filter-popover"
                            align="end"
                            sideOffset={8}
                        >
                            <div className="users-filter-popover-header">
                                <h3 className="users-filter-popover-title">Filter Users</h3>
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        className="users-filter-clear-button"
                                        onClick={handleClearFilters}
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <Separator.Root className="users-filter-separator" />

                            {/* Company Type Filter */}
                            {companyTypes.length > 0 && (
                                <>
                                    <div className="users-filter-section">
                                        <Label.Root className="users-filter-section-label">
                                            Company Type
                                        </Label.Root>

                                        <RadioGroup.Root
                                            value={selectedCompanyType}
                                            onValueChange={setSelectedCompanyType}
                                        >
                                            <label className="users-filter-radio-item">
                                                <RadioGroup.Item value="" className="users-filter-radio">
                                                    <RadioGroup.Indicator className="users-filter-radio-indicator" />
                                                </RadioGroup.Item>
                                                <span className="users-filter-radio-label">All Types</span>
                                            </label>
                                            {companyTypes.map((type) => (
                                                <label key={type} className="users-filter-radio-item">
                                                    <RadioGroup.Item value={type} className="users-filter-radio">
                                                        <RadioGroup.Indicator className="users-filter-radio-indicator" />
                                                    </RadioGroup.Item>
                                                    <span className="users-filter-radio-label">{type}</span>
                                                </label>
                                            ))}
                                        </RadioGroup.Root>
                                    </div>
                                    <Separator.Root className="users-filter-separator" />
                                </>
                            )}

                            {/* Transport Mode Filter */}
                            {transportModes.length > 0 && (
                                <div className="users-filter-section">
                                    <Label.Root className="users-filter-section-label">
                                        Transport Mode of Interest
                                    </Label.Root>

                                    <RadioGroup.Root
                                        value={selectedTransportMode}
                                        onValueChange={setSelectedTransportMode}
                                    >
                                        <label className="users-filter-radio-item">
                                            <RadioGroup.Item value="" className="users-filter-radio">
                                                <RadioGroup.Indicator className="users-filter-radio-indicator" />
                                            </RadioGroup.Item>
                                            <span className="users-filter-radio-label">All Modes</span>
                                        </label>
                                        {transportModes.map((mode) => (
                                            <label key={mode} className="users-filter-radio-item">
                                                <RadioGroup.Item value={mode} className="users-filter-radio">
                                                    <RadioGroup.Indicator className="users-filter-radio-indicator" />
                                                </RadioGroup.Item>
                                                <span className="users-filter-radio-label">{mode}</span>
                                            </label>
                                        ))}
                                    </RadioGroup.Root>
                                </div>
                            )}

                            {companyTypes.length === 0 && transportModes.length === 0 && (
                                <div className="users-filter-empty">
                                    <p>No filters available</p>
                                </div>
                            )}

                            <Popover.Arrow className="users-filter-popover-arrow" />
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
            </div>
        </div>
    );
}
