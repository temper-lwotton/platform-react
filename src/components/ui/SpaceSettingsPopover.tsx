'use client';

import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Icon } from './Icon';

interface SpaceSettingsPopoverProps {
    spaceId: string;
    spaceName: string;
}

type NotificationSetting = 'all' | 'mentions' | 'none';

export function SpaceSettingsPopover({ spaceId, spaceName }: SpaceSettingsPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notificationSetting, setNotificationSetting] = useState<NotificationSetting>('all');

    const handleNotificationChange = (setting: NotificationSetting) => {
        setNotificationSetting(setting);
        // In a real app, this would save to backend/local storage
    };

    const handleSettingsClick = (e: React.MouseEvent) => {
        // Only stop propagation to prevent navigation to the space
        e.stopPropagation();
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button
                    className="space-settings-trigger"
                    aria-label={`Settings for ${spaceName}`}
                    onClick={handleSettingsClick}
                >
                    <Icon icon="moreVertical" size={16} />
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className="space-settings-popover"
                    side="right"
                    align="start"
                    sideOffset={8}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="space-settings-header">
                        <h3 className="space-settings-title">Space Settings</h3>
                        <span className="space-settings-space-name">{spaceName}</span>
                    </div>

                    <div className="space-settings-section">
                        <div className="space-settings-section-title">
                            <Icon icon="bell" size={16} />
                            Notifications
                        </div>
                        <div className="space-settings-options">
                            <label className="space-settings-option">
                                <input
                                    type="radio"
                                    name={`notifications-${spaceId}`}
                                    value="all"
                                    checked={notificationSetting === 'all'}
                                    onChange={() => handleNotificationChange('all')}
                                    className="space-settings-radio"
                                />
                                <div className="space-settings-option-content">
                                    <div className="space-settings-option-label">All notifications</div>
                                    <div className="space-settings-option-description">
                                        Get notified for all activity in this space
                                    </div>
                                </div>
                            </label>

                            <label className="space-settings-option">
                                <input
                                    type="radio"
                                    name={`notifications-${spaceId}`}
                                    value="mentions"
                                    checked={notificationSetting === 'mentions'}
                                    onChange={() => handleNotificationChange('mentions')}
                                    className="space-settings-radio"
                                />
                                <div className="space-settings-option-content">
                                    <div className="space-settings-option-label">Only @mentions</div>
                                    <div className="space-settings-option-description">
                                        Get notified only when someone mentions you
                                    </div>
                                </div>
                            </label>

                            <label className="space-settings-option">
                                <input
                                    type="radio"
                                    name={`notifications-${spaceId}`}
                                    value="none"
                                    checked={notificationSetting === 'none'}
                                    onChange={() => handleNotificationChange('none')}
                                    className="space-settings-radio"
                                />
                                <div className="space-settings-option-content">
                                    <div className="space-settings-option-label">Nothing</div>
                                    <div className="space-settings-option-description">
                                        Don't send notifications from this space
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <Popover.Arrow className="space-settings-arrow" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
