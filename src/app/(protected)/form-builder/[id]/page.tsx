'use client';

import { use } from 'react';
import FormBuilder from '@/components/form-builder/FormBuilder';

export default function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const formId = parseInt(id, 10);

  if (isNaN(formId)) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Invalid Form ID</h1>
        <p>The form ID must be a valid number.</p>
      </div>
    );
  }

  return <FormBuilder formId={formId} />;
}
