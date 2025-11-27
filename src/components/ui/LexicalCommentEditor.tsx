'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, $getSelection, EditorState } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

import { MentionNode } from './lexical/nodes/MentionNode';
import MentionsPlugin from './lexical/plugins/MentionsPlugin';
import { MentionUser } from '@/hooks/useMentions';

interface LexicalCommentEditorProps {
  placeholder?: string;
  onChange?: (text: string, html: string) => void;
  onMention?: (user: MentionUser) => void;
  users: MentionUser[];
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

// Plugin to clear editor
function ClearEditorPlugin({ shouldClear }: { shouldClear: boolean }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (shouldClear) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
      });
    }
  }, [shouldClear, editor]);

  return null;
}

// Plugin to focus editor
function AutoFocusPlugin({ autoFocus }: { autoFocus: boolean }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (autoFocus) {
      editor.focus();
    }
  }, [autoFocus, editor]);

  return null;
}

// Simple theme for comment editor
const theme = {
  paragraph: 'lexical-comment-paragraph',
  text: {
    bold: 'lexical-text-bold',
    italic: 'lexical-text-italic',
    underline: 'lexical-text-underline',
  },
};

export function LexicalCommentEditor({
  placeholder = 'Write a comment...',
  onChange,
  onMention,
  users,
  disabled = false,
  autoFocus = false,
  className = '',
}: LexicalCommentEditorProps) {
  const initialConfig = {
    namespace: 'CommentEditor',
    theme,
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    nodes: [MentionNode],
    editable: !disabled,
  };

  const handleChange = (editorState: EditorState) => {
    if (!onChange) return;

    editorState.read(() => {
      const root = $getRoot();
      const text = root.getTextContent();

      // Generate HTML with mentions as links
      let html = '';
      root.getChildren().forEach((node) => {
        html += node.getTextContent();
      });

      onChange(text, html);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={`lexical-comment-editor ${className}`}>
        <div className="lexical-comment-editor-container">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="lexical-comment-content-editable"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="lexical-comment-placeholder">
                    {placeholder}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <MentionsPlugin users={users} onMention={onMention} />
          <AutoFocusPlugin autoFocus={autoFocus} />
        </div>
      </div>
    </LexicalComposer>
  );
}

// Hook to get editor text content
export function useLexicalEditorText() {
  const [editor] = useLexicalComposerContext();

  const getText = (): string => {
    let text = '';
    editor.getEditorState().read(() => {
      text = $getRoot().getTextContent();
    });
    return text;
  };

  const clear = () => {
    editor.update(() => {
      const root = $getRoot();
      root.clear();
    });
  };

  return { getText, clear, editor };
}
