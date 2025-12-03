'use client';

import { BlockTemplateEditor } from '@/components/cms/blocks/BlockTemplateEditor';
import { use } from 'react';

export default function EditBlockTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const templateId = parseInt(id, 10);

  return <BlockTemplateEditor templateId={templateId} />;
}
