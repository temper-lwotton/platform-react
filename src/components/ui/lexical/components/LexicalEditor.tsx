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

import { Toolbar } from './Toolbar';
import { getEditorConfig, EditorMode } from '@/lib/lexical-config';
import { MentionNode } from '../nodes/MentionNode';
import MentionsPlugin from '../plugins/MentionsPlugin';
import { MentionUser } from '@/hooks/useMentions';
import styles from '../Lexical.module.scss';

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

// Theme configuration for styling - using module classes
const theme = {
    paragraph: styles.paragraph,
    heading: {
        h1: styles.h1,
        h2: styles.h2,
        h3: styles.h3,
        h4: styles.h4,
        h5: styles.h5,
        h6: styles.h6,
    },
    list: {
        ul: styles.ul,
        ol: styles.ol,
        listitem: styles.listitem,
        nested: {
            listitem: styles.listitem,
        },
    },
    quote: styles.quote,
    code: styles.code,
    link: styles.link,
    text: {
        bold: styles.textBold,
        italic: styles.textItalic,
        underline: styles.textUnderline,
        strikethrough: styles.textStrikethrough,
        code: styles.textCode,
    },
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
            <div className={`${styles.editorContainer} lexical-editor-${mode}`}>
                <Toolbar
                    disabled={disabled}
                    features={editorConfig.features}
                    mode={mode}
                />
                <div className={styles.editorInner}>
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className={styles.contentEditable}
                                aria-placeholder={effectivePlaceholder}
                                placeholder={
                                    <div className={styles.placeholder}>
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
