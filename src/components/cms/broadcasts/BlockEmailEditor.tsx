'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  GripVertical,
  Trash2,
  Type,
  AlignLeft,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Space,
  ChevronDown,
  MoveUp,
  MoveDown,
} from 'lucide-react';
import styles from './BlockEmailEditor.module.scss';

type BlockType = 'heading' | 'paragraph' | 'button' | 'image' | 'divider' | 'spacer';

interface Block {
  id: string;
  type: BlockType;
  content: {
    text?: string;
    url?: string;
    alt?: string;
    level?: 'h1' | 'h2' | 'h3';
    buttonText?: string;
    buttonUrl?: string;
    height?: number;
  };
}

interface BlockEmailEditorProps {
  initialContent?: string;
  initialBlocks?: Block[] | null;
  onChange: (html: string) => void;
}

const blockTypes = [
  { type: 'heading' as BlockType, label: 'Heading', icon: Type },
  { type: 'paragraph' as BlockType, label: 'Paragraph', icon: AlignLeft },
  { type: 'button' as BlockType, label: 'Button', icon: LinkIcon },
  { type: 'image' as BlockType, label: 'Image', icon: ImageIcon },
  { type: 'divider' as BlockType, label: 'Divider', icon: Minus },
  { type: 'spacer' as BlockType, label: 'Spacer', icon: Space },
];

