'use client';

import { SettingsLayout } from '@/components/cms/settings/SettingsLayout';
import { PermalinkSettings } from '@/components/cms/settings/PermalinkSettings';

export default function PermalinkSettingsPage() {
  return (
    <SettingsLayout>
      <PermalinkSettings />
    </SettingsLayout>
  );
}
