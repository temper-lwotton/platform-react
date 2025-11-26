'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
    $createTextNode,
} from 'lexical';
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode,
} from '@lexical/list';
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    HeadingTagType,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { $createParagraphNode } from 'lexical';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $createCodeNode } from '@lexical/code';
import type { EditorFeatures, EditorMode } from '@/lib/lexical-config';
import { LinkInsertDialog } from './lexical/dialogs/LinkInsertDialog';
import { CodeBlockInsertDialog } from './lexical/dialogs/CodeBlockInsertDialog';
import {
    formatBold,
    formatItalic,
    formatUnderline,
    formatStrikethrough,
    code,
    formatListBullets,
    formatListNumbered,
    undo,
    redo,
    quote,
    link,
    image,
    blockTable,
} from '@wordpress/icons';

interface ToolbarPluginProps {
    disabled?: boolean;
    features: EditorFeatures;
    mode: EditorMode;
}

export function ToolbarPlugin({ disabled, features, mode }: ToolbarPluginProps) {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isCode, setIsCode] = useState(false);
    const [blockType, setBlockType] = useState('paragraph');

    // Dialog state
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [codeBlockDialogOpen, setCodeBlockDialogOpen] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // Update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsCode(selection.hasFormat('code'));

            // Update block type
            const anchorNode = selection.anchor.getNode();
            const element =
                anchorNode.getKey() === 'root'
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow();
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);

            if (elementDOM !== null) {
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                    const type = parentList ? parentList.getListType() : element.getListType();
                    setBlockType(type);
                } else {
                    const type = $isHeadingNode(element) ? element.getTag() : element.getType();
                    setBlockType(type);
                }
            }
        }
    }, [editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            })
        );
    }, [editor, updateToolbar]);

    const formatHeading = (headingSize: HeadingTagType) => {
        if (blockType !== headingSize) {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createHeadingNode(headingSize));
                }
            });
        }
    };

    const formatParagraph = () => {
        if (blockType !== 'paragraph') {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createParagraphNode());
                }
            });
        }
    };

    const formatQuote = () => {
        if (blockType !== 'quote') {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createQuoteNode());
                }
            });
        }
    };

    const formatBulletList = () => {
        if (blockType !== 'ul') {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        }
    };

    const formatNumberedList = () => {
        if (blockType !== 'ol') {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        }
    };

    // Link insertion
    const handleLinkButtonClick = () => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const text = selection.getTextContent();
                setSelectedText(text);
            }
        });
        setLinkDialogOpen(true);
    };

    const handleLinkInsert = (url: string, text: string, openInNewTab: boolean) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                if (selection.isCollapsed()) {
                    // No text selected - insert new link with text
                    const linkNode = $createTextNode(text);
                    selection.insertNodes([linkNode]);
                    linkNode.select();
                }

                // Apply link to selection
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
                    url,
                    target: openInNewTab ? '_blank' : null,
                    rel: openInNewTab ? 'noopener noreferrer' : null,
                });
            }
        });
    };

    // Code block insertion
    const handleCodeBlockButtonClick = () => {
        setCodeBlockDialogOpen(true);
    };

    const handleCodeBlockInsert = (language?: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                // Create a code node with the selected language
                const codeNode = $createCodeNode(language);
                // Convert the current block to a code block
                $setBlocksType(selection, () => codeNode);
            }
        });
    };

    // Determine toolbar layout based on mode
    const isCompact = mode === 'simple';

    return (
        <div className={`lexical-toolbar ${isCompact ? 'lexical-toolbar-compact' : ''}`}>
            {/* History */}
            {features.undo && (
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                    className="lexical-toolbar-button"
                    aria-label="Undo"
                    title="Undo (Ctrl+Z)"
                >
                    {undo}
                </button>
            )}
            {features.redo && (
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                    className="lexical-toolbar-button"
                    aria-label="Redo"
                    title="Redo (Ctrl+Y)"
                >
                    {redo}
                </button>
            )}

            {(features.undo || features.redo) && <div className="lexical-toolbar-divider" />}

            {/* Block Type Selector */}
            {features.headings && (
                <>
                    <select
                        disabled={disabled}
                        value={blockType}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === 'paragraph') formatParagraph();
                            else if (value === 'h1') formatHeading('h1');
                            else if (value === 'h2') formatHeading('h2');
                            else if (value === 'h3') formatHeading('h3');
                            else if (value === 'quote' && features.quote) formatQuote();
                        }}
                        className="lexical-toolbar-select"
                        aria-label="Formatting options"
                    >
                        <option value="paragraph">Paragraph</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        {features.quote && <option value="quote">Quote</option>}
                    </select>
                    <div className="lexical-toolbar-divider" />
                </>
            )}

            {/* Text Formatting */}
            <div className="lexical-toolbar-group">
                {features.bold && (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                        className={`lexical-toolbar-button ${isBold ? 'active' : ''}`}
                        aria-label="Format bold"
                        title="Bold (Ctrl+B)"
                    >
                        {formatBold}
                    </button>
                )}
                {features.italic && (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                        className={`lexical-toolbar-button ${isItalic ? 'active' : ''}`}
                        aria-label="Format italic"
                        title="Italic (Ctrl+I)"
                    >
                        {formatItalic}
                    </button>
                )}
                {features.underline && (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                        className={`lexical-toolbar-button ${isUnderline ? 'active' : ''}`}
                        aria-label="Format underline"
                        title="Underline (Ctrl+U)"
                    >
                        {formatUnderline}
                    </button>
                )}
                {features.strikethrough && (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
                        className={`lexical-toolbar-button ${isStrikethrough ? 'active' : ''}`}
                        aria-label="Format strikethrough"
                        title="Strikethrough"
                    >
                        {formatStrikethrough}
                    </button>
                )}
                {features.code && (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
                        className={`lexical-toolbar-button ${isCode ? 'active' : ''}`}
                        aria-label="Format code"
                        title="Code"
                    >
                        {code}
                    </button>
                )}
            </div>

            {(features.bulletList || features.numberedList) && (
                <div className="lexical-toolbar-divider" />
            )}

            {/* Lists */}
            {(features.bulletList || features.numberedList) && (
                <div className="lexical-toolbar-group">
                    {features.bulletList && (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={formatBulletList}
                            className={`lexical-toolbar-button ${blockType === 'ul' ? 'active' : ''}`}
                            aria-label="Bullet list"
                            title="Bullet list"
                        >
                            {formatListBullets}
                        </button>
                    )}
                    {features.numberedList && (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={formatNumberedList}
                            className={`lexical-toolbar-button ${blockType === 'ol' ? 'active' : ''}`}
                            aria-label="Numbered list"
                            title="Numbered list"
                        >
                            {formatListNumbered}
                        </button>
                    )}
                </div>
            )}

            {/* Block Elements */}
            {(features.quote || features.codeBlock) && (
                <>
                    <div className="lexical-toolbar-divider" />
                    <div className="lexical-toolbar-group">
                        {features.quote && (
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={formatQuote}
                                className={`lexical-toolbar-button ${blockType === 'quote' ? 'active' : ''}`}
                                aria-label="Quote block"
                                title="Quote block"
                            >
                                {quote}
                            </button>
                        )}
                        {features.codeBlock && (
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={handleCodeBlockButtonClick}
                                className="lexical-toolbar-button"
                                aria-label="Code block"
                                title="Insert code block"
                            >
                                {code}
                            </button>
                        )}
                    </div>
                </>
            )}

            {/* Insert Elements */}
            {(features.links || features.images || features.tables) && (
                <>
                    <div className="lexical-toolbar-divider" />
                    <div className="lexical-toolbar-group">
                        {features.links && (
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={handleLinkButtonClick}
                                className="lexical-toolbar-button"
                                aria-label="Insert link"
                                title="Insert link"
                            >
                                {link}
                            </button>
                        )}
                        {features.images && (
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => {
                                    // Image insertion will be handled
                                }}
                                className="lexical-toolbar-button"
                                aria-label="Insert image"
                                title="Insert image (coming soon)"
                            >
                                {image}
                            </button>
                        )}
                        {features.tables && (
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => {
                                    // Table insertion will be handled
                                }}
                                className="lexical-toolbar-button"
                                aria-label="Insert table"
                                title="Insert table (coming soon)"
                            >
                                {blockTable}
                            </button>
                        )}
                    </div>
                </>
            )}

            {/* Advanced Features Badge */}
            {mode === 'advanced' && (
                <div className="lexical-toolbar-mode-badge">
                    Advanced
                </div>
            )}

            {/* Dialogs */}
            <LinkInsertDialog
                open={linkDialogOpen}
                onOpenChange={setLinkDialogOpen}
                onInsert={handleLinkInsert}
                initialText={selectedText}
            />
            <CodeBlockInsertDialog
                open={codeBlockDialogOpen}
                onOpenChange={setCodeBlockDialogOpen}
                onInsert={handleCodeBlockInsert}
            />
        </div>
    );
}
