'use client';

import { SettingsLayout } from '@/components/cms/settings/SettingsLayout';
import { MessageSquare } from 'lucide-react';

export default function DiscussionSettingsPage() {
  return (
    <SettingsLayout>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Discussion Settings</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Comment and moderation settings coming soon...
        </p>
      </div>
    </SettingsLayout>
  );
}
