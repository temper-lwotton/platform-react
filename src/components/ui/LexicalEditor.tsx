'use client';

import { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { $generateHtmlFromNodes } from '@lexical/html';
import { $getRoot, EditorState } from 'lexical';
import { registerCodeHighlighting } from '@lexical/code';

import { ToolbarPlugin } from './LexicalToolbar';
import { getEditorConfig, EditorMode } from '@/lib/lexical-config';
import { MentionNode } from './lexical/nodes/MentionNode';
import MentionsPlugin from './lexical/plugins/MentionsPlugin';
import { MentionUser } from '@/hooks/useMentions';

interface LexicalEditorProps {
    value: string;
    onChange: (content: string, html: string) => void;
    mode?: EditorMode;
    placeholder?: string;
    disabled?: boolean;
    users?: MentionUser[];
    onMention?: (user: MentionUser) => void;
}

// Custom plugin to handle external updates
function UpdatePlugin({ value }: { value: string }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!value) {
            editor.update(() => {
                const root = $getRoot();
                root.clear();
            });
        }
    }, [value, editor]);

    return null;
}

// Custom plugin to register code highlighting
function CodeHighlightPluginWrapper() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return registerCodeHighlighting(editor);
    }, [editor]);

    return null;
}

// Theme configuration for styling
const theme = {
    paragraph: 'lexical-paragraph',
    heading: {
        h1: 'lexical-h1',
        h2: 'lexical-h2',
        h3: 'lexical-h3',
        h4: 'lexical-h4',
        h5: 'lexical-h5',
        h6: 'lexical-h6',
    },
    list: {
        ul: 'lexical-ul',
        ol: 'lexical-ol',
        listitem: 'lexical-listitem',
        nested: {
            listitem: 'lexical-nested-listitem',
        },
    },
    quote: 'lexical-quote',
    code: 'lexical-code',
    codeHighlight: {
        atrule: 'lexical-token-atrule',
        attr: 'lexical-token-attr',
        boolean: 'lexical-token-boolean',
        builtin: 'lexical-token-builtin',
        cdata: 'lexical-token-cdata',
        char: 'lexical-token-char',
        class: 'lexical-token-class',
        'class-name': 'lexical-token-class-name',
        comment: 'lexical-token-comment',
        constant: 'lexical-token-constant',
        deleted: 'lexical-token-deleted',
        doctype: 'lexical-token-doctype',
        entity: 'lexical-token-entity',
        function: 'lexical-token-function',
        important: 'lexical-token-important',
        inserted: 'lexical-token-inserted',
        keyword: 'lexical-token-keyword',
        namespace: 'lexical-token-namespace',
        number: 'lexical-token-number',
        operator: 'lexical-token-operator',
        prolog: 'lexical-token-prolog',
        property: 'lexical-token-property',
        punctuation: 'lexical-token-punctuation',
        regex: 'lexical-token-regex',
        selector: 'lexical-token-selector',
        string: 'lexical-token-string',
        symbol: 'lexical-token-symbol',
        tag: 'lexical-token-tag',
        url: 'lexical-token-url',
        variable: 'lexical-token-variable',
    },
    link: 'lexical-link',
    text: {
        bold: 'lexical-text-bold',
        italic: 'lexical-text-italic',
        underline: 'lexical-text-underline',
        strikethrough: 'lexical-text-strikethrough',
        code: 'lexical-text-code',
    },
    table: 'lexical-table',
    tableCell: 'lexical-table-cell',
    tableCellHeader: 'lexical-table-cell-header',
};

function onError(error: Error) {
    console.error('Lexical error:', error);
}

export function LexicalEditor({
    value,
    onChange,
    mode = 'standard',
    placeholder,
    disabled,
    users = [],
    onMention
}: LexicalEditorProps) {
    const editorConfig = getEditorConfig(mode);
    const effectivePlaceholder = placeholder || editorConfig.placeholder || 'Start typing...';

    const initialConfig = {
        namespace: 'LexicalEditor',
        theme,
        onError,
        nodes: [...editorConfig.nodes, MentionNode],
        editable: !disabled,
    };

    const handleChange = (editorState: EditorState, editor: any) => {
        editor.update(() => {
            const root = $getRoot();
            const textContent = root.getTextContent();

            // Generate HTML from the editor state
            const html = $generateHtmlFromNodes(editor, null);

            onChange(textContent, html);
        });
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className={`lexical-editor-container lexical-editor-${mode}`}>
                <ToolbarPlugin
                    disabled={disabled}
                    features={editorConfig.features}
                    mode={mode}
                />
                <div className="lexical-editor-inner">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="lexical-content-editable"
                                aria-placeholder={effectivePlaceholder}
                                placeholder={
                                    <div className="lexical-placeholder">
                                        {effectivePlaceholder}
                                    </div>
                                }
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    {editorConfig.features.codeBlock && (
                        <CodeHighlightPluginWrapper />
                    )}
                    {users.length > 0 && (
                        <MentionsPlugin users={users} onMention={onMention} />
                    )}
                    <OnChangePlugin onChange={handleChange} />
                    <UpdatePlugin value={value} />
                </div>
            </div>
        </LexicalComposer>
    );
}
