'use client';

import { useState } from 'react';
import { Plus, GripVertical, Edit, Trash2, Sparkles, Hash } from 'lucide-react';
import { SpaceData } from '../SpaceCreationWizard';
import styles from './SpaceStructureBuilder.module.scss';

interface SpaceStructureBuilderProps {
  spaceData: SpaceData;
  setSpaceData: (data: SpaceData) => void;
  useAIDefaults: boolean;
}

export function SpaceStructureBuilder({
  spaceData,
  setSpaceData,
  useAIDefaults,
}: SpaceStructureBuilderProps) {
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');
  const [newChannelIcon, setNewChannelIcon] = useState('💬');
  const [editingChannel, setEditingChannel] = useState<string | null>(null);

  const channelIcons = ['💬', '📢', '📁', '❓', '✨', '🎉', '📚', '🔧', '💡', '🎯', '📊', '🎨'];

  const handleAddChannel = () => {
    if (!newChannelName) return;

    const newChannel = {
      id: Date.now().toString(),
      name: newChannelName,
      description: newChannelDescription,
      icon: newChannelIcon,
    };

    setSpaceData({
      ...spaceData,
      channels: [...spaceData.channels, newChannel],
    });

    setNewChannelName('');
    setNewChannelDescription('');
    setNewChannelIcon('💬');
  };

  const handleDeleteChannel = (id: string) => {
    setSpaceData({
      ...spaceData,
      channels: spaceData.channels.filter((c) => c.id !== id),
    });
  };

  const handleSetDefaultChannel = (id: string) => {
    setSpaceData({
      ...spaceData,
      channels: spaceData.channels.map((c) => ({
        ...c,
        isDefault: c.id === id,
      })),
    });
  };

  return (
    <div className={styles.structureBuilder}>
      <div className={styles.header}>
        <h2>Organize Your Space</h2>
        <p>Create channels to organize discussions and content</p>
      </div>

      <div className={styles.layout}>
        {/* Channels List */}
        <div className={styles.channelsList}>
          <div className={styles.sectionHeader}>
            <h3>Channels ({spaceData.channels.length})</h3>
            <span className={styles.hint}>From your selected template</span>
          </div>

          {spaceData.channels.length === 0 ? (
            <div className={styles.emptyState}>
              <Hash />
              <p>No channels yet. Add your first channel below!</p>
            </div>
          ) : (
            <div className={styles.channels}>
              {spaceData.channels.map((channel) => (
                <div key={channel.id} className={styles.channelCard}>
                  <div className={styles.channelHeader}>
                    <button className={styles.dragHandle} title="Drag to reorder">
                      <GripVertical />
                    </button>

                    <div className={styles.channelIcon}>{channel.icon}</div>

                    <div className={styles.channelInfo}>
                      <h4>
                        <Hash />
                        {channel.name}
                      </h4>
                      <p>{channel.description}</p>
                    </div>

                    {channel.isDefault && (
                      <div className={styles.defaultBadge}>Default</div>
                    )}
                  </div>

                  <div className={styles.channelActions}>
                    {!channel.isDefault && (
                      <button
                        onClick={() => handleSetDefaultChannel(channel.id)}
                        className={styles.actionButton}
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => setEditingChannel(channel.id)}
                      className={styles.actionButton}
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => handleDeleteChannel(channel.id)}
                      className={styles.deleteButton}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Channel */}
        <div className={styles.addChannelSection}>
          <div className={styles.sectionHeader}>
            <h3>Add Channel</h3>
          </div>

          <div className={styles.addChannelForm}>
            <div className={styles.formGroup}>
              <label>Channel Icon</label>
              <div className={styles.iconPicker}>
                {channelIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewChannelIcon(icon)}
                    className={`${styles.iconButton} ${
                      newChannelIcon === icon ? styles.selected : ''
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Channel Name</label>
              <div className={styles.nameInput}>
                <Hash />
                <input
                  type="text"
                  placeholder="e.g., general, announcements"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddChannel()}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                placeholder="What's this channel for?"
                value={newChannelDescription}
                onChange={(e) => setNewChannelDescription(e.target.value)}
                rows={3}
              />
            </div>

            <button
              onClick={handleAddChannel}
              disabled={!newChannelName}
              className={styles.addButton}
            >
              <Plus />
              Add Channel
            </button>
          </div>

          <div className={styles.aiSuggestion}>
            <Sparkles />
            <div>
              <strong>AI Tip</strong>
              <p>
                Most successful spaces start with 3-5 focused channels. You can always add more
                later!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
