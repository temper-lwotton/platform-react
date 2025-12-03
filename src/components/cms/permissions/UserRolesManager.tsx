'use client';

import { useState } from 'react';
import { Users, Shield, Loader2, Check, X } from 'lucide-react';
import { useUsers, useUpdateUserRole, useCurrentUser } from '@/hooks/cms';
import { ROLE_CONFIGS } from '@/services/cms/types/permissions';
import type { UserRole } from '@/services/cms/types/permissions';
import { formatDistanceToNow } from 'date-fns';
import styles from './UserRolesManager.module.scss';

export function UserRolesManager() {
  const { data: usersData, isLoading } = useUsers();
  const { data: currentUserData } = useCurrentUser();
  const updateRole = useUpdateUserRole();

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const users = usersData?.data || [];
  const currentUser = currentUserData?.data;

  const handleStartEdit = (userId: number, currentRole: UserRole) => {
    setEditingUserId(userId);
    setSelectedRole(currentRole);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setSelectedRole(null);
  };

  const handleSaveRole = async (userId: number) => {
    if (!selectedRole) return;

    await updateRole.mutateAsync({ userId, role: selectedRole });
    setEditingUserId(null);
    setSelectedRole(null);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spinner} />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Users className={styles.titleIcon} />
          <div>
            <h2 className={styles.title}>User Roles & Permissions</h2>
            <p className={styles.subtitle}>
              Manage user access levels and capabilities
            </p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Capabilities</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const isEditing = editingUserId === user.id;
              const roleConfig = ROLE_CONFIGS[user.role];
              const isCurrentUser = currentUser?.id === user.id;

              return (
                <tr key={user.id} className={isCurrentUser ? styles.currentUserRow : ''}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <div className={styles.avatarPlaceholder}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className={styles.userName}>
                          {user.name}
                          {isCurrentUser && (
                            <span className={styles.currentUserBadge}>You</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.emailCell}>{user.email}</td>
                  <td>
                    {isEditing ? (
                      <select
                        value={selectedRole || user.role}
                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                        className={styles.roleSelect}
                      >
                        {Object.entries(ROLE_CONFIGS).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.displayName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={styles.roleBadge}
                        style={{ backgroundColor: roleConfig.color }}
                      >
                        <Shield size={12} />
                        {roleConfig.displayName}
                      </span>
                    )}
                  </td>
                  <td className={styles.capabilitiesCell}>
                    {user.capabilities.length} {user.capabilities.length === 1 ? 'capability' : 'capabilities'}
                  </td>
                  <td className={styles.dateCell}>
                    {user.lastLogin
                      ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })
                      : 'Never'}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className={styles.editActions}>
                        <button
                          onClick={() => handleSaveRole(user.id)}
                          className={styles.saveButton}
                          disabled={updateRole.isPending}
                        >
                          {updateRole.isPending ? (
                            <Loader2 className={styles.spinner} size={14} />
                          ) : (
                            <Check size={14} />
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className={styles.cancelButton}
                          disabled={updateRole.isPending}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(user.id, user.role)}
                        className={styles.editButton}
                        disabled={!currentUser || currentUser.role !== 'admin'}
                      >
                        Change Role
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className={styles.rolesLegend}>
          <h3 className={styles.legendTitle}>Role Descriptions</h3>
          <div className={styles.legendGrid}>
            {Object.entries(ROLE_CONFIGS).map(([key, config]) => (
              <div key={key} className={styles.legendItem}>
                <div className={styles.legendHeader}>
                  <span
                    className={styles.legendBadge}
                    style={{ backgroundColor: config.color }}
                  >
                    <Shield size={12} />
                    {config.displayName}
                  </span>
                </div>
                <p className={styles.legendDescription}>{config.description}</p>
                <p className={styles.legendCapabilities}>
                  {config.capabilities.length} capabilities
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
