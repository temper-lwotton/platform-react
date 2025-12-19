'use client';

import { useState } from 'react';
import {
  Type,
  Image as ImageIcon,
  LayoutGrid,
  AlignLeft,
  Link as LinkIcon,
  Divide,
  Square,
  Trash2,
  Plus,
  GripVertical,
  Eye,
  Code,
} from 'lucide-react';
import styles from './EmailBuilder.module.scss';

interface EmailBuilderProps {
  content: any;
  onChange: (content: any) => void;
}

interface EmailBlock {
  id: string;
  type: 'text' | 'heading' | 'image' | 'button' | 'divider' | 'spacer';
  content?: any;
}

const blockTypes = [
  { type: 'heading', icon: Type, label: 'Heading' },
  { type: 'text', icon: AlignLeft, label: 'Text' },
  { type: 'image', icon: ImageIcon, label: 'Image' },
  { type: 'button', icon: Square, label: 'Button' },
  { type: 'divider', icon: Divide, label: 'Divider' },
  { type: 'spacer', icon: LayoutGrid, label: 'Spacer' },
];

export function EmailBuilder({ content, onChange }: EmailBuilderProps) {
  const [blocks, setBlocks] = useState<EmailBlock[]>(
    content?.blocks || [
      {
        id: '1',
        type: 'heading',
        content: { text: 'Welcome to our newsletter!', level: 'h1' },
      },
      {
        id: '2',
        type: 'text',
        content: {
          text: 'Thank you for subscribing. We are excited to share our latest updates with you.',
        },
      },
    ]
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const addBlock = (type: EmailBlock['type']) => {
    const newBlock: EmailBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
    };

    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
    onChange({ blocks: newBlocks });
  };

  const updateBlock = (id: string, content: any) => {
    const newBlocks = blocks.map((block) =>
      block.id === id ? { ...block, content } : block
    );
    setBlocks(newBlocks);
    onChange({ blocks: newBlocks });
  };

  const deleteBlock = (id: string) => {
    const newBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(newBlocks);
    setSelectedBlockId(null);
    onChange({ blocks: newBlocks });
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ];

    setBlocks(newBlocks);
    onChange({ blocks: newBlocks });
  };

  const getDefaultContent = (type: EmailBlock['type']) => {
    switch (type) {
      case 'heading':
        return { text: 'New Heading', level: 'h2' };
      case 'text':
        return { text: 'Add your text here...' };
      case 'image':
        return { url: '', alt: 'Image description', width: '100%' };
      case 'button':
        return { text: 'Click Here', url: '#', align: 'center' };
      case 'divider':
        return { color: '#e5e7eb', thickness: 1 };
      case 'spacer':
        return { height: 20 };
      default:
        return {};
    }
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  return (
    <div className={styles.builder}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarSection}>
          <h3 className={styles.toolbarTitle}>Content Blocks</h3>
          <div className={styles.blockTypeGrid}>
            {blockTypes.map((blockType) => {
              const Icon = blockType.icon;
              return (
                <button
                  key={blockType.type}
                  onClick={() => addBlock(blockType.type as EmailBlock['type'])}
                  className={styles.blockTypeButton}
                  title={blockType.label}
                >
                  <Icon className={styles.blockTypeIcon} />
                  <span className={styles.blockTypeLabel}>{blockType.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.toolbarActions}>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`${styles.toolbarButton} ${previewMode ? styles.active : ''}`}
          >
            <Eye className={styles.toolbarButtonIcon} />
            Preview
          </button>
        </div>
      </div>

      <div className={styles.builderContent}>
        {/* Canvas */}
        <div className={styles.canvas}>
          <div className={styles.emailContainer}>
            {blocks.length === 0 ? (
              <div className={styles.emptyCanvas}>
                <LayoutGrid className={styles.emptyIcon} />
                <p className={styles.emptyText}>
                  Start building your email by adding content blocks
                </p>
              </div>
            ) : (
              blocks.map((block, index) => (
                <div
                  key={block.id}
                  className={`${styles.blockWrapper} ${
                    selectedBlockId === block.id ? styles.selected : ''
                  } ${previewMode ? styles.preview : ''}`}
                  onClick={() => !previewMode && setSelectedBlockId(block.id)}
                >
                  {!previewMode && (
                    <div className={styles.blockControls}>
                      <button
                        className={styles.blockControlButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBlock(block.id, 'up');
                        }}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <GripVertical className={styles.dragHandle} />
                      <button
                        className={styles.blockControlButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBlock(block.id, 'down');
                        }}
                        disabled={index === blocks.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        className={`${styles.blockControlButton} ${styles.danger}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlock(block.id);
                        }}
                      >
                        <Trash2 className={styles.blockControlIcon} />
                      </button>
                    </div>
                  )}
                  <BlockRenderer block={block} previewMode={previewMode} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Properties Panel */}
        {!previewMode && selectedBlock && (
          <div className={styles.propertiesPanel}>
            <div className={styles.propertiesPanelHeader}>
              <h3 className={styles.propertiesPanelTitle}>Block Settings</h3>
              <button
                onClick={() => setSelectedBlockId(null)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            <div className={styles.propertiesPanelContent}>
              <BlockEditor
                block={selectedBlock}
                onChange={(content) => updateBlock(selectedBlock.id, content)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Block Renderer Component
function BlockRenderer({
  block,
  previewMode,
}: {
  block: EmailBlock;
  previewMode: boolean;
}) {
  switch (block.type) {
    case 'heading':
      const HeadingTag = block.content?.level || 'h2';
      return (
        <HeadingTag className={styles.heading}>{block.content?.text}</HeadingTag>
      );
    case 'text':
      return <p className={styles.text}>{block.content?.text}</p>;
    case 'image':
      return block.content?.url ? (
        <img
          src={block.content.url}
          alt={block.content.alt}
          className={styles.image}
          style={{ width: block.content.width }}
        />
      ) : (
        <div className={styles.imagePlaceholder}>
          <ImageIcon className={styles.imagePlaceholderIcon} />
          <span>Add image URL</span>
        </div>
      );
    case 'button':
      return (
        <div
          className={styles.buttonContainer}
          style={{ textAlign: block.content?.align || 'center' }}
        >
          <a href={block.content?.url || '#'} className={styles.button}>
            {block.content?.text}
          </a>
        </div>
      );
    case 'divider':
      return (
        <hr
          className={styles.divider}
          style={{
            borderColor: block.content?.color || '#e5e7eb',
            borderWidth: `${block.content?.thickness || 1}px 0 0 0`,
          }}
        />
      );
    case 'spacer':
      return (
        <div
          className={styles.spacer}
          style={{ height: `${block.content?.height || 20}px` }}
        />
      );
    default:
      return null;
  }
}

// Block Editor Component
function BlockEditor({
  block,
  onChange,
}: {
  block: EmailBlock;
  onChange: (content: any) => void;
}) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...block.content, [field]: value });
  };

  switch (block.type) {
    case 'heading':
      return (
        <div className={styles.editorFields}>
          <div className={styles.editorField}>
            <label className={styles.editorLabel}>Heading Level</label>
            <select
              value={block.content?.level || 'h2'}
              onChange={(e) => handleChange('level', e.target.value)}
              className={styles.editorSelect}
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
            </select>
          </div>
          <div className={styles.editorField}>
            <label className={styles.editorLabel}>Text</label>
            <input
              type="text"
              value={block.content?.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              className={styles.editorInput}
            />
          </div>
        </div>
      );
    case 'text':
      return (
        <div className={styles.editorFields}>
          <div className={styles.editorField}>
            <label className={styles.editorLabel}>Content</label>
            <textarea
              value={block.content?.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              className={styles.editorTextarea}
              rows={5}
            />
          </div>
        </div>
      );
    case 'image':
      return (
        <div className={styles.editorFields}>
          <div className={styles.editorField}>
            <label className={styles.editorLabel}>Image URL</label>
            <input
              type="text"
              value={block.content?.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              className={styles.editorInput}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className={styles.editorField}>
            <label className={styles.editorLabel}>Alt Text</label>
            <input
              type="text"
              value={block.content?.alt || ''}
              onChange={(e) => handleChange('alt', e.target.value)}
              className={styles.editorInput}
            />
          </div>
          <div className={styles.editorField}>
            <label className={styles.editorLabel}>Width</label>
            <select
              value={block.content?.width || '100%'}
              onChange={(e) => handleChange('width', e.target.value)}
              className={styles.editorSelect}
            >
              <option value="100%">Full Width</option>
              <option value="75%">75%</option>
              <option value="50%">50%</option>
              <option value="25%">25%</option>
            </select>
          </div>
        </div>
      );
    case 'button':
      return (
        <div className={styles.editorFields}>
          <div className={styles.editorField}>
            <label className={styles.editorLabel}>Button Text</label>
            <input
              type="text"
              value={block.content?.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              className={styles.editorInput}
            />
          </div>
          <div className={styles.editorField}>
            <label className={styles.editorLabel}>Link URL</label>
            <input
              type="text"
              value={block.content?.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              className={styles.editorInput}
              placeholder="https://example.com"
            />
          </div>
          <div className={styles.editorField}>
            <label className={styles.editorLabel}>Alignment</label>
            <select
              value={block.content?.align || 'center'}
              onChange={(e) => handleChange('align', e.target.value)}
              className={styles.editorSelect}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      );
    case 'divider':
      return (
        <div className={styles.editorFields}>
          <div className={styles.editorField}>
            <label className={styles.editorLabel}>Color</label>
            <input
              type="color"
              value={block.content?.color || '#e5e7eb'}
              onChange={(e) => handleChange('color', e.target.value)}
              className={styles.editorColorInput}
            />
          </div>
          <div className={styles.editorField}>
            <label className={styles.editorLabel}>Thickness (px)</label>
            <input
              type="number"
              value={block.content?.thickness || 1}
              onChange={(e) => handleChange('thickness', parseInt(e.target.value))}
              className={styles.editorInput}
              min="1"
              max="10"
            />
          </div>
        </div>
      );
    case 'spacer':
      return (
        <div className={styles.editorFields}>
          <div className={styles.editorField}>
            <label className={styles.editorLabel}>Height (px)</label>
            <input
              type="number"
              value={block.content?.height || 20}
              onChange={(e) => handleChange('height', parseInt(e.target.value))}
              className={styles.editorInput}
              min="10"
              max="200"
              step="10"
            />
          </div>
        </div>
      );
    default:
      return null;
  }
}
