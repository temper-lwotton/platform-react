'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Label from '@radix-ui/react-label';

interface LinkInsertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInsert: (url: string, text: string, openInNewTab: boolean) => void;
    initialText?: string;
}

export function LinkInsertDialog({
    open,
    onOpenChange,
    onInsert,
    initialText = '',
}: LinkInsertDialogProps) {
    const [url, setUrl] = useState('');
    const [text, setText] = useState(initialText);
    const [openInNewTab, setOpenInNewTab] = useState(true);
    const [urlError, setUrlError] = useState('');

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setUrl('');
            setText(initialText);
            setOpenInNewTab(true);
            setUrlError('');
        }
    }, [open, initialText]);

    const validateUrl = (value: string): boolean => {
        if (!value.trim()) {
            setUrlError('URL is required');
            return false;
        }

        // Basic URL validation
        try {
            const urlObj = new URL(value.trim());
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                setUrlError('URL must start with http:// or https://');
                return false;
            }
            setUrlError('');
            return true;
        } catch {
            // If URL constructor fails, try adding https://
            if (!value.includes('://')) {
                try {
                    new URL(`https://${value.trim()}`);
                    setUrlError('');
                    return true;
                } catch {
                    setUrlError('Please enter a valid URL');
                    return false;
                }
            }
            setUrlError('Please enter a valid URL');
            return false;
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUrl(value);
        if (urlError) {
            validateUrl(value);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateUrl(url)) {
            return;
        }

        // Normalize URL - add https:// if missing protocol
        let normalizedUrl = url.trim();
        if (!normalizedUrl.includes('://')) {
            normalizedUrl = `https://${normalizedUrl}`;
        }

        // Use URL as text if text is empty
        const linkText = text.trim() || normalizedUrl;

        onInsert(normalizedUrl, linkText, openInNewTab);
        onOpenChange(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="lexical-dialog-overlay" />
                <Dialog.Content className="lexical-dialog-content">
                    <Dialog.Title className="lexical-dialog-title">
                        Insert Link
                    </Dialog.Title>
                    <Dialog.Description className="lexical-dialog-description">
                        Add a hyperlink to your content
                    </Dialog.Description>

                    <form onSubmit={handleSubmit} className="lexical-dialog-form">
                        <div className="lexical-dialog-field">
                            <Label.Root htmlFor="link-url" className="lexical-dialog-label">
                                URL
                            </Label.Root>
                            <input
                                id="link-url"
                                type="text"
                                className={`lexical-dialog-input ${urlError ? 'error' : ''}`}
                                placeholder="https://example.com"
                                value={url}
                                onChange={handleUrlChange}
                                autoFocus
                                required
                            />
                            {urlError && (
                                <span className="lexical-dialog-error">{urlError}</span>
                            )}
                        </div>

                        <div className="lexical-dialog-field">
                            <Label.Root htmlFor="link-text" className="lexical-dialog-label">
                                Link Text
                            </Label.Root>
                            <input
                                id="link-text"
                                type="text"
                                className="lexical-dialog-input"
                                placeholder="Click here (optional)"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <span className="lexical-dialog-hint">
                                Leave empty to use the URL as text
                            </span>
                        </div>

                        <div className="lexical-dialog-checkbox-field">
                            <Checkbox.Root
                                id="link-new-tab"
                                className="lexical-dialog-checkbox"
                                checked={openInNewTab}
                                onCheckedChange={(checked) => setOpenInNewTab(checked === true)}
                            >
                                <Checkbox.Indicator className="lexical-dialog-checkbox-indicator">
                                    ✓
                                </Checkbox.Indicator>
                            </Checkbox.Root>
                            <Label.Root
                                htmlFor="link-new-tab"
                                className="lexical-dialog-checkbox-label"
                            >
                                Open in new tab
                            </Label.Root>
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
                                disabled={!url.trim()}
                            >
                                Insert Link
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
