'use client';

import { SettingsLayout } from '@/components/cms/settings/SettingsLayout';
import { Link as LinkIcon } from 'lucide-react';

export default function PermalinkSettingsPage() {
  return (
    <SettingsLayout>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <LinkIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Permalink Settings</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          URL structure and slug settings coming soon...
        </p>
      </div>
    </SettingsLayout>
  );
}
