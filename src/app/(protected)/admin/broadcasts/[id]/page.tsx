'use client';

import { BroadcastEditor } from '@/components/cms/broadcasts/BroadcastEditor';
import { use } from 'react';

export default function EditBroadcastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <BroadcastEditor broadcastId={id} />;
}
