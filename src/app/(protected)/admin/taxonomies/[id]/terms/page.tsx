'use client';

import { TermsList } from '@/components/cms/taxonomies/TermsList';
import { use } from 'react';

export default function TermsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const taxonomyId = parseInt(id, 10);

  return <TermsList taxonomyId={taxonomyId} />;
}
