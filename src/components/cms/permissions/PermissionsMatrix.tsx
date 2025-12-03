'use client';

import { Shield, Check, X } from 'lucide-react';
import { useRoles } from '@/hooks/cms';
import { CAPABILITY_GROUPS } from '@/services/cms/types/permissions';
import type { UserRole } from '@/services/cms/types/permissions';
import styles from './PermissionsMatrix.module.scss';

export function PermissionsMatrix() {
  const { data: rolesData } = useRoles();
  const roles = rolesData?.data;

  if (!roles) return null;

  const roleKeys: UserRole[] = ['admin', 'editor', 'author', 'contributor', 'viewer'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Shield className={styles.headerIcon} />
        <div>
          <h2 className={styles.title}>Permissions Matrix</h2>
          <p className={styles.subtitle}>
            Complete capability breakdown by role
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {CAPABILITY_GROUPS.map(group => (
          <div key={group.name} className={styles.group}>
            <div className={styles.groupHeader}>
              <h3 className={styles.groupTitle}>{group.name}</h3>
              <p className={styles.groupDescription}>{group.description}</p>
            </div>

            <div className={styles.matrixTable}>
              <table>
                <thead>
                  <tr>
                    <th className={styles.capabilityHeader}>Capability</th>
                    {roleKeys.map(roleKey => (
                      <th key={roleKey} className={styles.roleHeader}>
                        <span
                          className={styles.roleHeaderBadge}
                          style={{ backgroundColor: roles[roleKey].color }}
                        >
                          {roles[roleKey].displayName}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.capabilities.map(capability => (
                    <tr key={capability}>
                      <td className={styles.capabilityCell}>
                        <code className={styles.capabilityCode}>{capability}</code>
                      </td>
                      {roleKeys.map(roleKey => {
                        const hasCapability = roles[roleKey].capabilities.includes(capability);
                        return (
                          <td key={roleKey} className={styles.checkCell}>
                            {hasCapability ? (
                              <Check className={styles.checkIcon} />
                            ) : (
                              <X className={styles.xIcon} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
