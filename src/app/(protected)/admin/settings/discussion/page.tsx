'use client';

import { SettingsLayout } from '@/components/cms/settings/SettingsLayout';
import { DiscussionSettings } from '@/components/cms/settings/DiscussionSettings';

export default function DiscussionSettingsPage() {
  return (
    <SettingsLayout>
      <DiscussionSettings />
    </SettingsLayout>
  );
}
