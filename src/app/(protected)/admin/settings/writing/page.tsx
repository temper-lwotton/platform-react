'use client';

import { SettingsLayout } from '@/components/cms/settings/SettingsLayout';
import { WritingSettings } from '@/components/cms/settings/WritingSettings';

export default function WritingSettingsPage() {
  return (
    <SettingsLayout>
      <WritingSettings />
    </SettingsLayout>
  );
}
