'use client';

import { UserRolesManager } from '@/components/cms/permissions/UserRolesManager';
import { PermissionsMatrix } from '@/components/cms/permissions/PermissionsMatrix';

export default function UserRolesPage() {
  return (
    <>
      <UserRolesManager />
      <div style={{ padding: '0 2.5rem 2.5rem' }}>
        <PermissionsMatrix />
      </div>
    </>
  );
}
