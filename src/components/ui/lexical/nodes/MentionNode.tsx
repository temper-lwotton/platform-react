import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
} from 'lexical';

import { $applyNodeReplacement, TextNode } from 'lexical';

export type SerializedMentionNode = Spread<
  {
    mentionName: string;
    userId: string;
  },
  SerializedTextNode
>;

function convertMentionElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  const userId = domNode.getAttribute('data-user-id');

  if (textContent !== null && userId !== null) {
    const node = $createMentionNode(textContent, userId);
    return {
      node,
    };
  }

  return null;
}

export class MentionNode extends TextNode {
  __mention: string;
  __userId: string;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__userId, node.__key);
  }

  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(
      serializedNode.mentionName,
      serializedNode.userId,
    );
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(mentionName: string, userId: string, key?: NodeKey) {
    super(mentionName, key);
    this.__mention = mentionName;
    this.__userId = userId;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      userId: this.__userId,
      type: 'mention',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    element.className = 'mention-link';
    element.setAttribute('data-user-id', this.__userId);
    element.setAttribute('data-lexical-mention', 'true');
    return element;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('a');
    element.setAttribute('href', `/users/${this.__userId}`);
    element.setAttribute('data-user-id', this.__userId);
    element.setAttribute('class', 'mention-link');
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      a: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-mention')) {
          return null;
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createMentionNode(
  mentionName: string,
  userId: string,
): MentionNode {
  const mentionNode = new MentionNode(mentionName, userId);
  mentionNode.setMode('segmented').toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(
  node: LexicalNode | null | undefined,
): node is MentionNode {
  return node instanceof MentionNode;
}
