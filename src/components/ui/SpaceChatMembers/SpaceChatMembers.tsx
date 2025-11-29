'use client';

import Link from 'next/link';
import { Icon } from '../Icon';
import type { SpaceUser } from '@/lib/spaces';
import styles from './SpaceChatMembers.module.scss';

interface SpaceChatMembersProps {
    admins: SpaceUser[];
    members: SpaceUser[];
}

// Mock function to determine online status
// In real implementation, this would check WebSocket connection, last activity, etc.
function isOnline(userId: string): boolean {
    // For demo purposes, make some users "online"
    const onlineUsers = ['5', '12', '8']; // Luke, Sarah, James
    return onlineUsers.includes(userId);
}

function MemberItem({ member, isAdmin }: { member: SpaceUser; isAdmin?: boolean }) {
    const online = isOnline(member.id);
    const displayName = member.profile?.fullName ||
                       `${member.profile?.firstName || ''} ${member.profile?.lastName || ''}`.trim() ||
                       member.email ||
                       'Unknown User';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <Link href={`/users/${member.id}`} className={styles.memberItem}>
            <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                    {member.profile?.photo ? (
                        <img src={member.profile.photo} alt={displayName} />
                    ) : (
                        <span className={styles.avatarText}>{initials}</span>
                    )}
                </div>
                <div className={`${styles.status} ${online ? styles.statusOnline : styles.statusOffline}`} />
            </div>
            <div className={styles.info}>
                <div className={styles.name}>
                    {displayName}
                    {isAdmin && <span className={styles.badge}>Admin</span>}
                </div>
            </div>
        </Link>
    );
}

export function SpaceChatMembers({ admins, members }: SpaceChatMembersProps) {
    const onlineAdmins = admins.filter(a => isOnline(a.id));
    const offlineAdmins = admins.filter(a => !isOnline(a.id));
    const onlineMembers = members.filter(m => isOnline(m.id));
    const offlineMembers = members.filter(m => !isOnline(m.id));

    const totalOnline = onlineAdmins.length + onlineMembers.length;
    const totalMembers = admins.length + members.length;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <div className={styles.count}>
                    <Icon icon="users" size={16} />
                    <span>{totalMembers} members</span>
                </div>
                <div className={styles.online}>
                    <div className={`${styles.status} ${styles.statusOnline}`} />
                    <span>{totalOnline} online</span>
                </div>
            </div>

            <div className={styles.list}>
                {/* Online Admins */}
                {onlineAdmins.length > 0 && (
                    <>
                        <div className={styles.sectionTitle}>
                            Admins — {onlineAdmins.length}
                        </div>
                        {onlineAdmins.map(admin => (
                            <MemberItem key={admin.id} member={admin} isAdmin />
                        ))}
                    </>
                )}

                {/* Online Members */}
                {onlineMembers.length > 0 && (
                    <>
                        <div className={styles.sectionTitle}>
                            Online — {onlineMembers.length}
                        </div>
                        {onlineMembers.map(member => (
                            <MemberItem key={member.id} member={member} />
                        ))}
                    </>
                )}

                {/* Offline Admins */}
                {offlineAdmins.length > 0 && (
                    <>
                        <div className={styles.sectionTitle}>
                            Offline Admins — {offlineAdmins.length}
                        </div>
                        {offlineAdmins.map(admin => (
                            <MemberItem key={admin.id} member={admin} isAdmin />
                        ))}
                    </>
                )}

                {/* Offline Members */}
                {offlineMembers.length > 0 && (
                    <>
                        <div className={styles.sectionTitle}>
                            Offline — {offlineMembers.length}
                        </div>
                        {offlineMembers.map(member => (
                            <MemberItem key={member.id} member={member} />
                        ))}
                    </>
                )}
            </div>
        </aside>
    );
}
