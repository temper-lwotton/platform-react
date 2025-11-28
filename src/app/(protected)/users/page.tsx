'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers, User, UsersQueryParams, enrichUsersWithConnectionStatus } from '@/lib/users';
import { getCurrentUserId } from '@/lib/auth';
import { UserCard } from '@/components/ui/UserCard';
import { UsersFilter } from '@/components/ui/UsersFilter';
import { NewestMembers } from '@/components/ui/NewestMembers';
import { UserStats } from '@/components/ui/UserStats';

export default function UsersPage() {
    const queryClient = useQueryClient();
    const [filterParams, setFilterParams] = useState<UsersQueryParams>({});
    const currentUserId = getCurrentUserId();

    // Fetch all users WITHOUT filters (for stats calculation)
    const { data: allUsers, isLoading: isLoadingAllUsers } = useQuery<User[]>({
        queryKey: ['users', 'all'],
        queryFn: () => getUsers(),
    });

    // Fetch filtered users (for display) and enrich with connection status
    const { data: users, isLoading, error } = useQuery<User[]>({
        queryKey: ['users', filterParams, currentUserId],
        queryFn: async () => {
            const fetchedUsers = await getUsers(filterParams);
            if (!currentUserId) return fetchedUsers;
            return enrichUsersWithConnectionStatus(fetchedUsers, currentUserId);
        },
    });

    // Fetch newest users for sidebar (limit 5) and enrich with connection status
    const { data: newestUsers, isLoading: isLoadingNewest } = useQuery<User[]>({
        queryKey: ['users', 'newest', currentUserId],
        queryFn: async () => {
            const fetchedUsers = await getUsers({ sort: 'newest', limit: 5 });
            if (!currentUserId) return fetchedUsers;
            return enrichUsersWithConnectionStatus(fetchedUsers, currentUserId);
        },
    });

    // Calculate stats from ALL users (not filtered)
    const stats = useMemo(() => {
        if (!allUsers) {
            return { totalUsers: 0, newThisWeek: 0, activeSpaces: 0 };
        }

        const now = Date.now();
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

        const newThisWeek = allUsers.filter(user => {
            const createdAt = new Date(user.createdAt).getTime();
            return createdAt >= oneWeekAgo;
        }).length;

        // Count unique spaces
        const spaceIds = new Set<string>();
        allUsers.forEach(user => {
            user.adminSpaces.forEach(space => spaceIds.add(space.id));
            user.memberSpaces.forEach(space => spaceIds.add(space.id));
        });

        return {
            totalUsers: allUsers.length,
            newThisWeek,
            activeSpaces: spaceIds.size,
        };
    }, [allUsers]);

    // Extract unique company types and transport modes for filters (from ALL users)
    const { companyTypes, transportModes } = useMemo(() => {
        if (!allUsers) {
            return { companyTypes: [], transportModes: [] };
        }

        const companyTypesSet = new Set<string>();
        const transportModesSet = new Set<string>();

        allUsers.forEach(user => {
            if (user.profile.companyType) {
                companyTypesSet.add(user.profile.companyType);
            }
            if (user.profile.transportModesOfInterest) {
                // Handle both string and array types
                if (typeof user.profile.transportModesOfInterest === 'string') {
                    const modes = user.profile.transportModesOfInterest.split(',').map(m => m.trim());
                    modes.forEach(mode => mode && transportModesSet.add(mode));
                } else if (Array.isArray(user.profile.transportModesOfInterest)) {
                    (user.profile.transportModesOfInterest as any[]).forEach((mode: any) => {
                        const trimmed = String(mode).trim();
                        if (trimmed) transportModesSet.add(trimmed);
                    });
                }
            }
        });

        return {
            companyTypes: Array.from(companyTypesSet).sort(),
            transportModes: Array.from(transportModesSet).sort(),
        };
    }, [allUsers]);

    const handleFilterChange = (params: UsersQueryParams) => {
        setFilterParams(params);
    };

    // Callback when connection status changes - refresh user data
    const handleConnectionChange = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
    }, [queryClient]);

    if (error) {
        return (
            <main className="users-page">
                <p className="users-error">Error loading users. Please try again.</p>
            </main>
        );
    }

    const hasFilters = filterParams.search || filterParams.companyType || filterParams.transportMode;
    const showEmpty = !isLoading && (!users || users.length === 0);

    return (
        <main className="users-page">
            <div className="users-page-container">
                {/* Main Content */}
                <div className="users-page-main">
                    <header className="users-header">
                        <div className="users-header-content">
                            <div>
                                <h1 className="users-title">Community Members</h1>
                                <p className="users-subtitle">Connect with professionals in the transport community</p>
                            </div>
                            {users && users.length > 0 && (
                                <div className="users-count">
                                    {users.length} {users.length === 1 ? 'member' : 'members'}
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Filter Bar */}
                    <UsersFilter
                        companyTypes={companyTypes}
                        transportModes={transportModes}
                        onFilterChange={handleFilterChange}
                        isLoading={isLoading}
                    />

                    {/* Loading State */}
                    {isLoading && (
                        <div className="users-loading-container">
                            <p className="users-loading">Loading members...</p>
                        </div>
                    )}

                    {/* Users Grid */}
                    {!isLoading && users && users.length > 0 && (
                        <div className="users-grid">
                            {users.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onConnectionChange={handleConnectionChange}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {showEmpty && (
                        <div className="users-empty">
                            {hasFilters ? (
                                <>
                                    <p className="users-empty-title">No members found</p>
                                    <p className="users-empty-description">
                                        Try adjusting your search or filter criteria
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="users-empty-title">No members yet</p>
                                    <p className="users-empty-description">
                                        Be the first to join the community
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="users-page-sidebar">
                    <UserStats
                        totalUsers={stats.totalUsers}
                        newThisWeek={stats.newThisWeek}
                        activeSpaces={stats.activeSpaces}
                        isLoading={isLoadingAllUsers}
                    />
                    <NewestMembers
                        users={newestUsers || []}
                        isLoading={isLoadingNewest}
                    />
                </div>
            </div>
        </main>
    );
}
