'use client';

import { useState } from 'react';
import {
  Layers,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
  History,
  AlertCircle,
  Send,
} from 'lucide-react';
import styles from './VersionManager.module.scss';

interface ContentVersion {
  id: string;
  versionNumber: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  publishedAt?: string;
  stats?: {
    views: number;
    engagement: number;
  };
}

interface ScheduledSwitch {
  id: string;
  fromVersion: ContentVersion;
  toVersion: ContentVersion;
  scheduledFor: string;
  reason?: string;
  status: 'pending' | 'completed';
}

interface VersionManagerProps {
  postId: string;
  postTitle: string;
}

export function VersionManager({ postId, postTitle }: VersionManagerProps) {
  const [showNewVersionModal, setShowNewVersionModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null);
  const [scheduleConfig, setScheduleConfig] = useState({
    fromVersionId: '',
    toVersionId: '',
    scheduledFor: '',
    reason: '',
  });

  // Dummy data
  const [versions, setVersions] = useState<ContentVersion[]>([
    {
      id: 'v1',
      versionNumber: 1,
      title: 'Holiday Hours Announcement',
      content: 'We will be closed on December 25th...',
      isActive: true,
      createdAt: '2024-12-15T10:00:00',
      createdBy: 'Admin User',
      publishedAt: '2024-12-15T14:00:00',
      stats: {
        views: 1247,
        engagement: 12.4,
      },
    },
    {
      id: 'v2',
      versionNumber: 2,
      title: 'Holiday Hours - Extended Version',
      content: 'We will be closed December 24-26. Special hours on December 27...',
      isActive: false,
      createdAt: '2024-12-18T16:00:00',
      createdBy: 'Admin User',
      stats: {
        views: 0,
        engagement: 0,
      },
    },
    {
      id: 'v3',
      versionNumber: 3,
      title: 'Holiday Hours - New Year Update',
      content: 'Updated hours for the holiday season including New Year...',
      isActive: false,
      createdAt: '2024-12-19T09:00:00',
      createdBy: 'Admin User',
    },
  ]);

  const [scheduledSwitches, setScheduledSwitches] = useState<ScheduledSwitch[]>([
    {
      id: 's1',
      fromVersion: versions[0],
      toVersion: versions[1],
      scheduledFor: '2024-12-24T00:00:00',
      reason: 'Activate extended holiday hours for peak season',
      status: 'pending',
    },
    {
      id: 's2',
      fromVersion: versions[1],
      toVersion: versions[0],
      scheduledFor: '2024-12-27T00:00:00',
      reason: 'Revert to standard holiday hours after peak',
      status: 'pending',
    },
  ]);

  const activeVersion = versions.find((v) => v.isActive);

  const handleCreateVersion = (baseVersionId?: string) => {
    // Create new version logic
    console.log('Creating new version based on:', baseVersionId);
    setShowNewVersionModal(false);
  };

  const handleScheduleSwitch = () => {
    const fromVersion = versions.find((v) => v.id === scheduleConfig.fromVersionId);
    const toVersion = versions.find((v) => v.id === scheduleConfig.toVersionId);

    if (fromVersion && toVersion && scheduleConfig.scheduledFor) {
      const newSwitch: ScheduledSwitch = {
        id: `s${Date.now()}`,
        fromVersion,
        toVersion,
        scheduledFor: scheduleConfig.scheduledFor,
        reason: scheduleConfig.reason,
        status: 'pending',
      };

      setScheduledSwitches([...scheduledSwitches, newSwitch]);
      setShowScheduleModal(false);
      setScheduleConfig({
        fromVersionId: '',
        toVersionId: '',
        scheduledFor: '',
        reason: '',
      });
    }
  };

  const handleActivateNow = (versionId: string) => {
    setVersions(
      versions.map((v) => ({
        ...v,
        isActive: v.id === versionId,
        publishedAt: v.id === versionId ? new Date().toISOString() : v.publishedAt,
      }))
    );
  };

  const handleDuplicateVersion = (versionId: string) => {
    const versionToDuplicate = versions.find((v) => v.id === versionId);
    if (versionToDuplicate) {
      const newVersion: ContentVersion = {
        ...versionToDuplicate,
        id: `v${Date.now()}`,
        versionNumber: Math.max(...versions.map((v) => v.versionNumber)) + 1,
        title: `${versionToDuplicate.title} (Copy)`,
        isActive: false,
        createdAt: new Date().toISOString(),
        publishedAt: undefined,
        stats: undefined,
      };
      setVersions([...versions, newVersion]);
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    const versionToDelete = versions.find((v) => v.id === versionId);
    if (versionToDelete && !versionToDelete.isActive) {
      setVersions(versions.filter((v) => v.id !== versionId));
    }
  };

  const handleCancelSchedule = (scheduleId: string) => {
    setScheduledSwitches(scheduledSwitches.filter((s) => s.id !== scheduleId));
  };

  return (
    <div className={styles.versionManager}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <div className={styles.headerIcon}>
              <Layers />
            </div>
            <div>
              <h1>Version Manager</h1>
              <p>{postTitle}</p>
            </div>
          </div>

          <button onClick={() => setShowNewVersionModal(true)} className={styles.primaryButton}>
            <Plus />
            Create New Version
          </button>
        </div>
      </div>

      {/* Active Version Banner */}
      {activeVersion && (
        <div className={styles.activeBanner}>
          <div className={styles.bannerContent}>
            <div className={styles.bannerIcon}>
              <CheckCircle />
            </div>
            <div className={styles.bannerInfo}>
              <h3>Currently Active Version</h3>
              <p>
                <strong>Version {activeVersion.versionNumber}:</strong> {activeVersion.title}
              </p>
              {activeVersion.publishedAt && (
                <span className={styles.publishedDate}>
                  Published{' '}
                  {new Date(activeVersion.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
            {activeVersion.stats && (
              <div className={styles.bannerStats}>
                <div className={styles.stat}>
                  <Eye />
                  <div>
                    <strong>{activeVersion.stats.views.toLocaleString()}</strong>
                    <span>Views</span>
                  </div>
                </div>
                <div className={styles.stat}>
                  <Sparkles />
                  <div>
                    <strong>{activeVersion.stats.engagement}%</strong>
                    <span>Engagement</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.managerLayout}>
        {/* Versions List */}
        <div className={styles.versionsSection}>
          <div className={styles.sectionHeader}>
            <h2>All Versions ({versions.length})</h2>
            <button
              onClick={() => setShowScheduleModal(true)}
              className={styles.scheduleButton}
            >
              <Calendar />
              Schedule Version Switch
            </button>
          </div>

          <div className={styles.versionsList}>
            {versions
              .sort((a, b) => b.versionNumber - a.versionNumber)
              .map((version) => (
                <div
                  key={version.id}
                  className={`${styles.versionCard} ${version.isActive ? styles.active : ''}`}
                >
                  <div className={styles.versionHeader}>
                    <div className={styles.versionTitle}>
                      <div className={styles.versionNumber}>v{version.versionNumber}</div>
                      <div>
                        <h3>{version.title}</h3>
                        <div className={styles.versionMeta}>
                          <span>
                            Created by {version.createdBy} on{' '}
                            {new Date(version.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {version.isActive && (
                      <div className={styles.activebadge}>
                        <CheckCircle />
                        Active
                      </div>
                    )}
                  </div>

                  <div className={styles.versionContent}>
                    <p>{version.content}</p>
                  </div>

                  {version.stats && (
                    <div className={styles.versionStats}>
                      <div className={styles.statItem}>
                        <Eye />
                        <span>{version.stats.views.toLocaleString()} views</span>
                      </div>
                      <div className={styles.statItem}>
                        <Sparkles />
                        <span>{version.stats.engagement}% engagement</span>
                      </div>
                    </div>
                  )}

                  <div className={styles.versionActions}>
                    <button onClick={() => setSelectedVersion(version)} className={styles.actionBtn}>
                      <Eye />
                      Preview
                    </button>
                    <button className={styles.actionBtn}>
                      <Edit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDuplicateVersion(version.id)}
                      className={styles.actionBtn}
                    >
                      <Copy />
                      Duplicate
                    </button>
                    {!version.isActive && (
                      <>
                        <button
                          onClick={() => handleActivateNow(version.id)}
                          className={styles.activateBtn}
                        >
                          <Send />
                          Activate Now
                        </button>
                        <button
                          onClick={() => handleDeleteVersion(version.id)}
                          className={styles.deleteBtn}
                        >
                          <Trash2 />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Scheduled Switches */}
        <div className={styles.schedulesSection}>
          <div className={styles.sectionHeader}>
            <h2>
              <Clock />
              Scheduled Version Switches
            </h2>
          </div>

          {scheduledSwitches.length === 0 ? (
            <div className={styles.emptyState}>
              <Calendar />
              <p>No scheduled version switches</p>
              <button
                onClick={() => setShowScheduleModal(true)}
                className={styles.emptyStateButton}
              >
                <Plus />
                Schedule a Switch
              </button>
            </div>
          ) : (
            <div className={styles.schedulesList}>
              {scheduledSwitches
                .sort(
                  (a, b) =>
                    new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
                )
                .map((schedule) => (
                  <div key={schedule.id} className={styles.scheduleCard}>
                    <div className={styles.scheduleHeader}>
                      <div className={styles.scheduleStatus}>
                        <Clock />
                        <span>Scheduled</span>
                      </div>
                      <button
                        onClick={() => handleCancelSchedule(schedule.id)}
                        className={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    </div>

                    <div className={styles.scheduleTime}>
                      <Calendar />
                      <div>
                        <strong>
                          {new Date(schedule.scheduledFor).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </strong>
                        <span>
                          at{' '}
                          {new Date(schedule.scheduledFor).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className={styles.scheduleSwitch}>
                      <div className={styles.switchVersion}>
                        <span className={styles.switchLabel}>From</span>
                        <div className={styles.switchVersionCard}>
                          <div className={styles.versionBadge}>
                            v{schedule.fromVersion.versionNumber}
                          </div>
                          <span>{schedule.fromVersion.title}</span>
                        </div>
                      </div>

                      <ArrowRight className={styles.switchArrow} />

                      <div className={styles.switchVersion}>
                        <span className={styles.switchLabel}>To</span>
                        <div className={styles.switchVersionCard}>
                          <div className={styles.versionBadge}>
                            v{schedule.toVersion.versionNumber}
                          </div>
                          <span>{schedule.toVersion.title}</span>
                        </div>
                      </div>
                    </div>

                    {schedule.reason && (
                      <div className={styles.scheduleReason}>
                        <AlertCircle />
                        <p>{schedule.reason}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* AI Recommendation */}
          <div className={styles.aiRecommendation}>
            <Sparkles />
            <div>
              <strong>AI Recommendation</strong>
              <p>
                Version 2 has more detailed information. Consider A/B testing to compare
                engagement before scheduling a permanent switch.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* New Version Modal */}
      {showNewVersionModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Create New Version</h3>
              <button onClick={() => setShowNewVersionModal(false)}>×</button>
            </div>

            <div className={styles.modalBody}>
              <p>Choose how you want to create your new version:</p>

              <div className={styles.versionOptions}>
                <button
                  onClick={() => handleCreateVersion()}
                  className={styles.versionOption}
                >
                  <Plus />
                  <div>
                    <strong>Start from Scratch</strong>
                    <span>Create a completely new version</span>
                  </div>
                </button>

                {activeVersion && (
                  <button
                    onClick={() => handleCreateVersion(activeVersion.id)}
                    className={styles.versionOption}
                  >
                    <Copy />
                    <div>
                      <strong>Duplicate Active Version</strong>
                      <span>Start with current live content (v{activeVersion.versionNumber})</span>
                    </div>
                  </button>
                )}

                <button className={styles.versionOption}>
                  <History />
                  <div>
                    <strong>Restore Previous Version</strong>
                    <span>Bring back an older version</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Switch Modal */}
      {showScheduleModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Schedule Version Switch</h3>
              <button onClick={() => setShowScheduleModal(false)}>×</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formField}>
                <label>
                  <span>From Version</span>
                  <select
                    value={scheduleConfig.fromVersionId}
                    onChange={(e) =>
                      setScheduleConfig({ ...scheduleConfig, fromVersionId: e.target.value })
                    }
                  >
                    <option value="">Select version...</option>
                    {versions.map((v) => (
                      <option key={v.id} value={v.id}>
                        v{v.versionNumber} - {v.title}
                        {v.isActive ? ' (Currently Active)' : ''}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className={styles.formField}>
                <label>
                  <span>To Version</span>
                  <select
                    value={scheduleConfig.toVersionId}
                    onChange={(e) =>
                      setScheduleConfig({ ...scheduleConfig, toVersionId: e.target.value })
                    }
                  >
                    <option value="">Select version...</option>
                    {versions
                      .filter((v) => v.id !== scheduleConfig.fromVersionId)
                      .map((v) => (
                        <option key={v.id} value={v.id}>
                          v{v.versionNumber} - {v.title}
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              <div className={styles.formField}>
                <label>
                  <span>Schedule Date & Time</span>
                  <input
                    type="datetime-local"
                    value={scheduleConfig.scheduledFor}
                    onChange={(e) =>
                      setScheduleConfig({ ...scheduleConfig, scheduledFor: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className={styles.formField}>
                <label>
                  <span>Reason (Optional)</span>
                  <textarea
                    placeholder="Why are you switching versions?"
                    value={scheduleConfig.reason}
                    onChange={(e) =>
                      setScheduleConfig({ ...scheduleConfig, reason: e.target.value })
                    }
                    rows={3}
                  />
                </label>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowScheduleModal(false)}
                className={styles.secondaryButton}
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSwitch}
                className={styles.primaryButton}
                disabled={
                  !scheduleConfig.fromVersionId ||
                  !scheduleConfig.toVersionId ||
                  !scheduleConfig.scheduledFor
                }
              >
                <Calendar />
                Schedule Switch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {selectedVersion && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Preview Version {selectedVersion.versionNumber}</h3>
              <button onClick={() => setSelectedVersion(null)}>×</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.previewContent}>
                <h1>{selectedVersion.title}</h1>
                <p>{selectedVersion.content}</p>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setSelectedVersion(null)} className={styles.secondaryButton}>
                Close
              </button>
              {!selectedVersion.isActive && (
                <button
                  onClick={() => {
                    handleActivateNow(selectedVersion.id);
                    setSelectedVersion(null);
                  }}
                  className={styles.primaryButton}
                >
                  <Send />
                  Activate This Version
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
