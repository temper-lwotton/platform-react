'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FormBuilderPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to forms listing page
    router.replace('/forms');
  }, [router]);

  return null;
}
