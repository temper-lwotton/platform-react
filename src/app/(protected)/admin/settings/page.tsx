'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect to general settings by default
export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/settings/general');
  }, [router]);

  return null;
}
