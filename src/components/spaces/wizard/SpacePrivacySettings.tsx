'use client';

import { Globe, Lock, EyeOff, Check, Users, UserPlus, Mail, Sparkles } from 'lucide-react';
import { SpaceData } from '../SpaceCreationWizard';
import styles from './SpacePrivacySettings.module.scss';

interface SpacePrivacySettingsProps {
  spaceData: SpaceData;
  setSpaceData: (data: SpaceData) => void;
  useAIDefaults: boolean;
}

export function SpacePrivacySettings({
  spaceData,
  setSpaceData,
  useAIDefaults,
}: SpacePrivacySettingsProps) {
  const visibilityOptions = [
    {
      id: 'public' as const,
      icon: <Globe />,
      name: 'Public',
      description: 'Anyone can discover and view your space',
      recommended: 'Best for communities and public groups',
      pros: ['Maximum discoverability', 'SEO benefits', 'Grows organically'],
      cons: ['Less control over members', 'Content is public'],
    },
    {
      id: 'private' as const,
      icon: <Lock />,
      name: 'Private',
      description: 'Only members can see content',
      recommended: 'Best for teams and closed communities',
      pros: ['Full privacy control', 'Exclusive feel', 'Protected content'],
      cons: ['Harder to discover', 'Requires invites/requests'],
    },
    {
      id: 'unlisted' as const,
      icon: <EyeOff />,
      name: 'Unlisted',
      description: 'Hidden from search, but anyone with link can join',
      recommended: 'Best for temporary or semi-private spaces',
      pros: ['Shareable link', 'Some privacy', 'Easy to join'],
      cons: ['Link can be shared', 'Not fully private'],
    },
  ];

  const joinOptions = [
    {
      id: 'open' as const,
      icon: <Users />,
      name: 'Open',
      description: 'Anyone can join immediately',
      recommended: 'For public communities',
    },
    {
      id: 'request' as const,
      icon: <UserPlus />,
      name: 'Request to Join',
      description: 'Users request access, admins approve',
      recommended: 'For moderated communities',
    },
    {
      id: 'invite' as const,
      icon: <Mail />,
      name: 'Invite Only',
      description: 'Only invited users can join',
      recommended: 'For exclusive or private spaces',
    },
  ];

  return (
    <div className={styles.privacySettings}>
      <div className={styles.header}>
        <h2>Privacy & Discovery</h2>
        <p>Control who can find and access your space</p>
      </div>

      {/* Visibility */}
      <div className={styles.section}>
        <h3>Space Visibility</h3>
        <p className={styles.sectionDescription}>
          Choose who can discover and view your space
        </p>

        <div className={styles.optionsGrid}>
          {visibilityOptions.map((option) => (
            <div
              key={option.id}
              className={`${styles.optionCard} ${
                spaceData.visibility === option.id ? styles.selected : ''
              }`}
              onClick={() => setSpaceData({ ...spaceData, visibility: option.id })}
            >
              <div className={styles.optionHeader}>
                <div className={styles.optionIcon}>{option.icon}</div>
                <div>
                  <h4>{option.name}</h4>
                  <p className={styles.optionDescription}>{option.description}</p>
                </div>
                {spaceData.visibility === option.id && (
                  <div className={styles.selectedBadge}>
                    <Check />
                  </div>
                )}
              </div>

              <div className={styles.optionRecommended}>
                <Sparkles />
                {option.recommended}
              </div>

              <div className={styles.prosCons}>
                <div className={styles.pros}>
                  {option.pros.map((pro, i) => (
                    <div key={i} className={styles.proItem}>
                      <Check />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
                {option.cons && option.cons.length > 0 && (
                  <div className={styles.cons}>
                    {option.cons.map((con, i) => (
                      <div key={i} className={styles.conItem}>
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Settings */}
      <div className={styles.section}>
        <h3>Join Settings</h3>
        <p className={styles.sectionDescription}>
          How can people become members of your space?
        </p>

        <div className={styles.joinOptions}>
          {joinOptions.map((option) => (
            <div
              key={option.id}
              className={`${styles.joinOption} ${
                spaceData.joinSetting === option.id ? styles.selected : ''
              }`}
              onClick={() => setSpaceData({ ...spaceData, joinSetting: option.id })}
            >
              <div className={styles.joinIcon}>{option.icon}</div>
              <div className={styles.joinInfo}>
                <h4>{option.name}</h4>
                <p>{option.description}</p>
                <span className={styles.joinRecommended}>
                  <Sparkles />
                  {option.recommended}
                </span>
              </div>
              {spaceData.joinSetting === option.id && (
                <div className={styles.selectedCheck}>
                  <Check />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Settings */}
      <div className={styles.section}>
        <h3>Discovery Settings</h3>

        <div className={styles.toggleOptions}>
          <div className={styles.toggleOption}>
            <div className={styles.toggleInfo}>
              <h4>Show in Directory</h4>
              <p>Allow your space to appear in the spaces directory</p>
            </div>
            <button
              className={`${styles.toggle} ${spaceData.inDirectory ? styles.active : ''}`}
              onClick={() =>
                setSpaceData({ ...spaceData, inDirectory: !spaceData.inDirectory })
              }
            >
              <span className={styles.toggleSlider} />
            </button>
          </div>

          <div className={styles.toggleOption}>
            <div className={styles.toggleInfo}>
              <h4>Search Engine Indexing</h4>
              <p>Allow search engines like Google to index your space</p>
            </div>
            <button
              className={`${styles.toggle} ${spaceData.searchIndexing ? styles.active : ''}`}
              onClick={() =>
                setSpaceData({ ...spaceData, searchIndexing: !spaceData.searchIndexing })
              }
            >
              <span className={styles.toggleSlider} />
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className={styles.aiRecommendation}>
        <Sparkles />
        <div>
          <strong>AI Recommendation for Your Space</strong>
          <p>
            Based on your template choice, we recommend{' '}
            <strong>{spaceData.visibility}</strong> visibility with{' '}
            <strong>{spaceData.joinSetting}</strong> join settings. This configuration balances
            growth with control.
          </p>
        </div>
      </div>
    </div>
  );
}
