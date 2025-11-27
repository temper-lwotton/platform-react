'use client';

import React from 'react';

interface RichContentProps {
    content: string;
    className?: string;
}

/**
 * Component to safely render HTML content from Lexical editor
 * This component renders the HTML directly, preserving all formatting,
 * headings, lists, links (including mentions), and other rich content.
 */
export function RichContent({ content, className = '' }: RichContentProps) {
    return (
        <div
            className={`rich-content ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
