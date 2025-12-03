'use client';

import { PostTypeEditor } from '@/components/cms/post-types/PostTypeEditor';
import { use } from 'react';

export default function EditPostTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const postTypeId = parseInt(id, 10);

  return <PostTypeEditor postTypeId={postTypeId} />;
}
