'use client';

import { PostEditor } from '@/components/cms/posts/PostEditor';
import { use } from 'react';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const postId = parseInt(id, 10);

  return <PostEditor postId={postId} />;
}
