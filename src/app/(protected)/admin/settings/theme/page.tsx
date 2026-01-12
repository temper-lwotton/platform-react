'use client';

import { SettingsLayout } from '@/components/cms/settings/SettingsLayout';
import { ThemeSettings } from '@/components/cms/settings/ThemeSettings';

export default function ThemeSettingsPage() {
  return (
    <SettingsLayout>
      <ThemeSettings />
    </SettingsLayout>
  );
}
