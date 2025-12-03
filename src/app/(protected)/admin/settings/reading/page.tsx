'use client';

import { SettingsLayout } from '@/components/cms/settings/SettingsLayout';
import { ReadingSettings } from '@/components/cms/settings/ReadingSettings';

export default function ReadingSettingsPage() {
  return (
    <SettingsLayout>
      <ReadingSettings />
    </SettingsLayout>
  );
}
