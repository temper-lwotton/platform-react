'use client';

import { SettingsLayout } from '@/components/cms/settings/SettingsLayout';
import { GeneralSettings } from '@/components/cms/settings/GeneralSettings';

export default function GeneralSettingsPage() {
  return (
    <SettingsLayout>
      <GeneralSettings />
    </SettingsLayout>
  );
}
