'use client';

import { AuthRequired } from '@/components/ui/AuthRequired';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthRequired message="Please log in to access this page">
            {children}
        </AuthRequired>
    );
}
