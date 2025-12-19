'use client';

import { useState } from 'react';
import {
  Edit,
  Check,
  Sparkles,
  Rocket,
  Calendar,
  Save,
  Globe,
  Lock,
  EyeOff,
  Hash,
  Mail,
  CheckCircle,
} from 'lucide-react';
import { SpaceData } from '../SpaceCreationWizard';
import styles from './SpacePreview.module.scss';

interface SpacePreviewProps {
  spaceData: SpaceData;
  onEdit: (step: 'template' | 'branding' | 'privacy' | 'structure' | 'invite') => void;
  onCreate: () => void;
}

export function SpacePreview({ spaceData, onEdit, onCreate }: SpacePreviewProps) {
  const [launching, setLaunching] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);

  const handleLaunch = () => {
    setLaunching(true);
    onCreate();
  };

  const getVisibilityIcon = () => {
    switch (spaceData.visibility) {
      case 'public':
        return <Globe />;
      case 'private':
        return <Lock />;
      case 'unlisted':
        return <EyeOff />;
    }
  };

  return (
    <div className={styles.preview}>
      <div className={styles.header}>
        <h2>Review Your Space</h2>
        <p>Everything looks good? Let's launch!</p>
      </div>

      <div className={styles.layout}>
        {/* Preview Card */}
        <div className={styles.previewCard}>
          {spaceData.coverImage && (
            <div
              className={styles.cover}
              style={{ backgroundImage: `url(${spaceData.coverImage})` }}
            />
          )}

          <div className={styles.content}>
            <div
              className={styles.icon}
              style={{
                background: `linear-gradient(135deg, ${spaceData.colorPalette[0]} 0%, ${spaceData.colorPalette[1]} 100%)`,
              }}
            >
              {spaceData.icon || <Sparkles />}
            </div>

            <h1>{spaceData.name}</h1>
            {spaceData.subtitle && <p className={styles.subtitle}>{spaceData.subtitle}</p>}
            {spaceData.description && <p className={styles.description}>{spaceData.description}</p>}

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                {getVisibilityIcon()}
                <span>{spaceData.visibility}</span>
              </div>
              <div className={styles.metaItem}>
                <Hash />
                <span>{spaceData.channels.length} channels</span>
              </div>
              {spaceData.invites.length > 0 && (
                <div className={styles.metaItem}>
                  <Mail />
                  <span>{spaceData.invites.length} invited</span>
                </div>
              )}
            </div>

            <button className={styles.previewJoinButton}>
              Join Space
            </button>
          </div>
        </div>

        {/* Details Panel */}
        <div className={styles.detailsPanel}>
          {/* Settings Summary */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Space Details</h3>
              <button onClick={() => onEdit('branding')} className={styles.editButton}>
                <Edit />
                Edit
              </button>
            </div>

            <div className={styles.detailsList}>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Name</span>
                <span className={styles.detailValue}>{spaceData.name}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>URL</span>
                <span className={styles.detailValue}>spaces.app/{spaceData.handle}</span>
              </div>
              {spaceData.subtitle && (
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Tagline</span>
                  <span className={styles.detailValue}>{spaceData.subtitle}</span>
                </div>
              )}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Privacy</h3>
              <button onClick={() => onEdit('privacy')} className={styles.editButton}>
                <Edit />
                Edit
              </button>
            </div>

            <div className={styles.detailsList}>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Visibility</span>
                <span className={styles.detailValue}>{spaceData.visibility}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Join Setting</span>
                <span className={styles.detailValue}>{spaceData.joinSetting}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>In Directory</span>
                <span className={styles.detailValue}>
                  {spaceData.inDirectory ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Channels */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Channels ({spaceData.channels.length})</h3>
              <button onClick={() => onEdit('structure')} className={styles.editButton}>
                <Edit />
                Edit
              </button>
            </div>

            <div className={styles.channelsList}>
              {spaceData.channels.slice(0, 5).map((channel) => (
                <div key={channel.id} className={styles.channelItem}>
                  <span className={styles.channelIcon}>{channel.icon}</span>
                  <div>
                    <div className={styles.channelName}>
                      <Hash />
                      {channel.name}
                    </div>
                    <div className={styles.channelDescription}>{channel.description}</div>
                  </div>
                </div>
              ))}
              {spaceData.channels.length > 5 && (
                <div className={styles.moreChannels}>
                  +{spaceData.channels.length - 5} more channels
                </div>
              )}
            </div>
          </div>

          {/* Invites */}
          {spaceData.invites.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Invites ({spaceData.invites.length})</h3>
                <button onClick={() => onEdit('invite')} className={styles.editButton}>
                  <Edit />
                  Edit
                </button>
              </div>

              <div className={styles.invitesList}>
                {spaceData.invites.slice(0, 3).map((invite) => (
                  <div key={invite.email} className={styles.inviteItem}>
                    <Mail />
                    <span>{invite.email}</span>
                    <span className={styles.roleTag}>{invite.role}</span>
                  </div>
                ))}
                {spaceData.invites.length > 3 && (
                  <div className={styles.moreInvites}>
                    +{spaceData.invites.length - 3} more people invited
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Checklist */}
          <div className={styles.successChecklist}>
            <Sparkles />
            <div>
              <strong>Your Space is Ready!</strong>
              <div className={styles.checklistItems}>
                <div className={styles.checkItem}>
                  <CheckCircle />
                  <span>Template selected & configured</span>
                </div>
                <div className={styles.checkItem}>
                  <CheckCircle />
                  <span>Identity & branding set</span>
                </div>
                <div className={styles.checkItem}>
                  <CheckCircle />
                  <span>Privacy settings configured</span>
                </div>
                <div className={styles.checkItem}>
                  <CheckCircle />
                  <span>{spaceData.channels.length} channels created</span>
                </div>
              </div>
            </div>
          </div>

          {/* Launch Actions */}
          <div className={styles.launchActions}>
            <button
              onClick={handleLaunch}
              disabled={launching}
              className={styles.launchButton}
            >
              <Rocket />
              {launching ? 'Launching...' : 'Launch Space Now'}
            </button>

            <button
              onClick={() => setShowScheduler(true)}
              className={styles.scheduleButton}
            >
              <Calendar />
              Schedule Launch
            </button>

            <button className={styles.saveButton}>
              <Save />
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
