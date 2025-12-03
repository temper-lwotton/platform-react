'use client';

import { TermEditor } from '@/components/cms/taxonomies/TermEditor';
import { use } from 'react';

export default function NewTermPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const taxonomyId = parseInt(id, 10);

  return <TermEditor taxonomyId={taxonomyId} />;
}
