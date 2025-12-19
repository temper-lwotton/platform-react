'use client';

import { useState } from 'react';
import { Mail, UserPlus, Copy, CheckCircle, Upload, Sparkles, Users, Search, X } from 'lucide-react';
import { SpaceData } from '../SpaceCreationWizard';
import styles from './SpaceInviteFlow.module.scss';

interface SpaceInviteFlowProps {
  spaceData: SpaceData;
  setSpaceData: (data: SpaceData) => void;
  useAIDefaults: boolean;
}

interface ExistingUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  username: string;
}

export function SpaceInviteFlow({
  spaceData,
  setSpaceData,
  useAIDefaults,
}: SpaceInviteFlowProps) {
  const [emailInput, setEmailInput] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ExistingUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const inviteLink = `https://spaces.app/join/${spaceData.handle}`;

  // Dummy existing users for search
  const existingUsers: ExistingUser[] = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', avatar: 'SJ', username: '@sarahj' },
    { id: '2', name: 'Mike Chen', email: 'mike@example.com', avatar: 'MC', username: '@mikec' },
    { id: '3', name: 'Emma Davis', email: 'emma@example.com', avatar: 'ED', username: '@emmad' },
    { id: '4', name: 'Alex Martinez', email: 'alex@example.com', avatar: 'AM', username: '@alexm' },
    { id: '5', name: 'Taylor Brown', email: 'taylor@example.com', avatar: 'TB', username: '@taylorb' },
    { id: '6', name: 'Jordan Lee', email: 'jordan@example.com', avatar: 'JL', username: '@jordanl' },
  ];

  const handleAddEmail = () => {
    const emails = emailInput
      .split(/[\n,;]/)
      .map((e) => e.trim())
      .filter((e) => e && e.includes('@'));

    const newInvites = emails.map((email) => ({
      email,
      role: 'member' as const,
    }));

    setSpaceData({
      ...spaceData,
      invites: [...spaceData.invites, ...newInvites],
    });

    setEmailInput('');
  };

  const handleRemoveInvite = (email: string) => {
    setSpaceData({
      ...spaceData,
      invites: spaceData.invites.filter((i) => i.email !== email),
    });
  };

  const handleRoleChange = (email: string, role: 'admin' | 'moderator' | 'member') => {
    setSpaceData({
      ...spaceData,
      invites: spaceData.invites.map((i) => (i.email === email ? { ...i, role } : i)),
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleUserSearch = (query: string) => {
    setUserSearchQuery(query);
    setIsSearching(true);

    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Simulate search delay
    setTimeout(() => {
      const results = existingUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const handleAddExistingUser = (user: ExistingUser) => {
    // Check if already invited
    if (spaceData.invites.some((i) => i.email === user.email)) {
      return;
    }

    setSpaceData({
      ...spaceData,
      invites: [
        ...spaceData.invites,
        {
          email: user.email,
          role: 'member' as const,
          name: user.name,
          avatar: user.avatar,
          userId: user.id,
        },
      ],
    });

    setUserSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className={styles.inviteFlow}>
      <div className={styles.header}>
        <h2>Invite Your Team</h2>
        <p>Add founding members to help build your space (optional)</p>
      </div>

      <div className={styles.layout}>
        {/* Main Section */}
        <div className={styles.emailSection}>
          {/* Search Existing Users */}
          <div className={styles.sectionHeader}>
            <Search />
            <div>
              <h3>Search Existing Users</h3>
              <p>Find and invite people already on the platform</p>
            </div>
          </div>

          <div className={styles.userSearchSection}>
            <div className={styles.searchInput}>
              <Search />
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={userSearchQuery}
                onChange={(e) => handleUserSearch(e.target.value)}
              />
              {userSearchQuery && (
                <button
                  onClick={() => {
                    setUserSearchQuery('');
                    setSearchResults([]);
                  }}
                  className={styles.clearButton}
                >
                  <X />
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className={styles.searchResults}>
                {searchResults.map((user) => (
                  <div key={user.id} className={styles.userResult}>
                    <div className={styles.userAvatar}>{user.avatar}</div>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{user.name}</div>
                      <div className={styles.userMeta}>
                        {user.username} • {user.email}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddExistingUser(user)}
                      className={styles.addUserButton}
                      disabled={spaceData.invites.some((i) => i.email === user.email)}
                    >
                      {spaceData.invites.some((i) => i.email === user.email) ? (
                        <>
                          <CheckCircle />
                          Added
                        </>
                      ) : (
                        <>
                          <UserPlus />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isSearching && (
              <div className={styles.searchingState}>Searching...</div>
            )}

            {!isSearching && userSearchQuery && searchResults.length === 0 && (
              <div className={styles.emptyState}>
                <Users />
                <p>No users found matching "{userSearchQuery}"</p>
              </div>
            )}
          </div>

          {/* Email Invites */}
          <div className={styles.sectionHeader}>
            <Mail />
            <div>
              <h3>Invite by Email</h3>
              <p>Send personalized invites to team members</p>
            </div>
          </div>

          <div className={styles.emailInput}>
            <textarea
              placeholder="Enter email addresses (one per line or comma-separated)&#10;&#10;e.g.,&#10;sarah@example.com&#10;mike@example.com, emma@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              rows={6}
            />
            <button
              onClick={handleAddEmail}
              disabled={!emailInput}
              className={styles.addButton}
            >
              <UserPlus />
              Add to Invite List
            </button>
          </div>

          {spaceData.invites.length > 0 && (
            <div className={styles.invitesList}>
              <div className={styles.invitesHeader}>
                <h4>Pending Invites ({spaceData.invites.length})</h4>
              </div>

              {spaceData.invites.map((invite) => (
                <div key={invite.email} className={styles.inviteItem}>
                  {invite.avatar && (
                    <div className={styles.inviteAvatar}>{invite.avatar}</div>
                  )}
                  <div className={styles.inviteInfo}>
                    {invite.name && <div className={styles.inviteName}>{invite.name}</div>}
                    <div className={styles.inviteEmail}>{invite.email}</div>
                  </div>
                  <select
                    value={invite.role}
                    onChange={(e) =>
                      handleRoleChange(
                        invite.email,
                        e.target.value as 'admin' | 'moderator' | 'member'
                      )
                    }
                    className={styles.roleSelect}
                  >
                    <option value="member">Member</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleRemoveInvite(invite.email)}
                    className={styles.removeButton}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button className={styles.uploadButton}>
            <Upload />
            Upload CSV
          </button>
        </div>

        {/* Quick Options */}
        <div className={styles.quickOptions}>
          {/* Share Link */}
          <div className={styles.optionCard}>
            <div className={styles.optionHeader}>
              <Copy />
              <div>
                <h3>Share Invite Link</h3>
                <p>Anyone with this link can join</p>
              </div>
            </div>

            <div className={styles.linkBox}>
              <input
                type="text"
                value={inviteLink}
                readOnly
                className={styles.linkInput}
              />
              <button onClick={handleCopyLink} className={styles.copyButton}>
                {linkCopied ? <CheckCircle /> : <Copy />}
                {linkCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Skip Option */}
          <div className={styles.optionCard}>
            <div className={styles.optionHeader}>
              <Users />
              <div>
                <h3>Invite Later</h3>
                <p>You can add members anytime after creating your space</p>
              </div>
            </div>

            <p className={styles.skipNote}>
              No worries! You'll have full access to member management once your space is
              created.
            </p>
          </div>

          {/* AI Recommendation */}
          <div className={styles.aiTip}>
            <Sparkles />
            <div>
              <strong>AI Tip</strong>
              <p>
                Spaces with 5+ founding members in the first week grow 3x faster. Consider
                inviting key contributors now!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
