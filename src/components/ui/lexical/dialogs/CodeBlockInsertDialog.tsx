'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';

interface CodeBlockInsertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInsert: (language?: string) => void;
}

// Popular programming languages for quick selection
const POPULAR_LANGUAGES = [
    { value: 'plain', label: 'Plain Text' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
];

const MARKUP_LANGUAGES = [
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'scss', label: 'SCSS' },
    { value: 'xml', label: 'XML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
];

const SHELL_LANGUAGES = [
    { value: 'bash', label: 'Bash' },
    { value: 'powershell', label: 'PowerShell' },
    { value: 'sql', label: 'SQL' },
];

export function CodeBlockInsertDialog({
    open,
    onOpenChange,
    onInsert,
}: CodeBlockInsertDialogProps) {
    const [selectedLanguage, setSelectedLanguage] = useState('plain');

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setSelectedLanguage('plain');
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Convert 'plain' back to undefined for plain text code blocks
        const language = selectedLanguage === 'plain' ? undefined : selectedLanguage;
        onInsert(language);
        onOpenChange(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="lexical-dialog-overlay" />
                <Dialog.Content className="lexical-dialog-content">
                    <Dialog.Title className="lexical-dialog-title">
                        Insert Code Block
                    </Dialog.Title>
                    <Dialog.Description className="lexical-dialog-description">
                        Choose a language for syntax highlighting
                    </Dialog.Description>

                    <form onSubmit={handleSubmit} className="lexical-dialog-form">
                        <div className="lexical-dialog-field">
                            <Label.Root htmlFor="code-language" className="lexical-dialog-label">
                                Language
                            </Label.Root>
                            <Select.Root
                                value={selectedLanguage}
                                onValueChange={setSelectedLanguage}
                            >
                                <Select.Trigger
                                    id="code-language"
                                    className="lexical-dialog-select-trigger"
                                    aria-label="Select language"
                                >
                                    <Select.Value placeholder="Select a language..." />
                                    <Select.Icon className="lexical-dialog-select-icon">
                                        ▼
                                    </Select.Icon>
                                </Select.Trigger>

                                <Select.Portal>
                                    <Select.Content className="lexical-dialog-select-content">
                                        <Select.Viewport className="lexical-dialog-select-viewport">
                                            {/* Popular Languages */}
                                            <Select.Group>
                                                <Select.Label className="lexical-dialog-select-label">
                                                    Popular Languages
                                                </Select.Label>
                                                {POPULAR_LANGUAGES.map((lang) => (
                                                    <Select.Item
                                                        key={lang.value}
                                                        value={lang.value}
                                                        className="lexical-dialog-select-item"
                                                    >
                                                        <Select.ItemText>{lang.label}</Select.ItemText>
                                                        <Select.ItemIndicator className="lexical-dialog-select-indicator">
                                                            ✓
                                                        </Select.ItemIndicator>
                                                    </Select.Item>
                                                ))}
                                            </Select.Group>

                                            <Select.Separator className="lexical-dialog-select-separator" />

                                            {/* Markup Languages */}
                                            <Select.Group>
                                                <Select.Label className="lexical-dialog-select-label">
                                                    Markup & Data
                                                </Select.Label>
                                                {MARKUP_LANGUAGES.map((lang) => (
                                                    <Select.Item
                                                        key={lang.value}
                                                        value={lang.value}
                                                        className="lexical-dialog-select-item"
                                                    >
                                                        <Select.ItemText>{lang.label}</Select.ItemText>
                                                        <Select.ItemIndicator className="lexical-dialog-select-indicator">
                                                            ✓
                                                        </Select.ItemIndicator>
                                                    </Select.Item>
                                                ))}
                                            </Select.Group>

                                            <Select.Separator className="lexical-dialog-select-separator" />

                                            {/* Shell Languages */}
                                            <Select.Group>
                                                <Select.Label className="lexical-dialog-select-label">
                                                    Shell & Query
                                                </Select.Label>
                                                {SHELL_LANGUAGES.map((lang) => (
                                                    <Select.Item
                                                        key={lang.value}
                                                        value={lang.value}
                                                        className="lexical-dialog-select-item"
                                                    >
                                                        <Select.ItemText>{lang.label}</Select.ItemText>
                                                        <Select.ItemIndicator className="lexical-dialog-select-indicator">
                                                            ✓
                                                        </Select.ItemIndicator>
                                                    </Select.Item>
                                                ))}
                                            </Select.Group>
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                            <span className="lexical-dialog-hint">
                                Optional - leave empty for plain text
                            </span>
                        </div>

                        <div className="lexical-dialog-actions">
                            <Dialog.Close asChild>
                                <button type="button" className="lexical-dialog-button-secondary">
                                    Cancel
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                className="lexical-dialog-button-primary"
                            >
                                Insert Code Block
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
