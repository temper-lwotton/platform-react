import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import type { Klass, LexicalNode } from 'lexical';

export type EditorMode = 'simple' | 'standard' | 'advanced';

export interface EditorFeatures {
    // Text formatting
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    code: boolean;

    // Block types
    headings: boolean;
    quote: boolean;
    codeBlock: boolean;

    // Lists
    bulletList: boolean;
    numberedList: boolean;

    // Advanced
    links: boolean;
    tables: boolean;
    horizontalRule: boolean;
    images: boolean;

    // History
    undo: boolean;
    redo: boolean;
}

export interface EditorConfig {
    mode: EditorMode;
    features: EditorFeatures;
    nodes: Array<Klass<LexicalNode>>;
    placeholder?: string;
}

/**
 * Simple Editor: Rich formatting for discussions
 * - Bold, Italic, Headings
 * - Links, Images, Tables
 * - Lists, Quotes, Code blocks
 * Perfect for: Discussions, posts, content creation
 */
export const SIMPLE_EDITOR_CONFIG: EditorConfig = {
    mode: 'simple',
    features: {
        bold: true,
        italic: true,
        underline: false,
        strikethrough: false,
        code: false,
        headings: true,
        quote: true,
        codeBlock: true,
        bulletList: true,
        numberedList: true,
        links: true,
        tables: true,
        horizontalRule: false,
        images: true,
        undo: true,
        redo: true,
    },
    nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        AutoLinkNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
    ],
    placeholder: 'Share your thoughts...',
};

/**
 * Standard Editor: Full-featured for discussion posts
 * - All text formatting
 * - Headings (H1-H3)
 * - Lists and quotes
 * - Code blocks
 * Perfect for: Discussion posts, forum threads
 */
export const STANDARD_EDITOR_CONFIG: EditorConfig = {
    mode: 'standard',
    features: {
        bold: true,
        italic: true,
        underline: true,
        strikethrough: true,
        code: true,
        headings: true,
        quote: true,
        codeBlock: true,
        bulletList: true,
        numberedList: true,
        links: true,
        tables: false,
        horizontalRule: false,
        images: false,
        undo: true,
        redo: true,
    },
    nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        AutoLinkNode,
        CodeNode,
        CodeHighlightNode,
    ],
    placeholder: 'Share your thoughts, questions, or ideas...',
};

/**
 * Advanced Editor: Full block editor for articles
 * - Everything in Standard
 * - Tables
 * - Images
 * - Horizontal rules
 * Perfect for: Long-form articles, documentation, pages
 */
export const ADVANCED_EDITOR_CONFIG: EditorConfig = {
    mode: 'advanced',
    features: {
        bold: true,
        italic: true,
        underline: true,
        strikethrough: true,
        code: true,
        headings: true,
        quote: true,
        codeBlock: true,
        bulletList: true,
        numberedList: true,
        links: true,
        tables: true,
        horizontalRule: true,
        images: true,
        undo: true,
        redo: true,
    },
    nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        AutoLinkNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        HorizontalRuleNode,
    ],
    placeholder: 'Start writing your article...',
};

/**
 * Get editor configuration by mode
 */
export function getEditorConfig(mode: EditorMode = 'standard'): EditorConfig {
    switch (mode) {
        case 'simple':
            return SIMPLE_EDITOR_CONFIG;
        case 'standard':
            return STANDARD_EDITOR_CONFIG;
        case 'advanced':
            return ADVANCED_EDITOR_CONFIG;
        default:
            return STANDARD_EDITOR_CONFIG;
    }
}

/**
 * Create custom editor configuration
 */
export function createCustomEditorConfig(
    baseMode: EditorMode,
    overrides: Partial<EditorFeatures>
): EditorConfig {
    const baseConfig = getEditorConfig(baseMode);
    return {
        ...baseConfig,
        features: {
            ...baseConfig.features,
            ...overrides,
        },
    };
}