export function BlockEmailEditor({ initialContent, initialBlocks, onChange }: BlockEmailEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: '1',
      type: 'heading',
      content: { text: 'Welcome to our community!', level: 'h1' },
    },
    {
      id: '2',
      type: 'paragraph',
      content: { text: 'Start building your email by adding blocks below.' },
    },
  ]);
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  // Load template blocks when initialBlocks changes
  useEffect(() => {
    if (initialBlocks && initialBlocks.length > 0) {
      updateBlocks(initialBlocks);
    }
  }, [initialBlocks]);

  const generateHTML = (currentBlocks: Block[]) => {
    return currentBlocks
      .map((block) => {
        switch (block.type) {
          case 'heading':
            const HeadingTag = block.content.level || 'h2';
            return `<${HeadingTag} style="color: #0f172a; margin: 0 0 16px 0;">${block.content.text || ''}</${HeadingTag}>`;

          case 'paragraph':
            return `<p style="color: #475569; line-height: 1.6; margin: 0 0 16px 0;">${block.content.text || ''}</p>`;

          case 'button':
            return `<table cellpadding="0" cellspacing="0" style="margin: 24px 0;"><tr><td style="border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"><a href="${block.content.buttonUrl || '#'}" style="display: inline-block; padding: 12px 32px; color: #ffffff; text-decoration: none; font-weight: 600;">${block.content.buttonText || 'Click here'}</a></td></tr></table>`;

          case 'image':
            return `<img src="${block.content.url || 'https://via.placeholder.com/600x300'}" alt="${block.content.alt || ''}" style="max-width: 100%; height: auto; margin: 16px 0; border-radius: 8px;" />`;

          case 'divider':
            return `<hr style="border: none; border-top: 2px solid #e2e8f0; margin: 24px 0;" />`;

          case 'spacer':
            return `<div style="height: ${block.content.height || 24}px;"></div>`;

          default:
            return '';
        }
      })
      .join('\n');
  };

  const updateBlocks = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    const html = generateHTML(newBlocks);
    onChange(html);
  };

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content:
        type === 'heading'
          ? { text: 'New Heading', level: 'h2' }
          : type === 'paragraph'
          ? { text: 'New paragraph text goes here.' }
          : type === 'button'
          ? { buttonText: 'Click Me', buttonUrl: '#' }
          : type === 'image'
          ? { url: 'https://via.placeholder.com/600x300', alt: 'Image description' }
          : type === 'spacer'
          ? { height: 24 }
          : {},
    };

    updateBlocks([...blocks, newBlock]);
    setShowBlockMenu(false);
  };

  const updateBlock = (id: string, content: Block['content']) => {
    updateBlocks(blocks.map((block) => (block.id === id ? { ...block, content } : block)));
  };

  const deleteBlock = (id: string) => {
    updateBlocks(blocks.filter((block) => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex((block) => block.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    updateBlocks(newBlocks);
  };

  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <h3>Email Content</h3>
        <p>Build your email using drag-and-drop blocks</p>
      </div>

      <div className={styles.editorLayout}>
        {/* Blocks List */}
        <div className={styles.blocksList}>
          {blocks.map((block, index) => (
            <div key={block.id} className={styles.blockWrapper}>
              <div className={styles.blockControls}>
                <button className={styles.dragHandle} title="Drag to reorder">
                  <GripVertical />
                </button>
                <div className={styles.blockActions}>
                  <button
                    onClick={() => moveBlock(block.id, 'up')}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <MoveUp />
                  </button>
                  <button
                    onClick={() => moveBlock(block.id, 'down')}
                    disabled={index === blocks.length - 1}
                    title="Move down"
                  >
                    <MoveDown />
                  </button>
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className={styles.deleteButton}
                    title="Delete"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>

              <div className={styles.blockContent}>
                {/* Heading Block */}
                {block.type === 'heading' && (
                  <div className={styles.blockEditor}>
                    <div className={styles.blockEditorHeader}>
                      <Type />
                      <span>Heading</span>
                    </div>
                    <select
                      value={block.content.level || 'h2'}
                      onChange={(e) =>
                        updateBlock(block.id, {
                          ...block.content,
                          level: e.target.value as 'h1' | 'h2' | 'h3',
                        })
                      }
                      className={styles.select}
                    >
                      <option value="h1">Heading 1 (Large)</option>
                      <option value="h2">Heading 2 (Medium)</option>
                      <option value="h3">Heading 3 (Small)</option>
                    </select>
                    <input
                      type="text"
                      value={block.content.text || ''}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, text: e.target.value })
                      }
                      placeholder="Enter heading text"
                      className={styles.input}
                    />
                  </div>
                )}

                {/* Paragraph Block */}
                {block.type === 'paragraph' && (
                  <div className={styles.blockEditor}>
                    <div className={styles.blockEditorHeader}>
                      <AlignLeft />
                      <span>Paragraph</span>
                    </div>
                    <textarea
                      value={block.content.text || ''}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, text: e.target.value })
                      }
                      placeholder="Enter paragraph text"
                      rows={4}
                      className={styles.textarea}
                    />
                  </div>
                )}

                {/* Button Block */}
                {block.type === 'button' && (
                  <div className={styles.blockEditor}>
                    <div className={styles.blockEditorHeader}>
                      <LinkIcon />
                      <span>Button</span>
                    </div>
                    <input
                      type="text"
                      value={block.content.buttonText || ''}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, buttonText: e.target.value })
                      }
                      placeholder="Button text"
                      className={styles.input}
                    />
                    <input
                      type="url"
                      value={block.content.buttonUrl || ''}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, buttonUrl: e.target.value })
                      }
                      placeholder="Button URL (https://...)"
                      className={styles.input}
                    />
                  </div>
                )}

                {/* Image Block */}
                {block.type === 'image' && (
                  <div className={styles.blockEditor}>
                    <div className={styles.blockEditorHeader}>
                      <ImageIcon />
                      <span>Image</span>
                    </div>
                    <input
                      type="url"
                      value={block.content.url || ''}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, url: e.target.value })
                      }
                      placeholder="Image URL (https://...)"
                      className={styles.input}
                    />
                    <input
                      type="text"
                      value={block.content.alt || ''}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, alt: e.target.value })
                      }
                      placeholder="Image description (for accessibility)"
                      className={styles.input}
                    />
                  </div>
                )}

                {/* Divider Block */}
                {block.type === 'divider' && (
                  <div className={styles.blockEditor}>
                    <div className={styles.blockEditorHeader}>
                      <Minus />
                      <span>Divider</span>
                    </div>
                    <div className={styles.dividerPreview} />
                  </div>
                )}

                {/* Spacer Block */}
                {block.type === 'spacer' && (
                  <div className={styles.blockEditor}>
                    <div className={styles.blockEditorHeader}>
                      <Space />
                      <span>Spacer</span>
                    </div>
                    <label className={styles.label}>
                      Height (pixels)
                      <input
                        type="number"
                        value={block.content.height || 24}
                        onChange={(e) =>
                          updateBlock(block.id, {
                            ...block.content,
                            height: parseInt(e.target.value) || 24,
                          })
                        }
                        min="8"
                        max="200"
                        className={styles.input}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add Block Button */}
          <div className={styles.addBlockWrapper}>
            <button
              onClick={() => setShowBlockMenu(!showBlockMenu)}
              className={styles.addBlockButton}
            >
              <Plus />
              Add Block
              <ChevronDown className={showBlockMenu ? styles.rotated : ''} />
            </button>

            {showBlockMenu && (
              <div className={styles.blockMenu}>
                {blockTypes.map((blockType) => {
                  const Icon = blockType.icon;
                  return (
                    <button
                      key={blockType.type}
                      onClick={() => addBlock(blockType.type)}
                      className={styles.blockMenuItem}
                    >
                      <Icon />
                      {blockType.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <h4>Live Preview</h4>
          </div>
          <div className={styles.previewContent}>
            <div
              className={styles.emailPreview}
              dangerouslySetInnerHTML={{ __html: generateHTML(blocks) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
