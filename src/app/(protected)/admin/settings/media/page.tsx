'use client';

import { SettingsLayout } from '@/components/cms/settings/SettingsLayout';
import { MediaSettings } from '@/components/cms/settings/MediaSettings';

export default function MediaSettingsPage() {
  return (
    <SettingsLayout>
      <MediaSettings />
    </SettingsLayout>
  );
}
