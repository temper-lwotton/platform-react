'use client';

import { useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
import * as Separator from '@radix-ui/react-separator';
import { Icon } from '@/components/ui/Icon';

export default function PreferencesPage() {
  // Notification Preferences
  const [emailDiscussions, setEmailDiscussions] = useState(true);
  const [emailReplies, setEmailReplies] = useState(true);
  const [emailMentions, setEmailMentions] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Privacy Settings
  const [publicProfile, setPublicProfile] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);

  // Content Preferences
  const [autoFollowDiscussions, setAutoFollowDiscussions] = useState(true);
  const [followNotifications, setFollowNotifications] = useState(true);
  const [showNSFW, setShowNSFW] = useState(false);
  const [autoPlayVideos, setAutoPlayVideos] = useState(false);

  // Display Settings
  const [compactView, setCompactView] = useState(false);
  const [showAvatars, setShowAvatars] = useState(true);
  const [showBadges, setShowBadges] = useState(true);
  const [highlightMentions, setHighlightMentions] = useState(true);

  return (
    <div className="preferences-page">
      <div className="preferences-header">
        <h1 className="preferences-title">Preferences</h1>
        <p className="preferences-subtitle">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="preferences-content">
        {/* Notifications Section */}
        <section className="preferences-section">
          <div className="preferences-section-header">
            <Icon icon="bell" size={20} className="preferences-section-icon" />
            <div>
              <h2 className="preferences-section-title">Notifications</h2>
              <p className="preferences-section-description">
                Choose how you want to be notified about activity
              </p>
            </div>
          </div>

          <div className="preferences-items">
            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="email-discussions" className="preferences-item-label">
                  Email notifications for new discussions
                </label>
                <p className="preferences-item-description">
                  Get notified when new discussions are posted in your spaces
                </p>
              </div>
              <Switch.Root
                id="email-discussions"
                checked={emailDiscussions}
                onCheckedChange={setEmailDiscussions}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="email-replies" className="preferences-item-label">
                  Email notifications for replies
                </label>
                <p className="preferences-item-description">
                  Get notified when someone replies to your content
                </p>
              </div>
              <Switch.Root
                id="email-replies"
                checked={emailReplies}
                onCheckedChange={setEmailReplies}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="email-mentions" className="preferences-item-label">
                  Email notifications for mentions
                </label>
                <p className="preferences-item-description">
                  Get notified when someone mentions you
                </p>
              </div>
              <Switch.Root
                id="email-mentions"
                checked={emailMentions}
                onCheckedChange={setEmailMentions}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="email-digest" className="preferences-item-label">
                  Weekly digest email
                </label>
                <p className="preferences-item-description">
                  Receive a weekly summary of activity in your spaces
                </p>
              </div>
              <Switch.Root
                id="email-digest"
                checked={emailDigest}
                onCheckedChange={setEmailDigest}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="push-notifications" className="preferences-item-label">
                  Push notifications
                </label>
                <p className="preferences-item-description">
                  Receive browser push notifications for important updates
                </p>
              </div>
              <Switch.Root
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>
          </div>
        </section>

        <Separator.Root className="preferences-separator" />

        {/* Privacy Section */}
        <section className="preferences-section">
          <div className="preferences-section-header">
            <Icon icon="user" size={20} className="preferences-section-icon" />
            <div>
              <h2 className="preferences-section-title">Privacy</h2>
              <p className="preferences-section-description">
                Control who can see your information and activity
              </p>
            </div>
          </div>

          <div className="preferences-items">
            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="public-profile" className="preferences-item-label">
                  Public profile
                </label>
                <p className="preferences-item-description">
                  Make your profile visible to everyone
                </p>
              </div>
              <Switch.Root
                id="public-profile"
                checked={publicProfile}
                onCheckedChange={setPublicProfile}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="show-email" className="preferences-item-label">
                  Show email address
                </label>
                <p className="preferences-item-description">
                  Allow other users to see your email address
                </p>
              </div>
              <Switch.Root
                id="show-email"
                checked={showEmail}
                onCheckedChange={setShowEmail}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="show-activity" className="preferences-item-label">
                  Show activity
                </label>
                <p className="preferences-item-description">
                  Allow others to see your recent activity and contributions
                </p>
              </div>
              <Switch.Root
                id="show-activity"
                checked={showActivity}
                onCheckedChange={setShowActivity}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="show-online" className="preferences-item-label">
                  Show online status
                </label>
                <p className="preferences-item-description">
                  Display when you're currently online
                </p>
              </div>
              <Switch.Root
                id="show-online"
                checked={showOnlineStatus}
                onCheckedChange={setShowOnlineStatus}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>
          </div>
        </section>

        <Separator.Root className="preferences-separator" />

        {/* Content Section */}
        <section className="preferences-section">
          <div className="preferences-section-header">
            <Icon icon="fileText" size={20} className="preferences-section-icon" />
            <div>
              <h2 className="preferences-section-title">Content</h2>
              <p className="preferences-section-description">
                Customize your content experience
              </p>
            </div>
          </div>

          <div className="preferences-items">
            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="auto-follow" className="preferences-item-label">
                  Auto-follow discussions
                </label>
                <p className="preferences-item-description">
                  Automatically follow discussions you comment on
                </p>
              </div>
              <Switch.Root
                id="auto-follow"
                checked={autoFollowDiscussions}
                onCheckedChange={setAutoFollowDiscussions}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="follow-notifications" className="preferences-item-label">
                  Notifications for followed discussions
                </label>
                <p className="preferences-item-description">
                  Get notified about updates to discussions you follow
                </p>
              </div>
              <Switch.Root
                id="follow-notifications"
                checked={followNotifications}
                onCheckedChange={setFollowNotifications}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="show-nsfw" className="preferences-item-label">
                  Show NSFW content
                </label>
                <p className="preferences-item-description">
                  Display content marked as Not Safe For Work
                </p>
              </div>
              <Switch.Root
                id="show-nsfw"
                checked={showNSFW}
                onCheckedChange={setShowNSFW}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="autoplay-videos" className="preferences-item-label">
                  Auto-play videos
                </label>
                <p className="preferences-item-description">
                  Automatically play videos when scrolling
                </p>
              </div>
              <Switch.Root
                id="autoplay-videos"
                checked={autoPlayVideos}
                onCheckedChange={setAutoPlayVideos}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>
          </div>
        </section>

        <Separator.Root className="preferences-separator" />

        {/* Display Section */}
        <section className="preferences-section">
          <div className="preferences-section-header">
            <Icon icon="settings" size={20} className="preferences-section-icon" />
            <div>
              <h2 className="preferences-section-title">Display</h2>
              <p className="preferences-section-description">
                Customize how content is displayed
              </p>
            </div>
          </div>

          <div className="preferences-items">
            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="compact-view" className="preferences-item-label">
                  Compact view
                </label>
                <p className="preferences-item-description">
                  Show more content in less space
                </p>
              </div>
              <Switch.Root
                id="compact-view"
                checked={compactView}
                onCheckedChange={setCompactView}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="show-avatars" className="preferences-item-label">
                  Show avatars
                </label>
                <p className="preferences-item-description">
                  Display user avatars in comments and posts
                </p>
              </div>
              <Switch.Root
                id="show-avatars"
                checked={showAvatars}
                onCheckedChange={setShowAvatars}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="show-badges" className="preferences-item-label">
                  Show user badges
                </label>
                <p className="preferences-item-description">
                  Display achievement badges next to usernames
                </p>
              </div>
              <Switch.Root
                id="show-badges"
                checked={showBadges}
                onCheckedChange={setShowBadges}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="preferences-item">
              <div className="preferences-item-info">
                <label htmlFor="highlight-mentions" className="preferences-item-label">
                  Highlight mentions
                </label>
                <p className="preferences-item-description">
                  Highlight comments where you're mentioned
                </p>
              </div>
              <Switch.Root
                id="highlight-mentions"
                checked={highlightMentions}
                onCheckedChange={setHighlightMentions}
                className="preference-switch"
              >
                <Switch.Thumb className="preference-switch-thumb" />
              </Switch.Root>
            </div>
          </div>
        </section>

        <div className="preferences-footer">
          <p className="preferences-footer-text">
            Changes are saved automatically
          </p>
        </div>
      </div>
    </div>
  );
}
