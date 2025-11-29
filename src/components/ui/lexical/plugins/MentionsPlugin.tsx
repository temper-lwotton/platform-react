'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createTextNode, TextNode } from 'lexical';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useCallback, useMemo, useState } from 'react';
import * as Avatar from '@radix-ui/react-avatar';

import { $createMentionNode } from '../nodes/MentionNode';
import { MentionUser } from '@/hooks/useMentions';

const PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  ')';

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$',
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    '){0,' +
    ALIAS_LENGTH_LIMIT +
    '})' +
    ')$',
);

function checkForAtSignMentions(
  text: string,
  minMatchLength: number,
): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignMentions(text, 0);
}

class MentionTypeaheadOption extends MenuOption {
  name: string;
  id: string;
  email?: string;
  avatar?: string;

  constructor(name: string, id: string, email?: string, avatar?: string) {
    super(name);
    this.name = name;
    this.id = id;
    this.email = email;
    this.avatar = avatar;
  }
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}) {
  const getUserInitials = (name: string): string => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <button
      key={option.key}
      tabIndex={-1}
      className={`mention-dropdown-item ${
        isSelected ? 'mention-dropdown-item--selected' : ''
      }`}
      ref={option.setRefElement}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      type="button"
    >
      <Avatar.Root className="mention-dropdown-avatar">
        {option.avatar && (
          <Avatar.Image src={option.avatar} alt={option.name} />
        )}
        <Avatar.Fallback className="mention-dropdown-avatar-fallback">
          {getUserInitials(option.name)}
        </Avatar.Fallback>
      </Avatar.Root>
      <div className="mention-dropdown-info">
        <div className="mention-dropdown-name">{option.name}</div>
        {option.email && (
          <div className="mention-dropdown-email">{option.email}</div>
        )}
      </div>
    </button>
  );
}

export type MenuTextMatch = {
  leadOffset: number;
  matchingString: string;
  replaceableString: string;
};

interface MentionsPluginProps {
  users: MentionUser[];
  onMention?: (user: MentionUser) => void;
}

export default function MentionsPlugin({
  users,
  onMention,
}: MentionsPluginProps): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(() => {
    if (queryString === null) {
      return users.map(
        (user) =>
          new MentionTypeaheadOption(user.name, user.id, user.email, user.avatar),
      );
    }

    const searchLower = queryString.toLowerCase();

    return users
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower),
      )
      .map(
        (user) =>
          new MentionTypeaheadOption(user.name, user.id, user.email, user.avatar),
      );
  }, [users, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(
          `@${selectedOption.name}`,
          selectedOption.id,
        );
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();

        // Add a space after the mention
        const spaceNode = $createTextNode(' ');
        mentionNode.insertAfter(spaceNode);
        spaceNode.select();

        closeMenu();

        // Callback
        if (onMention) {
          const user = users.find((u) => u.id === selectedOption.id);
          if (user) {
            onMention(user);
          }
        }
      });
    },
    [editor, onMention, users],
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const match = getPossibleQueryMatch(text);
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      return !slashMatch && match ? match : null;
    },
    [checkForSlashTriggerMatch, editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorElementRef.current && options.length
          ? ReactDOM.createPortal(
              <div className="mention-dropdown">
                <div className="mention-dropdown-content">
                  {options.map((option, i: number) => (
                    <MentionsTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </div>
                <div className="mention-dropdown-hint">
                  ↑↓ to navigate • ↵ to select • esc to dismiss
                </div>
              </div>,
              anchorElementRef.current,
            )
          : null
      }
    />
  );
}
