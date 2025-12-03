'use client';

import { TermEditor } from '@/components/cms/taxonomies/TermEditor';
import { use } from 'react';

export default function EditTermPage({
  params,
}: {
  params: Promise<{ id: string; termId: string }>;
}) {
  const { id, termId } = use(params);
  const taxonomyId = parseInt(id, 10);
  const termIdNum = parseInt(termId, 10);

  return <TermEditor taxonomyId={taxonomyId} termId={termIdNum} />;
}
