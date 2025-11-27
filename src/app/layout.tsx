import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { QueryClientWrapper } from './query-client-provider';
import { Navigation } from '@/components/ui/Navigation';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/components/ui/ToastProvider';

const geist = Geist({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-geist',
    display: 'swap',
});

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
        <html lang="en" className={geist.variable}>
        <body className={geist.className}>
        <ThemeProvider>
            <QueryClientWrapper>
                <ToastProvider>
                    <Navigation />
                    {children}
                </ToastProvider>
            </QueryClientWrapper>
        </ThemeProvider>
        </body>
        </html>
    );
}
