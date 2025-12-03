'use client';

import { TaxonomyEditor } from '@/components/cms/taxonomies/TaxonomyEditor';
import { use } from 'react';

export default function EditTaxonomyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const taxonomyId = parseInt(id, 10);

  return <TaxonomyEditor taxonomyId={taxonomyId} />;
}
