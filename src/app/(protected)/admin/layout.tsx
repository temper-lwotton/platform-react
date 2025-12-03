'use client';

import { CMSLayout } from '@/components/cms/layout/CMSLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CMSLayout>{children}</CMSLayout>;
}
