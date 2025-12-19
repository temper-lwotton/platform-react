'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Palette,
  Wand2,
  RefreshCw,
} from 'lucide-react';
import { SpaceData } from '../SpaceCreationWizard';
import styles from './SpaceBrandingForm.module.scss';

interface SpaceBrandingFormProps {
  spaceData: SpaceData;
  setSpaceData: (data: SpaceData) => void;
  useAIDefaults: boolean;
}

const colorPalettes = [
  { name: 'Purple Dream', colors: ['#667eea', '#764ba2'] },
  { name: 'Ocean Blue', colors: ['#2563eb', '#06b6d4'] },
  { name: 'Forest Green', colors: ['#10b981', '#059669'] },
  { name: 'Sunset Orange', colors: ['#f59e0b', '#ef4444'] },
  { name: 'Pink Blossom', colors: ['#ec4899', '#8b5cf6'] },
  { name: 'Midnight', colors: ['#1e293b', '#475569'] },
];

const iconEmojis = ['🚀', '💡', '🎯', '⭐', '🔥', '💎', '🌟', '✨', '🎨', '🏆', '💪', '🌈'];

export function SpaceBrandingForm({
  spaceData,
  setSpaceData,
  useAIDefaults,
}: SpaceBrandingFormProps) {
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [generatingTagline, setGeneratingTagline] = useState(false);

  // Auto-generate handle from name
  useEffect(() => {
    if (spaceData.name && !spaceData.handle) {
      const handle = spaceData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 30);
      setSpaceData({ ...spaceData, handle });
    }
  }, [spaceData.name]);

  const generateDescription = () => {
    setGeneratingDescription(true);

    // Simulate AI generation
    setTimeout(() => {
      const templates = [
        `Welcome to ${spaceData.name}! This is a dynamic space where members can collaborate, share ideas, and build meaningful connections. Join us to be part of an engaged community focused on growth and innovation.`,
        `${spaceData.name} is your hub for collaboration and creativity. Connect with like-minded individuals, share insights, and work together on exciting projects. We're building something special here.`,
        `Join ${spaceData.name} - a thriving community dedicated to excellence and innovation. Share knowledge, collaborate on projects, and grow together with passionate members who share your interests.`,
      ];

      const randomDescription = templates[Math.floor(Math.random() * templates.length)];
      setSpaceData({ ...spaceData, description: randomDescription });
      setGeneratingDescription(false);
    }, 1500);
  };

  const generateTagline = () => {
    setGeneratingTagline(true);

    setTimeout(() => {
      const templates = [
        'Where great ideas come together',
        'Collaborate, create, succeed',
        'Building the future, together',
        'Your community for growth and innovation',
        'Connect, learn, and thrive',
        'Innovation meets collaboration',
      ];

      const randomTagline = templates[Math.floor(Math.random() * templates.length)];
      setSpaceData({ ...spaceData, subtitle: randomTagline });
      setGeneratingTagline(false);
    }, 1000);
  };

  const handleColorPaletteSelect = (colors: string[]) => {
    setSpaceData({ ...spaceData, colorPalette: colors });
  };

  return (
    <div className={styles.brandingForm}>
      <div className={styles.header}>
        <h2>Give Your Space Personality</h2>
        <p>Create a memorable identity that reflects your community's purpose</p>
      </div>

      <div className={styles.formLayout}>
        {/* Left Column - Text Content */}
        <div className={styles.formColumn}>
          {/* Space Name */}
          <div className={styles.formGroup}>
            <label>
              <span className={styles.labelText}>
                Space Name <span className={styles.required}>*</span>
              </span>
              <input
                type="text"
                placeholder="e.g., Design Team HQ"
                value={spaceData.name}
                onChange={(e) => setSpaceData({ ...spaceData, name: e.target.value })}
                className={styles.input}
                maxLength={60}
              />
              <span className={styles.hint}>
                {spaceData.name.length}/60 characters
              </span>
            </label>
          </div>

          {/* Tagline */}
          <div className={styles.formGroup}>
            <label>
              <div className={styles.labelWithAction}>
                <span className={styles.labelText}>Tagline</span>
                <button
                  type="button"
                  onClick={generateTagline}
                  disabled={!spaceData.name || generatingTagline}
                  className={styles.aiButton}
                >
                  <Sparkles />
                  {generatingTagline ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              <input
                type="text"
                placeholder="A catchy one-liner about your space"
                value={spaceData.subtitle}
                onChange={(e) => setSpaceData({ ...spaceData, subtitle: e.target.value })}
                className={styles.input}
                maxLength={100}
              />
              <span className={styles.hint}>
                {spaceData.subtitle.length}/100 characters
              </span>
            </label>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label>
              <div className={styles.labelWithAction}>
                <span className={styles.labelText}>
                  Description <span className={styles.required}>*</span>
                </span>
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={!spaceData.name || generatingDescription}
                  className={styles.aiButton}
                >
                  <Wand2 />
                  {generatingDescription ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              <textarea
                placeholder="Describe what your space is about and what members can expect..."
                value={spaceData.description}
                onChange={(e) => setSpaceData({ ...spaceData, description: e.target.value })}
                className={styles.textarea}
                rows={6}
                maxLength={500}
              />
              <span className={styles.hint}>
                {spaceData.description.length}/500 characters
              </span>
            </label>
          </div>

          {/* Space Handle/URL */}
          <div className={styles.formGroup}>
            <label>
              <span className={styles.labelText}>Space URL</span>
              <div className={styles.urlInput}>
                <span className={styles.urlPrefix}>spaces.app/</span>
                <input
                  type="text"
                  placeholder="your-space-url"
                  value={spaceData.handle}
                  onChange={(e) => {
                    const handle = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, '')
                      .slice(0, 30);
                    setSpaceData({ ...spaceData, handle });
                  }}
                  className={styles.handleInput}
                  maxLength={30}
                />
              </div>
              <span className={styles.hint}>
                This will be your space's unique web address
              </span>
            </label>
          </div>
        </div>

        {/* Right Column - Visual Identity */}
        <div className={styles.formColumn}>
          {/* Space Icon */}
          <div className={styles.formGroup}>
            <label>
              <span className={styles.labelText}>Space Icon</span>
            </label>

            <div className={styles.iconSelector}>
              <div
                className={styles.currentIcon}
                style={{
                  background: `linear-gradient(135deg, ${spaceData.colorPalette[0]} 0%, ${spaceData.colorPalette[1]} 100%)`,
                }}
              >
                {spaceData.icon ? (
                  <span className={styles.iconEmoji}>{spaceData.icon}</span>
                ) : (
                  <ImageIcon />
                )}
              </div>

              <div className={styles.iconOptions}>
                <span className={styles.optionLabel}>Quick Select:</span>
                <div className={styles.emojiGrid}>
                  {iconEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSpaceData({ ...spaceData, icon: emoji })}
                      className={`${styles.emojiButton} ${
                        spaceData.icon === emoji ? styles.selected : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <button type="button" className={styles.uploadButton}>
                  <Upload />
                  Upload Custom Icon
                </button>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className={styles.formGroup}>
            <label>
              <span className={styles.labelText}>Color Palette</span>
            </label>

            <div className={styles.colorPalettes}>
              {colorPalettes.map((palette) => (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => handleColorPaletteSelect(palette.colors)}
                  className={`${styles.paletteButton} ${
                    JSON.stringify(spaceData.colorPalette) === JSON.stringify(palette.colors)
                      ? styles.selected
                      : ''
                  }`}
                >
                  <div
                    className={styles.palettePreview}
                    style={{
                      background: `linear-gradient(135deg, ${palette.colors[0]} 0%, ${palette.colors[1]} 100%)`,
                    }}
                  />
                  <span>{palette.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div className={styles.formGroup}>
            <label>
              <span className={styles.labelText}>Cover Image (Optional)</span>
            </label>

            {spaceData.coverImage ? (
              <div className={styles.coverPreview}>
                <img src={spaceData.coverImage} alt="Cover" />
                <button
                  type="button"
                  onClick={() => setSpaceData({ ...spaceData, coverImage: '' })}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className={styles.coverUpload}>
                <ImageIcon />
                <p>Add a cover image to make your space stand out</p>
                <button type="button" className={styles.uploadButton}>
                  <Upload />
                  Upload Cover Image
                </button>
                <input
                  type="url"
                  placeholder="Or paste image URL..."
                  onChange={(e) => setSpaceData({ ...spaceData, coverImage: e.target.value })}
                  className={styles.urlInputField}
                />
              </div>
            )}
          </div>

          {/* AI Recommendation */}
          <div className={styles.aiRecommendation}>
            <Sparkles />
            <div>
              <strong>AI Tip</strong>
              <p>
                A clear description helps members understand your space's purpose and increases
                engagement by up to 40%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className={styles.livePreview}>
        <div className={styles.previewHeader}>
          <h3>Live Preview</h3>
          <p>See how your space will appear to members</p>
        </div>

        <div className={styles.previewCard}>
          {spaceData.coverImage && (
            <div
              className={styles.previewCover}
              style={{ backgroundImage: `url(${spaceData.coverImage})` }}
            />
          )}

          <div className={styles.previewContent}>
            <div
              className={styles.previewIcon}
              style={{
                background: `linear-gradient(135deg, ${spaceData.colorPalette[0]} 0%, ${spaceData.colorPalette[1]} 100%)`,
              }}
            >
              {spaceData.icon ? (
                <span className={styles.previewEmoji}>{spaceData.icon}</span>
              ) : (
                <ImageIcon />
              )}
            </div>

            <h4>{spaceData.name || 'Your Space Name'}</h4>
            {spaceData.subtitle && <p className={styles.previewSubtitle}>{spaceData.subtitle}</p>}
            {spaceData.description && (
              <p className={styles.previewDescription}>{spaceData.description}</p>
            )}

            {spaceData.handle && (
              <div className={styles.previewUrl}>spaces.app/{spaceData.handle}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
