'use client';

import { useQuery } from '@tanstack/react-query';
import { getUsers, User } from '@/lib/users';
import { UserCard } from '@/components/ui/UserCard';

export default function UsersPage() {
    const { data, isLoading, error } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: getUsers,
    });

    if (isLoading) {
        return (
            <main className="users-page">
                <p className="users-loading">Loading users...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="users-page">
                <p className="users-error">Error loading users. Please try again.</p>
            </main>
        );
    }

    return (
        <main className="users-page">
            <header className="users-header">
                <h1 className="users-title">Users</h1>
                <p className="users-subtitle">Browse community members</p>
            </header>

            {data && data.length > 0 ? (
                <div className="users-grid">
                    {data.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            ) : (
                <div className="users-empty">
                    <p>No users found.</p>
                </div>
            )}
        </main>
    );
}
