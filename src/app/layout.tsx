import type { Metadata } from 'next';
import './globals.css';
import { QueryClientWrapper } from './query-client-provider';
import { Navigation } from '@/components/ui/Navigation';

export const metadata: Metadata = {
    title: 'Spaces',
    description: 'Spaces community platform',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <QueryClientWrapper>
            <Navigation />
            {children}
        </QueryClientWrapper>
        </body>
        </html>
    );
}
