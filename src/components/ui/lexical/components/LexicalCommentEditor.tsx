'use client';

import { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $generateHtmlFromNodes } from '@lexical/html';
import { $getRoot, EditorState } from 'lexical';

import { MentionNode } from '../nodes/MentionNode';
import MentionsPlugin from '../plugins/MentionsPlugin';
import { MentionUser } from '@/hooks/useMentions';
import styles from '../Lexical.module.scss';

interface LexicalCommentEditorProps {
    value?: string;
    onChange: (content: string, html: string) => void;
    placeholder?: string;
    disabled?: boolean;
    autoFocus?: boolean;
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

// Custom plugin to handle autofocus
function AutoFocusPlugin({ autoFocus }: { autoFocus?: boolean }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (autoFocus) {
            editor.focus();
        }
    }, [autoFocus, editor]);

    return null;
}

// Minimal theme for comment editor
const theme = {
    paragraph: styles.commentParagraph,
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

export function LexicalCommentEditor({
    value = '',
    onChange,
    placeholder = 'Write a comment...',
    disabled,
    autoFocus,
    users = [],
    onMention
}: LexicalCommentEditorProps) {
    const initialConfig = {
        namespace: 'LexicalCommentEditor',
        theme,
        onError,
        nodes: [MentionNode],
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
            <div className={styles.editorContainer}>
                <div className={styles.editorInner}>
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className={styles.contentEditable}
                                aria-placeholder={placeholder}
                                placeholder={
                                    <div className={styles.placeholder}>
                                        {placeholder}
                                    </div>
                                }
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    {users.length > 0 && (
                        <MentionsPlugin users={users} onMention={onMention} />
                    )}
                    <OnChangePlugin onChange={handleChange} />
                    <UpdatePlugin value={value} />
                    <AutoFocusPlugin autoFocus={autoFocus} />
                </div>
            </div>
        </LexicalComposer>
    );
}
